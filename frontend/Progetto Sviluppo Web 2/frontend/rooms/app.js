/**
 * ROOMS LIST PAGE FUNCTIONALITY
 * 
 * This module handles the display and interaction of available rooms.
 * Features include:
 * - Dynamic room card generation from data
 * - City-based filtering from URL parameters
 * - Room selection and navigation to detail page
 * - Fallback sample data when API is unavailable
 * - Loading states and error handling
 */

// Extract city parameter from URL for filtering
const params = new URLSearchParams(window.location.search);
const city = params.get('city');

/**
 * Creates a clickable room card element from room data
 * @param {Object} room - Room data object containing id, imageUrl, maxGuests, priceSymbol, etc.
 * @returns {HTMLElement} - Complete room card article element
 */
function createRoomCard(room){
  // Create main card container
  const card = document.createElement('article');
  card.className = 'room-card';

  // Create photo section
  const photo = document.createElement('div');
  photo.className = 'room-photo';
  
  if (room.imageUrl){
    // Display actual room image if available
    const img = document.createElement('img');
    img.src = room.imageUrl;
    img.alt = room.alt || 'Room photo';
    photo.appendChild(img);
  } else {
    // Show placeholder text if no image available
    const ph = document.createElement('div');
    ph.className = 'placeholder-text';
    ph.textContent = 'Pic placeholder';
    photo.appendChild(ph);
  }

  // Create room information section
  const info = document.createElement('div');
  info.className = 'room-info';
  
  // Guest capacity display
  const people = document.createElement('div');
  people.textContent = 'guests' + (room.maxGuests ? ' ' + room.maxGuests : '');
  
  // Price indicator display
  const price = document.createElement('div');
  price.textContent = room.priceSymbol || '€€';
  
  info.appendChild(people);
  info.appendChild(price);

  // Add click handler for room selection
  card.addEventListener('click', function(){
    // Store selected room data for detail page
    try { sessionStorage.setItem('selectedRoom', JSON.stringify(room)); } catch(e){}
    // Navigate to room detail page
    window.location.href = 'room/room.html';
  });

  // Assemble final card structure
  card.appendChild(photo);
  card.appendChild(info);
  return card;
}

/**
 * Renders an array of rooms into the grid container
 * @param {Array} rooms - Array of room objects to display
 */
function renderRooms(rooms){
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = ''; // Clear existing content
  
  // Handle empty or invalid room data
  if (!Array.isArray(rooms) || rooms.length === 0){
    const empty = document.createElement('div');
    empty.textContent = 'No rooms available.';
    empty.style.color = '#fff';
    grid.appendChild(empty);
    grid.setAttribute('aria-busy','false');
    return;
  }
  
  // Create and append room cards for each room
  rooms.forEach(r => grid.appendChild(createRoomCard(r)));
  grid.setAttribute('aria-busy','false'); // Remove loading state
}

/**
 * Shows loading indicator in the rooms grid
 */
function showLoading(){
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = '<div style="color:#fff;">Loading rooms…</div>';
  grid.setAttribute('aria-busy','true'); // Set loading state for accessibility
}

/**
 * Fetches rooms data from API with city filtering support
 * Falls back to sample data if API is unavailable
 */
async function fetchRooms(){
  try{
    // Show loading state
    showLoading();
    
    // Build API URL with optional city parameter
    const url = city ? `/api/rooms?city=${encodeURIComponent(city)}` : '/api/rooms';
    
    // Fetch rooms data from server
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' }});
    if(!resp.ok) throw new Error('HTTP ' + resp.status);
    
    const data = await resp.json();
    renderRooms(data);
    
  } catch(e){
    // Fallback: Generate sample room data for demo purposes
    console.warn('API unavailable, using sample data:', e.message);
    
    const SAMPLE = Array.from({length:6}, (_,i)=>({
      id: i+1,
      imageUrl: null, // No images in demo
      maxGuests: (i%4)+1, // Vary guest capacity 1-4
      priceSymbol: '€€', // Standard pricing indicator
      alt: 'Demo room'
    }));
    
    renderRooms(SAMPLE);
  }
}

// Initialize the page by fetching and displaying rooms
fetchRooms();
