// login/register/logout with role selection + helpers (userId, authHeader)
(function (global) {
  const CFG = global.CONFIG || {};
  const STORAGE = CFG.STORAGE || { TOKEN: 'cw_token', USER: 'cw_user' };

  // --- storage helpers ---
  const saveToken = (t) => t ? localStorage.setItem(STORAGE.TOKEN, t) : localStorage.removeItem(STORAGE.TOKEN);
  const saveUser  = (u) => u ? localStorage.setItem(STORAGE.USER, JSON.stringify(u)) : localStorage.removeItem(STORAGE.USER);
  const getToken  = () => localStorage.getItem(STORAGE.TOKEN);
  const getUser   = () => { try { return JSON.parse(localStorage.getItem(STORAGE.USER)); } catch { return null; } };
  const clearAll  = () => { localStorage.removeItem(STORAGE.TOKEN); localStorage.removeItem(STORAGE.USER); };

  // --- state in memoria (comodo per accessi ripetuti) ---
  const state = { token: getToken(), user: getUser() };

  // --- utility: set auth atomica ---
  function setAuth({ token, user } = {}) {
    if (token !== undefined) { state.token = token; saveToken(token); }
    if (user  !== undefined) { state.user  = user;  saveUser(user);  }
    // riflette su API (proprietà comode)
    api.token = state.token;
    api.user  = state.user;
    return api;
  }

  // --- JWT decode (fallback per userId) ---
  function parseJwtPayload(token) {
    try {
      const base = token.split('.')[1];
      const json = atob(base.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch { return null; }
  }

  // --- public helpers ---
  function isAuthenticated() { return !!state.token; }
  function currentUser()     { return state.user; }
  function userId() {
    const u = state.user;
    if (u && (u.id_user || u.id)) return Number(u.id_user || u.id);
    const p = state.token ? parseJwtPayload(state.token) : null;
    if (p && (p.id_user || p.userId || p.sub)) return Number(p.id_user || p.userId || p.sub);
    return null;
  }
  function authHeader() {
    return state.token ? { Authorization: `Bearer ${state.token}` } : {};
  }

  function requireAuth(loginPath) {
    if (!isAuthenticated()) global.location.replace(loginPath);
  }
  function requireRole(role, loginPath) {
    const u = currentUser();
    if (!isAuthenticated() || !u || u.role !== role) global.location.replace(loginPath);
  }

  function logout() {
    clearAll();
    state.token = null;
    state.user = null;
    api.token = null;
    api.user = null;
  }

  function goToHomeByRole(user) {
    // hosts and clients redirected to map (come prima)
    global.location.href = '../map/index.html';
  }

  // --- API calls ---
  async function login(email, password) {
    const API_BASE_URL = CFG.API_BASE_URL || 'http://localhost:3000/api';
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Login failed');

    // salva tutto in un colpo
    setAuth({ token: data.token || null, user: data.user || null });
    return data.user;
  }

  async function register(payload) {
    const API_BASE_URL = CFG.API_BASE_URL || 'http://localhost:3000/api';
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Register failed');
    // qui NON settiamo auth automaticamente (manteniamo il comportamento precedente)
    return data.user || data;
  }

  // --- export globale ---
  const api = {
    // stato comodo da leggere direttamente
    token: state.token,
    user: state.user,

    // auth lifecycle
    setAuth, login, register, logout,

    // getters/guard
    isAuthenticated, currentUser, requireAuth, requireRole,

    // helpers pratici
    userId, authHeader,

    // routing
    goToHomeByRole
  };

  global.Auth = api;
})(window);
