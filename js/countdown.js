// ===================================================
// COUNTDOWN.JS - Contador Regressivo até o Casamento
// ===================================================

let WEDDING_DATE = new Date('2027-04-25T16:30:00-03:00'); // Fallback padrão

// Escuta a data carregada do Firestore
window.addEventListener('weddingDateLoaded', (e) => {
  if (e.detail instanceof Date) {
    WEDDING_DATE = e.detail;
    if (typeof tickCountdown === 'function') tickCountdown();
  }
});

let tickCountdown = null;

function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  tickCountdown = function() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      el.innerHTML = `<p class="countdown-section-title text-shimmer-gold">Hoje é o Grande Dia! 💒</p>`;
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const fmt = n => String(n).padStart(2, '0');

    el.innerHTML = `
      <div class="countdown-grid">
        <div class="countdown-item">
          <span class="countdown-number" id="cd-days">${fmt(days)}</span>
          <span class="countdown-label">Dias</span>
        </div>
        <div class="countdown-separator">:</div>
        <div class="countdown-item">
          <span class="countdown-number" id="cd-hours">${fmt(hours)}</span>
          <span class="countdown-label">Horas</span>
        </div>
        <div class="countdown-separator">:</div>
        <div class="countdown-item">
          <span class="countdown-number" id="cd-min">${fmt(minutes)}</span>
          <span class="countdown-label">Minutos</span>
        </div>
        <div class="countdown-separator">:</div>
        <div class="countdown-item">
          <span class="countdown-number" id="cd-sec">${fmt(seconds)}</span>
          <span class="countdown-label">Segundos</span>
        </div>
      </div>
    `;
  }

  tickCountdown();
  setInterval(tickCountdown, 1000);
}

document.addEventListener('DOMContentLoaded', initCountdown);
