// Only HOST can access
Auth?.requireAuth("../login/index.html");
Auth?.requireRole('host', "../login/index.html");

(function(global) {
  const { API_BASE_URL, STORAGE } = global.CONFIG;

  const form = document.getElementById('roomForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch(`${API_BASE_URL}/rooms/add`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    if(!res.ok){
      msg.hidden = false;
      msg.style.color = '#ff0000';
      throw new Error('Error adding room');
    };
    msg.hidden = false;
    msg.style.color = '#063';
    msg.textContent = 'Room saved succesfully!';
  });
})(window);
