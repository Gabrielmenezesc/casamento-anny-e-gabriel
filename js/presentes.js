// ===================================================
// PRESENTES.JS v4 - Fluxo robusto, sem dependência de Firebase
// ===================================================

// ── Dados dos presentes ────────────────────────────
const RAW_ITEMS = [
  { name: "Liquidificador",           cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Cafeteira",                cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Sanduicheira",             cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Batedeira",                cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Processador de alimentos", cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Espremedor de frutas",     cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Purificador de água",      cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Bebedouro",                cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Sofá",                     cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Mesa de jantar",           cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Cadeiras para mesa",       cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Rack para TV",             cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Guarda-roupa",             cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Criado-mudo",              cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Escrivaninha",             cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Cadeira de escritório",    cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Estante",                  cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Aparador",                 cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Sapateira",                cat: "🏠 Eletrodomésticos e Móveis" },
  { name: "Jogo de panelas",          cat: "🍳 Cozinha" },
  { name: "Panela de pressão",        cat: "🍳 Cozinha" },
  { name: "Frigideiras",              cat: "🍳 Cozinha" },
  { name: "Assadeiras",               cat: "🍳 Cozinha" },
  { name: "Formas de bolo",           cat: "🍳 Cozinha" },
  { name: "Travessas",                cat: "🍳 Cozinha" },
  { name: "Refratários",              cat: "🍳 Cozinha" },
  { name: "Jogo de pratos",           cat: "🍳 Cozinha" },
  { name: "Tigelas",                  cat: "🍳 Cozinha" },
  { name: "Copos",                    cat: "🍳 Cozinha" },
  { name: "Taças",                    cat: "🍳 Cozinha" },
  { name: "Canecas",                  cat: "🍳 Cozinha" },
  { name: "Xícaras",                  cat: "🍳 Cozinha" },
  { name: "Faqueiro",                 cat: "🍳 Cozinha" },
  { name: "Facas de cozinha",         cat: "🍳 Cozinha" },
  { name: "Conchas e pegadores",      cat: "🍳 Cozinha" },
  { name: "Tábua de corte",           cat: "🍳 Cozinha" },
  { name: "Escorredor",               cat: "🍳 Cozinha" },
  { name: "Potes e jarras",           cat: "🍳 Cozinha" },
  { name: "Garrafa térmica",          cat: "🍳 Cozinha" },
  { name: "Porta-temperos",           cat: "🍳 Cozinha" },
  { name: "Jogo de lençóis",          cat: "🛏 Quarto" },
  { name: "Travesseiros",             cat: "🛏 Quarto" },
  { name: "Edredom",                  cat: "🛏 Quarto" },
  { name: "Cobertor",                 cat: "🛏 Quarto" },
  { name: "Colcha de cama",           cat: "🛏 Quarto" },
  { name: "Mantas decorativas",       cat: "🛏 Quarto" },
  { name: "Cabides",                  cat: "🛏 Quarto" },
  { name: "Toalhas de banho",         cat: "🚿 Banheiro" },
  { name: "Tapete de banheiro",       cat: "🚿 Banheiro" },
  { name: "Cortina Box",              cat: "🚿 Banheiro" },
  { name: "Porta sabonete",           cat: "🚿 Banheiro" },
  { name: "Cesto de roupas",          cat: "🚿 Banheiro" },
  { name: "Cortinas",                 cat: "🛋 Sala" },
  { name: "Tapete de sala",           cat: "🛋 Sala" },
  { name: "Almofadas",                cat: "🛋 Sala" },
  { name: "Mesa de centro",           cat: "🛋 Sala" },
  { name: "Mesa lateral",             cat: "🛋 Sala" },
  { name: "Luminária",                cat: "🛋 Sala" },
  { name: "Ferro de passar",          cat: "🧺 Lavanderia" },
  { name: "Tábua de passar",          cat: "🧺 Lavanderia" },
  { name: "Vassoura e rodo",          cat: "🧺 Lavanderia" },
  { name: "Panos e esponjas",         cat: "🧺 Lavanderia" },
  { name: "Kit Ferramentas",          cat: "📦 Diversos" },
  { name: "Filtro de Linha",          cat: "📦 Diversos" },
  { name: "Espelho",                  cat: "📦 Diversos" },
  { name: "Relógio de parede",        cat: "📦 Diversos" },
  { name: "Organizadores",            cat: "📦 Diversos" }
];

const LOJAS = [
  { label: "Amazon",        domain: "amazon.com.br",        url: (q) => `https://www.amazon.com.br/s?k=${q}` },
  { label: "Mercado Livre", domain: "mercadolivre.com.br",  url: (q) => `https://lista.mercadolivre.com.br/${q}` },
  { label: "Shopee",        domain: "shopee.com.br",         url: (q) => `https://shopee.com.br/search?keyword=${q}` },
  { label: "Magalu",        domain: "magazineluiza.com.br",  url: (q) => `https://www.magazineluiza.com.br/busca/${q}` }
];

