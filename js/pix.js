// ===================================================
// PIX.JS - Modal PIX com QR Code e Cópia de Chave
// ===================================================

const PIX_KEY = '38991621135';
const PIX_NAME = 'Gabriel Men';
const PIX_CITY = 'Brasilia';
const INFINITEPAY_LINK = 'https://link.infinitepay.io/gabrielmen10?origin=link-na-bio';
const CARD_PAYMENT_URL = 'https://invoice.infinitepay.io/gabrielmen10/gV7OaCL60E';

/**
 * Gera payload PIX BR Code (formato padrão Banco Central)
 * Funciona para qualquer chave PIX
 */
function generatePixPayload(key, name, city, amount = null, txid = '***') {
  function fmt(id, value) {
    const len = String(value.length).padStart(2, '0');
    return `${id}${len}${value}`;
  }

  const merchantName = name.substring(0, 25).toUpperCase();
  const merchantCity = city.substring(0, 15).toUpperCase();

  const pixKey = fmt('01', key);
  const gui = fmt('00', 'BR.GOV.BCB.PIX');
  const additionalData = fmt('05', txid);
  const merchantAccountInfo = fmt('26', gui + pixKey);

  let payload =
    fmt('00', '01') +
    merchantAccountInfo +
    fmt('52', '0000') +
    fmt('53', '986') +
    (amount ? fmt('54', amount.toFixed(2)) : '') +
    fmt('58', 'BR') +
    fmt('59', merchantName) +
    fmt('60', merchantCity) +
    fmt('62', fmt('05', txid));

  payload += fmt('63', crc16(payload + '6304'));
  return payload;
}

/**
 * CRC16 para validação do payload PIX
 */
function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera URL do QR Code via API pública (sem depender de servidor)
 */
function generateQRCodeUrl(pixPayload) {
  const encoded = encodeURIComponent(pixPayload);
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encoded}&size=240x240&margin=12&color=2-2-2&bgcolor=255-255-255&ecc=M`;
}

/**
 * Inicializa o Modal PIX
 */
function initPixModal() {
  const btnOpenPix = document.querySelectorAll('[data-open-pix]');
  btnOpenPix.forEach(btn => {
    btn.addEventListener('click', () => openPixModal());
  });

  const btnCopyPix = document.getElementById('btn-copy-pix');
  if (btnCopyPix) {
    btnCopyPix.addEventListener('click', async () => {
      const pixPayload = generatePixPayload(PIX_KEY, PIX_NAME, PIX_CITY);
      const ok = await copyToClipboard(pixPayload);
      if (ok) {
        btnCopyPix.innerHTML = 'Copiado! ✅';
        btnCopyPix.style.background = '#2d8a4e';
        btnCopyPix.style.color = '#fff';
        btnCopyPix.style.borderColor = '#2d8a4e';
        showToast('Chave PIX copiada!', 'success');
        setTimeout(() => {
          btnCopyPix.innerHTML = '📋 Copiar Chave PIX';
          btnCopyPix.style.background = '';
          btnCopyPix.style.color = '';
          btnCopyPix.style.borderColor = '';
        }, 2500);
      } else {
        showToast('Não foi possível copiar. Copie manualmente.', 'error');
      }
    });
  }

  const btnCard = document.getElementById('btn-pix-card');
  if (btnCard) {
    btnCard.addEventListener('click', () => {
      window.open(CARD_PAYMENT_URL, '_blank', 'noopener,noreferrer');
    });
  }
}

function openPixModal() {
  openModal('modal-pix');
  // Renderiza QR Code
  const qrImg = document.getElementById('pix-qrcode');
  const pixKeyDisplay = document.getElementById('pix-key-display');
  const pixLink = document.getElementById('pix-infinitepay-link');

  if (qrImg) {
    const pixPayload = generatePixPayload(PIX_KEY, PIX_NAME, PIX_CITY);
    qrImg.src = generateQRCodeUrl(pixPayload);
    qrImg.alt = 'QR Code PIX para contribuição';
  }
  if (pixKeyDisplay) {
    pixKeyDisplay.textContent = PIX_KEY;
  }
  if (pixLink) {
    pixLink.href = INFINITEPAY_LINK;
  }
}

document.addEventListener('DOMContentLoaded', initPixModal);
