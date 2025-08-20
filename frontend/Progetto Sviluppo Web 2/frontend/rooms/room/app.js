/* Room Detail Page Controller
   Handles room data loading, calendar interactions, and booking flow
   Features:
   - Room data from sessionStorage or API fallback
   - Interactive calendar with availability simulation
   - Date selection and booking initiation
   - Modal calendar interface with navigation
*/

// Payment page URL for booking redirection
const PAYMENT_URL = '../../payment/index.html';

// Main application controller wrapped in IIFE for scope isolation
(function(){
  // Room data storage - populated from sessionStorage or API
  let room = null;
  
  // Try to retrieve room data from session storage (set by rooms list page)
  try{
    const stored = sessionStorage.getItem('selectedRoom');
    if(stored) room = JSON.parse(stored);
  }catch(e){
    // Ignore JSON parsing errors - will fallback to API or demo data
  }

  // Extract room ID from URL parameters for API lookup
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  /* API Data Fetching
     Attempts to fetch room details from backend API using room ID
     Returns null on failure (network issues, 404, etc.)
  */
  async function fetchById() {
    if(!id) return null;  // No room ID provided in URL
    
    try{
      const resp = await fetch(`/api/rooms/${encodeURIComponent(id)}`, { 
        headers: { 'Accept':'application/json' } 
      });
      if(!resp.ok) throw new Error('HTTP '+resp.status);
      return await resp.json();
    }catch(e){ 
      // Silent failure - will use fallback demo data
      return null; 
    }
  }

  /* Page Initialization
     Loads room data and populates UI elements
     Fallback chain: sessionStorage -> API -> demo data
  */
  async function init(){
    // Try API if no room data from sessionStorage
    if(!room){ room = await fetchById(); }
    
    // Fallback to demo data if both sessionStorage and API fail
    if(!room){
      room = { 
        id:'demo-1', 
        imageUrl:null, 
        maxGuests:3, 
        priceSymbol:'€€', 
        accessibility:'Yes (ramp & elevator)', 
        hasTv:'TV & Projector available', 
        description:'Bright room, ideal for small teams. Fast Wi-Fi and air conditioning included.' 
      };
    }

    // Handle room image display - show image or placeholder
    const img = document.getElementById('roomImg');
    const ph  = document.getElementById('roomPlaceholder');
    if(room.imageUrl){
      img.src = room.imageUrl; 
      img.alt = room.alt || 'Room photo';
      img.style.display = 'block'; 
      ph.style.display = 'none';
    } else {
      img.style.display = 'none'; 
      ph.style.display = 'grid';
    }

    // Populate room metadata fields
    document.getElementById('metaPeople').textContent = 'guests ' + (room.maxGuests ?? '');
    document.getElementById('metaPrice').textContent  = room.priceSymbol || '€€';
    document.getElementById('metaAccessibility').textContent = room.accessibility ?? '—';
    document.getElementById('metaTv').textContent  = room.hasTv ?? '—';
    document.getElementById('roomDescription').textContent = room.description ?? '';
  }

  /* Calendar System (Demo Implementation)
     Interactive calendar modal with date selection and availability checking
     Uses DOM elements and simulated availability data
  */
  const modal = document.getElementById('calendarModal');
  const calGrid = document.getElementById('calGrid');
  const monthLabel = document.getElementById('calMonthLabel');
  const actionWrap = document.getElementById('calendarAction');
  const ctaBtn = document.getElementById('calendarCta');

  // Calendar state tracking
  let viewDate = new Date();                              // Current month being viewed
  let selected = { date: null, available: false, cell: null };  // Selected date info

  /* Open Calendar Modal
     Shows the calendar modal and resets selection state
     Triggers calendar rendering for current month
  */
  function openCalendar(){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');  // Accessibility: announce modal is open
    selected = { date: null, available: false, cell: null };  // Reset selection
    actionWrap.hidden = true;                   // Hide booking button initially
    renderCalendar();
  }
  
  /* Close Calendar Modal
     Hides the calendar modal and announces to screen readers
     Exposed globally for onclick handlers in HTML
  */
  window.closeCalendar = function(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');   // Accessibility: announce modal is closed
  };

  /* Date Formatting Utility
     Converts JavaScript Date object to ISO date string (YYYY-MM-DD)
     Used for URL parameters when navigating to payment page
  */
  function formatISO(d){
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  /* Date Selection Handler
     Called when user clicks on a calendar day
     Updates UI state and configures booking button based on availability
  */
  function onSelectDate(cell, year, month, day, isAvailable){
    // Remove selection from all other days
    document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
    
    // Mark clicked day as selected
    cell.classList.add('selected');
    
    // Store selection data for booking
    selected = { date: new Date(year, month, day), available: isAvailable, cell };
    
    // Show booking action area
    actionWrap.hidden = false;

    // Configure booking button based on availability
    if (isAvailable){
      ctaBtn.textContent = 'Book';
      ctaBtn.className = 'btn-cta primary';  // Green success button
      ctaBtn.removeAttribute('disabled');
      
      // Set up booking navigation with date and room parameters
      ctaBtn.onclick = function(){
        const qs = new URLSearchParams({ 
          date: formatISO(selected.date), 
          room: room?.id ?? '' 
        }).toString();
        window.location.href = `${PAYMENT_URL}?${qs}`;
      };
    } else {
      ctaBtn.textContent = 'Not available';
      ctaBtn.className = 'btn-cta danger';   // Red danger button
      ctaBtn.setAttribute('disabled', 'true');
      ctaBtn.onclick = null;                 // Disable click handler
    }
  }

  /* Calendar Rendering Function
     Generates calendar grid for current viewDate month
     Includes day-of-week headers, day cells with availability, and today highlighting
  */
  function renderCalendar(){
    const DOW = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    
    // Clear existing calendar content
    calGrid.innerHTML = '';
    
    // Add day-of-week headers
    DOW.forEach(d => {
      const el = document.createElement('div');
      el.className = 'dow';
      el.textContent = d;
      calGrid.appendChild(el);
    });

    // Calculate month layout
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const startIdx = (first.getDay() + 6) % 7;  // Monday = 0, Sunday = 6
    const lastDay = new Date(year, month+1, 0).getDate();
    
    // Update month label
    monthLabel.textContent = first.toLocaleString('en-GB', { month:'long', year:'numeric' });

    // Add empty cells for days before month start
    for(let i=0;i<startIdx;i++){ 
      calGrid.appendChild(document.createElement('div')); 
    }

    // Add day cells with availability simulation
    const today = new Date();
    for(let d=1; d<=lastDay; d++){
      const cell = document.createElement('div');
      cell.className = 'day';
      cell.textContent = d;
      
      // Demo availability logic: busy on days divisible by 6 or 7
      const busy = (d % 6 === 0) || (d % 7 === 0);
      cell.classList.add(busy ? 'busy' : 'free');
      
      // Highlight today's date
      if(year===today.getFullYear() && month===today.getMonth() && d===today.getDate()){ 
        cell.classList.add('today'); 
      }
      
      // Add click handler for date selection
      cell.addEventListener('click', () => onSelectDate(cell, year, month, d, !busy));
      calGrid.appendChild(cell);
    }
  }

  /* Event Listeners Setup
     Wire up UI interactions for calendar modal and navigation
  */
  document.getElementById('openCalendarBtn').addEventListener('click', openCalendar);
  document.getElementById('prevMonth').addEventListener('click', ()=>{ 
    viewDate.setMonth(viewDate.getMonth()-1); 
    renderCalendar(); 
  });
  document.getElementById('nextMonth').addEventListener('click', ()=>{ 
    viewDate.setMonth(viewDate.getMonth()+1); 
    renderCalendar(); 
  });
  
  // Close modal when clicking backdrop
  modal.addEventListener('click', (e)=>{ 
    if(e.target === modal) window.closeCalendar(); 
  });

  // Initialize the application when DOM is ready
  init();
})();
