// ===================================================
// PRESENTES.JS - Lista de Presentes interativa (Atualizada)
// ===================================================

const CATEGORY_IMAGES = {
  "🏠 Eletrodomésticos e Móveis": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=300&fit=crop",
  "🍳 Cozinha": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  "🛏 Quarto": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
  "🚿 Banheiro": "https://images.unsplash.com/photo-1571864030041-9b5a85caeb0b?w=400&h=300&fit=crop",
  "🛋 Sala": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  "🧺 Lavanderia": "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=400&h=300&fit=crop",
  "📦 Diversos": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop"
};

// Generate list of items requested by the user
const RAW_ITEMS = [
  { name: "Liquidificador", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Cafeteira", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Sanduicheira", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Batedeira", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Processador de alimentos", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Espremedor de frutas", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Purificador/Filtro de água", cat: "🏠 Eletrodomésticos e Móveis" },
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
  { name: "Formas", cat: "🍳 Cozinha" },
  { name: "Travessas", cat: "🍳 Cozinha" },
  { name: "Refratários", cat: "🍳 Cozinha" },
  { name: "Pratos", cat: "🍳 Cozinha" },
  { name: "Pratos fundos", cat: "🍳 Cozinha" },
  { name: "Pratos sobremesa", cat: "🍳 Cozinha" },
  { name: "Tigelas", cat: "🍳 Cozinha" },
  { name: "Copos", cat: "🍳 Cozinha" },
  { name: "Taças", cat: "🍳 Cozinha" },
  { name: "Canecas", cat: "🍳 Cozinha" },
  { name: "Xícaras", cat: "🍳 Cozinha" },
  { name: "Faqueiro", cat: "🍳 Cozinha" },
  { name: "Facas", cat: "🍳 Cozinha" },
  { name: "Conchas", cat: "🍳 Cozinha" },
  { name: "Espátulas", cat: "🍳 Cozinha" },
  { name: "Pegadores", cat: "🍳 Cozinha" },
  { name: "Tábuas", cat: "🍳 Cozinha" },
  { name: "Escorredor", cat: "🍳 Cozinha" },
  { name: "Ralador", cat: "🍳 Cozinha" },
  { name: "Abridor", cat: "🍳 Cozinha" },
  { name: "Descascador", cat: "🍳 Cozinha" },
  { name: "Potes", cat: "🍳 Cozinha" },
  { name: "Jarras", cat: "🍳 Cozinha" },
  { name: "Garrafa térmica", cat: "🍳 Cozinha" },
  { name: "Porta-temperos", cat: "🍳 Cozinha" },
  { name: "Lixeira", cat: "🍳 Cozinha" },
  { name: "Jogo de lençóis", cat: "🛏 Quarto" },
  { name: "Fronhas", cat: "🛏 Quarto" },
  { name: "Travesseiros", cat: "🛏 Quarto" },
  { name: "Edredom", cat: "🛏 Quarto" },
  { name: "Cobertor", cat: "🛏 Quarto" },
  { name: "Colcha", cat: "🛏 Quarto" },
  { name: "Mantas", cat: "🛏 Quarto" },
  { name: "Cabides", cat: "🛏 Quarto" },
  { name: "Toalhas", cat: "🚿 Banheiro" },
  { name: "Tapetes", cat: "🚿 Banheiro" },
  { name: "Cortina Box", cat: "🚿 Banheiro" },
  { name: "Lixeira", cat: "🚿 Banheiro" },
  { name: "Porta sabonete", cat: "🚿 Banheiro" },
  { name: "Porta escovas", cat: "🚿 Banheiro" },
  { name: "Cesto de roupas", cat: "🚿 Banheiro" },
  { name: "Cortinas", cat: "🛋 Sala" },
  { name: "Tapete", cat: "🛋 Sala" },
  { name: "Almofadas", cat: "🛋 Sala" },
  { name: "Mesa de centro", cat: "🛋 Sala" },
  { name: "Mesa lateral", cat: "🛋 Sala" },
  { name: "Luminária", cat: "🛋 Sala" },
  { name: "Varal", cat: "🧺 Lavanderia" },
  { name: "Ferro", cat: "🧺 Lavanderia" },
  { name: "Tábua", cat: "🧺 Lavanderia" },
  { name: "Balde", cat: "🧺 Lavanderia" },
  { name: "Vassoura", cat: "🧺 Lavanderia" },
  { name: "Rodo", cat: "🧺 Lavanderia" },
  { name: "Mop", cat: "🧺 Lavanderia" },
  { name: "Pá", cat: "🧺 Lavanderia" },
  { name: "Panos", cat: "🧺 Lavanderia" },
  { name: "Esponjas", cat: "🧺 Lavanderia" },
  { name: "Kit Ferramentas", cat: "📦 Diversos" },
  { name: "Filtro de Linha", cat: "📦 Diversos" },
  { name: "Extensão", cat: "📦 Diversos" },
  { name: "Escada", cat: "📦 Diversos" },
  { name: "Espelho", cat: "📦 Diversos" },
  { name: "Relógio", cat: "📦 Diversos" },
  { name: "Organizadores", cat: "📦 Diversos" }
];

