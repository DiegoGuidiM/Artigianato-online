// Tiny vanilla auth client for login/register/logout with role support
(function(global){
  const { API_BASE_URL, STORAGE } = global.CONFIG;

  const saveToken = t => localStorage.setItem(STORAGE.TOKEN, t);
  const saveUser  = u => localStorage.setItem(STORAGE.USER, JSON.stringify(u));
  const getToken  = () => localStorage.getItem(STORAGE.TOKEN);
  const getUser   = () => { try { return JSON.parse(localStorage.getItem(STORAGE.USER)); } catch(_) { return null; } };
  const clearAll  = () => { localStorage.removeItem(STORAGE.TOKEN); localStorage.removeItem(STORAGE.USER); };

  let role;

  async function login(email, password){
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(()=> ({}));
    if(!res.ok) throw new Error(data.error || 'Login failed');
    if (data.token) saveToken(data.token);
    if (data.user)  saveUser(data.user);
    role = data.normRole;
    return data.user;
  }

  async function register(payload){
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if(!res.ok) {
      throw new Error('An error has occurred');
    }
    const data = await res.json();
    role = data.normRole;
    return data.user || data;
  }

  function logout(){ clearAll(); }
  function isAuthenticated(){ return !!getToken(); }
  function currentUser(){ return getUser(); }
  function requireAuth(loginPath){ if (!isAuthenticated()) window.location.replace(loginPath); }
  function requireRole(role, loginPath){
    const u = getUser();
    if(!u || (u.role||'client') !== role){ window.location.replace(loginPath); }
  }

  // Helper: where to go after login based on role
function goToHomeByRole(user){
  // Portiamo tutti alla mappa; l’host vedrà le funzioni extra da lì
  window.location.href = '../map/index.html';
}


  global.Auth = { login, register, logout, isAuthenticated, currentUser, requireAuth, requireRole, goToHomeByRole };
})(window);
