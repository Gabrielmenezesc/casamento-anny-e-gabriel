// ============================================================================
// SITE-CONFIG.JS - Carregamento Dinâmico de Configurações Públicas
// ============================================================================

let weddingConfig = null;

// CRC16 Helper para PIX
function crc16(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xFF;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Gerador dinâmico de PIX EMV (Copia e Cola)
function generatePixEMV(key, name, city, amount = 0) {
  if (!key || !name) return '';
  key = key.replace(/\s+/g, '');
  name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().substring(0, 25);
  city = (city || 'Brasilia').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().substring(0, 15);
  
  const parts = [
    '000201',
    '010212'
  ];
  
  const gui = '0014BR.GOV.BCB.PIX';
  const keyField = '01' + key.length.toString().padStart(2, '0') + key;
  const merchantInfo = '26' + (gui.length + keyField.length).toString().padStart(2, '0') + gui + keyField;
  parts.push(merchantInfo);
  
  parts.push('52040000');
  parts.push('5303986');
  
  if (amount > 0) {
    const amtStr = amount.toFixed(2);
    parts.push('54' + amtStr.length.toString().padStart(2, '0') + amtStr);
  }
  
  parts.push('5802BR');
  parts.push('59' + name.length.toString().padStart(2, '0') + name);
  parts.push('60' + city.length.toString().padStart(2, '0') + city);
  parts.push('62070503***');
  
  const preCrc = parts.join('') + '6304';
  return preCrc + crc16(preCrc);
}

// Inicializa configurações
async function loadWeddingConfigData() {
  try {
    // 1. Garante inicialização do Firebase
    if (typeof initFirebase === 'function') {
      await initFirebase();
    }
    
    // 2. Busca configurações
    if (typeof getWeddingConfig === 'function') {
      weddingConfig = await getWeddingConfig();
      applyConfigToDOM();
    }
  } catch (e) {
    console.error('[Site Config] Erro ao inicializar configurações:', e);
  }
}

// Aplica as configurações dinamicamente no HTML
function applyConfigToDOM() {
  if (!weddingConfig) return;

  const namesCombined = `${weddingConfig.brideName} & ${weddingConfig.groomName}`;
  const weddingDateParsed = new Date(weddingConfig.weddingDate);
  
  // Formatadores de data
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDateLong = weddingDateParsed.toLocaleDateString('pt-BR', dateOptions); // ex: 25 de abril de 2027
  const formattedDateShort = weddingDateParsed.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }); // ex: 25 de Abril
  const formattedYear = weddingDateParsed.getFullYear();
  const formattedTime = weddingDateParsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' horas';

  // 1. Atualizar Título da Página
  if (document.title.includes('|')) {
    const titleParts = document.title.split('|');
    document.title = `${namesCombined} | ${titleParts[1]}`;
  } else {
    document.title = `${namesCombined} | Casamento`;
  }

  // 2. Atualizar Logotipo Navbar e Footer
  document.querySelectorAll('.navbar-logo, .footer-logo').forEach(el => {
    el.innerHTML = `${weddingConfig.brideName} <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin:0 3px;color:#e85d75;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> ${weddingConfig.groomName}`;
  });

  // 3. Atualizar Nomes no Hero e Textos
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.innerHTML = `${weddingConfig.brideName} <span class="hero-heart"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin:0 3px;color:#e85d75;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span> ${weddingConfig.groomName}`;
  }

  // 4. Data e Hora
  setElContent('hero-date-val', formattedDateShort);
  setElContent('hero-year-val', `de ${formattedYear}`);
  setElContent('hero-time-val', formattedTime);
  setElContent('wedding-main-text-val', weddingConfig.mainText);
  setElContent('footer-details-val', `${formattedDateLong} • ${weddingConfig.receptionName} • ${weddingConfig.address}`);
  
  document.querySelectorAll('.wedding-date-long-val').forEach(el => {
    el.textContent = formattedDateLong;
  });
  document.querySelectorAll('.wedding-reception-val').forEach(el => {
    el.textContent = weddingConfig.receptionName;
  });

  // 5. Localização e Google Maps
  const mapsBtn = document.getElementById('wedding-maps-btn');
  if (mapsBtn && weddingConfig.mapsLink) {
    mapsBtn.href = weddingConfig.mapsLink;
  }
  const mapsIframe = document.getElementById('wedding-maps-iframe');
  if (mapsIframe && weddingConfig.mapsLink) {
    mapsIframe.src = weddingConfig.mapsLink;
  }
  setElContent('wedding-address-val', weddingConfig.address);
  setElContent('wedding-church-val', weddingConfig.churchName);
  setElContent('wedding-reception-val', weddingConfig.receptionName);

  // 6. Configurações de PIX
  const pixEMVCode = generatePixEMV(weddingConfig.pixKey, weddingConfig.pixReceiver, weddingConfig.pixCity);
  window.PIX_EMV = pixEMVCode;
  window.PIX_KEY = weddingConfig.pixKey;
  window.WA_NUMBER = weddingConfig.whatsappNumber;

  const pixQR = document.getElementById('wedding-pix-qr');
  if (pixQR && pixEMVCode) {
    pixQR.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(pixEMVCode)}&size=210x210&margin=6&color=0-0-0&bgcolor=255-255-255&ecc=M`;
  }
  
  document.querySelectorAll('.noivos-combined-names-val').forEach(el => {
    el.textContent = namesCombined;
  });
  document.querySelectorAll('#wedding-pix-key-val').forEach(el => {
    el.textContent = weddingConfig.pixKey;
  });
  document.querySelectorAll('#wedding-pix-receiver-val').forEach(el => {
    el.textContent = weddingConfig.pixReceiver;
  });
  document.querySelectorAll('#wedding-pix-city-val').forEach(el => {
    el.textContent = weddingConfig.pixCity;
  });

  // 7. Meta de Lua de Mel
  const moonCollected = parseFloat(weddingConfig.honeymoonCollected || 0);
  const moonGoal = parseFloat(weddingConfig.honeymoonGoal || 1);
  const pct = Math.min(100, (moonCollected / moonGoal) * 100);
  
  setElContent('goal-amount', `R$ ${moonCollected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  setElContent('goal-percentage', `${pct.toFixed(1)}% da meta alcançada`);
  const goalBar = document.getElementById('goal-bar');
  if (goalBar) {
    setTimeout(() => {
      goalBar.style.width = pct + '%';
    }, 500);
  }
  const goalDescription = document.getElementById('goal-description');
  if (goalDescription) {
    goalDescription.textContent = weddingConfig.honeymoonDescription;
  }

  // Dispara evento customizado para outros scripts saberem que a data carregou (ex: countdown.js)
  window.dispatchEvent(new CustomEvent('weddingDateLoaded', { detail: weddingDateParsed }));
}

function setElContent(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// Roda ao carregar a página
document.addEventListener('DOMContentLoaded', loadWeddingConfigData);