// ── Estado ─────────────────────────────────────────
const STORAGE_KEY = 'presentes_v4';
let presentes     = [];
let filtroAtual   = 'Todos';
let presenteAtual = null;
let modoReserva   = 'named';

// ── LocalStorage ───────────────────────────────────
function carregarLocal() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e) { return null; }
}
function salvarLocal(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

// ── Init ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Carrega dados
  const local = carregarLocal();
  if (local && local.length) {
    presentes = local;
  } else {
    presentes = RAW_ITEMS.map((item, i) => ({
      id:          `g_${String(i+1).padStart(3,'0')}`,
      name:        item.name,
      category:    item.cat,
      description: 'Item especial para nossa nova jornada.',
      status:      'available',
      reservedBy:  null,
      reservedAt:  null
    }));
    salvarLocal(presentes);
  }

  renderFiltros();
  renderGrid();
  iniciarModais();

  // Tenta Firebase em background, sem travar
  setTimeout(syncFirebase, 1000);
});

async function syncFirebase() {
  try {
    if (typeof initFirebase === 'function') await initFirebase();
    if (typeof initGiftsIfEmpty === 'function') {
      const initial = presentes.map(p => ({ ...p, price: 0, image: '' }));
      await initGiftsIfEmpty(initial);
    }
    if (typeof getGifts === 'function') {
      const remoto = await getGifts();
      if (remoto && remoto.length) {
        // Atualiza status reservado/entregue do Firebase
        let mudou = false;
        presentes = presentes.map(local => {
          const r = remoto.find(x => x.id === local.id);
          if (r && r.status !== 'available' && local.status === 'available') {
            mudou = true;
            return { ...local, status: r.status, reservedBy: r.reservedBy || null, reservedAt: r.reservedAt || null };
          }
          return local;
        });
        if (mudou) { salvarLocal(presentes); renderGrid(); }
      }
    }
  } catch(e) { console.info('Firebase sync:', e.message); }
}

// ── Filtros ────────────────────────────────────────
function renderFiltros() {
  const container = document.getElementById('gift-filters');
  if (!container) return;
  const cats = ['Todos', ...new Set(presentes.map(p => p.category))];
  container.innerHTML = cats.map(c => `
    <button class="gift-filter-btn${c === filtroAtual ? ' active' : ''}"
            onclick="setFiltro(this,'${CSS.escape(c)}')">${c}</button>
  `).join('');
}

