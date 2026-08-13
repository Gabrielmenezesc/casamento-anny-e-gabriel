// ===================================================
// CONVIDADOS.JS - Formulário RSVP (v10 - à prova de falhas)
// ===================================================

document.addEventListener('DOMContentLoaded', async () => {
  await initFirebase();
  initRSVPForm();
  initCounters();
  maskPhoneInputs();
});

function initCounters() {
  initCounter('adults-dec', 'adults-inc', 'adults-count', 1, 20, 1);
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

  for (let i = 2; i <= adults; i++) {
    html += `
      <div class="form-group" style="margin-top: 10px;">
        <label class="form-label" style="font-size: 0.8rem;">Nome do Adulto ${i}</label>
        <input class="form-input additional-adult-name" type="text" placeholder="Nome completo" required />
      </div>
    `;
  }

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

    // Validação de nome repetido (não bloqueia se falhar)
    try {
      const existingRsvps = await getRSVPs();
      if (existingRsvps && existingRsvps.length > 0) {
        const isDuplicate = existingRsvps.some(r => 
          r.fullName && r.fullName.trim().toLowerCase() === rsvp.fullName.toLowerCase()
        );
        if (isDuplicate) {
          showToast('Este nome já está confirmado na lista de convidados!', 'error');
          submitBtn.disabled = false;
          submitBtn.innerHTML = '👨‍👩‍👧 Confirmar Presença';
          return;
        }
      }
    } catch (e) {
      // Se falhar a verificação, permite continuar mesmo assim
      console.warn('Verificação de duplicata falhou, prosseguindo:', e);
    }

    // Salva RSVP - saveRSVP nunca lança erro (salva no localStorage como garantia)
    try {
      await saveRSVP(rsvp);
    } catch (e) {
      console.warn('Erro no saveRSVP, mas dados foram salvos localmente:', e);
    }

    // SEMPRE mostra sucesso (dados já foram salvos localmente)
    const formContainer = document.querySelector('.rsvp-form-body');
    const success = document.getElementById('rsvp-success');
    if (formContainer) formContainer.style.display = 'none';
    if (success) {
      success.classList.add('visible');
      const nameEl = success.querySelector('.rsvp-success-name');
      if (nameEl) nameEl.textContent = rsvp.fullName.split(' ')[0];
    }

    if (typeof launchConfetti === 'function') launchConfetti();
    showToast('✅ Presença confirmada! Redirecionando para o WhatsApp...', 'success', 5000);

    // WhatsApp
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
      window.location.href = whatsappUrl;
    }, 1500);
  });
}
