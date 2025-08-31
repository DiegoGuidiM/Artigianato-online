// backend/src/seed.spaces.js
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
// solo valori >= 8
const randGuests = () => [8,10,12,15][randInt(0,3)];
const randPrice  = () => ['€','€€','€€','€€','€€€'][randInt(0,4)];

const roomName = (city, i) => {
  const base = ['Meeting Room','Private Office','Open Space','Focus Room','Board Room','Studio','Hot Desk'];
  return `${base[i % base.length]} — ${city}`;
};
const desc = (city) => `Bright workspace in ${city} with Wi-Fi and A/C, ideal for teams and meetings.`;

const tierOf = (city) => MAJOR.includes(city) ? 'major' : (MEDIUM.includes(city) ? 'medium' : 'minor');
const roomsCountFor = (city) => {
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

function randomRoomImageFor(city) {
  const t = tierOf(city);
  const desiredMax = POOL_SIZE_BY_TIER[t] || IMAGE_POOL_SIZE;

  if (HAS_LOCAL_IMAGES) {
    const usable = AVAILABLE_IDX.filter(n => n <= desiredMax);
    const pick = usable.length ? usable[randInt(0, usable.length-1)] : AVAILABLE_IDX[randInt(0, AVAILABLE_IDX.length-1)];
    return `${IMAGE_BASE_URL}/image_room_${pick}${IMAGE_EXT}`;
  } else {
    const seed = `${city}-${randInt(1,desiredMax)}`;
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/600`;
  }
}

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
