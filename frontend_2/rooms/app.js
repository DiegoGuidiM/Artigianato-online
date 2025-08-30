/* Rooms page: reads ?city=..., fetches rooms, normalizes data, and renders cards.
   If the API fails, shows a small demo fallback so the UI isn’t empty. */

// Require auth: if not logged in, go to login
Auth?.requireAuth("../login/index.html");

//search the city based on input field
const params = new URLSearchParams(window.location.search);
const city = params.get('city');

//City tiers & simple per-city limit
const MAJOR = ['Milano','Roma','Torino','Bologna','Napoli','Firenze','Venezia','Genova'];
const MINOR = ['Varese','Como','Trento','Treviso','Pisa'];

function limitForCity(c) {
  const name = (c || '').trim();
  if (MAJOR.includes(name)) return 5;
  if (MINOR.includes(name)) return 2;
  return 3; // default
}

// === Helpers ===
const ASSETS_BASE = (window.CONFIG && CONFIG.ASSETS_BASE_URL) || '';

function toAbsoluteUrl(rawUrl) {
  if (!rawUrl) return '';
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;   // already absolute
  if (rawUrl.startsWith('/')) return ASSETS_BASE + rawUrl; // app-served asset
  return rawUrl; // relative path as-is
}

// Normalize different backend shapes into one consistent object
function normalizeRoom(raw = {}) {
  return {
    // id can be named id, id_space, or id_room → take the first that exists. If none, null.
    id: raw.id ?? raw.id_space ?? raw.id_room ?? null,

    // name → string ('' if missing)
    name: raw.name ?? '',

    // city can be named city or location_city; if missing, fall back to the city from the query string (outer variable)
    city: raw.city ?? raw.location_city ?? city ?? '',

    // maxGuests can be named max_guests or maxGuests; if missing, empty string
    maxGuests: raw.max_guests ?? raw.maxGuests ?? '',

    // price symbol: price_symbol or priceSymbol; default '€€'
    priceSymbol: raw.price_symbol ?? raw.priceSymbol ?? '€€',

    // image URL: try several keys; here we use || (falsy OR),
    // then pass it to toAbsoluteUrl to get an absolute URL.
    imageUrl: toAbsoluteUrl(
      raw.image_url || raw.imageUrl || raw.cover_image_url || raw.coverImageUrl || ''
    ),
  };
}

// UI
// Build one room card (<article>)
function createRoomCard(room) {
  const card = document.createElement('article');
  card.className = 'room-card';

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

  const info = document.createElement('div');
  info.className = 'room-info';

  const people = document.createElement('div');
  people.textContent = 'n. persone ' + (room.maxGuests ?? '');

  const price = document.createElement('div');
  price.textContent = room.priceSymbol || '€€';

  info.appendChild(people);
  info.appendChild(price);

  // Click → go to detail (stash room in sessionStorage)
  card.addEventListener('click', () => {
    try { sessionStorage.setItem('selectedRoom', JSON.stringify(room)); } catch (_) {}
    const target = room.id ? `room/room.html?id=${room.id}` : 'room/room.html';
    window.location.href = target;
  });

  card.appendChild(photo);
  card.appendChild(info);
  return card;
}

// Render a list of rooms (or empty state)
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

// Simple loading placeholder
function showLoading() {
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = '<div style="color:#fff;">Caricamento stanze…</div>';
  grid.setAttribute('aria-busy','true');
}

// === Data ===
// Fetch rooms, normalize, apply client-side limit, render; on error → demo fallback
async function fetchRooms() {
  try {
    showLoading();

    const url = city
      ? `${CONFIG.API_BASE_URL}/rooms?city=${encodeURIComponent(city)}`
      : `${CONFIG.API_BASE_URL}/rooms`;

    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);

    const data = await resp.json();
    const normalized = (Array.isArray(data) ? data : []).map(normalizeRoom);

    const finalCity = city || (normalized[0]?.city || '');
    const limit = limitForCity(finalCity);

    renderRooms(normalized.slice(0, limit));
  } catch (e) {
    // Small demo set so the UI still shows something if API is down
    const SAMPLE = Array.from({ length: 3 }, (_, i) => normalizeRoom({
      id: i + 1,
      image_url: '',
      max_guests: (i % 4) + 1,
      price_symbol: '€€',
      name: `Demo Room ${i + 1}`,
      city
    }));
    renderRooms(SAMPLE);
  }
}

// Kick off
fetchRooms();

