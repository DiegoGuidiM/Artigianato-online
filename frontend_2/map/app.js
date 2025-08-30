// user must be logged in, otherwise redirect to login
Auth?.requireAuth("../login/index.html");
const me = Auth.currentUser();
const isHost = !!(me && me.role === 'host');
// picked elements from DOM to work with
document.querySelectorAll('.host-only').forEach(el => {
  el.hidden = !isHost;
});

// Simple city search demo → goes to rooms
const CITIES = ["Milano","Roma","Napoli","Torino","Palermo","Genova","Bologna","Firenze","Bari","Catania","Venezia","Verona","Padova"];
const cityInput = document.getElementById('citySearch');
const suggestionBox = document.getElementById('searchSuggestions');

/* helper/function block */
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
/* helper/function block */
function selectCity(name){
  cityInput.value = name; suggestionBox.hidden = true;
  // navigate to another page, corrisponding to the city name
  window.location.href = "../rooms/index.html?city=" + encodeURIComponent(name);
}
cityInput?.addEventListener('input', ()=>{
  const q = cityInput.value.trim().toLowerCase();
  if(!q){ suggestionBox.hidden = true; return; }
  renderSuggestions(CITIES.filter(c => c.toLowerCase().includes(q)));
});
document.addEventListener('click', (e)=>{ if(!e.target.closest('.search-wrap')) suggestionBox.hidden = true; });

//logout button to return to login page
document.getElementById('btnLogout')?.addEventListener('click', async ()=>{
  await Auth.logout();
  // navigate to another page
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
  // navigate to another page
  window.location.href = url.toString();
});
