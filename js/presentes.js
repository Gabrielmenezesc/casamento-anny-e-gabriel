// ===================================================
// PRESENTES.JS - Lista de Presentes (Versão Robusta v3)
// ===================================================

const RAW_ITEMS = [
  { name: "Liquidificador", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Cafeteira", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Sanduicheira", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Batedeira", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Processador de alimentos", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Espremedor de frutas", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Purificador de água", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Bebedouro", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Sofá", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Mesa de jantar", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Cadeiras para mesa", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Rack para TV", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Guarda-roupa", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Criado-mudo", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Escrivaninha", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Cadeira de escritório", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Estante", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Aparador", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Sapateira", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Jogo de panelas", cat: "🍳 Cozinha" },
  { name: "Panela de pressão", cat: "🍳 Cozinha" },
  { name: "Frigideiras", cat: "🍳 Cozinha" },
  { name: "Assadeiras", cat: "🍳 Cozinha" },
  { name: "Formas de bolo", cat: "🍳 Cozinha" },
  { name: "Travessas", cat: "🍳 Cozinha" },
  { name: "Refratários", cat: "🍳 Cozinha" },
  { name: "Jogo de pratos", cat: "🍳 Cozinha" },
  { name: "Tigelas", cat: "🍳 Cozinha" },
  { name: "Copos", cat: "🍳 Cozinha" },
  { name: "Taças", cat: "🍳 Cozinha" },
  { name: "Canecas", cat: "🍳 Cozinha" },
  { name: "Xícaras", cat: "🍳 Cozinha" },
  { name: "Faqueiro", cat: "🍳 Cozinha" },
  { name: "Facas de cozinha", cat: "🍳 Cozinha" },
  { name: "Conchas e pegadores", cat: "🍳 Cozinha" },
  { name: "Tábua de corte", cat: "🍳 Cozinha" },
  { name: "Escorredor", cat: "🍳 Cozinha" },
  { name: "Potes e jarras", cat: "🍳 Cozinha" },
  { name: "Garrafa térmica", cat: "🍳 Cozinha" },
  { name: "Porta-temperos", cat: "🍳 Cozinha" },
  { name: "Jogo de lençóis", cat: "🛏 Quarto" },
  { name: "Travesseiros", cat: "🛏 Quarto" },
  { name: "Edredom", cat: "🛏 Quarto" },
  { name: "Cobertor", cat: "🛏 Quarto" },
  { name: "Colcha de cama", cat: "🛏 Quarto" },
  { name: "Mantas decorativas", cat: "🛏 Quarto" },
  { name: "Cabides", cat: "🛏 Quarto" },
  { name: "Toalhas de banho", cat: "🚿 Banheiro" },
  { name: "Tapete de banheiro", cat: "🚿 Banheiro" },
  { name: "Cortina Box", cat: "🚿 Banheiro" },
  { name: "Porta sabonete", cat: "🚿 Banheiro" },
  { name: "Cesto de roupas", cat: "🚿 Banheiro" },
  { name: "Cortinas", cat: "🛋 Sala" },
  { name: "Tapete de sala", cat: "🛋 Sala" },
  { name: "Almofadas", cat: "🛋 Sala" },
  { name: "Mesa de centro", cat: "🛋 Sala" },
  { name: "Mesa lateral", cat: "🛋 Sala" },
  { name: "Luminária", cat: "🛋 Sala" },
  { name: "Ferro de passar", cat: "🧺 Lavanderia" },
  { name: "Tábua de passar", cat: "🧺 Lavanderia" },
  { name: "Vassoura e rodo", cat: "🧺 Lavanderia" },
  { name: "Panos e esponjas", cat: "🧺 Lavanderia" },
  { name: "Kit Ferramentas", cat: "📦 Diversos" },
  { name: "Filtro de Linha", cat: "📦 Diversos" },
  { name: "Espelho", cat: "📦 Diversos" },
  { name: "Relógio de parede", cat: "📦 Diversos" },
  { name: "Organizadores", cat: "📦 Diversos" }
];

const INITIAL_GIFTS_DATA = RAW_ITEMS.map((item, idx) => ({
  id: `g_${String(idx + 1).padStart(3, '0')}`,
  name: item.name,
  category: item.cat,
  description: 'Item especial para nossa nova jornada.',
  price: 0,
  status: 'available',
  image: ''
}));

const STORES = [
  { label: "Amazon", domain: "amazon.com.br", getUrl: (q) => `https://www.amazon.com.br/s?k=${q}` },
  { label: "Mercado Livre", domain: "mercadolivre.com.br", getUrl: (q) => `https://lista.mercadolivre.com.br/${q}` },
  { label: "Shopee", domain: "shopee.com.br", getUrl: (q) => `https://shopee.com.br/search?keyword=${q}` },
  { label: "Magalu", domain: "magazineluiza.com.br", getUrl: (q) => `https://www.magazineluiza.com.br/busca/${q}` }
];

// ── State ──────────────────────────────────────────────
let allGifts = [];
let currentFilter = 'Todos';
let selectedGiftId = null;
let reserveMode = null;

// ── Storage helpers (not depend on firebase.js) ─────────
const GIFTS_KEY = 'wedding_gifts_v3';

function loadLocalGifts() {
  try {
    const raw = localStorage.getItem(GIFTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function saveLocalGifts(gifts) {
  try { localStorage.setItem(GIFTS_KEY, JSON.stringify(gifts)); } catch(e) {}
}

// ── Init ───────────────────────────────────────────────
async function initGifts() {
  // Load from localStorage first (instant)
  const local = loadLocalGifts();
  if (local && local.length > 0) {
    allGifts = local;
  } else {
    allGifts = INITIAL_GIFTS_DATA.map(g => ({ ...g }));
    saveLocalGifts(allGifts);
  }

  // Try Firebase in background (no blocking)
  tryFirebaseSync();

  renderGifts();
  initFilters();
  initReserveModal();
}

async function tryFirebaseSync() {
  try {
    if (typeof initFirebase === 'function') {
      await initFirebase();
    }
    if (typeof initGiftsIfEmpty === 'function') {
      await initGiftsIfEmpty(INITIAL_GIFTS_DATA);
    }
    if (typeof getGifts === 'function') {
      const firebaseGifts = await getGifts();
      if (firebaseGifts && firebaseGifts.length > 0) {
        // Merge: respect reserved/delivered statuses from firebase
        allGifts = allGifts.map(local => {
          const remote = firebaseGifts.find(r => r.id === local.id);
          if (remote && remote.status !== 'available') return { ...local, ...remote };
          return local;
        });
        saveLocalGifts(allGifts);
        renderGifts();
      }
    }
  } catch(e) {
    console.info('[Presentes] Firebase sync skipped:', e.message);
  }
}

// ── Filters ────────────────────────────────────────────
function initFilters() {
  const container = document.getElementById('gift-filters');
  if (!container) return;

  const cats = ['Todos', ...new Set(allGifts.map(g => g.category))];
  container.innerHTML = cats.map(c => `
    <button class="gift-filter-btn${c === 'Todos' ? ' active' : ''}" data-filter="${c}">${c}</button>
  `).join('');

  container.querySelectorAll('.gift-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.gift-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderGifts();
    });
  });
}

// ── Render Grid ────────────────────────────────────────
function renderGifts() {
  const grid = document.getElementById('gifts-grid');
  if (!grid) return;

  const filtered = currentFilter === 'Todos'
    ? allGifts
    : allGifts.filter(g => g.category === currentFilter);

  if (!filtered.length) {
    grid.innerHTML = `<div class="gifts-empty"><span class="gifts-empty-icon">🎁</span><p>Nenhum presente nesta categoria.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(gift => renderGiftCard(gift)).join('');

  grid.querySelectorAll('.btn-reserve').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.giftId;
      const gift = allGifts.find(g => g.id === id);
      if (gift && gift.status === 'available') openReserveModal(gift);
    });
  });
}

function getImage(name) {
  return `https://image.pollinations.ai/prompt/professional+product+photo+of+${encodeURIComponent(name)}+white+background?width=400&height=300&nologo=true&seed=${name.length}`;
}

function renderGiftCard(gift) {
  const status = giftStatusLabel(gift.status);
  const isAvailable = gift.status === 'available';
  const imgSrc = getImage(gift.name);
  const q = encodeURIComponent(gift.name);

  const storesHTML = isAvailable ? `
    <div style="margin:1rem 0;text-align:center;">
      <p style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:.06em;">Ver nas lojas:</p>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
        ${STORES.map(s => `
          <a href="${s.getUrl(q)}" target="_blank" rel="noopener noreferrer"
             style="display:flex;align-items:center;gap:5px;font-size:0.72rem;background:var(--bg-primary);padding:5px 9px;border-radius:8px;border:1px solid var(--glass-border-strong);color:var(--text-primary);text-decoration:none;font-weight:600;">
            <img src="https://logo.clearbit.com/${s.domain}" alt="${s.label}" width="16" height="16" style="border-radius:3px;" onerror="this.style.display='none'" />
            ${s.label}
          </a>`).join('')}
      </div>
    </div>
  ` : '';

  return `
    <div class="gift-card ${gift.status}" data-aos="fade-up">
      <div class="gift-card-image">
        <img class="gift-card-img" src="${imgSrc}" alt="${sanitize(gift.name)}" loading="lazy"
             onerror="this.src='https://placehold.co/400x300/e8ecf1/91a8d0?text=${encodeURIComponent(gift.name)}'" />
        <span class="gift-card-badge">
          <span class="badge ${status.class}">${status.emoji} ${status.label}</span>
        </span>
        <span class="gift-card-category">${sanitize(gift.category)}</span>
        ${!isAvailable ? `<div class="gift-card-status-overlay"><span class="gift-card-status-icon">${gift.status === 'reserved' ? '🎁' : '✅'}</span></div>` : ''}
      </div>
      <div class="gift-card-body">
        <h3 class="gift-card-name">${sanitize(gift.name)}</h3>
        <p class="gift-card-desc">${sanitize(gift.description)}</p>
        ${storesHTML}
      </div>
      <div class="gift-card-footer">
        <button class="btn-reserve" data-gift-id="${gift.id}" ${!isAvailable ? 'disabled' : ''}>
          ${isAvailable ? '🎁 Quero Presentear' : (gift.status === 'reserved' ? '🎁 Reservado' : '✅ Entregue')}
        </button>
      </div>
    </div>
  `;
}

// ── Modal de Reserva ───────────────────────────────────
function openReserveModal(gift) {
  selectedGiftId = gift.id;
  reserveMode = 'named'; // default

  const nameEl = document.getElementById('reserve-gift-name');
  if (nameEl) nameEl.textContent = gift.name;

  const priceEl = document.getElementById('reserve-gift-price');
  if (priceEl) priceEl.textContent = '';

  const form = document.getElementById('reserve-named-form');
  if (form) { form.classList.add('visible'); form.reset(); }

  const btn = document.getElementById('btn-confirm-reserve');
  if (btn) { btn.disabled = false; btn.textContent = '🎁 Reservar Presente'; }

  // Mark "named" option as selected
  document.querySelectorAll('.reserve-option').forEach(o => o.classList.remove('selected'));
  const namedOpt = document.querySelector('.reserve-option[data-mode="named"]');
  if (namedOpt) namedOpt.classList.add('selected');

  openModal('modal-reserve');
}

function initReserveModal() {
  // Option toggle
  document.querySelectorAll('.reserve-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.reserve-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      reserveMode = opt.dataset.mode;

      const form = document.getElementById('reserve-named-form');
      const btn  = document.getElementById('btn-confirm-reserve');
      if (form) form.classList.toggle('visible', reserveMode === 'named');
      if (btn)  btn.disabled = false;
    });
  });

  // Confirm button
  const btnConfirm = document.getElementById('btn-confirm-reserve');
  if (!btnConfirm) return;

  btnConfirm.addEventListener('click', async () => {
    if (!selectedGiftId || !reserveMode) {
      showToast('Selecione uma opção de reserva.', 'error');
      return;
    }

    // Gather data
    const reservation = { isAnonymous: reserveMode === 'anonymous' };

    if (reserveMode === 'named') {
      const name    = (document.getElementById('reserve-name')?.value || '').trim();
      const phone   = (document.getElementById('reserve-phone')?.value || '').trim();
      const message = (document.getElementById('reserve-message')?.value || '').trim();

      if (!name || !phone) {
        showToast('Preencha seu nome e telefone.', 'error');
        return;
      }
      reservation.reservedBy = name;
      reservation.reservedPhone = phone;
      if (message) reservation.reservationMessage = message;
    }

    // Disable button
    btnConfirm.disabled = true;
    btnConfirm.textContent = 'Reservando...';

    // 1. Mark as reserved locally FIRST (instant feedback)
    const giftId = selectedGiftId;
    const gift   = allGifts.find(g => g.id === giftId);
    allGifts = allGifts.map(g =>
      g.id === giftId ? { ...g, status: 'reserved', ...reservation, reservedAt: new Date().toISOString() } : g
    );
    saveLocalGifts(allGifts);

    // 2. Try to save to Firebase (fire & forget)
    if (typeof reserveGift === 'function') {
      reserveGift(giftId, reservation).catch(e => console.warn('Firebase save failed:', e));
    }

    // 3. Close reserve modal + re-render grid
    closeModal('modal-reserve');
    renderGifts();
    launchConfetti();
    showToast('🎁 Presente reservado com sucesso!', 'success', 4000);

    // 4. Build WhatsApp notification URL
    const noivosPhone = '5538991621135';
    const guestName   = reservation.isAnonymous ? 'Convidado Anônimo' : reservation.reservedBy;
    let waText = `Olá Laoanny e Gabriel! 💒\n\nAcabei de reservar o presente *"${gift ? gift.name : 'Presente'}"* da lista de vocês!\n\nAbraços, ${guestName}!`;
    if (reservation.reservationMessage) {
      waText += `\n\n💬 Recado: "${reservation.reservationMessage}"`;
    }
    const waUrl = `https://api.whatsapp.com/send?phone=${noivosPhone}&text=${encodeURIComponent(waText)}`;

    // 5. Inject WhatsApp button into PIX modal (remove old if exists)
    const existingWa = document.getElementById('btn-whatsapp-notify');
    if (existingWa) existingWa.remove();

    const waBtn = document.createElement('a');
    waBtn.id = 'btn-whatsapp-notify';
    waBtn.href = waUrl;
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
    waBtn.className = 'btn btn-lg';
    waBtn.style.cssText = 'background:#25D366;color:white;justify-content:center;margin-top:0.75rem;display:flex;text-decoration:none;gap:8px;';
    waBtn.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="22" height="22" /> Avisar os Noivos no WhatsApp`;

    const btnGroup = document.querySelector('#modal-pix .modal-body > div:last-of-type');
    if (btnGroup) btnGroup.appendChild(waBtn);
    else {
      const body = document.querySelector('#modal-pix .modal-body');
      if (body) body.appendChild(waBtn);
    }

    // 6. Open PIX modal
    openModal('modal-pix');

    // Reset state
    selectedGiftId = null;
    reserveMode = null;
    btnConfirm.disabled = false;
    btnConfirm.textContent = '🎁 Reservar Presente';
  });
}

document.addEventListener('DOMContentLoaded', initGifts);
