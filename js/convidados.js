(function () {
  function byId(id) { return document.getElementById(id); }
  function setChildFields() {
    var isChild = byId('rsvp-person-type').value === 'child';
    var group = byId('rsvp-birthdate-group');
    var date = byId('rsvp-birthdate');
    group.hidden = !isChild;
    date.required = isChild;
    if (!isChild) date.value = '';
  }
  function maskPhoneInputs() {
    var input = byId('rsvp-phone');
    if (input) input.addEventListener('input', function () { if (typeof maskPhone === 'function') maskPhone(input); });
  }
  function initRSVPForm() {
    var form = byId('rsvp-form');
    if (!form) return;
    byId('rsvp-person-type').addEventListener('change', setChildFields);
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Confirmando...';
      try {
        var result = await window.submitWeddingRSVP({
          full_name: byId('rsvp-name').value,
          phone: byId('rsvp-phone').value,
          email: byId('rsvp-email').value,
          person_type: byId('rsvp-person-type').value,
          birth_date: byId('rsvp-birthdate').value,
          identity_confirmed: byId('rsvp-identity-confirmation').checked,
          notes: byId('rsvp-notes').value
        });
        window.openWhatsAppRsvpConfirmation(result.rsvp);
        form.hidden = true;
        byId('rsvp-success').classList.add('show');
        var nameTarget = document.querySelector('.rsvp-success-name');
        if (nameTarget) nameTarget.textContent = byId('rsvp-name').value.trim().split(' ')[0];
      } catch (error) {
        alert(error.message || 'Não foi possível registrar a confirmação. Tente novamente.');
      } finally {
        button.disabled = false;
        button.textContent = 'Confirmar Presença';
      }
    });
  }
  document.addEventListener('DOMContentLoaded', function () { maskPhoneInputs(); initRSVPForm(); });
})();