// ===================================================
// ADMIN.JS - Painel Administrativo (Atualizado)
// ===================================================

let adminLoggedIn = false;
let currentAdminPanel = 'dashboard';
let allRSVPs = [];
let allAdminGifts = [];
let allAdminGodparents = [];
let allPix = [];
let allGuestList = [];
let weddingConfig = null;

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o Firebase primeiro
  initFirebase().then(() => {
    checkAdminSession();
    initAdminLogin();
  });
});

// ===== Auth =====
function checkAdminSession() {
  onAdminStateChanged((user) => {
    if (user) {
      showAdminPanel();
    } else {
      showLoginScreen();
    }
  });
}

function initAdminLogin() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email')?.value?.trim();
    const pwd = document.getElementById('admin-password')?.value;
    const error = document.getElementById('admin-login-error');
    const submitBtn = form.querySelector('[type="submit"]');

    if (!email || !pwd) {
      showToast('⚠️ Por favor, digite seu e-mail e senha.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Entrando...';

    try {
      await signInAdmin(email, pwd);
      showToast('🔓 Acesso concedido!', 'success');
    } catch (e) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Entrar no Painel';
      if (error) {
        error.textContent = '🔒 Usuário ou senha incorretos.';
        error.classList.add('visible');
        setTimeout(() => error.classList.remove('visible'), 4000);
      }
    }
  });
}

function showLoginScreen() {
  document.getElementById('admin-login-screen')?.classList.remove('hidden');
  document.getElementById('admin-dashboard-screen')?.classList.add('hidden');
}

async function showAdminPanel() {
  document.getElementById('admin-login-screen')?.classList.add('hidden');
  document.getElementById('admin-dashboard-screen')?.classList.remove('hidden');
  adminLoggedIn = true;

  // Ativa navegação IMEDIATAMENTE (antes de carregar dados)
  initAdminNav();
  initAdminSearch();
  initExportButtons();
  initWeddingConfigForm();
  initGalleryForm();
  initWhatsAppPanel();

  // Carrega dados em segundo plano
  try {
    await loadAdminData();
  } catch (e) {
    console.error('Erro ao carregar dados do painel:', e);
    showToast('Erro ao carregar alguns dados. Recarregue a página.', 'error');
  }
}

async function adminLogout() {
  try {
    await signOutAdmin();
    showToast('🚪 Sessão encerrada.', 'info');
  } catch(e) {}
}

// ===== Load Data =====
async function loadAdminData() {
  try { allRSVPs = await getRSVPs(); } catch(e) { console.warn('Erro RSVPs:', e); allRSVPs = []; }
  try { allAdminGifts = await getGifts(); } catch(e) { console.warn('Erro Gifts:', e); allAdminGifts = []; }
  try { allAdminGodparents = await getGodparents(); } catch(e) { console.warn('Erro Padrinhos:', e); allAdminGodparents = []; }
  try { allPix = await getPix(); } catch(e) { console.warn('Erro PIX:', e); allPix = []; }
  try { allGuestList = await getGuestList(); } catch(e) { console.warn('Erro GuestList:', e); allGuestList = []; }
  try { weddingConfig = await getWeddingConfig(); } catch(e) { console.warn('Erro Config:', e); }

  // Importa a lista (a função no firebase.js filtra duplicatas automaticamente)
  try {
    allGuestList = await importInitialGuestList();
  } catch(e) { 
    console.warn('Erro importação:', e); 
  }

  // Sincroniza confirmações: marca automaticamente como confirmado quem já fez RSVP
  syncGuestConfirmations();

  renderDashboard(allRSVPs, allAdminGifts, weddingConfig, allPix);
  renderRSVPTable(allRSVPs);
  renderGiftsTable(allAdminGifts);
  renderGodparentsTable(allAdminGodparents);
  renderPixTable(allPix);
  renderGuestListTable(allGuestList);
  renderCharts(allRSVPs, allAdminGifts);
  
  // Preenche campos de configurações
  fillWeddingConfigForm();
  fillWhatsAppStats();
}

