/**
 * MAP PAGE FUNCTIONALITY
 * 
 * This module handles the main map page functionality including:
 * - City search with autocomplete suggestions
 * - User account menu actions
 * - Logout functionality
 * - Filter system (placeholder)
 * - Navigation to rooms list
 */

// City search autocomplete with redirect to rooms list
(function () {
	// DEMO: List of Italian cities (can be extended or replaced with API data)
	const CITIES = [
		"Milano", "Roma", "Napoli", "Torino", "Palermo", "Genova", "Bologna", "Firenze",
		"Bari", "Catania", "Venezia", "Verona", "Messina", "Padova", "Trieste", "Taranto",
		"Brescia", "Parma", "Prato", "Modena", "Reggio Calabria", "Reggio Emilia", "Perugia",
		"Ravenna", "Livorno", "Cagliari", "Foggia", "Rimini", "Salerno", "Ferrara", "Sassari",
		"Latina", "Monza", "Siracusa", "Pescara", "Bergamo", "Forlì", "Trento", "Vicenza", "Terni", "Varese", "Ponte Tresa", "Cantello",
		"Como", "L'Aquila", "Bolzano", "Aosta", "Ancona", "La Spezia", "Piacenza", "Novara",
		"Udine", "Cremona", "Pesaro", "Lecce", "Barletta", "Andria", "Taranto", "Cosenza", "Catanzaro", "Benevento", "Avellino",
		"Caserta", "Brindisi", "Matera", "Potenza"
	];

	// Get references to search elements
	const cityInput = document.getElementById('citySearch');
	const suggestionBox = document.getElementById('searchSuggestions');

	/**
	 * DEBOUNCING UTILITY
	 * Prevents excessive API calls or processing during rapid user input
	 */
	let debounceTimer = null;
	/**
	 * Creates a debounced version of a function
	 * @param {Function} fn - Function to debounce
	 * @param {number} delay - Delay in milliseconds (default 200ms)
	 * @returns {Function} - Debounced function
	 */
	function debounce(fn, delay = 200) {
		return function (...args) {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => fn.apply(this, args), delay);
		};
	}

	/**
	 * SEARCH SUGGESTIONS RENDERING
	 * Creates and displays the dropdown list of city suggestions
	 */
	/**
	 * Renders search suggestions in the dropdown
	 * @param {Array} list - Array of city names to display
	 */
	function renderSuggestions(list) {
		// Clear previous suggestions
		suggestionBox.innerHTML = '';
		if (!list || list.length === 0) {
			suggestionBox.hidden = true;
			return;
		}

		// Create clickable list items (limit to 8 results)
		list.slice(0, 8).forEach((name) => {
			const li = document.createElement('li');
			li.textContent = name;
			li.addEventListener('click', () => {
				selectCity(name);
			});
			suggestionBox.appendChild(li);
		});
		suggestionBox.hidden = false;
	}

	/**
	 * Handles city selection and navigation to rooms page
	 * @param {string} name - Selected city name
	 */
	function selectCity(name) {
		cityInput.value = name;
		suggestionBox.hidden = true;
		// Navigate to rooms page with city as query parameter
		window.location.href = "../rooms/index.html?city=" + encodeURIComponent(name);
	}

	/**
	 * SEARCH HANDLING
	 * Processes user input and filters cities locally (demo version)
	 */
	const handleSearch = debounce(() => {
		const q = cityInput.value.trim().toLowerCase();
		if (q.length === 0) {
			suggestionBox.hidden = true;
			return;
		}
		// Filter cities that contain the search query
		const results = CITIES.filter(c => c.toLowerCase().includes(q));
		renderSuggestions(results);
	}, 180);

	// Attach search handler to input field
	cityInput.addEventListener('input', handleSearch);

	/**
	 * KEYBOARD NAVIGATION
	 * Handle Enter key to select first match, Escape to close suggestions
	 */
	cityInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			const q = cityInput.value.trim().toLowerCase();
			const results = CITIES.filter(c => c.toLowerCase().includes(q));
			if (results.length > 0) {
				// Use first matching result
				selectCity(results[0]);
			} else {
				// Fallback: search with whatever was typed
				selectCity(cityInput.value.trim());
			}
		} else if (e.key === 'Escape') {
			// Close suggestions dropdown
			suggestionBox.hidden = true;
		}
	});

	// Close suggestions when clicking outside search area
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.search-wrap')) {
			suggestionBox.hidden = true;
		}
	});

	/**
	 * FUTURE BACKEND INTEGRATION
	 * Replace the local city filtering with server-side search when backend is ready
	 */
	/* 
	const handleSearchServer = debounce(async () => {
		const q = cityInput.value.trim();
		if (!q) { suggestionBox.hidden = true; return; }

		try {
			// Fetch city suggestions from server
			const res = await fetch(`/api/cities?q=${encodeURIComponent(q)}`);
			const data = await res.json(); // Expected format: ["Milano","Milazzo",...]
			renderSuggestions(data);
		} catch (err) {
			console.error('Search error:', err);
			suggestionBox.hidden = true;
		}
	}, 200);

	// Replace the local search with: cityInput.addEventListener('input', handleSearchServer);
	*/
	
	/**
	 * USER ACCOUNT MENU ACTIONS
	 * Placeholder handlers for user menu items in the offcanvas
	 */
	document.getElementById('btnReservations')?.addEventListener('click', () => console.log('Navigate to: manage reservations'));
	document.getElementById('btnPayments')?.addEventListener('click', () => console.log('Navigate to: manage payments'));
	document.getElementById('btnSettings')?.addEventListener('click', () => console.log('Open: account settings'));
	
	/**
	 * LOGOUT FUNCTIONALITY
	 * Handles user logout with storage cleanup and navigation
	 */
(function () {
  const LOGOUT_REDIRECT = '../login/index.html'; 

  /**
   * Handles complete logout process
   * 1. Clears authentication data from storage
   * 2. Closes any open Bootstrap offcanvas
   * 3. Redirects to login page
   */
  function handleLogout() {
    // 1. Clean up authentication storage (adapt keys to your backend needs)
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    } catch (e) {
      // Silently handle storage errors
    }

    // 2. Close Bootstrap 5 offcanvas if open
    const offcanvasEl = document.getElementById('userOffcanvas');
    if (offcanvasEl && window.bootstrap?.Offcanvas) {
      const off = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      off.hide();
    }

    // 3. Redirect to login page after brief delay for animation
    setTimeout(() => {
      window.location.replace(LOGOUT_REDIRECT);
    }, 150); // Small delay for offcanvas animation
  }

  // Attach logout handler
  document.getElementById('btnLogout')?.addEventListener('click', handleLogout);
})();

	/**
	 * FILTERS SYSTEM
	 * Placeholder implementation for search filters
	 */
	const filtersForm = document.getElementById('filtersForm');
	filtersForm?.addEventListener('submit', function (e) {
		e.preventDefault();
		// Extract form data for filter processing
		const data = Object.fromEntries(new FormData(filtersForm).entries());
		console.log('Applied filters:', data);
		// TODO: Implement actual filtering logic when backend is ready
	});
})();
