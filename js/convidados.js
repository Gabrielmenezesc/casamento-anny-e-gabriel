// ===================================================
// CONVIDADOS.JS - Formulario RSVP (simples -> direto ao WhatsApp)
// ===================================================

document.addEventListener('DOMContentLoaded', function() {
  initCounters();
  maskPhoneInputs();
  initRSVPForm();
});

function initCounters() {
  initCounter('children-dec', 'children-inc', 'children-count', 0, 20, 0);
}

function initCounter(decId, incId, displayId, min, max, initialValue) {
  var dec     = document.getElementById(decId);
  var inc     = document.getElementById(incId);
  var display = document.getElementById(displayId);
  if (!dec || !inc || !display) return;

  var value = initialValue;
  display.textContent = value;

  dec.addEventListener('click', function() {
    if (value > min) { value--; display.textContent = value; renderAdditionalGuestInputs(); }
  });
  inc.addEventListener('click', function() {
    if (value < max) { value++; display.textContent = value; renderAdditionalGuestInputs(); }
  });
}

function renderAdditionalGuestInputs() {
  var container = document.getElementById('additional-guests-container');
  if (!container) return;

  var children = parseInt(document.getElementById('children-count') && document.getElementById('children-count').textContent || '0');

  var html = '';
  for (var j = 1; j <= children; j++) {
    html += '<div class="form-group" style="margin-top: 10px;">' +
              '<label class="form-label" style="font-size: 0.8rem;">Nome da Crianca ' + j + ' (Ate 9 anos)</label>' +
              '<input class="form-input additional-child-name" type="text" placeholder="Nome completo da crianca" />' +
            '</div>';
  }
  container.innerHTML = html;
}

function maskPhoneInputs() {
  var inputs = document.querySelectorAll('input[type="tel"]');
  for (var k = 0; k < inputs.length; k++) {
    (function(input) {
      input.addEventListener('input', function() {
        if (typeof maskPhone === 'function') maskPhone(input);
      });
    })(inputs[k]);
  }
}

function initRSVPForm() {
  var form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var nome     = (document.getElementById('rsvp-name')  ? document.getElementById('rsvp-name').value  : '').trim();
    var telefone = (document.getElementById('rsvp-phone') ? document.getElementById('rsvp-phone').value : '').trim();

    if (!nome || !telefone) {
      alert('Por favor, preencha seu nome e telefone.');
      return;
    }

    var criancas = parseInt(document.getElementById('children-count') ? document.getElementById('children-count').textContent : '0');
    var notas    = (document.getElementById('rsvp-notes') ? document.getElementById('rsvp-notes').value : '').trim();

    var criancaInputs = document.querySelectorAll('.additional-child-name');

    var nomesCriancas = [];
    for (var b = 0; b < criancaInputs.length; b++) {
      if (criancaInputs[b].value.trim()) nomesCriancas.push(criancaInputs[b].value.trim());
    }

    // Monta mensagem
    var msg = 'Ola Laoanny e Gabriel! Confirmei minha presenca no casamento de voces pelo site!\n\n';
    msg += 'Nome: ' + nome + '\n';
    msg += 'Telefone: ' + telefone + '\n';
    msg += 'Adultos: 1 (Eu)\n'; // Fixed to 1 adult
    
    msg += 'Criancas: ' + criancas + '\n';
    if (nomesCriancas.length > 0) {
      msg += 'Nomes das Criancas: ' + nomesCriancas.join(', ') + '\n';
    }
    if (notas) {
      msg += 'Observacoes: ' + notas + '\n';
    }
    msg += '\nNos vemos no dia 25/04/2027!';

    // VAI DIRETO PARA O WHATSAPP
    var url = 'https://api.whatsapp.com/send?phone=5538991621135&text=' + encodeURIComponent(msg);
    window.location.href = url;
  });
}