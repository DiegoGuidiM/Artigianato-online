// user must be logged in, otherwise redirect to login
Auth?.requireAuth("../login/index.html");
const form = document.getElementById('payForm');
const msg = document.getElementById('payMsg');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  msg.hidden = true;
  const fd = new FormData(form);
  // Validate
  const email = fd.get('email');
  const pan = fd.get('pan').replace(/\s+/g, '');
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    msg.textContent = 'Email non valida';
    msg.style.color = '#c00';
    msg.hidden = false;
    return;
  }
  if (!/^[\d]{16}$/.test(pan)) {
    msg.textContent = 'Numero carta non valido (16 cifre)';
    msg.style.color = '#c00';
    msg.hidden = false;
    return;
  }
  // Luhn check for card number
  function luhnCheck(num) {
    let sum = 0, alt = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num[i], 10);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }
  if (!luhnCheck(pan)) {
    msg.textContent = 'Numero carta non valido (Luhn check fallito)';
    msg.style.color = '#c00';
    msg.hidden = false;
    return;
  }
  // Success
  msg.hidden = false;
  msg.textContent = 'Payment successful ✓  (demo)';
  msg.style.color = '#064';
  setTimeout(()=>{ window.location.href = "../map/index.html"; }, 1200);
});
