/**
 * Login Page Interactive Bubble System
 * 
 * This module handles the role selection bubble that appears when users
 * click on login/register buttons. The bubble dynamically positions its
 * arrow to point at the clicked button.
 */
(function(){
  // Get references to bubble elements
  const bubble = document.getElementById('roleBubble');
  const bubbleTitle = document.getElementById('bubbleTitle');
  const arrow = document.getElementById('bubbleArrow');

  // Bubble width constant - must match CSS value
  const BUBBLE_WIDTH = 260;

  /**
   * Shows the role selection bubble and positions the arrow to point at the clicked button
   * @param {HTMLElement} button - The button that was clicked (login or register)
   * @param {string} action - The action type ('login' or 'register')
   */
  function showBubbleFor(button, action){
    // Set the bubble title based on the action
    bubbleTitle.textContent = (action === 'login') ? 'Login as:' : 'Register as:';
    bubble.dataset.action = action;

    // Calculate the X position of the arrow to point at the button center
    const btnRect = button.getBoundingClientRect();
    const btnCenterX = btnRect.left + (btnRect.width / 2);

    // Calculate the bubble's theoretical left position (centered in viewport)
    const bubbleLeft = (window.innerWidth - BUBBLE_WIDTH) / 2;

    // Calculate horizontal position of the arrow within the bubble
    let arrowLeft = btnCenterX - bubbleLeft - 6; // -6 = half arrow width (12px)
    // Constrain arrow position to stay within bubble bounds
    arrowLeft = Math.max(12, Math.min(BUBBLE_WIDTH - 12, arrowLeft));
    arrow.style.left = arrowLeft + 'px';

    // Show the bubble with animation
    bubble.classList.add('show');
  }

  /**
   * Hides the role selection bubble
   */
  function hideBubble(){
    bubble.classList.remove('show');
  }

  // Event listeners for main action buttons
  document.getElementById('btnLogin').addEventListener('click', (e)=> {
    showBubbleFor(e.currentTarget, 'login');
  });
  document.getElementById('btnRegister').addEventListener('click', (e)=> {
    showBubbleFor(e.currentTarget, 'register');
  });

  // Admin access button (placeholder functionality)
  document.getElementById('adminAccess').addEventListener('click', ()=> {
    console.log('Admin access clicked');
  });

  /**
   * REGISTRATION POPUP MANAGEMENT
   * Handles the signup form popup that appears when user selects a role for registration
   */
  
  // Get references to signup popup elements
  const signupPopup = document.getElementById('signupPopup');
  const signupBackdrop = document.getElementById('signupBackdrop');
  const signupClose = document.getElementById('signupClose');
  const signupCancel = document.getElementById('signupCancel');
  const signupForm = document.getElementById('signupForm');
  const signupRoleInput = document.getElementById('signupRole');
  const signupTitle = document.getElementById('signupTitle');

  /**
   * Opens the registration popup for the specified role
   * @param {string} role - Either 'customer' or 'manager'
   */
  function openSignup(role) {
    // Set the role in the hidden form field
    signupRoleInput.value = role;

    // Set different title based on role
    signupTitle.textContent = (role === 'manager') ? 'Create your Host account' : 'Create your Client account';

    // Show the popup with animation
    signupBackdrop.hidden = false;
    signupPopup.hidden = false;
    // Force reflow for animation to work properly
    void signupPopup.offsetWidth;
    signupBackdrop.classList.add('show');
    signupPopup.classList.add('show');
  }

  /**
   * Closes the registration popup with animation
   */
  function closeSignup() {
    signupBackdrop.classList.remove('show');
    signupPopup.classList.remove('show');
    // Hide elements after animation completes
    setTimeout(() => {
      signupBackdrop.hidden = true;
      signupPopup.hidden = true;
    }, 150);
  }

  // Handle role selection from the bubble
  bubble.querySelectorAll('[data-role]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const role = e.currentTarget.dataset.role; // 'customer' | 'manager'
      const action = bubble.dataset.action || 'login';

      // Close the role selection bubble
      bubble.classList.remove('show');

      // Open the appropriate form based on the selected action
      if (action === 'register') {
        // Open registration popup
        openSignup(role);
      } else if (action === 'login') {
        // Open login popup
        openLogin(role);
      }
    });
  });

  // Registration popup close event listeners
  signupClose.addEventListener('click', closeSignup);
  signupCancel.addEventListener('click', closeSignup);
  signupBackdrop.addEventListener('click', (e) => {
    // Close only if clicked outside the popup card
    if (e.target === signupBackdrop) closeSignup();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSignup();
  });

  // Handle registration form submission (demo version)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect form data
    const payload = {
      role: signupRoleInput.value,
      nome: document.getElementById('signupNome').value.trim(),
      cognome: document.getElementById('signupCognome').value.trim(),
      email: document.getElementById('signupEmail').value.trim(),
      password: document.getElementById('signupPassword').value
    };

    console.log('REGISTER payload:', payload);
    // Redirect to map page (demo behavior)
    window.location.href = "../map/index.html";

    // TODO: Replace with real backend integration when ready
    // $.post('/auth/register', payload).done(()=>{ ... }).fail(()=>{ ... });

    closeSignup();
  });

  /**
   * LOGIN POPUP MANAGEMENT
   * Handles the login form popup that appears when user selects a role for login
   */
  
  // Get references to login popup elements
  const loginPopup = document.getElementById('loginPopup');
  const loginBackdrop = document.getElementById('loginBackdrop');
  const loginClose = document.getElementById('loginClose');
  const loginCancel = document.getElementById('loginCancel');
  const loginForm = document.getElementById('loginForm');
  const loginRoleInput = document.getElementById('loginRole');
  const loginTitle = document.getElementById('loginTitle');

  /**
   * Opens the login popup for the specified role
   * @param {string} role - Either 'customer' or 'manager'
   */
  function openLogin(role) {
    // Set the role in the hidden form field
    loginRoleInput.value = role;
    // Set title based on role
    loginTitle.textContent = (role === 'manager') ? 'Sign in as Host' : 'Sign in as Client';

    // Show the popup with animation
    loginBackdrop.hidden = false;
    loginPopup.hidden = false;
    void loginPopup.offsetWidth; // Force reflow for animation
    loginBackdrop.classList.add('show');
    loginPopup.classList.add('show');
  }

  /**
   * Closes the login popup with animation
   */
  function closeLogin() {
    loginBackdrop.classList.remove('show');
    loginPopup.classList.remove('show');
    // Hide elements after animation completes
    setTimeout(() => {
      loginBackdrop.hidden = true;
      loginPopup.hidden = true;
    }, 150);
  }

  // Login popup close event listeners
  loginClose.addEventListener('click', closeLogin);
  loginCancel.addEventListener('click', closeLogin);
  loginBackdrop.addEventListener('click', (e) => {
    // Close only if clicked outside the popup card
    if (e.target === loginBackdrop) closeLogin();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLogin();
  });

  // Handle login form submission (demo version)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect form data
    const payload = {
      role: loginRoleInput.value,
      email: document.getElementById('loginEmail').value.trim(),
      password: document.getElementById('loginPassword').value
    };

    console.log('LOGIN payload:', payload);
    // Redirect to map page (demo behavior)
    window.location.href = "../map/index.html";

    // TODO: Replace with real backend integration when ready
    // $.post('/auth/login', payload).done(()=>{ ... }).fail(()=>{ ... });

    closeLogin();
  });

  /**
   * GLOBAL EVENT HANDLERS
   * Handle clicks outside bubble and window resize
   */
  
  // Close bubble when clicking outside of it
  document.addEventListener('click', (e)=>{
    if (!bubble.classList.contains('show')) return;
    const isTrigger = e.target.closest('#btnLogin, #btnRegister');
    const insideBubble = e.target.closest('#roleBubble');
    if (!isTrigger && !insideBubble) hideBubble();
  });

  // Recalculate arrow position on window resize
  window.addEventListener('resize', ()=>{
    if (!bubble.classList.contains('show')) return;
    // Reposition the arrow to point at the active button
    const action = bubble.dataset.action;
    const btn = (action === 'login') ? document.getElementById('btnLogin') : document.getElementById('btnRegister');
    if (btn) showBubbleFor(btn, action);
  });
})();

