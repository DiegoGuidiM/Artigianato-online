// backend/src/seed.spaces.js
// Seeds: SpaceType, Location (una per città), Space (3–15 per città by tier).
// Immagini: pool condiviso di 8 file in /images/rooms (image_room_1..8).
// Se i file non esistono, fallback automatico a picsum.photos.
//
// RICORDA in main.js:
//   const path = require('path');
//   app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

const { query, pool } = require('./db');
const fs   = require('fs');
const path = require('path');

// --- Config immagini ----------------------------------------------------------
const IMAGE_BASE_URL  = '/images/rooms';
const IMAGE_BASE_DIR  = path.join(__dirname, '..', 'public', 'images', 'rooms');
const IMAGE_EXT       = '.webp'; // cambia in '.jpg' o '.png' se serve
const IMAGE_POOL_SIZE = 8;       // image_room_1..image_room_8

// varietà immagini usate per tier città
const POOL_SIZE_BY_TIER = { minor: 3, medium: 5, major: 8 };

// --- Città --------------------------------------------------------------------
const MAJOR  = ['Milano','Roma','Torino','Bologna','Napoli','Firenze','Venezia','Genova'];
const MEDIUM = ['Verona','Padova','Bari','Catania','Palermo'];
const MINOR  = ['Varese','Como','Trento','Treviso','Pisa'];

const ALL_CITIES = [...MAJOR, ...MEDIUM, ...MINOR];

// --- Util ---------------------------------------------------------------------
const randInt    = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const randGuests = () => [2,3,4,5,6,8,10][randInt(0,6)];
const randPrice  = () => ['€','€€','€€','€€','€€€'][randInt(0,4)];

const roomName = (city, i) => {
  const base = ['Meeting Room','Private Office','Open Space','Focus Room','Board Room','Studio','Hot Desk'];
  return `${base[i % base.length]} — ${city}`;
};
const desc = (city) => `Bright workspace in ${city} with Wi-Fi and A/C, ideal for teams and meetings.`;

const tierOf = (city) => MAJOR.includes(city) ? 'major' : (MEDIUM.includes(city) ? 'medium' : 'minor');
const roomsCountFor = (city) => {
  // grandi: 4–5; medie: 2–3; piccole: 1–2
  if (MAJOR.includes(city))  return Math.floor(Math.random()*2)+4; // 4..5
  if (MINOR.includes(city))  return Math.floor(Math.random()*2)+1; // 1..2
  return Math.floor(Math.random()*2)+2; // 2..3 per medie
};


// --- Verifica quali file di immagine locali esistono --------------------------
function listAvailableIndices() {
  const present = [];
  for (let i=1; i<=IMAGE_POOL_SIZE; i++){
    const filePath = path.join(IMAGE_BASE_DIR, `image_room_${i}${IMAGE_EXT}`);
    if (fs.existsSync(filePath)) present.push(i);
  }
  return present;
}
const AVAILABLE_IDX = listAvailableIndices();
const HAS_LOCAL_IMAGES = AVAILABLE_IDX.length > 0;

// URL immagine stanza random dal pool (limitato dal tier)
function randomRoomImageFor(city) {
  const t = tierOf(city);
  const desiredMax = POOL_SIZE_BY_TIER[t] || IMAGE_POOL_SIZE;

  if (HAS_LOCAL_IMAGES) {
    // usa solo gli indici che esistono davvero e clamp al desiredMax
    const usable = AVAILABLE_IDX.filter(n => n <= desiredMax);
    const pick = usable.length ? usable[randInt(0, usable.length-1)] : AVAILABLE_IDX[randInt(0, AVAILABLE_IDX.length-1)];
    return `${IMAGE_BASE_URL}/image_room_${pick}${IMAGE_EXT}`;
  } else {
    // fallback picsum (nessun file trovato)
    const seed = `${city}-${randInt(1,desiredMax)}`;
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/600`;
  }
}

// Cover per location (fallback nell’API è già COALESCE(s.image_url, l.cover_image_url))
function coverForCity(city) {
  if (HAS_LOCAL_IMAGES) {
    const pick = AVAILABLE_IDX.includes(1) ? 1 : AVAILABLE_IDX[0];
    return `${IMAGE_BASE_URL}/image_room_${pick}${IMAGE_EXT}`;
  } else {
    return `https://picsum.photos/seed/${encodeURIComponent(city)}-cover/1200/800`;
  }
}

// --- Seed ---------------------------------------------------------------------
(async function seed() {
  try {
    // 0) SpaceType base (richiede UNIQUE su spacetype(name))
    const types = [
      { name:'Meeting room',  description:'Sala riunioni' },
      { name:'Private office',description:'Ufficio privato' },
      { name:'Open space',    description:'Spazio condiviso' }
    ];
    for (const t of types){
      await query(`
        INSERT INTO spacetype(name, description)
        VALUES ($1,$2)
        ON CONFLICT (name) DO NOTHING
      `, [t.name, t.description]);
    }
    const typesRes = await query(`SELECT id_space_type, name FROM spacetype`);
    const TYPES = Object.fromEntries(typesRes.rows.map(r => [r.name, r.id_space_type]));
    const typeRoundRobin = (i) => (i % 3 === 0 ? 'Meeting room' : (i % 3 === 1 ? 'Private office' : 'Open space'));

    // 1) Una location per città (richiede UNIQUE su location(city))
    for (const city of ALL_CITIES){
      await query(`
        INSERT INTO location(name, address, city, region, country, capacity, cover_image_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (city) DO NOTHING
      `, [
        `CoWorkSpace — ${city}`,
        `Centro ${city}, Via Principale 1`,
        city,
        '—', 'Italia',
        100,
        coverForCity(city)
      ]);
    }

    // 2) Crea stanze per città e assegna immagine random dal pool
    for (const city of ALL_CITIES){
      const loc = await query(`SELECT id_location FROM location WHERE city=$1 LIMIT 1`, [city]);
      if (loc.rowCount === 0) continue;
      const idLocation = loc.rows[0].id_location;

      const target = roomsCountFor(city);
      const existing = await query(`SELECT COUNT(*)::int AS c FROM space WHERE id_location=$1`, [idLocation]);
      if (existing.rows[0].c >= target) continue;

      for (let i = existing.rows[0].c; i < target; i++){
        const tname = typeRoundRobin(i);
        await query(`
          INSERT INTO space(id_location, id_space_type, name, description, max_guests, price_symbol, image_url)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
        `, [
          idLocation,
          TYPES[tname],
          roomName(city, i),
          desc(city),
          randGuests(),
          randPrice(),
          randomRoomImageFor(city)
        ]);
      }
    }

    console.log(`✓ locations + spaces seeded (${HAS_LOCAL_IMAGES ? 'local images' : 'picsum fallback'})`);
  } catch (e){
    console.error('seed.spaces error:', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();


