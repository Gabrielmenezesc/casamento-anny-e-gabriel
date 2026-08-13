// ===================================================
// CONVIDADOS.JS - Formulário RSVP
// ===================================================

document.addEventListener('DOMContentLoaded', async () => {
  await initFirebase();
  initRSVPForm();
  initCounters();
  maskPhoneInputs();
});

function initCounters() {
  // Adults counter
  initCounter('adults-dec', 'adults-inc', 'adults-count', 1, 20, 1);
  // Children counter
  initCounter('children-dec', 'children-inc', 'children-count', 0, 20, 0);
}

function initCounter(decId, incId, displayId, min, max, initialValue) {
  const dec = document.getElementById(decId);
  const inc = document.getElementById(incId);
  const display = document.getElementById(displayId);
  if (!dec || !inc || !display) return;

  let value = initialValue;
  display.textContent = value;

  dec.addEventListener('click', () => {
    if (value > min) { value--; display.textContent = value; renderAdditionalGuestInputs(); }
  });
  inc.addEventListener('click', () => {
    if (value < max) { value++; display.textContent = value; renderAdditionalGuestInputs(); }
  });
}

function renderAdditionalGuestInputs() {
  const container = document.getElementById('additional-guests-container');
  if (!container) return;

  const adults = parseInt(document.getElementById('adults-count')?.textContent || '1');
  const children = parseInt(document.getElementById('children-count')?.textContent || '0');

  let html = '';

  // Adultos adicionais (começa no 2 porque o 1 é o titular)
  for (let i = 2; i <= adults; i++) {
    html += `
      <div class="form-group" style="margin-top: 10px;">
        <label class="form-label" style="font-size: 0.8rem;">Nome do Adulto ${i}</label>
        <input class="form-input additional-adult-name" type="text" placeholder="Nome completo" required />
      </div>
    `;
  }

  // Crianças
  for (let i = 1; i <= children; i++) {
    html += `
      <div class="form-group" style="margin-top: 10px;">
        <label class="form-label" style="font-size: 0.8rem;">Nome da Criança ${i} (Até 9 anos)</label>
        <input class="form-input additional-child-name" type="text" placeholder="Nome completo da criança" required />
      </div>
    `;
  }

  container.innerHTML = html;
}

function maskPhoneInputs() {
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', () => maskPhone(input));
  });
}

function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="animate-spin">⏳</span> Confirmando...';

    const adultsCount = parseInt(document.getElementById('adults-count')?.textContent || '1');
    const childrenCount = parseInt(document.getElementById('children-count')?.textContent || '0');
    
    // Coleta nomes adicionais
    const adultNames = [];
    document.querySelectorAll('.additional-adult-name').forEach(input => {
      if (input.value.trim()) adultNames.push(input.value.trim());
    });

    const childNames = [];
    document.querySelectorAll('.additional-child-name').forEach(input => {
      if (input.value.trim()) childNames.push(input.value.trim());
    });

    const rsvp = {
      fullName: document.getElementById('rsvp-name')?.value?.trim() || '',
      phone: document.getElementById('rsvp-phone')?.value?.trim() || '',
      email: document.getElementById('rsvp-email')?.value?.trim() || '',
      adultsCount: adultsCount,
      childrenCount: childrenCount,
      adultNames: adultNames,
      childNames: childNames,
      notes: document.getElementById('rsvp-notes')?.value?.trim() || '',
      timestamp: new Date().toISOString()
    };

    if (!rsvp.fullName || !rsvp.phone) {
      showToast('Por favor, preencha seu nome e telefone.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '👨‍👩‍👧 Confirmar Presença';
      return;
    }

    // Validação de nome repetido
    try {
      const existingRsvps = await getRSVPs();
      const isDuplicate = existingRsvps.some(r => r.fullName.trim().toLowerCase() === rsvp.fullName.toLowerCase());
      if (isDuplicate) {
        showToast('Este nome já está confirmado na lista de convidados!', 'error');
        alert('Este nome já está confirmado na lista de convidados! Se você for um homônimo ou estiver tentando alterar os dados, entre em contato com os noivos.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '👨‍👩‍👧 Confirmar Presença';
        return;
      }
    } catch (e) {
      console.warn('Erro ao verificar nomes repetidos', e);
    }

    try {
      await saveRSVP(rsvp);

      // Animação de sucesso
      const formContainer = document.querySelector('.rsvp-form-body');
      const success = document.getElementById('rsvp-success');
      if (formContainer) formContainer.style.display = 'none';
      if (success) {
        success.classList.add('visible');
        success.querySelector('.rsvp-success-name').textContent = rsvp.fullName.split(' ')[0];
      }

      launchConfetti();
      showToast('✅ Presença confirmada! Redirecionando para o WhatsApp...', 'success', 5000);

      // Envia confirmação via WhatsApp automaticamente para o número dos noivos
      const noivosPhone = '5538991621135';
      let rsvpText = `Olá Laoanny e Gabriel! 💒\n\nConfirmei minha presença no casamento de vocês através do site!\n\n`;
      rsvpText += `👤 *Titular:* ${rsvp.fullName}\n`;
      rsvpText += `📞 *Telefone:* ${rsvp.phone}\n`;
      rsvpText += `👨 *Adultos:* ${rsvp.adultsCount}\n`;
      if (rsvp.adultNames && rsvp.adultNames.length > 0) {
        rsvpText += `   Acompanhantes:\n   - ${rsvp.adultNames.join('\n   - ')}\n`;
      }
      rsvpText += `👶 *Crianças:* ${rsvp.childrenCount}\n`;
      if (rsvp.childNames && rsvp.childNames.length > 0) {
        rsvpText += `   Nomes:\n   - ${rsvp.childNames.join('\n   - ')}\n`;
      }
      
      if (rsvp.notes) {
        rsvpText += `\n📝 *Observações:* ${rsvp.notes}`;
      }
      rsvpText += `\n\nNos vemos no dia 25/04/2027! 🎉`;

      const encodedText = encodeURIComponent(rsvpText);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${noivosPhone}&text=${encodedText}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 1500);

    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes('banco de dados')) {
        showToast(err.message, 'error', 10000);
        alert("Erro Crítico: " + err.message + "\n\nPor favor, avise o desenvolvedor para ir no site do Firebase, menu 'Firestore Database' e clicar em 'Criar banco de dados'.");
      } else {
        alert("Erro interno: " + err.message + "\nStack: " + err.stack);
        showToast('Erro ao confirmar presença. Tente novamente.', 'error');
      }
      submitBtn.disabled = false;
      submitBtn.innerHTML = '👨‍👩‍👧 Confirmar Presença';
    }
  });
}
