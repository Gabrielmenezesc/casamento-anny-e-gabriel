const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'ENGEFIELD', 'Downloads', 'GL', 'casamento-premium', 'js', 'presentes.js');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Fix the image cache issue by overriding it inside renderGiftCard
const renderGiftCardBlock = `function renderGiftCard(gift) {
  const status = giftStatusLabel(gift.status);
  const isAvailable = gift.status === 'available';`;

const renderGiftCardFix = `function renderGiftCard(gift) {
  const status = giftStatusLabel(gift.status);
  const isAvailable = gift.status === 'available';
  // Force dynamic image to bypass LocalStorage/Firebase cache of the old static URLs
  gift.image = \`https://image.pollinations.ai/prompt/beautiful%20product%20photography%20of%20\${encodeURIComponent(gift.name)}%20home%20decor?width=400&height=300&nologo=true\`;`;

content = content.replace(renderGiftCardBlock, renderGiftCardFix);

// 2. Fix the reservation popup blocker issue
const reserveBlockOld = `      // Abre o WhatsApp após uma pequena fração de segundo
      setTimeout(() => {
        openModal('modal-pix');
        // O WhatsApp abre em uma nova aba
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 800);`;

const reserveBlockNew = `      // Abre o WhatsApp e o PIX imediatamente para evitar bloqueador de popups
      openModal('modal-pix');
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');`;

content = content.replace(reserveBlockOld, reserveBlockNew);

fs.writeFileSync(filePath, content);
console.log('presentes.js updated');
