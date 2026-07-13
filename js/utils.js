// ===================================================
// UTILS.JS - Funções Auxiliares
// ===================================================

/**
 * Formata valor monetário em Real Brasileiro
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata data em português
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

/**
 * Formata data e hora
 */
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/**
 * Aplica máscara de telefone
 */
function maskPhone(input) {
  let v = input.value.replace(/\D/g, '');
  if (v.length <= 11) {
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  }
  input.value = v;
}

/**
 * Aplica máscara de CPF
 */
function maskCPF(input) {
  let v = input.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

/**
 * Gera ID único
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Copia texto para área de transferência
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  }
}

/**
 * Debounce de função
 */
function debounce(fn, delay = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Sanitiza string para evitar XSS
 */
function sanitize(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}

/**
 * Verifica se elemento está na viewport
 */
function isInViewport(el, threshold = 0.1) {
  const rect = el.getBoundingClientRect();
  const windowH = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowH * (1 - threshold) && rect.bottom >= 0;
}

/**
 * Scroll suave para elemento
 */
function scrollTo(selector, offset = 80) {
  const el = document.querySelector(selector);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Formata status dos presentes
 */
function giftStatusLabel(status) {
  const map = {
    available: { label: 'Disponível', emoji: '🟢', class: 'badge-available' },
    reserved: { label: 'Reservado', emoji: '🟡', class: 'badge-reserved' },
    delivered: { label: 'Entregue', emoji: '🔵', class: 'badge-delivered' },
  };
  return map[status] || map.available;
}

/**
 * Dispara evento customizado
 */
function emit(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

/**
 * Exporta dados para CSV
 */
function exportCSV(data, filename = 'export.csv') {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// -------- LocalStorage helpers --------
const Storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  }
};

// -------- Keys --------
const STORAGE_KEYS = {
  rsvps: 'wedding_rsvps',
  gifts: 'wedding_gifts',
  honeymoon: 'wedding_honeymoon',
  godparents: 'wedding_godparents',
  settings: 'wedding_app_settings',
  theme: 'wedding_theme'
};
