/**
 * PAYMENT PAGE FUNCTIONALITY
 * 
 * This module handles the checkout and payment process for room bookings.
 * Features include:
 * - Room booking summary display
 * - Price estimation from symbols
 * - Form validation for payment details
 * - Simulated payment processing
 * - Receipt generation and storage
 * - Success/error modal display
 */

(function(){
  /**
   * DATA RETRIEVAL AND INITIALIZATION
   * Extract booking details from URL parameters and session storage
   */
  
  // Parse URL parameters for booking details
  const qs = new URLSearchParams(window.location.search);
  const dateParam = qs.get('date') || ''; // Booking date
  const roomId = qs.get('room') || ''; // Room identifier

  // Retrieve selected room data from session storage
  let room = null;
  try{
    const stored = sessionStorage.getItem('selectedRoom');
    if(stored) room = JSON.parse(stored);
  }catch(e){
    // Silently handle parsing errors
  }

  /**
   * PRICE ESTIMATION UTILITY
   * Converts price symbols (€, €€, €€€) to estimated euro amounts
   */
  /**
   * Estimates price from symbol representation
   * @param {string|number} symbol - Price symbol or direct number
   * @returns {number} - Estimated price in euros
   */
  function estimatePrice(symbol){
    if (typeof symbol === 'string'){
      const s = symbol.replace(/\s/g,''); // Remove whitespace
      
      // Handle explicit euro amounts like "€ 120"
      if (/^\€\d+/.test(s)) return parseFloat(s.slice(1));
      
      // Count euro symbols for estimation
      const count = (s.match(/€/g)||[]).length;
      if (count === 1) return 40;   // € = 40 euros
      if (count === 2) return 80;   // €€ = 80 euros
      if (count >= 3) return 120;   // €€€+ = 120 euros
    }
    
    // Return number values directly
    if (typeof symbol === 'number') return symbol;
    
    return 80; // Default fallback price
  }

  /**
   * BOOKING SUMMARY POPULATION
   * Fill the summary section with booking and room details
   */
  
  // Get references to summary elements
  const sumRoom = document.getElementById('sumRoom');
  const sumDate = document.getElementById('sumDate');
  const sumGuests = document.getElementById('sumGuests');
  const sumPrice = document.getElementById('sumPrice');
  const sumTotal = document.getElementById('sumTotal');

  // Format booking date for display
  const readableDate = dateParam
    ? new Date(dateParam + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
    : '—';

  // Calculate estimated price and populate summary
  const price = estimatePrice(room?.priceSymbol);
  sumRoom.textContent = room?.alt || `Room ${roomId || '—'}`;
  sumDate.textContent = readableDate;
  sumGuests.textContent = room?.maxGuests != null ? String(room.maxGuests) : '—';
  sumPrice.textContent = room?.priceSymbol || `€ ${price}`;
  sumTotal.textContent = `€ ${price.toFixed(2)}`;

  /**
   * PAYMENT FORM HANDLING
   * Manages form validation, submission, and payment simulation
   */
  
  // Get references to form elements
  const form = document.getElementById('payForm');
  const payBtn = document.getElementById('payBtn');
  const resultModal = document.getElementById('resultModal');
  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');

  /**
   * Validates the payment form
   * @param {HTMLFormElement} formEl - The form element to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  function validate(formEl){
    // Check all required fields are filled
    const required = formEl.querySelectorAll('[required]');
    for (const input of required){
      if (!input.value.trim()) {
        input.focus();
        return false;
      }
    }
    
    // Validate credit card expiry format (MM/YY)
    const exp = formEl.elements['exp']?.value || '';
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      alert('Please enter expiry date in MM/YY format');
      formEl.elements['exp'].focus();
      return false;
    }
    
    return true;
  }

  // Handle form submission
  form.addEventListener('submit', function(e){
    e.preventDefault();
    
    // Validate form before processing
    if(!validate(form)) return;

    // Show processing state
    payBtn.disabled = true;
    payBtn.textContent = 'Processing…';

    // Simulate payment processing with delay
    setTimeout(() => {
      // Reset button state
      payBtn.disabled = false;
      payBtn.textContent = 'Pay Now';

      // Show success result
      resultTitle.textContent = 'Payment Completed';
      resultText.textContent = `Booking for ${readableDate} registered successfully.`;
      resultModal.classList.add('show');
      resultModal.setAttribute('aria-hidden','false');

      // Generate and store receipt (optional demo feature)
      try{
        const receipt = {
          id: 'R' + Math.random().toString(36).slice(2,10).toUpperCase(),
          date: new Date().toISOString(),
          stayDate: dateParam || null,
          roomId: roomId || room?.id || null,
          amount: price
        };
        sessionStorage.setItem('lastReceipt', JSON.stringify(receipt));
      }catch(e){
        // Silently handle storage errors
      }
    }, 800); // 800ms delay to simulate processing
  });

})();
