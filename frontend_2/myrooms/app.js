// Accessible page to only hosts
// user must be logged in, otherwise redirect to login
Auth?.requireAuth('../login/index.html');

(function init(){
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // no "pre generated room", host can add his own
  const addCard = document.createElement('article');
  addCard.className = 'room-card add-card';

  const plus = document.createElement('a');
  plus.className = 'plus';
  plus.href = '../host/index.html';         // brings to host screen for adding details of the room
  plus.setAttribute('aria-label', 'Aggiungi una nuova stanza');
  plus.textContent = '+';

  addCard.appendChild(plus);
  grid.appendChild(addCard);

  grid.setAttribute('aria-busy','false');
})();
