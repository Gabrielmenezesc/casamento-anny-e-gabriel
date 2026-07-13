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
    if (value > min) { value--; display.textContent = value; }
  });
  inc.addEventListener('click', () => {
    if (value < max) { value++; display.textContent = value; }
  });
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

    const rsvp = {
      fullName: document.getElementById('rsvp-name')?.value?.trim() || '',
      phone: document.getElementById('rsvp-phone')?.value?.trim() || '',
      email: document.getElementById('rsvp-email')?.value?.trim() || '',
      adultsCount: parseInt(document.getElementById('adults-count')?.textContent || '1'),
      childrenCount: parseInt(document.getElementById('children-count')?.textContent || '0'),
      notes: document.getElementById('rsvp-notes')?.value?.trim() || '',
    };

    if (!rsvp.fullName || !rsvp.phone) {
      showToast('Por favor, preencha seu nome e telefone.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '👨‍👩‍👧 Confirmar Presença';
      return;
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
      showToast('✅ Presença confirmada! Até o dia 25/04/2027!', 'success', 5000);

    } catch (err) {
      console.error(err);
      showToast('Erro ao confirmar presença. Tente novamente.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '👨‍👩‍👧 Confirmar Presença';
    }
  });
}
