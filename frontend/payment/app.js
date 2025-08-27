Auth?.requireAuth("../login/index.html");
const form = document.getElementById('payForm');
const msg = document.getElementById('payMsg');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  msg.hidden = false;
  msg.textContent = 'Payment successful ✓  (demo)';
  msg.style.color = '#064';
  setTimeout(()=>{ window.location.href = "../map/index.html"; }, 1200);
});
