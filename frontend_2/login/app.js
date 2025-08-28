// Role toggle
let currentRole = 'client';
const roleBtns = document.querySelectorAll('.role-btn');
roleBtns.forEach(btn => btn.addEventListener('click', () => {
  roleBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
  currentRole = btn.dataset.role;                 // 'client' | 'host'
  document.getElementById('regRole').value = currentRole;
}));

// Login
// handle a UI event (click/submit/etc.)
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
// handle a UI event (click/submit/etc.)
document.getElementById('registerForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const err = document.getElementById('registerErr'); err.hidden=true;
  const fd = new FormData(e.currentTarget);
  const payload = Object.fromEntries(fd.entries());

  // Email and password validation
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!emailRegex.test(payload.email)) {
    err.textContent = "Email non valida";
    err.hidden = false;
    return;
  }
  if (!passRegex.test(payload.password)) {
    err.textContent = "Password troppo debole (min. 8 caratteri, almeno una lettera e un numero)";
    err.hidden = false;
    return;
  }
  try{
    await Auth.register(payload);
    const user = await Auth.login(payload.email, payload.password);
    Auth.goToHomeByRole(user);
  }catch(ex){
    err.textContent = ex.message || "Register failed";
    err.hidden = false;
  }
});

// Open/close signup modal
document.getElementById('openSignup')?.addEventListener('click', (e)=>{
  e.preventDefault();
  document.getElementById('signupModal')?.removeAttribute('hidden');
});
document.getElementById('closeSignup')?.addEventListener('click', ()=>{
  document.getElementById('signupModal')?.setAttribute('hidden','');
});
// Chiudi cliccando fuori o con ESC
document.getElementById('signupModal')?.addEventListener('click', (e)=>{
  if(e.target.id === 'signupModal'){ e.currentTarget.setAttribute('hidden',''); }
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){ document.getElementById('signupModal')?.setAttribute('hidden',''); }
});

