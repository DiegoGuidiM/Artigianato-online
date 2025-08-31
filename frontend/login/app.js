// frontend_2/login/app.js
// Login + Signup modal, allineato agli ID/nome del tuo HTML.

(function () {
  // ---- UI helpers ----
  function setMsg(el, text, ok = true) {
    if (!el) return;
    el.hidden = false;
    el.style.color = ok ? '#063' : '#c00';
    el.textContent = text;
  }
  function clearMsg(el) {
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
  }
  function byName(form, name) { return form.querySelector(`[name="${name}"]`); }

  // ---- Elements ----
  const loginForm = document.getElementById('loginForm');
  const loginErr  = document.getElementById('loginErr');

  const signupModal = document.getElementById('signupModal');
  const openSignup  = document.getElementById('openSignup');
  const closeSignup = document.getElementById('closeSignup');

  const regForm = document.getElementById('registerForm');
  const regErr  = document.getElementById('registerErr');
  const regRoleInput = document.getElementById('regRole');
  const roleBtns = Array.from(document.querySelectorAll('.role-btn[data-role]'));

  // ---- Se sei già autenticato, vai direttamente alla home per ruolo ----
  document.addEventListener('DOMContentLoaded', () => {
    if (window.Auth?.isAuthenticated?.()) {
      window.Auth.goToHomeByRole(window.Auth.currentUser?.());
    }
  });

  // ---- Modal handlers ----
  function showSignup() {
    if (!signupModal) return;
    signupModal.hidden = false;
    const first = regForm ? byName(regForm, 'name') : null;
    if (first) first.focus();
    clearMsg(regErr);
  }
  function hideSignup() {
    if (!signupModal) return;
    signupModal.hidden = true;
  }

  openSignup?.addEventListener('click', (e) => { e.preventDefault(); showSignup(); });
  closeSignup?.addEventListener('click', hideSignup);

  // chiudi cliccando sull’overlay
  signupModal?.addEventListener('click', (e) => {
    if (e.target === signupModal) hideSignup();
  });
  // chiudi con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !signupModal?.hidden) hideSignup();
  });

  // ---- Role toggle ----
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      if (regRoleInput) regRoleInput.value = btn.dataset.role || 'client';
    });
  });

  // ---- Login submit ----
  async function handleLogin(e) {
    e.preventDefault();
    clearMsg(loginErr);

    const email = (byName(loginForm, 'email')?.value || '').trim();
    const password = byName(loginForm, 'password')?.value || '';

    if (!email || !password) {
      setMsg(loginErr, 'Please enter email and password.', false);
      return;
    }

    const submit = loginForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    setMsg(loginErr, 'Signing in…', true);

    try {
      const user = await Auth.login(email, password); // salva token+user
      setMsg(loginErr, 'Login successful. Redirecting…', true);
      Auth.goToHomeByRole(user);
    } catch (err) {
      console.error('Login error:', err);
      setMsg(loginErr, err.message || 'Login failed', false);
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  // ---- Register submit ----
  async function handleRegister(e) {
    e.preventDefault();
    clearMsg(regErr);

    const payload = {
      role:     (regRoleInput?.value || 'client').trim(),
      name:     (byName(regForm, 'name')?.value || '').trim(),
      surname:  (byName(regForm, 'surname')?.value || '').trim(),
      email:    (byName(regForm, 'email')?.value || '').trim(),
      password: byName(regForm, 'password')?.value || ''
    };

    if (!payload.name || !payload.surname || !payload.email || !payload.password) {
      setMsg(regErr, 'Please fill all required fields.', false);
      return;
    }

    const submit = regForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    setMsg(regErr, 'Creating account…', true);

    try {
      await Auth.register(payload); // non logga automaticamente
      setMsg(regErr, 'Account created! You can now log in.', true);

      // Precompila il form di login
      const loginEmail = byName(loginForm, 'email');
      const loginPass  = byName(loginForm, 'password');
      if (loginEmail) loginEmail.value = payload.email;
      if (loginPass)  loginPass.value  = payload.password;

      regForm.reset();
      const defaultBtn = roleBtns.find(b => b.dataset.role === 'client');
      defaultBtn?.click();
      setTimeout(hideSignup, 600);
    } catch (err) {
      console.error('Register error:', err);
      setMsg(regErr, err.message || 'Register failed', false);
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  // ---- Bind listeners ----
  loginForm?.addEventListener('submit', handleLogin);
  regForm?.addEventListener('submit', handleRegister);
})();


