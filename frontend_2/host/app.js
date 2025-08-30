Auth?.requireAuth("../login/index.html");
Auth?.requireRole('host', "../login/index.html");

const form = document.getElementById('roomForm');
const msg = document.getElementById('msg');

// Populate location dropdown dynamically
async function populateLocations() {
  const locationSelect = document.querySelector('select[name="id_location"]');
  try {
    // Must match backend API URL
    const API_BASE_URL = window.CONFIG?.API_BASE_URL || 'http://localhost:3000/api';
    const res = await fetch(`${API_BASE_URL}/locations`);
    const locations = await res.json();
    locationSelect.innerHTML = '';
    locations.forEach(loc => {
      const option = document.createElement('option');
      option.value = loc.id_location ?? loc.id; // backend might use id_location or id
      option.textContent = loc.name + (loc.city ? ` (${loc.city})` : '');
      locationSelect.appendChild(option);
    });
    if (!locationSelect.options.length) {
      locationSelect.innerHTML = '<option disabled>No locations available</option>';
    }
  } catch (err) {
    locationSelect.innerHTML = '<option disabled>Error loading locations</option>';
  }
}

document.addEventListener('DOMContentLoaded', populateLocations);

(function(global) {
  const { API_BASE_URL, STORAGE } = global.CONFIG;

  const form = document.getElementById('roomForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch(`${API_BASE_URL}/rooms/add/user/${Auth.user?.id_user ?? ''}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    if(!res.ok){
      msg.hidden = false;
      msg.style.color = '#ff0000';
      msg.textContent = 'Error adding room';
      throw new Error('Error adding room');
    };
    msg.hidden = false;
    msg.style.color = '#063';
    msg.textContent = 'Room saved succesfully!';
  });
})(window);