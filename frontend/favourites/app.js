(async function(){
  const API = (window.CONFIG && CONFIG.API_BASE_URL) || '';
  const id_user = Auth.userId(); // utente loggato

  if (!id_user) {
    console.error("Utente non autenticato");
    return;
  }

  try {
    const resp = await fetch(`${API}/rooms/get_favs/user/${id_user}`, {
      headers: { 'Accept':'application/json', ...Auth.authHeader() }
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);

    const data = await resp.json();
    const container = document.getElementById('favList');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = "<p>Nessuna stanza nei preferiti.</p>";
      return;
    }

    data.forEach(room => {
      const article = document.createElement('article');
      article.className = 'room-card';

      // Fix URL immagini → sempre assoluto
      let imgUrl = null;
      if (room.image_url) {
        if (room.image_url.startsWith('http')) {
          imgUrl = room.image_url;
        } else {
          imgUrl = CONFIG.ASSETS_BASE_URL.replace(/\/$/, '') + '/' + room.image_url.replace(/^\//, '');
        }
      }

      article.innerHTML = `
        <div class="room-photo">
          ${imgUrl 
            ? `<img src="${imgUrl}" alt="Room image">`
            : `<div class="room-photo__ph">★</div>`}
        </div>
        <div class="room-info">
          <h2>${room.name || 'Stanza senza nome'}</h2>
          <div class="room-meta">
            <div>n. persone <span class="room-capacity">${room.max_guests}</span></div>
            <div>${room.price_symbol}</div>
          </div>
          <div class="room-desc">${room.description || ''}</div>
        </div>
      `;

      container.appendChild(article);
    });
  } catch (e) {
    console.error('Error loading favourites', e);
    document.getElementById('favList').innerHTML = "<p>Errore nel caricamento dei preferiti</p>";
  }
})();
