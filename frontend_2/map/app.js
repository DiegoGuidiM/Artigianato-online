// Only clients should access this page
Auth?.requireAuth("../login/index.html");
const me = Auth.currentUser();
if (me && me.role === 'host') {
  // Host opening client map → send to host dashboard
  window.location.replace("../host/index.html");
}

// Simple city search demo → goes to rooms
const CITIES = ["Milano","Roma","Napoli","Torino","Palermo","Genova","Bologna","Firenze","Bari","Catania","Venezia","Verona","Padova"];
const cityInput = document.getElementById('citySearch');
const suggestionBox = document.getElementById('searchSuggestions');

function renderSuggestions(list){
  suggestionBox.innerHTML = '';
  if(!list.length){ suggestionBox.hidden = true; return; }
  list.slice(0,8).forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    li.addEventListener('click', ()=> selectCity(name));
    suggestionBox.appendChild(li);
  });
  suggestionBox.hidden = false;
}
function selectCity(name){
  cityInput.value = name; suggestionBox.hidden = true;
  window.location.href = "../rooms/index.html?city=" + encodeURIComponent(name);
}
cityInput?.addEventListener('input', ()=>{
  const q = cityInput.value.trim().toLowerCase();
  if(!q){ suggestionBox.hidden = true; return; }
  renderSuggestions(CITIES.filter(c => c.toLowerCase().includes(q)));
});
document.addEventListener('click', (e)=>{ if(!e.target.closest('.search-wrap')) suggestionBox.hidden = true; });

document.getElementById('btnLogout')?.addEventListener('click', async ()=>{
  await Auth.logout();
  window.location.href = "../login/index.html";
});
document.getElementById('filtersForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget).entries());
  // Interpret 'capacity' as MINIMUM people required
  const min = data.capacity || '';
  const city = (document.getElementById('citySearch')?.value || '').trim();
  const url = new URL('../rooms/index.html', window.location.href);
  if (city) url.searchParams.set('city', city);
  if (min)  url.searchParams.set('min', String(min));
  window.location.href = url.toString();
});