// ===== Dashboard Stats =====
function renderDashboard(rsvps, gifts, honeymoon, pixList) {
  const totalGuests = rsvps.reduce((acc, r) => acc + (r.adultsCount || 0) + (r.childrenCount || 0), 0);
  const totalAdults = rsvps.reduce((acc, r) => acc + (r.adultsCount || 0), 0);
  const totalChildren = rsvps.reduce((acc, r) => acc + (r.childrenCount || 0), 0);
  const confirmedCount = rsvps.length;

  const availableGifts = gifts.filter(g => g.status === 'available').length;
  const reservedGifts = gifts.filter(g => g.status === 'reserved').length;
  const deliveredGifts = gifts.filter(g => g.status === 'delivered').length;

  const pixAmount = pixList.reduce((acc, p) => acc + (parseFloat(p.valor) || 0), 0) + (honeymoon?.currentAmount || 0);
  const goal = honeymoon?.goal || 25000;
  const progress = Math.min(100, (pixAmount / goal) * 100);

  setEl('stat-confirmed', confirmedCount);
  setEl('stat-guests', totalGuests);
  setEl('stat-adults', totalAdults);
  setEl('stat-children', totalChildren);
  setEl('stat-available', availableGifts);
  setEl('stat-reserved', reservedGifts);
  setEl('stat-delivered', deliveredGifts);
  setEl('stat-pix', formatCurrency(pixAmount));

  // Progress bar
  const fill = document.getElementById('pix-goal-fill');
  if (fill) {
    fill.style.width = progress + '%';
    fill.title = `${progress.toFixed(1)}% da meta`;
  }
  const textVal = document.getElementById('pix-goal-text');
  if (textVal) textVal.textContent = `${formatCurrency(pixAmount)} de ${formatCurrency(goal)} (${progress.toFixed(1)}%)`;
}

function setEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ===== Tables =====
function renderRSVPTable(rsvps, filter = '') {
  const tbody = document.getElementById('rsvp-table-body');
  if (!tbody) return;

  const filtered = filter
    ? rsvps.filter(r => r.fullName?.toLowerCase().includes(filter.toLowerCase()) ||
                        r.phone?.includes(filter) || r.email?.toLowerCase().includes(filter.toLowerCase()))
    : rsvps;

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted)">Nenhum convidado encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    const rawPhone = r.phone ? r.phone.replace(/\D/g, '') : '';
    const waLink = rawPhone ? `https://wa.me/55${rawPhone}` : '';
    return `
      <tr>
        <td><strong>${sanitize(r.fullName || '')}</strong></td>
        <td>
          ${sanitize(r.phone || '')}
          ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" style="color: #25d366; font-size: 1.1rem; margin-left: 6px; text-decoration: none;" title="Conversar no WhatsApp">💬</a>` : ''}
        </td>
        <td>${sanitize(r.email || '-')}</td>
        <td style="text-align:center">${r.adultsCount || 0}</td>
        <td style="text-align:center">${r.childrenCount || 0}</td>
        <td>${sanitize(r.notes || '-')}</td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-action-btn admin-action-delete" onclick="deleteRSVPRow('${r.id}')">🗑 Excluir</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderGiftsTable(gifts, filter = '') {
  const tbody = document.getElementById('gifts-table-body');
  if (!tbody) return;

  const filtered = filter
    ? gifts.filter(g => g.name?.toLowerCase().includes(filter.toLowerCase()) || g.category?.toLowerCase().includes(filter.toLowerCase()))
    : gifts;

  tbody.innerHTML = filtered.map(g => {
    const st = giftStatusLabel(g.status);
    const rawPhone = g.reservedPhone ? g.reservedPhone.replace(/\D/g, '') : '';
    const waLink = rawPhone && !g.isAnonymous ? `https://wa.me/55${rawPhone}` : '';
    return `
      <tr>
        <td><strong>${sanitize(g.name)}</strong></td>
        <td>${sanitize(g.category)}</td>
        <td>${g.price > 0 ? formatCurrency(g.price) : 'Sem valor'}</td>
        <td><span class="badge ${st.class}">${st.emoji} ${st.label}</span></td>
        <td>
          ${g.reservedBy ? sanitize(g.reservedBy) + (g.isAnonymous ? ' (Anônimo)' : '') : '-'}
          ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" style="color: #25d366; font-size: 1.1rem; margin-left: 6px; text-decoration: none;" title="Conversar no WhatsApp">💬</a>` : ''}
        </td>
        <td>${g.reservedAt ? formatDate(g.reservedAt) : '-'}</td>
        <td>
          <div class="admin-table-actions">
            ${g.status === 'reserved' ? `<button class="admin-action-btn admin-action-deliver" onclick="markDelivered('${g.id}')">✅ Entregue</button>` : ''}
            ${g.status !== 'available' ? `<button class="admin-action-btn admin-action-edit" onclick="resetGift('${g.id}')">🔄 Liberar</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderGodparentsTable(godparents, filter = '') {
  const tbody = document.getElementById('padrinhos-table-body');
  if (!tbody) return;

  const filtered = filter
    ? godparents.filter(g => g.fullName?.toLowerCase().includes(filter.toLowerCase()) || g.phone?.includes(filter))
    : godparents;

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted)">Nenhum padrinho/madrinha cadastrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(g => {
    const rawPhone = g.phone ? g.phone.replace(/\D/g, '') : '';
    const waLink = rawPhone ? `https://wa.me/55${rawPhone}` : '';
    return `
      <tr>
        <td><strong>${sanitize(g.fullName || '')}</strong></td>
        <td>
          ${sanitize(g.phone || '')}
          ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" style="color: #25d366; font-size: 1.1rem; margin-left: 6px; text-decoration: none;" title="Conversar no WhatsApp">💬</a>` : ''}
        </td>
        <td style="text-align:center"><span class="badge badge-available">${sanitize(g.wearSize)}</span></td>
        <td style="text-align:center"><span class="badge badge-reserved">${sanitize(g.shoeSize)}</span></td>
        <td>${sanitize(g.foodRestrictions || '-')}</td>
        <td>${sanitize(g.companion || '-')}</td>
        <td>${sanitize(g.message || '-')}</td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-action-btn admin-action-delete" onclick="deleteGodparentRow('${g.id}')">🗑 Excluir</button>
          </div>
        </td>
    `;
  }).join('');
}

function renderPixTable(pixList) {
  const tbody = document.getElementById('pix-table-body-2') || document.getElementById('pix-table-body');
  if (!tbody) return;
  if (!pixList || !pixList.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--text-muted)">Nenhum PIX registrado ainda.</td></tr>';
    return;
  }
  tbody.innerHTML = pixList.map((p, index) => {
    const d = p.data ? new Date(p.data).toLocaleString('pt-BR') : '-';
    return `
      <tr>
        <td><strong>${sanitize(p.nome || 'Anônimo')}</strong></td>
        <td><span style="color:#25d366;font-weight:600;">R$ ${(parseFloat(p.valor)||0).toFixed(2).replace('.',',')}</span></td>
        <td>${d}</td>
        <td>
          <button class="admin-action-btn admin-action-delete" onclick="deletePixRow('${p.id || index}')">🗑 Excluir</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ===== Charts with Chart.js =====
function renderCharts(rsvps, gifts) {
  if (typeof Chart === 'undefined') return;

  // Chart 1: Convidados (Adultos vs Crianças)
  const ctxGuests = document.getElementById('chart-guests');
  if (ctxGuests) {
    const adults = rsvps.reduce((acc, r) => acc + (r.adultsCount || 0), 0);
    const children = rsvps.reduce((acc, r) => acc + (r.childrenCount || 0), 0);
    new Chart(ctxGuests, {
      type: 'doughnut',
      data: {
        labels: ['Adultos', 'Crianças'],
        datasets: [{ data: [adults, children], backgroundColor: ['#D4A843', '#C8586A'], borderWidth: 0 }]
      },
      options: { plugins: { legend: { position: 'bottom' } }, cutout: '65%' }
    });
  }

  // Chart 2: Status dos Presentes
  const ctxGifts = document.getElementById('chart-gifts');
  if (ctxGifts) {
    const available = gifts.filter(g => g.status === 'available').length;
    const reserved = gifts.filter(g => g.status === 'reserved').length;
    const delivered = gifts.filter(g => g.status === 'delivered').length;
    new Chart(ctxGifts, {
      type: 'bar',
      data: {
        labels: ['Disponível', 'Reservado', 'Entregue'],
        datasets: [{ data: [available, reserved, delivered], backgroundColor: ['#4ade80', '#D4A843', '#60a5fa'], borderRadius: 8 }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }
}

// ===== Actions =====
async function deleteRSVPRow(id) {
  if (!confirm('Excluir este convidado?')) return;
  await deleteRSVP(id);
  allRSVPs = allRSVPs.filter(r => r.id !== id);
  renderRSVPTable(allRSVPs);
  renderDashboard(allRSVPs, allAdminGifts, await getHoneymoonSettings(), allPix);
  showToast('Convidado removido.', 'info');
}

async function deletePixRow(index) {
  if (!confirm('Excluir este PIX?')) return;
  allPix = await deletePix(index);
  renderPixTable(allPix);
  renderDashboard(allRSVPs, allAdminGifts, await getHoneymoonSettings(), allPix);
  showToast('PIX removido.', 'info');
}

async function markDelivered(id) {
  await updateGift(id, { status: 'delivered' });
  allAdminGifts = allAdminGifts.map(g => g.id === id ? { ...g, status: 'delivered' } : g);
  renderGiftsTable(allAdminGifts);
  renderDashboard(allRSVPs, allAdminGifts, await getHoneymoonSettings());
  showToast('Presente marcado como entregue!', 'success');
}

async function resetGift(id) {
  if (!confirm('Liberar este presente para outros convidados?')) return;
  await updateGift(id, { status: 'available', reservedBy: null, reservedPhone: null, reservedAt: null, isAnonymous: false, reservationMessage: null });
  allAdminGifts = allAdminGifts.map(g => g.id === id ? { ...g, status: 'available', reservedBy: null } : g);
  renderGiftsTable(allAdminGifts);
  renderDashboard(allRSVPs, allAdminGifts, await getHoneymoonSettings());
  showToast('Presente liberado!', 'info');
}

async function deleteGodparentRow(id) {
  if (!confirm('Excluir este padrinho/madrinha?')) return;
  if (firebaseReady && db) {
    try {
      const { doc, deleteDoc } = window._fsLib;
      await deleteDoc(doc(db, 'godparents', id));
    } catch (e) { console.warn(e); }
  }
  allAdminGodparents = allAdminGodparents.filter(g => g.id !== id);
  Storage.set(STORAGE_KEYS.godparents, allAdminGodparents);
  renderGodparentsTable(allAdminGodparents);
  showToast('Padrinho removido.', 'info');
}

// ===== Admin Nav =====
function initAdminNav() {
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const panel = item.dataset.panel;
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${panel}`)?.classList.add('active');
      currentAdminPanel = panel;
      document.getElementById('admin-header-title').textContent = item.textContent.trim();
    });
  });
}

// ===== Search =====
function initAdminSearch() {
  const rsvpSearch = document.getElementById('rsvp-search');
  if (rsvpSearch) {
    rsvpSearch.addEventListener('input', debounce(() => renderRSVPTable(allRSVPs, rsvpSearch.value), 300));
  }
  const giftSearch = document.getElementById('gifts-search');
  if (giftSearch) {
    giftSearch.addEventListener('input', debounce(() => renderGiftsTable(allAdminGifts, giftSearch.value), 300));
  }
  const padSearch = document.getElementById('padrinhos-search');
  if (padSearch) {
    padSearch.addEventListener('input', debounce(() => renderGodparentsTable(allAdminGodparents, padSearch.value), 300));
  }
  const glSearch = document.getElementById('guestlist-search');
  if (glSearch) {
    glSearch.addEventListener('input', debounce(() => renderGuestListTable(allGuestList, glSearch.value), 300));
  }
}

// ===== Export =====
function initExportButtons() {
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    exportCSV(allRSVPs.map(r => ({
      Nome: r.fullName,
      Telefone: r.phone,
      Email: r.email || '',
      Adultos: r.adultsCount,
      Crianças: r.childrenCount,
      Observações: r.notes || '',
      'Data Confirmação': formatDateTime(r.confirmedAt)
    })), 'convidados_casamento.csv');
    showToast('📊 CSV exportado!', 'success');
  });

  document.getElementById('btn-export-gifts-csv')?.addEventListener('click', () => {
    exportCSV(allAdminGifts.map(g => ({
      Nome: g.name,
      Categoria: g.category,
      Valor: g.price || '',
      Status: g.status,
      'Reservado por': g.reservedBy || '',
      'Telefone Reserva': g.reservedPhone || '',
      'Mensagem Reserva': g.reservationMessage || '',
      'Data Reserva': g.reservedAt ? formatDate(g.reservedAt) : ''
    })), 'presentes_casamento.csv');
    showToast('📊 CSV de presentes exportado!', 'success');
  });

  document.getElementById('btn-export-padrinhos-csv')?.addEventListener('click', () => {
    exportCSV(allAdminGodparents.map(g => ({
      Nome: g.fullName,
      Telefone: g.phone,
      'Tamanho Roupa': g.wearSize,
      'Tamanho Calçado': g.shoeSize,
      'Restrições Alimentares': g.foodRestrictions,
      Acompanhante: g.companion,
      Mensagem: g.message || '',
      'Data Confirmação': formatDateTime(g.confirmedAt)
    })), 'padrinhos_casamento.csv');
    showToast('📊 CSV de Padrinhos exportado!', 'success');
  });

  document.getElementById('btn-print')?.addEventListener('click', () => window.print());

  // Guest list export
  document.getElementById('btn-export-guestlist-csv')?.addEventListener('click', () => {
    exportCSV(allGuestList.map(g => ({
      Nome: g.name,
      Lado: g.side === 'noiva' ? 'Noiva' : 'Noivo',
      Tipo: g.type === 'pagante' ? 'Pagante' : 'Não Pagante',
      Status: g.confirmed ? 'Confirmado' : 'Pendente',
      'Data Confirmação': g.confirmedAt ? formatDateTime(g.confirmedAt) : ''
    })), 'lista_convidados_casamento.csv');
    showToast('📊 CSV da lista exportado!', 'success');
  });
}

// ===== GUEST LIST (Lista de Convidados Master) =====

// Lista inicial da Noiva (1ª lista)
const NOIVA_PAGANTES = [
  'Izomar','Ângela','Erica','Kauê','Glenda','Ágata','Léo','Maisa','Isaías','Dom Dom',
  'Liliane','Letícia','Clarisse','Jurandi','Leninha','Romeu','Layd Helem','Lucas',
  'Lindinha','Camila','Ailton','Geisa','Gleiton','Dino','Layla','Renato','Francisco',
  'Carmelita','Jeferson','Letícia (2)','Amanda','Ian','Keite','Jennifer','Laís','Yasmim',
  'Ingrid','Sarah','Nyla','Valéria','Kaliny','Pedro (da Kaliny)','Mãe Kaka','Ellen',
  'Rosilene','Pedro (do Dino)','Raimunda','Pastor Buben','Roseane','Luyde'
];

const NOIVA_NAO_PAGANTES = [
  'Ravi','Hillary','Richard','Helena','Júlia','Joice','Sophia','Maria',
  'Maitê','Melissa','Nicolas','Outra Maitê','Filha da Sarah','Mariah'
];

// Lista inicial do Noivo (Gabriel)
const NOIVO_PAGANTES = [
  'Valdir','Georgiane','Jullye','Davi','Michel','Vanessa','Jhonatan','Douglas','Stefany',
  'Onofre','Welington Charles','Naty','Pamile','Sarah','Néia','Eric','Namorada de Eric',
  'João Lucas','Tia Cica','Tio Gato','Osvaldo','Nicinha','Zé Antônio (Toninho)','Zé Mendes',
  'Denor','Patrícia','Vó Ana','Jéssica','Wilian','João Pedro','Flávia','Emanuele','Isabelle',
  'Anne','Xande','Paula','Warley','Lucas','Rafael','Raiane','Tiago','Jaine','Silvio','Cleia',
  'Katia','Timbó','Luiz','Ana Caroline','Maninha','Luiz (2)','Max','Joelia','Davi (2)','Alexandre',
  'Cris','Victor Hugo','Ernane','Esposa do Ernane','Mariana','Geovane','Esposa do Geovane',
  'Mariana (2)','Felipe','Namorada de Felipe'
];

const NOIVO_NAO_PAGANTES = [
  'Isac','Danilo','Laura','Maria (2)','João Lucas (filho da Tia Jéssica)','Miguel','Luiz (3)'
];

async function importInitialGuestList() {
  const guests = [];
  NOIVA_PAGANTES.forEach((name, i) => {
    guests.push({
      id: 'noiva_p_' + (i + 1),
      name: name,
      side: 'noiva',
      type: 'pagante',
      confirmed: false,
      confirmedAt: null
    });
  });
  NOIVA_NAO_PAGANTES.forEach((name, i) => {
    guests.push({
      id: 'noiva_np_' + (i + 1),
      name: name,
      side: 'noiva',
      type: 'nao_pagante',
      confirmed: false,
      confirmedAt: null
    });
  });
  NOIVO_PAGANTES.forEach((name, i) => {
    guests.push({
      id: 'noivo_p_' + (i + 1),
      name: name,
      side: 'noivo',
      type: 'pagante',
      confirmed: false,
      confirmedAt: null
    });
  });
  NOIVO_NAO_PAGANTES.forEach((name, i) => {
    guests.push({
      id: 'noivo_np_' + (i + 1),
      name: name,
      side: 'noivo',
      type: 'nao_pagante',
      confirmed: false,
      confirmedAt: null
    });
  });
  return await importGuestBatch(guests);
}

function syncGuestConfirmations() {
  if (!allGuestList.length || !allRSVPs.length) return;
  let changed = false;
  allGuestList.forEach(guest => {
    const match = allRSVPs.find(r =>
      r.fullName && guest.name &&
      r.fullName.trim().toLowerCase() === guest.name.trim().toLowerCase()
    );
    if (match && !guest.confirmed) {
      guest.confirmed = true;
      guest.confirmedAt = match.confirmedAt || match.timestamp;
      changed = true;
    }
  });
  if (changed) {
    Storage.set('wedding_guestlist', allGuestList);
  }
}

function renderGuestListTable(guests, filter = '') {
  const tbody = document.getElementById('guestlist-table-body');
  if (!tbody) return;

  const filtered = filter
    ? guests.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()))
    : guests;

  // Stats
  const totalPagantes = guests.filter(g => g.type === 'pagante').length;
  const totalNaoPagantes = guests.filter(g => g.type === 'nao_pagante').length;
  const totalConfirmados = guests.filter(g => g.confirmed).length;
  setEl('stat-guestlist-total', guests.length);
  setEl('stat-guestlist-pagantes', totalPagantes);
  setEl('stat-guestlist-nao-pagantes', totalNaoPagantes);
  setEl('stat-guestlist-confirmados', totalConfirmados);

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted)">Nenhum convidado encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map((g, i) => {
    const statusBadge = g.confirmed
      ? '<span style="background:#22c55e;color:#fff;padding:2px 10px;border-radius:12px;font-size:0.75rem;font-weight:600;">✅ Confirmado</span>'
      : '<span style="background:#ef4444;color:#fff;padding:2px 10px;border-radius:12px;font-size:0.75rem;font-weight:600;">⏳ Pendente</span>';
    const typeBadge = g.type === 'pagante'
      ? '<span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:12px;font-size:0.7rem;">Pagante</span>'
      : '<span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:12px;font-size:0.7rem;">Não Pag.</span>';
    const sideBadge = g.side === 'noiva'
      ? '<span style="color:#ec4899;">👰 Noiva</span>'
      : '<span style="color:#3b82f6;">🤵 Noivo</span>';
    const confirmedDate = g.confirmedAt ? new Date(g.confirmedAt).toLocaleDateString('pt-BR') : '-';

    return `
      <tr style="${g.confirmed ? 'background: rgba(34,197,94,0.05);' : ''}">
        <td><strong>${sanitize(g.name)}</strong></td>
        <td>${sideBadge}</td>
        <td>${typeBadge}</td>
        <td>${statusBadge}</td>
        <td>
          ${!g.confirmed ? `<button class="admin-action-btn" style="background:#22c55e;color:#fff;border:none;padding:4px 10px;border-radius:8px;cursor:pointer;font-size:0.75rem;" onclick="manualConfirmGuest('${g.id}')">✅ Confirmar</button>` : `<button class="admin-action-btn" style="background:#f59e0b;color:#fff;border:none;padding:4px 10px;border-radius:8px;cursor:pointer;font-size:0.75rem;" onclick="unconfirmGuest('${g.id}')">↩ Desfazer</button>`}
          <button class="admin-action-btn admin-action-delete" style="margin-left:4px;" onclick="deleteGuestRow('${g.id}')">🗑</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function manualConfirmGuest(guestId) {
  allGuestList = await updateGuest(guestId, { confirmed: true, confirmedAt: new Date().toISOString() });
  renderGuestListTable(allGuestList);
  fillWhatsAppStats(); // Atualiza painel do WhatsApp também
  showToast('✅ Convidado confirmado manualmente!', 'success');
}

async function unconfirmGuest(guestId) {
  allGuestList = await updateGuest(guestId, { confirmed: false, confirmedAt: null });
  renderGuestListTable(allGuestList);
  fillWhatsAppStats();
  showToast('↩ Confirmação desfeita.', 'info');
}

async function deleteGuestRow(guestId) {
  if (!confirm('Excluir este convidado da lista?')) return;
  allGuestList = await deleteGuest(guestId);
  renderGuestListTable(allGuestList);
  fillWhatsAppStats();
  showToast('Convidado removido da lista.', 'info');
}

// ===== CONFIGURAÇÕES GERAIS (Wedding Config Form) =====

function initWeddingConfigForm() {
  const form = document.getElementById('admin-config-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = form.querySelector('[type="submit"]');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '⏳ Salvando...';

    const updatedConfig = {
      ...weddingConfig,
      brideName: document.getElementById('cfg-bride-name').value.trim(),
      groomName: document.getElementById('cfg-groom-name').value.trim(),
      weddingDate: document.getElementById('cfg-wedding-date').value,
      whatsappNumber: document.getElementById('cfg-whatsapp-number').value.trim(),
      receptionName: document.getElementById('cfg-reception-name').value.trim(),
      churchName: document.getElementById('cfg-church-name').value.trim(),
      address: document.getElementById('cfg-address').value.trim(),
      mapsLink: document.getElementById('cfg-maps-link').value.trim(),
      pixKey: document.getElementById('cfg-pix-key').value.trim(),
      pixReceiver: document.getElementById('cfg-pix-receiver').value.trim(),
      pixCity: document.getElementById('cfg-pix-city').value.trim(),
      honeymoonGoal: parseFloat(document.getElementById('cfg-honeymoon-goal').value) || 0,
      honeymoonCollected: parseFloat(document.getElementById('cfg-honeymoon-collected').value) || 0,
      honeymoonDescription: document.getElementById('cfg-honeymoon-description').value.trim(),
      mainText: document.getElementById('cfg-main-text').value.trim(),
      invitationText: document.getElementById('cfg-invitation-text').value.trim()
    };

    try {
      await saveWeddingConfig(updatedConfig);
      weddingConfig = updatedConfig;
      showToast('⚙️ Configurações salvas com sucesso!', 'success');
      
      // Atualiza dashboard
      renderDashboard(allRSVPs, allAdminGifts, weddingConfig, allPix);
    } catch (err) {
      showToast('❌ Erro ao salvar configurações. Tente novamente.', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = 'Salvar Configurações';
    }
  });
}

function fillWeddingConfigForm() {
  if (!weddingConfig) return;
  
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('cfg-bride-name', weddingConfig.brideName);
  setVal('cfg-groom-name', weddingConfig.groomName);
  
  // datetime-local precisa estar no formato YYYY-MM-DDTHH:MM
  if (weddingConfig.weddingDate) {
    setVal('cfg-wedding-date', weddingConfig.weddingDate.substring(0, 16));
  }
  
  setVal('cfg-whatsapp-number', weddingConfig.whatsappNumber);
  setVal('cfg-reception-name', weddingConfig.receptionName);
  setVal('cfg-church-name', weddingConfig.churchName);
  setVal('cfg-address', weddingConfig.address);
  setVal('cfg-maps-link', weddingConfig.mapsLink);
  setVal('cfg-pix-key', weddingConfig.pixKey);
  setVal('cfg-pix-receiver', weddingConfig.pixReceiver);
  setVal('cfg-pix-city', weddingConfig.pixCity);
  setVal('cfg-honeymoon-goal', weddingConfig.honeymoonGoal);
  setVal('cfg-honeymoon-collected', weddingConfig.honeymoonCollected);
  setVal('cfg-honeymoon-description', weddingConfig.honeymoonDescription);
  setVal('cfg-main-text', weddingConfig.mainText);
  setVal('cfg-invitation-text', weddingConfig.invitationText);
}

// ===== GERENCIAMENTO DE GALERIA =====

function initGalleryForm() {
  const form = document.getElementById('admin-gallery-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = form.querySelector('[type="submit"]');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '⏳ Salvando...';

    const updatedConfig = {
      ...weddingConfig,
      galleryPhoto1: document.getElementById('gallery-photo-1').value.trim(),
      galleryPhoto2: document.getElementById('gallery-photo-2').value.trim(),
      galleryPhoto3: document.getElementById('gallery-photo-3').value.trim(),
      galleryPhoto4: document.getElementById('gallery-photo-4').value.trim()
    };

    try {
      await saveWeddingConfig(updatedConfig);
      weddingConfig = updatedConfig;
      showToast('📸 Galeria atualizada com sucesso!', 'success');
    } catch (err) {
      showToast('❌ Erro ao atualizar galeria.', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = 'Salvar Fotos';
    }
  });
}

// ===== PAINEL WHATSAPP =====

// Modelos de mensagens
const WA_TEMPLATES = {
  convite: "Olá, [NOME]! 💒\n\nEstamos muito felizes em compartilhar esse momento especial com você. Nosso casamento está chegando!\n\n📅 Data: [DATA]\n⏰ Horário: [HORARIO]\n\nPor favor, confirme sua presença pelo nosso site:\n[LINK]\n\nCom carinho,\nAnny & Gabriel",
  lembrete: "Oi, [NOME]! ⏳\n\nPassando para lembrar que o nosso grande dia está se aproximando! Se você ainda não confirmou sua presença, por favor, faça isso pelo link abaixo para nos ajudar na organização:\n\n👉 [LINK]\n\nContamos com você! 💒",
  confirmacao: "Olá, [NOME]! ✅\n\nRecebemos sua confirmação de presença! Ficamos imensamente felizes em saber que você celebrará conosco no dia [DATA] às [HORARIO].\n\nTodas as informações e lista de presentes estão no nosso site:\n[LINK]\n\nAté lá! 🎉",
  agradecimento: "Querido(a) [NOME], 💜\n\nGostaríamos de agradecer imensamente pelo carinho, presença (ou presente) e por fazer parte da nossa história de amor.\n\nCom amor,\nAnny & Gabriel"
};

let currentWaTemplateType = 'convite';

function initWhatsAppPanel() {
  const editor = document.getElementById('wa-template-editor');
  if (editor) {
    editor.value = WA_TEMPLATES.convite;
  }

  const bindTmplBtn = (id, type) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.wa-tmpl-btn').forEach(b => {
        b.style.background = '#eee';
        b.style.color = '#333';
      });
      btn.style.background = 'var(--accent)';
      btn.style.color = 'white';
      currentWaTemplateType = type;
      if (editor) editor.value = WA_TEMPLATES[type];
    });
  };

  bindTmplBtn('wa-tmpl-convite', 'convite');
  bindTmplBtn('wa-tmpl-lembrete', 'lembrete');
  bindTmplBtn('wa-tmpl-confirmacao', 'confirmacao');
  bindTmplBtn('wa-tmpl-agradecimento', 'agradecimento');

  const waGuestSearch = document.getElementById('wa-guest-search');
  if (waGuestSearch) {
    waGuestSearch.addEventListener('input', debounce(() => {
      renderWaGuestTable(allGuestList, waGuestSearch.value);
    }, 300));
  }
}

function fillWhatsAppStats() {
  if (!allGuestList.length) return;

  // Filtra números de telefone válidos ou preenchidos (vamos simular identificando quem tem telefone)
  // Como a lista padrão importada em admin.js não tem telefones, vamos assumir que o casal preenche
  const total = allGuestList.length;
  // Para fins visuais, consideramos com telefone se tiver o campo preenchido (ou criamos telefone padrão para fins de teste)
  const withPhone = allGuestList.filter(g => g.phone && g.phone.trim().length > 4).length;
  const noPhone = total - withPhone;

  setEl('wa-stat-total', total);
  setEl('wa-stat-with-phone', withPhone);
  setEl('wa-stat-no-phone', noPhone);

  renderWaGuestTable(allGuestList);
}

function renderWaGuestTable(guests, filter = '') {
  const tbody = document.getElementById('wa-guest-table-body');
  if (!tbody) return;

  const filtered = filter
    ? guests.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()))
    : guests;

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted)">Nenhum convidado encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(g => {
    const hasPhone = g.phone && g.phone.trim().length > 4;
    const phoneDisplay = hasPhone ? sanitize(g.phone) : '<span style="color:#ef4444;">Sem Telefone</span>';
    const lastContact = g.whatsappUltimaAcao ? new Date(g.whatsappUltimaAcao).toLocaleString('pt-BR') : '-';
    const statusText = g.whatsappAcao ? '<span style="color:#22c55e;font-weight:600;">Enviado</span>' : '<span style="color:#888;">Pendente</span>';

    return `
      <tr>
        <td><strong>${sanitize(g.name)}</strong></td>
        <td>${phoneDisplay}</td>
        <td>${lastContact}</td>
        <td>${statusText}</td>
        <td>
          <button class="admin-action-btn" style="background:#25d366;color:#fff;border:none;padding:4px 10px;border-radius:8px;cursor:pointer;font-size:0.75rem;gap:4px;" onclick="sendWhatsAppTemplate('${g.id}')">💬 Enviar</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function sendWhatsAppTemplate(guestId) {
  const guest = allGuestList.find(g => g.id === guestId);
  if (!guest) return;

  // Garante que o convidado tem telefone cadastrado
  let guestPhone = guest.phone ? guest.phone.replace(/\D/g, '') : '';
  if (!guestPhone) {
    const inputPhone = prompt(`Digite o número de telefone de ${guest.name} (DDD + Número, apenas números):`);
    if (!inputPhone) return;
    guestPhone = inputPhone.replace(/\D/g, '');
    // Salva o telefone no Firestore
    allGuestList = await updateGuest(guestId, { phone: inputPhone });
    renderGuestListTable(allGuestList);
    fillWhatsAppStats();
  }

  // Prepara a mensagem
  const editor = document.getElementById('wa-template-editor');
  let text = editor ? editor.value : WA_TEMPLATES[currentWaTemplateType];

  const weddingDateParsed = new Date(weddingConfig?.weddingDate || '2027-04-25T16:30:00');
  const formattedDate = weddingDateParsed.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = weddingDateParsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Substitui tags
  text = text.replace(/\[NOME\]/g, guest.name)
             .replace(/\[DATA\]/g, formattedDate)
             .replace(/\[HORARIO\]/g, formattedTime)
             .replace(/\[LINK\]/g, 'https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/');

  // Registra a ação no Firestore
  allGuestList = await updateGuest(guestId, { whatsappAcao: true, whatsappUltimaAcao: new Date().toISOString() });
  renderWaGuestTable(allGuestList);

  // Redireciona para o WhatsApp (Sem delay para evitar bloqueios de pop-up)
  const encodedText = encodeURIComponent(text);
  const waUrl = `https://api.whatsapp.com/send?phone=55${guestPhone}&text=${encodedText}`;
  window.location.href = waUrl;
}

// Vincula globalmente para ser acessado por inline onClick
window.sendWhatsAppTemplate = sendWhatsAppTemplate;
