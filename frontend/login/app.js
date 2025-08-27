// Role toggle
let currentRole = 'client';
const roleBtns = document.querySelectorAll('.role-btn');
roleBtns.forEach(btn => btn.addEventListener('click', () => {
  roleBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
  currentRole = btn.dataset.role;                 // 'client' | 'host'
  document.getElementById('regRole').value = currentRole;
}));

// Login
document.getElementById('loginForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const err = document.getElementById('loginErr'); err.hidden=true;
  const fd = new FormData(e.currentTarget);
  try{
    const user = await Auth.login(fd.get('email'), fd.get('password'));
    // Route based on user's real role from backend
    Auth.goToHomeByRole(user);
  }catch(ex){
    err.textContent = ex.message || "Login failed";
    err.hidden = false;
  }
});

// Register
document.getElementById('registerForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const err = document.getElementById('registerErr'); err.hidden=true;
  const fd = new FormData(e.currentTarget);
  const payload = Object.fromEntries(fd.entries());  // {name,surname,email,password,role}
  try{
    await Auth.register(payload);
    const user = await Auth.login(payload.email, payload.password);
    Auth.goToHomeByRole(user);
  }catch(ex){
    err.textContent = ex.message || "Register failed";
    err.hidden = false;
  }
});
