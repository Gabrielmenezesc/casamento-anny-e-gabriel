const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';
const presentesPath = path.join(dir, 'js', 'presentes.js');

let content = fs.readFileSync(presentesPath, 'utf-8');

const searchCode = `      // Abre o WhatsApp e o PIX imediatamente para evitar bloqueador de popups
      openModal('modal-pix');
      window.location.href = whatsappUrl; // Bypasses mobile popup blockers after async await

      selectedGiftId = null;
      reserveMode = null;`;

const replaceCode = `      // Abre o PIX e adiciona um botão para o WhatsApp
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
      whatsappBtn.innerHTML = '📱 Avisar os Noivos (WhatsApp)';
      
      const btnGroup = pixModalBody.querySelector('div[style*="flex-direction: column"]');
      if (btnGroup) {
         btnGroup.appendChild(whatsappBtn);
      } else {
         pixModalBody.appendChild(whatsappBtn);
      }

      openModal('modal-pix');

      selectedGiftId = null;
      reserveMode = null;`;

content = content.replace(searchCode, replaceCode);

// Also remove disabled state from reserve button when an error happens just to be safe
content = content.replace(/btnConfirm\.disabled = true;\n      btnConfirm\.textContent = 'Reservando\.\.\.';/g, `btnConfirm.disabled = true;\n      btnConfirm.textContent = 'Reservando...';\n      try {`);
content = content.replace(/selectedGiftId = null;\n      reserveMode = null;/g, `selectedGiftId = null;\n      reserveMode = null;\n      } catch (err) {\n        console.error(err);\n        showToast('Erro ao reservar presente', 'error');\n      } finally {\n        btnConfirm.disabled = false;\n        btnConfirm.textContent = '🎁 Reservar Presente';\n      }`);


fs.writeFileSync(presentesPath, content);
console.log('Fixed present reservation flow');