function setFiltro(btn, cat) {
  filtroAtual = cat.replace(/\\,/g, ','); // unescape if needed
  // Simpler: just read data attribute
  filtroAtual = btn.textContent;
  document.querySelectorAll('.gift-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid();
}

// ── Grid de presentes ──────────────────────────────
function renderGrid() {
  const grid = document.getElementById('gifts-grid');
  if (!grid) return;

  const lista = filtroAtual === 'Todos'
    ? presentes
    : presentes.filter(p => p.category === filtroAtual);

  if (!lista.length) {
    grid.innerHTML = `<div class="gifts-empty"><span class="gifts-empty-icon">🎁</span><p>Nenhum presente nesta categoria.</p></div>`;
    return;
  }

  grid.innerHTML = lista.map(p => cartaoPresente(p)).join('');
}

function cartaoPresente(p) {
  const disponivel = p.status === 'available';
  const q   = encodeURIComponent(p.name);
  const img = `https://image.pollinations.ai/prompt/professional+studio+product+photo+of+${q}+white+background+minimalist?width=400&height=300&nologo=true&seed=${p.id}`;

  const lojasHTML = disponivel ? `
    <div style="margin:.75rem 0;text-align:center;">
      <p style="font-size:.68rem;color:var(--text-muted);margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.06em;">Ver preços nas lojas:</p>
      <div style="display:flex;gap:5px;justify-content:center;flex-wrap:wrap;">
        ${LOJAS.map(l => `
          <a href="${l.url(q)}" target="_blank" rel="noopener noreferrer"
             style="display:flex;align-items:center;gap:4px;font-size:.7rem;background:var(--bg-primary);padding:4px 8px;border-radius:7px;border:1px solid var(--glass-border-strong);color:var(--text-primary);text-decoration:none;font-weight:600;">
            <img src="https://logo.clearbit.com/${l.domain}" width="14" height="14" style="border-radius:3px;" onerror="this.style.display='none'" />
            ${l.label}
          </a>`).join('')}
      </div>
    </div>
  ` : '';

  const statusLabel = disponivel
    ? ''
    : `<div style="position:absolute;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;font-size:2.5rem;">${p.status === 'reserved' ? '🎁' : '✅'}</div>`;

  const badgeColor = disponivel ? '#d1fae5;color:#065f46' : '#fef3c7;color:#92400e';
  const badgeText  = disponivel ? '🟢 Disponível' : (p.status === 'reserved' ? '🟡 Reservado' : '✅ Entregue');

  return `
    <div class="gift-card ${p.status}" data-aos="fade-up">
      <div class="gift-card-image" style="position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--bg-secondary);">
        <img src="${img}" alt="${sanitize(p.name)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform .4s;"
             onerror="this.src='https://placehold.co/400x300/e8ecf1/91a8d0?text=${encodeURIComponent(p.name)}'" />
        ${statusLabel}
        <span style="position:absolute;top:.5rem;left:.5rem;background:${badgeColor};padding:.2rem .6rem;border-radius:50px;font-size:.68rem;font-weight:700;">${badgeText}</span>
        <span style="position:absolute;top:.5rem;right:.5rem;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);color:white;font-size:.62rem;font-weight:600;padding:.2rem .5rem;border-radius:50px;">${sanitize(p.category)}</span>
      </div>
      <div class="gift-card-body">
        <h3 class="gift-card-name">${sanitize(p.name)}</h3>
        <p class="gift-card-desc">${sanitize(p.description)}</p>
        ${lojasHTML}
      </div>
      <div class="gift-card-footer">
        <button class="btn-reserve" data-id="${p.id}" ${!disponivel ? 'disabled' : ''}>
          ${disponivel ? '🎁 Quero Presentear' : (p.status === 'reserved' ? '🎁 Reservado' : '✅ Entregue')}
        </button>
      </div>
    </div>
  `;
}

// ── Modais ─────────────────────────────────────────
function iniciarModais() {
  // Delegação de eventos no grid para botões de reserva
  document.getElementById('gifts-grid').addEventListener('click', e => {
    const btn = e.target.closest('.btn-reserve');
    if (!btn || btn.disabled) return;
    const id = btn.dataset.id;
    const p  = presentes.find(x => x.id === id);
    if (p && p.status === 'available') abrirModalReserva(p);
  });

  // Fechar modal reserva
  document.getElementById('mr-close-btn').addEventListener('click', fecharModalReserva);
  document.getElementById('modal-reserva-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-reserva-overlay')) fecharModalReserva();
  });

  // Fechar modal PIX
  document.getElementById('pix-close-btn').addEventListener('click', fecharModalPix);
  document.getElementById('modal-pix-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-pix-overlay')) fecharModalPix();
  });

  // Botão copiar PIX
  document.getElementById('pix-btn-copiar').addEventListener('click', () => {
    navigator.clipboard.writeText('38991621135').then(() => {
      const btn = document.getElementById('pix-btn-copiar');
      btn.textContent = '✅ Chave copiada!';
      setTimeout(() => { btn.textContent = '📋 Copiar Chave PIX'; }, 2500);
    }).catch(() => {
      // fallback
      const el = document.createElement('textarea');
      el.value = '38991621135'; el.style.position = 'absolute'; el.style.left = '-9999px';
      document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove();
      const btn = document.getElementById('pix-btn-copiar');
      btn.textContent = '✅ Chave copiada!';
      setTimeout(() => { btn.textContent = '📋 Copiar Chave PIX'; }, 2500);
    });
  });

  // Botão confirmar reserva
  document.getElementById('btn-confirmar-reserva').addEventListener('click', confirmarReserva);
}

function selecionarTab(modo) {
  modoReserva = modo;
  document.getElementById('tab-com-nome').classList.toggle('ativo', modo === 'named');
  document.getElementById('tab-anonimo').classList.toggle('ativo', modo === 'anonymous');
  document.getElementById('mr-campos-nome').style.display = modo === 'named' ? 'block' : 'none';
}

function abrirModalReserva(p) {
  presenteAtual = p;
  modoReserva   = 'named';

  document.getElementById('mr-nome-presente').textContent = p.name;
  document.getElementById('mr-nome').value      = '';
  document.getElementById('mr-telefone').value  = '';
  document.getElementById('mr-mensagem').value  = '';

  // Tab com nome ativo por padrão
  document.getElementById('tab-com-nome').classList.add('ativo');
  document.getElementById('tab-anonimo').classList.remove('ativo');
  document.getElementById('mr-campos-nome').style.display = 'block';

  const btn = document.getElementById('btn-confirmar-reserva');
  btn.disabled    = false;
  btn.textContent = '🎁 Confirmar e ver PIX para pagamento';

  document.getElementById('modal-reserva-overlay').classList.add('aberto');
  document.body.style.overflow = 'hidden';
}

function fecharModalReserva() {
  document.getElementById('modal-reserva-overlay').classList.remove('aberto');
  document.body.style.overflow = '';
}

