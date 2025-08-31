Auth?.requireAuth("../login/index.html");

const API_BASE = (window.CONFIG && (CONFIG.API_BASE_URL || CONFIG.API_URL || CONFIG.API)) || "";
const BOOKINGS_API = API_BASE + "/bookings"; // NB: API_BASE già include /api

function formatDate(isoDate) {
  try {
    const [y,m,d] = String(isoDate||"").split("-");
    const dt = new Date(Number(y), Number(m)-1, Number(d));
    return dt.toLocaleDateString("it-IT", { day:"2-digit", month:"short", year:"numeric" });
  } catch { return isoDate; }
}
function formatTime(t) { return (t || "").slice(0,5); }

function statusClass(status) {
  if (!status) return "status-chip status-pending";
  const s = status.toLowerCase();
  if (s.includes("confermat")) return "status-chip status-confirmed";
  if (s.includes("annullat")) return "status-chip status-cancelled";
  return "status-chip status-pending";
}

function renderBookingCard(b) {
  const article = document.createElement("article");
  article.className = "room-card";

  const photo = document.createElement("div");
  photo.className = "room-photo";
  if (b.space_image) {
    const img = document.createElement("img");
    img.src = b.space_image;
    img.alt = b.space_name || "Space";
    img.className = "room-photo__img";
    photo.appendChild(img);
  } else {
    const ph = document.createElement("div");
    ph.className = "room-photo__ph";
    ph.textContent = "📅";
    photo.appendChild(ph);
  }

  const info = document.createElement("div");
  info.className = "room-info";

  const h2 = document.createElement("h2");
  h2.textContent = b.space_name || "Spazio prenotato";

  const meta = document.createElement("div");
  meta.className = "room-meta";
  const metaLeft = document.createElement("div");
  metaLeft.innerHTML = `<span class="${statusClass(b.booking_status)}">${b.booking_status || "In attesa"}</span>`;
  const metaRight = document.createElement("div");
  metaRight.textContent = `${b.location_name || ""}${b.city ? " · " + b.city : ""}`;

  meta.appendChild(metaLeft);
  meta.appendChild(metaRight);

  const desc = document.createElement("div");
  desc.className = "room-desc";
  const dateStr = formatDate(b.availability_date);
  const timeStr = `${formatTime(b.start_time)}–${formatTime(b.end_time)}`;
  desc.textContent = `${dateStr} · ${timeStr}`;

  const actions = document.createElement("div");
  actions.className = "actions";
  const isConfirmed = (b.booking_status || "").toLowerCase().includes("confermat");
  const isCancelled = (b.booking_status || "").toLowerCase().includes("annullat");

  if (!isConfirmed && !isCancelled) {
    const btnConfirm = document.createElement("button");
    btnConfirm.className = "btn btn-confirm";
    btnConfirm.textContent = "Conferma";
    btnConfirm.addEventListener("click", async () => {
      btnConfirm.disabled = true;
      try {
        const res = await fetch(`${API_BASE}/bookings/${b.id_booking}/confirm`, {
          method: "POST",
          headers: { 'Accept': 'application/json', ...Auth.authHeader?.() }
        });
        if (!res.ok) throw new Error("Confirm failed");
        b.booking_status = "Confermata";
        refreshCard(article, b);
      } catch {
        showError("Errore durante la conferma della prenotazione.");
        btnConfirm.disabled = false;
      }
    });
    actions.appendChild(btnConfirm);
  }

  if (!isCancelled) {
    const btnCancel = document.createElement("button");
    btnCancel.className = "btn btn-cancel";
    btnCancel.textContent = "Annulla";
    btnCancel.addEventListener("click", async () => {
      if (!confirm("Sei sicuro di voler annullare questa prenotazione?")) return;
      btnCancel.disabled = true;
      try {
        const res = await fetch(`${API_BASE}/bookings/${b.id_booking}/cancel`, {
          method: "POST",
          headers: { 'Accept': 'application/json', ...Auth.authHeader?.() }
        });
        if (!res.ok) throw new Error("Cancel failed");
        b.booking_status = "Annullata";
        refreshCard(article, b);
      } catch {
        showError("Errore durante l'annullamento della prenotazione.");
        btnCancel.disabled = false;
      }
    });
    actions.appendChild(btnCancel);
  }

  info.appendChild(h2);
  info.appendChild(meta);
  info.appendChild(desc);
  info.appendChild(actions);

  article.appendChild(photo);
  article.appendChild(info);
  return article;
}

function refreshCard(article, updatedBooking) {
  const newCard = renderBookingCard(updatedBooking);
  article.replaceWith(newCard);
}

async function loadBookings() {
  const grid = document.getElementById("grid");
  const user = (Auth && (Auth.getUser?.() || Auth.user)) || null;
  const userId = user?.id_user || user?.id;

  if (!userId) {
    clearGrid(); showEmpty("Non riusciamo a identificare l'utente. Effettua nuovamente l'accesso.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/bookings/user/${userId}`, {
      headers: { 'Accept': 'application/json', ...Auth.authHeader?.() }
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    clearGrid();
    if (!Array.isArray(data) || data.length === 0) { showEmpty("Non hai ancora prenotazioni."); return; }
    data.forEach(b => grid.appendChild(renderBookingCard(b)));
  } catch {
    clearGrid(); showError("Impossibile recuperare le prenotazioni. Riprova più tardi.");
  }
}

function clearGrid() { document.getElementById("grid").innerHTML = ""; }
function showEmpty(message) {
  const grid = document.getElementById("grid");
  const div = document.createElement("div");
  div.className = "empty";
  div.textContent = message;
  grid.appendChild(div);
}
function showError(message) {
  const el = document.getElementById("error");
  el.textContent = message;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 5000);
}

document.addEventListener("DOMContentLoaded", loadBookings);
