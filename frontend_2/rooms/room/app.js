/* Requires:
   - CONFIG.API_BASE_URL
   - CONFIG.ASSETS_BASE_URL
*/
Auth?.requireAuth("../../login/index.html");

(function(){
  // -------- Helpers --------
  const ASSETS_BASE = (window.CONFIG && CONFIG.ASSETS_BASE_URL) || '';

  function toAbsoluteUrl(rawUrl) {
    if (!rawUrl) return '';
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    if (rawUrl.startsWith('/')) return ASSETS_BASE + rawUrl;
    return rawUrl;
  }

  function normalizeRoom(raw = {}) {
    return {
      id: raw.id ?? raw.id_space ?? raw.id_room ?? null,
      name: raw.name ?? '',
      city: raw.city ?? '',
      maxGuests: raw.max_guests ?? raw.maxGuests ?? '',
      priceSymbol: raw.price_symbol ?? raw.priceSymbol ?? '€€',
      imageUrl: toAbsoluteUrl(
        raw.image_url || raw.imageUrl || raw.cover_image_url || raw.coverImageUrl || ''
      ),
      accessibility: raw.accessibility ?? '—',
      hasTv: raw.hasTv ?? '—',
      description: raw.description ?? ''
    };
  }

  // -------- State --------
  const stored = sessionStorage.getItem('selectedRoom'); 
  let room = null;
  try { if (stored) room = normalizeRoom(JSON.parse(stored)); } catch(_) {}

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  async function fetchById() {
    if (!id) return null;
    try{
      const resp = await fetch(`${CONFIG.API_BASE_URL}/rooms/${encodeURIComponent(id)}`, {
        headers: { 'Accept':'application/json' }
      });
      if(!resp.ok) throw new Error('HTTP '+resp.status);
      const data = await resp.json();
      return normalizeRoom(data);
    }catch(_){ return null; }
  }

  async function init(){
    if(!room) room = await fetchById();
    if(!room){
      // Fallback demo
      room = normalizeRoom({
        max_guests: 3,
        price_symbol: '€€',
        description: 'Bright room ideal for small meetings. Wi-Fi and A/C included.'
      });
    }

    const img = document.getElementById('roomImg');
    const ph  = document.getElementById('roomPlaceholder');

    if(room.imageUrl){
      img.src = room.imageUrl;
      img.alt = room.name || `Room in ${room.city || ''}`;
      img.style.display = 'block';
      ph.style.display = 'none';
    } else {
      img.style.display = 'none';
      ph.style.display = 'grid';
    }

    document.getElementById('metaPeople').textContent = 'n. persone ' + (room.maxGuests ?? '');
    document.getElementById('metaPrice').textContent  = room.priceSymbol || '€€';
    document.getElementById('metaAccessibility').textContent = room.accessibility ?? '—';
    document.getElementById('metaTv').textContent  = room.hasTv ?? '—';
    document.getElementById('roomDescription').textContent = room.description ?? '';
  }

  // -------- Calendar --------
  const modal = document.getElementById('calendarModal');
  const calGrid = document.getElementById('calGrid');
  const monthLabel = document.getElementById('calMonthLabel');
  const ctaWrap = document.getElementById('calendarCta');
  const ctaBtn = document.getElementById('calendarAction');

  let viewDate = new Date();
  let selected = null;

  function openCalendar(){ 
    modal.classList.add('show'); 
    modal.setAttribute('aria-hidden','false'); 
    renderCalendar(); 
  }
  window.closeCalendar = function(){ 
    modal.classList.remove('show'); 
    modal.setAttribute('aria-hidden','true'); 
    selected=null; 
    ctaWrap.hidden=true; 
  };

  function renderCalendar(){
    const DOW = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];
    calGrid.innerHTML = '';
    DOW.forEach(d => { 
      const el=document.createElement('div'); 
      el.className='dow'; 
      el.textContent=d; 
      calGrid.appendChild(el); 
    });

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const startIdx = (first.getDay() + 6) % 7;
    const lastDay = new Date(year, month+1, 0).getDate();
    monthLabel.textContent = first.toLocaleString('it-IT', { month:'long', year:'numeric' });

    for(let i=0;i<startIdx;i++) calGrid.appendChild(document.createElement('div'));

    const today = new Date();
    for(let d=1; d<=lastDay; d++){
      const cell = document.createElement('div');
      cell.className = 'day';
      cell.textContent = d;

      const busy = (d % 6 === 0) || (d % 7 === 0); // fake pattern
      cell.classList.add(busy ? 'busy' : 'free');

      if(year===today.getFullYear() && month===today.getMonth() && d===today.getDate()){
        cell.classList.add('today');
      }

      cell.addEventListener('click', ()=>{
        selected = { year, month: month+1, day: d, busy };
        ctaWrap.hidden = false;
        ctaBtn.textContent = busy ? 'Not available' : 'Prenota';
        ctaBtn.disabled = busy;
        ctaBtn.style.background = busy ? '#f5c9c9' : '#b0e8b0';
        ctaBtn.style.color = busy ? '#900' : '#063';
      });

      calGrid.appendChild(cell);
    }
  }

  document.getElementById('bookBtn').addEventListener('click', openCalendar);
  document.getElementById('prevMonth').addEventListener('click', ()=>{ viewDate.setMonth(viewDate.getMonth()-1); renderCalendar(); });
  document.getElementById('nextMonth').addEventListener('click', ()=>{ viewDate.setMonth(viewDate.getMonth()+1); renderCalendar(); });

  ctaBtn.addEventListener('click', ()=>{
    if(!selected || selected.busy) return;
    const qs = new URLSearchParams({
      date: `${selected.year}-${String(selected.month).padStart(2,'0')}-${String(selected.day).padStart(2,'0')}`
    }).toString();
    window.location.href = "../../payment/index.html?" + qs;
  });

  modal.addEventListener('click', (e)=>{ if(e.target === modal) window.closeCalendar(); });

  // start
  init();
})();


// === FAVOURITES & RESERVATION HOOKS ===
(function(){
  const API = (window.CONFIG && CONFIG.API_BASE_URL) || '';
  const token = localStorage.getItem((window.CONFIG && window.CONFIG.STORAGE?.TOKEN) || 'cw_token');

  function authHeaders(){
    return token ? { 'Authorization': 'Bearer ' + token } : {};
  }

  function showToast(){
    const t = document.getElementById('favToast');
    if(!t) return;
    t.hidden = false;
    setTimeout(()=>{ t.hidden = true; }, 1600);
  }

  // Get room id from URL (?id=...)
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get('id');

  document.getElementById('favBtn')?.addEventListener('click', async () => {
    if(!roomId) return;
    try {
      const resp = await fetch(API + '/favorites/' + encodeURIComponent(roomId), {
        method: 'POST',
        headers: { 'Accept': 'application/json', ...authHeaders() }
      });
      if(!resp.ok) throw new Error('HTTP ' + resp.status);
      showToast();
    } catch(e){
      console.error('Add favourite error', e);
      showToast(); // still show feedback
    }
  });

  // Bind reservation to existing CTA button if present
  document.getElementById('calendarAction')?.addEventListener('click', async () => {
    if(!roomId) return;
    try {
      const resp = await fetch(API + '/reservations/' + encodeURIComponent(roomId), {
        method: 'POST',
        headers: { 'Accept': 'application/json', ...authHeaders() }
      });
      if(!resp.ok) throw new Error('HTTP ' + resp.status);
      // After saving reservation, go to list page
      window.location.href = '../../reservations/index.html';
    } catch(e){
      console.error('Reservation error', e);
      window.location.href = '../../reservations/index.html';
    }
  });
})();