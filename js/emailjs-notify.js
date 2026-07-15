// ============================================================================
// NOTIFICATION SERVICE (FormSubmit.co + EmailJS) - 100% AUTOMÁTICO E VINCULADO
// ============================================================================
// Envia e-mails automáticos para gabrielmc02@gmail.com e tavareslaoanny2@gmail.com
// quando um presente é reservado ou um convidado confirma presença.
//
// FUNCIONAMENTO AUTOMÁTICO (FormSubmit.co):
//   O sistema usa a API do FormSubmit.co para enviar e-mails diretamente sem
//   necessidade de configuração de API Key.
//   IMPORTANTE: Na primeira vez que um e-mail for disparado, o FormSubmit
//   enviará um e-mail de ativação para gabrielmc02@gmail.com e tavareslaoanny2@gmail.com.
//   Basta clicar em "Activate Form" nesse primeiro e-mail para que todas as
//   próximas notificações cheguem automaticamente!
// ============================================================================

const NOIVOS_EMAILS = ['gabrielmc02@gmail.com', 'tavareslaoanny2@gmail.com'];

// (Opcional) Chaves do EmailJS caso queira ativar redundância:
const EMAILJS_PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

// Envia e-mail para os dois noivos via FormSubmit.co (Zero-config, vinculado)
async function sendEmailNotification({ subject, message }) {
  console.info('[Notification] Enviando notificação para:', NOIVOS_EMAILS.join(', '));

  // 1. Disparo via FormSubmit.co (automático, sem API key)
  const formSubmitPromises = NOIVOS_EMAILS.map(async (email) => {
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: subject,
          Mensagem: message,
          Site: 'https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/',
          _captcha: 'false',
          _template: 'box'
        })
      });
      const data = await response.json();
      console.info(`[FormSubmit] Notificação enviada para ${email}:`, data);
      return data;
    } catch (err) {
      console.warn(`[FormSubmit] Falha no disparo para ${email}:`, err);
    }
  });

  // 2. Disparo redundante via EmailJS se estiver configurado
  if (EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
    try {
      await loadEmailJS();
      for (const email of NOIVOS_EMAILS) {
        window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: email,
          subject,
          message,
          site_url: 'https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/'
        }).catch(e => console.warn('[EmailJS] Erro:', e));
      }
    } catch (err) {
      console.warn('[EmailJS] Falha na carga:', err);
    }
  }

  // Executa envios do FormSubmit
  await Promise.allSettled(formSubmitPromises);
}

// Injeta SDK EmailJS caso seja necessário
function loadEmailJS() {
  return new Promise((resolve) => {
    if (window.emailjs) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    s.onload = () => { window.emailjs.init(EMAILJS_PUBLIC_KEY); resolve(); };
    document.head.appendChild(s);
  });
}

// Chamado automaticamente quando um presente é reservado
async function notifyGiftReserved({ giftName, reservedBy, phone, isAnonymous }) {
  const who = isAnonymous ? 'Um convidado anônimo' : `${reservedBy} (${phone})`;
  await sendEmailNotification({
    subject: `🎁 Presente Reservado: ${giftName}`,
    message:
`Olá Laoanny e Gabriel! 💒

${who} acabou de reservar o presente "${giftName}" da lista de casamento de vocês!

• Presente: ${giftName}
• Reservado por: ${who}
• Data/Hora: ${new Date().toLocaleString('pt-BR')}

Acesse o painel dos noivos para gerenciar:
https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/admin.html

Com carinho,
Site do Casamento ♡`
  });
}

// Chamado automaticamente quando um convidado confirma presença no RSVP
async function notifyRSVP({ guestName, phone, guests, message }) {
  await sendEmailNotification({
    subject: `✅ Confirmação de Presença: ${guestName}`,
    message:
`Olá Laoanny e Gabriel! 💒

${guestName} acabou de confirmar presença no casamento de vocês!

• Nome: ${guestName}
• Telefone: ${phone}
• Acompanhantes / Convidados: ${guests}
${message ? `• Observações / Recado: "${message}"` : ''}
• Data/Hora: ${new Date().toLocaleString('pt-BR')}

Acesse o painel dos noivos para ver a lista completa:
https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/admin.html

Com carinho,
Site do Casamento ♡`
  });
}