// Map into the INITIAL_GIFTS_DATA structure
const INITIAL_GIFTS_DATA = RAW_ITEMS.map((item, idx) => ({
  id: `g_${String(idx + 1).padStart(3, '0')}`,
  name: item.name,
  category: item.cat,
  description: `Item especial para nossa nova jornada.`,
  price: 0, // No price required
  status: 'available',
  image: `https://image.pollinations.ai/prompt/beautiful%20product%20photography%20of%20${encodeURIComponent(item.name)}%20home%20decor?width=400&height=300&nologo=true`
}));

let allGifts = [];
let currentFilter = 'Todos';
let selectedGiftId = null;
let reserveMode = null; // 'named' | 'anonymous'

async function initGifts() {
  await initFirebase();
  await initGiftsIfEmpty(INITIAL_GIFTS_DATA);
  allGifts = await getGifts();
  renderGifts();
  initFilters();
  initReserveModal();
}

function getCategories() {
  const cats = ['Todos', ...new Set(allGifts.map(g => g.category))];
  return cats;
}

function initFilters() {
  const container = document.getElementById('gift-filters');
  if (!container) return;
  const cats = getCategories();
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

function renderGifts() {
  const grid = document.getElementById('gifts-grid');
  if (!grid) return;

  const filtered = currentFilter === 'Todos'
    ? allGifts
    : allGifts.filter(g => g.category === currentFilter);

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="gifts-empty">
        <span class="gifts-empty-icon">🎁</span>
        <p>Nenhum presente nesta categoria.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(gift => renderGiftCard(gift)).join('');

  // Bind reserve buttons
  grid.querySelectorAll('.btn-reserve').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.giftId;
      const gift = allGifts.find(g => g.id === id);
      if (gift && gift.status === 'available') openReserveModal(gift);
    });
  });
}

function renderGiftCard(gift) {
  const status = giftStatusLabel(gift.status);
  const isAvailable = gift.status === 'available';
  // Force dynamic image to bypass LocalStorage/Firebase cache of the old static URLs
  gift.image = `https://image.pollinations.ai/prompt/beautiful%20product%20photography%20of%20${encodeURIComponent(gift.name)}%20home%20decor?width=400&height=300&nologo=true`;

  // Search links to allow users to purchase or view the product elsewhere
  const searchName = encodeURIComponent(gift.name);
  const stores = [
    { label: "Amazon", url: `https://www.amazon.com.br/s?k=${searchName}`, domain: "amazon.com.br" },
    { label: "Mercado Livre", url: `https://lista.mercadolivre.com.br/${searchName}`, domain: "mercadolivre.com.br" },
    { label: "Shopee", url: `https://shopee.com.br/search?keyword=${searchName}`, domain: "shopee.com.br" },
    { label: "Magalu", url: `https://www.magazineluiza.com.br/busca/${searchName}`, domain: "magazineluiza.com.br" }
  ];

  const storesHTML = isAvailable ? `
    <div style="margin: 1.25rem 0; text-align: center;">
      <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">Pesquisar este item em lojas oficiais:</p>
      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
        ${stores.map(s => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; background: var(--bg-primary); padding: 6px 10px; border-radius: 8px; border: 1px solid var(--glass-border-strong); color: var(--text-primary); text-decoration: none; font-weight: 600; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
            <img src="https://logo.clearbit.com/${s.domain}" alt="${s.label}" style="width: 18px; height: 18px; border-radius: 4px;" onerror="this.style.display='none'" />
            ${s.label}
          </a>`).join('')}
      </div>
    </div>
  ` : '';

  return `
    <div class="gift-card ${gift.status}" data-aos="fade-up">
      <div class="gift-card-image">
        <img class="gift-card-img" src="${sanitize(gift.image)}" alt="${sanitize(gift.name)}" loading="lazy"
             onerror="this.src='https://placehold.co/400x300/f5efe6/c8a96a?text=Presente'">
        <span class="gift-card-badge">
          <span class="badge ${status.class}">${status.emoji} ${status.label}</span>
        </span>
        <span class="gift-card-category">${sanitize(gift.category)}</span>
        ${gift.status !== 'available' ? `
          <div class="gift-card-status-overlay">
            <span class="gift-card-status-icon">${gift.status === 'reserved' ? '🎁' : '✅'}</span>
          </div>` : ''}
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

