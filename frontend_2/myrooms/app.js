// Pagina accessibile a tutti gli utenti autenticati (host e user)
// user must be logged in, otherwise redirect to login
Auth?.requireAuth('../login/index.html');

(function init(){
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // Per ora nessuna stanza all'inizio: mostra solo la card con il "+"
  const addCard = document.createElement('article');
  addCard.className = 'room-card add-card';

  const plus = document.createElement('a');
  plus.className = 'plus';
  plus.href = '../host/index.html';         // porta alla schermata host per aggiungere una stanza
  plus.setAttribute('aria-label', 'Aggiungi una nuova stanza');
  plus.textContent = '+';

  addCard.appendChild(plus);
  grid.appendChild(addCard);

  grid.setAttribute('aria-busy','false');
})();
