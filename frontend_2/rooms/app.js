/* Requires:
   - CONFIG.API_BASE_URL (es. "http://localhost:3000/api")
   - CONFIG.ASSETS_BASE_URL (es. "http://localhost:3000")
*/
Auth?.requireAuth("../login/index.html");

// ===== Query param city =====
const params = new URLSearchParams(window.location.search);
const city = params.get('city');

// ===== City tiers & limits =====
const MAJOR  = ['Milano','Roma','Torino','Bologna','Napoli','Firenze','Venezia','Genova'];
const MINOR  = ['Varese','Como','Trento','Treviso','Pisa'];

function limitForCity(c) {
  const name = (c || '').trim();
  if (MAJOR.includes(name)) return 5; // grandi → max 5
  if (MINOR.includes(name)) return 2; // piccole → max 2
  return 3;                            // medie → max 3
}

// ===== Helpers =====
const ASSETS_BASE = (window.CONFIG && CONFIG.ASSETS_BASE_URL) || '';

function toAbsoluteUrl(rawUrl) {
  if (!rawUrl) return '';
  // Se non è http/https e inizia con '/', lo prefissiamo con ASSETS_BASE
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
  if (rawUrl.startsWith('/')) return ASSETS_BASE + rawUrl;
  return rawUrl;
}

function normalizeRoom(raw = {}) {
  return {
    id: raw.id ?? raw.id_space ?? raw.id_room ?? null,
    name: raw.name ?? '',
    city: raw.city ?? raw.location_city ?? city ?? '',
    maxGuests: raw.max_guests ?? raw.maxGuests ?? '',
    priceSymbol: raw.price_symbol ?? raw.priceSymbol ?? '€€',
    imageUrl: toAbsoluteUrl(
      raw.image_url || raw.imageUrl || raw.cover_image_url || raw.coverImageUrl || ''
    ),
  };
}

// ===== UI =====
function createRoomCard(room) {
  const card = document.createElement('article');
  card.className = 'room-card';

  // Foto
  const photo = document.createElement('div');
  photo.className = 'room-photo';

  if (room.imageUrl) {
    const img = document.createElement('img');
    img.src = room.imageUrl;
    img.loading = 'lazy';
    img.alt = room.name || `Room in ${room.city || ''}`;
    photo.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-text';
    ph.textContent = 'Pic placeholder';
    photo.appendChild(ph);
  }

  // Info
  const info = document.createElement('div');
  info.className = 'room-info';

  const people = document.createElement('div');
  people.textContent = 'n. persone ' + (room.maxGuests ?? '');

  const price = document.createElement('div');
  price.textContent = room.priceSymbol || '€€';

  info.appendChild(people);
  info.appendChild(price);

  // Click → dettaglio
  card.addEventListener('click', () => {
    try { sessionStorage.setItem('selectedRoom', JSON.stringify(room)); } catch (_) {}
    const target = room.id ? `room/room.html?id=${room.id}` : 'room/room.html';
    window.location.href = target;
  });

  card.appendChild(photo);
  card.appendChild(info);
  return card;
}

function renderRooms(rooms) {
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = '';

  if (!Array.isArray(rooms) || rooms.length === 0) {
    const empty = document.createElement('div');
    empty.textContent = 'Nessuna stanza disponibile.';
    empty.style.color = '#fff';
    grid.appendChild(empty);
    grid.setAttribute('aria-busy','false');
    return;
  }

  rooms.forEach(r => grid.appendChild(createRoomCard(r)));
  grid.setAttribute('aria-busy','false');
}

function showLoading() {
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = '<div style="color:#fff;">Caricamento stanze…</div>';
  grid.setAttribute('aria-busy','true');
}

// ===== Data =====
async function fetchRooms() {
  try {
    showLoading();
    const url = city
      ? `${CONFIG.API_BASE_URL}/rooms?city=${encodeURIComponent(city)}`
      : `${CONFIG.API_BASE_URL}/rooms`;

    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();

    // Normalizza e applica limite lato client (in caso il backend non limiti)
    const normalized = (Array.isArray(data) ? data : []).map(normalizeRoom);
    const finalCity = city || (normalized[0]?.city || '');
    const limit = limitForCity(finalCity);
    renderRooms(normalized.slice(0, limit));

  } catch (e) {
    // Fallback demo
    const SAMPLE = Array.from({length: 3}, (_, i) => normalizeRoom({
      id: i+1, image_url: '', max_guests: (i%4)+1, price_symbol: '€€', name: `Demo Room ${i+1}`, city
    }));
    renderRooms(SAMPLE);
  }
}

fetchRooms();
