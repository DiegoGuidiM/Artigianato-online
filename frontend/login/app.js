// Bubble fissa: spostiamo solo la freccia per puntare al bottone cliccato
(function(){
  const bubble = document.getElementById('roleBubble');
  const bubbleTitle = document.getElementById('bubbleTitle');
  const arrow = document.getElementById('bubbleArrow');

  const BUBBLE_WIDTH = 260; // deve combaciare col CSS

  function showBubbleFor(button, action){
    // titolo
    bubbleTitle.textContent = (action === 'login') ? 'Login as:' : 'Register as:';
    bubble.dataset.action = action;

    // calcolo la X della freccia affinché punti al centro del bottone
    const btnRect = button.getBoundingClientRect();
    const btnCenterX = btnRect.left + (btnRect.width / 2);

    // la bubble è centrata nella viewport: ricavo il suo "left" teorico
    const bubbleLeft = (window.innerWidth - BUBBLE_WIDTH) / 2;

    // posizione orizzontale della freccia dentro la bubble
    let arrowLeft = btnCenterX - bubbleLeft - 6; // -6 = metà freccia (12px)
    // limiti per non far uscire la freccia dai bordi
    arrowLeft = Math.max(12, Math.min(BUBBLE_WIDTH - 12, arrowLeft));
    arrow.style.left = arrowLeft + 'px';

    // mostra
    bubble.classList.add('show');
  }

  function hideBubble(){
    bubble.classList.remove('show');
  }

  // trigger dai bottoni
  document.getElementById('btnLogin').addEventListener('click', (e)=> {
    showBubbleFor(e.currentTarget, 'login');
  });
  document.getElementById('btnRegister').addEventListener('click', (e)=> {
    showBubbleFor(e.currentTarget, 'register');
  });

  // admin redirect
  document.getElementById('adminAccess').addEventListener('click', ()=> {
    console.log('Admin access clicked');
  });

  // Gestione scelta ruolo nella bubble
  const signupPopup = document.getElementById('signupPopup');
  const signupBackdrop = document.getElementById('signupBackdrop');
  const signupClose = document.getElementById('signupClose');
  const signupCancel = document.getElementById('signupCancel');
  const signupForm = document.getElementById('signupForm');
  const signupRoleInput = document.getElementById('signupRole');
  const signupTitle = document.getElementById('signupTitle');

  function openSignup(role) {
    // ruolo: 'customer' | 'manager'
    signupRoleInput.value = role;

    // titolo diverso in base al ruolo (opzionale)
    signupTitle.textContent = (role === 'manager') ? 'Create your Host account' : 'Create your Client account';

    // mostra popup
    signupBackdrop.hidden = false;
    signupPopup.hidden = false;
    // forza reflow per animazione
    void signupPopup.offsetWidth;
    signupBackdrop.classList.add('show');
    signupPopup.classList.add('show');
  }

  function closeSignup() {
    signupBackdrop.classList.remove('show');
    signupPopup.classList.remove('show');
    setTimeout(() => {
      signupBackdrop.hidden = true;
      signupPopup.hidden = true;
    }, 150);
  }

bubble.querySelectorAll('[data-role]').forEach(btn => {
	btn.addEventListener('click', (e) => {
		const role = e.currentTarget.dataset.role; // 'customer' | 'manager'
		const action = bubble.dataset.action || 'login';

		// Chiudi la bubble
		bubble.classList.remove('show');

		if (action === 'register') {
      // Apri popup registrazione
      openSignup(role);
    } else if (action === 'login') {
      // Apri popup login
      openLogin(role);
    }
	});
});

// chiusure popup
signupClose.addEventListener('click', closeSignup);
signupCancel.addEventListener('click', closeSignup);
signupBackdrop.addEventListener('click', (e) => {
	// chiudi solo se clicchi fuori dalla card
	if (e.target === signupBackdrop) closeSignup();
});
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') closeSignup();
});

// submit semplice (per ora demo)
signupForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const payload = {
		role: signupRoleInput.value,
		nome: document.getElementById('signupNome').value.trim(),
		cognome: document.getElementById('signupCognome').value.trim(),
		email: document.getElementById('signupEmail').value.trim(),
		password: document.getElementById('signupPassword').value
	};

	console.log('REGISTER payload:', payload);
  window.location.href = "../map/index.html";


	// TODO: invio reale quando il backend è pronto (AJAX)
	// $.post('/auth/register', payload).done(()=>{ ... }).fail(()=>{ ... });

	closeSignup();
});

// Riferimenti login
const loginPopup = document.getElementById('loginPopup');
const loginBackdrop = document.getElementById('loginBackdrop');
const loginClose = document.getElementById('loginClose');
const loginCancel = document.getElementById('loginCancel');
const loginForm = document.getElementById('loginForm');
const loginRoleInput = document.getElementById('loginRole');
const loginTitle = document.getElementById('loginTitle');

function openLogin(role) {
	loginRoleInput.value = role;
	loginTitle.textContent = (role === 'manager') ? 'Sign in as Host' : 'Sign in as Client';

	loginBackdrop.hidden = false;
	loginPopup.hidden = false;
	void loginPopup.offsetWidth; // forza reflow
	loginBackdrop.classList.add('show');
	loginPopup.classList.add('show');
}

function closeLogin() {
	loginBackdrop.classList.remove('show');
	loginPopup.classList.remove('show');
	setTimeout(() => {
		loginBackdrop.hidden = true;
		loginPopup.hidden = true;
	}, 150);
}

// chiusure login
loginClose.addEventListener('click', closeLogin);
loginCancel.addEventListener('click', closeLogin);
loginBackdrop.addEventListener('click', (e) => {
	if (e.target === loginBackdrop) closeLogin();
});
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') closeLogin();
});

// submit login (demo)
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const payload = {
		role: loginRoleInput.value,
		email: document.getElementById('loginEmail').value.trim(),
		password: document.getElementById('loginPassword').value
	};

	console.log('LOGIN payload:', payload);
  window.location.href = "../map/index.html";


	// TODO: invio reale quando backend pronto
	// $.post('/auth/login', payload).done(()=>{ ... }).fail(()=>{ ... });

	closeLogin();
});


  // chiudi clic fuori
  document.addEventListener('click', (e)=>{
    if (!bubble.classList.contains('show')) return;
    const isTrigger = e.target.closest('#btnLogin, #btnRegister');
    const insideBubble = e.target.closest('#roleBubble');
    if (!isTrigger && !insideBubble) hideBubble();
  });

  // ricalcola la freccia se ruoti lo schermo / resize
  window.addEventListener('resize', ()=>{
    if (!bubble.classList.contains('show')) return;
    // ripunta la freccia verso il bottone attivo
    const action = bubble.dataset.action;
    const btn = (action === 'login') ? document.getElementById('btnLogin') : document.getElementById('btnRegister');
    if (btn) showBubbleFor(btn, action);
  });
})();

