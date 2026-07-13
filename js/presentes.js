// ===================================================
// PRESENTES.JS - Lista de Presentes interativa
// ===================================================

// Dados iniciais dos presentes
const INITIAL_GIFTS_DATA = [
  {
    id: 'g001', name: 'Jogo de Panelas Tramontina', category: 'Cozinha',
    description: 'Conjunto de panelas antiaderentes de alta qualidade com 5 peças.',
    price: 580, status: 'available', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
  },
  {
    id: 'g002', name: 'Jogo de Cama Queen 600 Fios', category: 'Quarto',
    description: 'Lençol de percal egípcio, macio e duradouro. Cor: Branco Off-White.',
    price: 420, status: 'available', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'
  },
  {
    id: 'g003', name: 'Air Fryer Digital 5,5L', category: 'Eletrodomésticos',
    description: 'Fritadeira elétrica sem óleo com tela touch e 12 funções pré-programadas.',
    price: 650, status: 'available', image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=300&fit=crop'
  },
  {
    id: 'g004', name: 'Jogo de Toalhas Buddemeyer', category: 'Banheiro',
    description: 'Kit com 8 peças em algodão egípcio premium. Fofas e absorventes.',
    price: 320, status: 'available', image: 'https://images.unsplash.com/photo-1571864030041-9b5a85caeb0b?w=400&h=300&fit=crop'
  },
  {
    id: 'g005', name: 'Liquidificador Tramontina', category: 'Cozinha',
    description: 'Potência de 1000W com 5 velocidades e jarra de vidro 2L.',
    price: 390, status: 'available', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop'
  },
  {
    id: 'g006', name: 'Smart TV 50" 4K', category: 'Eletrodomésticos',
    description: 'Televisão com resolução 4K Ultra HD, Wi-Fi, Bluetooth e apps integrados.',
    price: 2200, status: 'available', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop'
  },
  {
    id: 'g007', name: 'Jogo de Jantar 30 peças', category: 'Mesa Posta',
    description: 'Serviço completo para 6 pessoas em porcelana premium com bordas douradas.',
    price: 750, status: 'available', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop'
  },
  {
    id: 'g008', name: 'Máquina de Café Expresso', category: 'Cozinha',
    description: 'Preparo profissional com moagem e pressão perfeitas para café coado e expresso.',
    price: 1100, status: 'available', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
  },
  {
    id: 'g009', name: 'Aspirador de Pó Robô', category: 'Eletrodomésticos',
    description: 'Aspirador robô programável com Wi-Fi, mapeamento inteligente e bateria de longa duração.',
    price: 1800, status: 'available', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    id: 'g010', name: 'Conjunto de Almofadas', category: 'Sala',
    description: 'Kit com 6 almofadas decorativas em veludo. Cores: nude, dourado e terracota.',
    price: 280, status: 'available', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'
  },
  {
    id: 'g011', name: 'Batedeira Planetária KitchenAid', category: 'Cozinha',
    description: 'Batedeira profissional 4,8L com 10 velocidades e acessórios completos.',
    price: 1650, status: 'available', image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=400&h=300&fit=crop'
  },
  {
    id: 'g012', name: 'Jogo de Facas Tramontina', category: 'Cozinha',
    description: 'Conjunto com 7 facas em aço inox alemão com suporte de madeira.',
    price: 480, status: 'available', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=300&fit=crop'
  },
];

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
        <p class="gift-card-price">
          <span class="gift-card-price-prefix">Valor aprox.</span>
          ${formatCurrency(gift.price)}
        </p>
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
  document.getElementById('reserve-gift-price').textContent = formatCurrency(gift.price);

  // Reset form
  const form = document.getElementById('reserve-named-form');
  const btnReserve = document.getElementById('btn-confirm-reserve');
  if (form) { form.classList.remove('visible'); form.reset(); }
  if (btnReserve) btnReserve.disabled = true;

  // Reset options
  document.querySelectorAll('.reserve-option').forEach(opt => opt.classList.remove('selected'));

  openModal('modal-reserve');
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

      showToast('🎁 Presente reservado com sucesso! Redirecionando para o WhatsApp...', 'success', 4000);
      launchConfetti();

      // Envia mensagem de WhatsApp automaticamente para o número dos noivos
      const noivosPhone = '5538991621135';
      const guestName = reservation.isAnonymous ? 'Um convidado anônimo' : reservation.reservedBy;
      const giftValue = formatCurrency(gift.price);
      let text = `Olá Laoanny e Gabriel! 💒\n\nAcabei de reservar o presente *"${gift.name}"* (Valor: ${giftValue}) no site de vocês!`;
      if (reservation.reservationMessage) {
        text += `\n\nRecado: "${reservation.reservationMessage}"`;
      }
      text += `\n\nAbraços, ${guestName}!`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${noivosPhone}&text=${encodedText}`;
      
      // Abre o WhatsApp após uma pequena fração de segundo
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 1000);

      selectedGiftId = null;
      reserveMode = null;
    });
  }
}

document.addEventListener('DOMContentLoaded', initGifts);