function openReserveModal(gift) {
  selectedGiftId = gift.id;
  reserveMode = null;

  // Popula modal
  document.getElementById('reserve-gift-name').textContent = gift.name;
  const priceDisplay = document.getElementById('reserve-gift-price');
  if (priceDisplay) priceDisplay.textContent = ""; // Do not show price values

  // Reset form
  const form = document.getElementById('reserve-named-form');
  const btnReserve = document.getElementById('btn-confirm-reserve');
  if (form) { form.classList.remove('visible'); form.reset(); }
  if (btnReserve) btnReserve.disabled = true;

  // Reset options
  document.querySelectorAll('.reserve-option').forEach(opt => opt.classList.remove('selected'));

  
  openModal('modal-reserve');
  
  // Select named by default to prevent disabled button confusion
  const optNamed = document.querySelector('.reserve-option[data-mode="named"]');
  if (optNamed) optNamed.click();

}

function initReserveModal() {
  // Option buttons
  document.querySelectorAll('.reserve-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.reserve-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      reserveMode = opt.dataset.mode;

      const form = document.getElementById('reserve-named-form');
      const btnReserve = document.getElementById('btn-confirm-reserve');

      if (reserveMode === 'named') {
        if (form) form.classList.add('visible');
      } else {
        if (form) form.classList.remove('visible');
      }
      if (btnReserve) btnReserve.disabled = false;
    });
  });

  // Confirm reserve
  const btnConfirm = document.getElementById('btn-confirm-reserve');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', async () => {
      if (!selectedGiftId || !reserveMode) return;

      btnConfirm.disabled = true;
      btnConfirm.textContent = 'Reservando...';
      try {

      const reservation = { isAnonymous: reserveMode === 'anonymous' };

      if (reserveMode === 'named') {
        const name = document.getElementById('reserve-name')?.value?.trim();
        const phone = document.getElementById('reserve-phone')?.value?.trim();
        const message = document.getElementById('reserve-message')?.value?.trim();

        if (!name || !phone) {
          showToast('Por favor, preencha seu nome e telefone.', 'error');
          btnConfirm.disabled = false;
          btnConfirm.textContent = 'Reservar';
          return;
        }
        reservation.reservedBy = name;
        reservation.reservedPhone = phone;
        reservation.reservationMessage = message;
      }

      await reserveGift(selectedGiftId, reservation);
      const gift = allGifts.find(g => g.id === selectedGiftId);
      allGifts = allGifts.map(g => g.id === selectedGiftId ? { ...g, status: 'reserved', ...reservation } : g);

      closeModal('modal-reserve');
      renderGifts();

      showToast('🎁 Presente reservado! Redirecionando para o PIX...', 'success', 4000);
      launchConfetti();

      // Envia mensagem de WhatsApp automaticamente para o número dos noivos
      const noivosPhone = '5538991621135';
      const guestName = reservation.isAnonymous ? 'Um convidado anônimo' : reservation.reservedBy;
      let text = `Olá Laoanny e Gabriel! 💒\n\nAcabei de reservar o presente *"${gift.name}"* no site de vocês!`;
      if (reservation.reservationMessage) {
        text += `\n\nRecado: "${reservation.reservationMessage}"`;
      }
      text += `\n\nAbraços, ${guestName}!`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${noivosPhone}&text=${encodedText}`;
      
      // Abre o PIX e adiciona um botão para o WhatsApp
      const pixModalBody = document.querySelector('#modal-pix .modal-body');
      
      // Remove botão antigo se existir
      const existingBtn = document.getElementById('btn-whatsapp-notify');
      if (existingBtn) existingBtn.remove();
      
      const whatsappBtn = document.createElement('a');
      whatsappBtn.id = 'btn-whatsapp-notify';
      whatsappBtn.className = 'btn btn-outline btn-lg';
      whatsappBtn.style.cssText = 'border-color: #25D366; color: #25D366; justify-content: center; margin-top: 0.75rem; display: flex; text-decoration: none;';
      whatsappBtn.href = whatsappUrl;
      whatsappBtn.target = '_blank';
      whatsappBtn.rel = 'noopener noreferrer';
      whatsappBtn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width:20px; height:20px; margin-right:8px;" /> Avisar os Noivos no WhatsApp';
      
      const btnGroup = pixModalBody.querySelector('div[style*="flex-direction: column"]');
      if (btnGroup) {
         btnGroup.appendChild(whatsappBtn);
      } else {
         pixModalBody.appendChild(whatsappBtn);
      }

      openModal('modal-pix');

      selectedGiftId = null;
      reserveMode = null;
      } catch (err) {
        console.error(err);
        showToast('Erro ao reservar presente', 'error');
      } finally {
        btnConfirm.disabled = false;
        btnConfirm.textContent = '🎁 Reservar Presente';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initGifts);

