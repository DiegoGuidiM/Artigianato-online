// Auth guard
Auth?.requireAuth("../login/index.html");
Auth?.requireRole('host', "../login/index.html");

const API_BASE_URL = window.CONFIG?.API_BASE_URL || 'http://localhost:3000/api';
const TOKEN_KEY = window.CONFIG?.STORAGE?.TOKEN || 'cw_token';

const form = document.getElementById('roomForm');
const msg = document.getElementById('msg');
const selType = document.getElementById('spaceTypeId');
const cityInput = document.getElementById('city');

function authHeader() {
  const token = (window.Auth?.token) || localStorage.getItem(TOKEN_KEY) || '';
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Carica space types (se l'API esiste)
async function populateSpaceTypes() {
  try {
    const res = await fetch(`${API_BASE_URL}/spacetypes`, { headers: { ...authHeader() } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const types = await res.json();

    selType.innerHTML = '<option disabled selected>Select a type…</option>';
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id_space_type ?? t.id;
      opt.textContent = t.name;
      selType.appendChild(opt);
    });
  } catch (e) {
    console.error('Errore caricamento spacetypes', e);
    selType.innerHTML = '<option disabled>No space types available</option>';
  }
}

document.addEventListener('DOMContentLoaded', populateSpaceTypes);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const payload = {
    // ⬇️ niente id_location: NON usiamo più la tabella locations
    id_space_type: Number(selType.value),
    city: cityInput.value.trim(),
    max_guests: Number(document.getElementById('maxGuests').value || 4),
    price_symbol: document.getElementById('priceSymbol').value || '€€',
    description: (document.getElementById('description').value || '').trim() || null,
    image_url: (document.getElementById('imageUrl').value || '').trim() || null
    // id_host NON si invia: lo deve impostare il backend dal JWT
  };

  // endpoint attuale del tuo progetto
  const userId = Auth.userId();
  if (userId == null) { Auth.requireAuth('../login/index.html'); return; }
  const url = `${API_BASE_URL}/rooms/add/user/${userId}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${text}`);
    }

    msg.hidden = false;
    msg.style.color = '#063';
    msg.textContent = 'Room saved successfully!';
    form.reset();
    form.classList.remove('was-validated');
  } catch (err) {
    console.error('Errore creazione stanza', err);
    msg.hidden = false;
    msg.style.color = '#ff0000';
    msg.textContent = 'Error adding room';
  }
});

