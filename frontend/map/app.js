// Placeholder semplice per le azioni del pannello account e dei filtri
(function () {
	// Ricerca città (demo)
	const cityInput = document.getElementById('citySearch');
	if (cityInput) {
		cityInput.addEventListener('keydown', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				console.log('Cerca città:', cityInput.value.trim());
			}
		});
	}

	// Azioni account (demo)
	document.getElementById('btnReservations')?.addEventListener('click', () => {
		console.log('Vai a: manage reservations');
	});

	document.getElementById('btnPayments')?.addEventListener('click', () => {
		console.log('Vai a: manage payments');
	});

	document.getElementById('btnSettings')?.addEventListener('click', () => {
		console.log('Apri: settings account');
	});

	document.getElementById('btnLogout')?.addEventListener('click', () => {
		console.log('Logout');
		// TODO: chiamata al backend /logout e redirect
	});

	// Filtri: submit (demo)
	const filtersForm = document.getElementById('filtersForm');
	filtersForm?.addEventListener('submit', function (e) {
		e.preventDefault();
		const data = Object.fromEntries(new FormData(filtersForm).entries());
		console.log('Filtri applicati:', data);
	});
})();

