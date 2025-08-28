// Tiny vanilla auth client for login/register/logout with role support
(function(global){
  const { API_BASE_URL, STORAGE } = global.CONFIG;

  const saveToken = t => localStorage.setItem(STORAGE.TOKEN, t);
  const saveUser  = u => localStorage.setItem(STORAGE.USER, JSON.stringify(u));
  /* helper/function block */
  const getToken  = () => localStorage.getItem(STORAGE.TOKEN);
  /* helper/function block */
  const getUser   = () => { try { return JSON.parse(localStorage.getItem(STORAGE.USER)); } catch(_) { return null; } };
  /* helper/function block */
  const clearAll  = () => { localStorage.removeItem(STORAGE.TOKEN); localStorage.removeItem(STORAGE.USER); };

  /* helper/function block */

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
    return data.user;
  }

  /* helper/function block */

  async function register(payload){
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=> ({}));
    if(!res.ok) throw new Error(data.error || 'Register failed');
    return data.user || data;
  }

  /* helper/function block */

  function logout(){ clearAll(); }
  /* helper/function block */
  function isAuthenticated(){ return !!getToken(); }
  /* helper/function block */
  function currentUser(){ return getUser(); }
  /* helper/function block */
  function requireAuth(loginPath){ if (!isAuthenticated()) window.location.replace(loginPath); }
  /* helper/function block */
  function requireRole(role, loginPath){
    const u = getUser();
    if(!u || (u.role||'client') !== role){ window.location.replace(loginPath); }
  }

  // Helper: where to go after login based on role
/* helper/function block */
function goToHomeByRole(user){
  // Portiamo tutti alla mappa; l’host vedrà le funzioni extra da lì
  // navigate to another page
  window.location.href = '../map/index.html';
}


  global.Auth = { login, register, logout, isAuthenticated, currentUser, requireAuth, requireRole, goToHomeByRole };
})(window);