function fecharModalPix() {
  document.getElementById('modal-pix-overlay').classList.remove('aberto');
  document.body.style.overflow = '';
}

function abrirModalPix() {
  // Abre modal PIX sem reserva (botão da seção "Presentear com PIX")
  document.getElementById('pix-nome-presente').textContent = 'Escaneie o QR Code ou copie a chave';
  const waBtn = document.getElementById('pix-btn-wa');
  const waText = encodeURIComponent('Olá Laoanny e Gabriel! 💒\n\nGostaria de contribuir com a Lua de Mel de vocês! ❤️');
  waBtn.href = `https://api.whatsapp.com/send?phone=5538991621135&text=${waText}`;
  document.getElementById('modal-pix-overlay').classList.add('aberto');
  document.body.style.overflow = 'hidden';
}

async function confirmarReserva() {
  if (!presenteAtual) return;

  const btn = document.getElementById('btn-confirmar-reserva');

  // Validação
  if (modoReserva === 'named') {
    const nome = (document.getElementById('mr-nome').value || '').trim();
    const tel  = (document.getElementById('mr-telefone').value || '').trim();
    if (!nome || !tel) {
      // Destaca campos vazios
      if (!nome) document.getElementById('mr-nome').style.borderColor = '#ef4444';
      if (!tel)  document.getElementById('mr-telefone').style.borderColor = '#ef4444';
      setTimeout(() => {
        document.getElementById('mr-nome').style.borderColor = '';
        document.getElementById('mr-telefone').style.borderColor = '';
      }, 2000);
      btn.textContent = '⚠️ Preencha nome e telefone!';
      setTimeout(() => { btn.textContent = '🎁 Confirmar e ver PIX para pagamento'; }, 2000);
      return;
    }
  }

  btn.disabled    = true;
  btn.textContent = 'Reservando...';

  // Dados da reserva
  const nome      = (document.getElementById('mr-nome').value || '').trim();
  const tel       = (document.getElementById('mr-telefone').value || '').trim();
  const mensagem  = (document.getElementById('mr-mensagem').value || '').trim();
  const anonimo   = modoReserva === 'anonymous';
  const nomeExib  = anonimo ? 'Convidado Anônimo' : nome;

  // 1. Marca como reservado localmente (IMEDIATO)
  presentes = presentes.map(p =>
    p.id === presenteAtual.id
      ? { ...p, status: 'available', /* mantém disponível localmente; só Firebase confirma */ }
      : p
  );

  // Marca como reservado de forma definitiva
  presentes = presentes.map(p =>
    p.id === presenteAtual.id
      ? {
          ...p,
          status:     'reserved',
          reservedBy: anonimo ? null : nome,
          reservedPhone: anonimo ? null : tel,
          reservationMessage: mensagem || null,
          isAnonymous: anonimo,
          reservedAt: new Date().toISOString()
        }
      : p
  );
  salvarLocal(presentes);

  // 2b. Email notification
  if (typeof notifyGiftReserved === 'function') {
    notifyGiftReserved({
      giftName: presenteAtual.name,
      reservedBy: anonimo ? null : nome,
      phone: anonimo ? null : tel,
      isAnonymous: anonimo
    });
  }

  // 2. Salva no Firebase (background)
  const dadosReserva = {
    isAnonymous: anonimo,
    reservedBy: anonimo ? null : nome,
    reservedPhone: anonimo ? null : tel,
    reservationMessage: mensagem || null
  };
  if (typeof reserveGift === 'function') {
    reserveGift(presenteAtual.id, dadosReserva).catch(e => console.warn('Firebase reserve:', e));
  }

  // 3. Re-renderiza grid (presente some da lista disponível)
  fecharModalReserva();
  renderGrid();
  if (typeof launchConfetti === 'function') launchConfetti();

  // 4. Monta mensagem WhatsApp
  let waText = `Olá Laoanny e Gabriel! 💒\n\nAcabei de reservar o presente *"${presenteAtual.name}"* da lista de casamento de vocês!\n\nAbraços, ${nomeExib}!`;
  if (mensagem) waText += `\n\n💬 Recado: "${mensagem}"`;
  const waUrl = `https://api.whatsapp.com/send?phone=5538991621135&text=${encodeURIComponent(waText)}`;

  // 5. Atualiza botão WhatsApp no modal PIX
  document.getElementById('pix-btn-wa').href = waUrl;
  document.getElementById('pix-nome-presente').textContent = `Presente: ${presenteAtual.name}`;

  // 6. Abre modal PIX
  document.getElementById('modal-pix-overlay').classList.add('aberto');
  document.body.style.overflow = 'hidden';

  presenteAtual = null;
  btn.disabled    = false;
  btn.textContent = '🎁 Confirmar e ver PIX para pagamento';
}
