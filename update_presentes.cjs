const fs = require('fs');

const filePath = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium\\js\\presentes.js';
let content = fs.readFileSync(filePath, 'utf-8');

// Update image property
content = content.replace(
  /image:\s*CATEGORY_IMAGES\[item\.cat\].*/g,
  "image: `https://image.pollinations.ai/prompt/beautiful%20product%20photography%20of%20${encodeURIComponent(item.name)}%20home%20decor?width=400&height=300&nologo=true`"
);

// Remove Whatsapp auto opening entirely and use Pix instead?
// The user said: "DEVE SER DIRECIONADO PARA O PIX TAMBEM"
// Which means we still open WhatsApp but also Pix modal.
content = content.replace(/showToast\('🎁 Presente reservado com sucesso! Redirecionando para o WhatsApp\.\.\.', 'success', 4000\);/, "showToast('🎁 Presente reservado! Redirecionando para o PIX...', 'success', 4000);");

// Let's replace the setTimeout block at the bottom of reserve Confirm
const searchBlock = `      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 1000);`;

const replaceBlock = `      setTimeout(() => {
        openModal('modal-pix');
        // O WhatsApp abre em uma nova aba
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 800);`;

content = content.replace(searchBlock, replaceBlock);

fs.writeFileSync(filePath, content);
console.log('presentes.js updated');
