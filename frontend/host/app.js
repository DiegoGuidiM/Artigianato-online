// Only HOST can access
Auth?.requireAuth("../login/index.html");
Auth?.requireRole('host', "../login/index.html");

const form = document.getElementById('roomForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  // Placeholder: call your future backend endpoint to create a room
  // const res = await fetch(`${CONFIG.API_BASE_URL}/rooms`, { method:'POST', headers:{'Content-Type':'application/json', 'Authorization': 'Bearer ' + localStorage.getItem(CONFIG.STORAGE.TOKEN)}, body: JSON.stringify(data) });
  // if(!res.ok){ ... }
  msg.hidden = false;
  msg.style.color = '#063';
  msg.textContent = 'Room saved (demo). API not wired yet.';
});
