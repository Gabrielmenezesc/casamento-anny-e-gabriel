// ── EmailJS Notification Service ──────────────────────────────────────────
// Sends email to gabrielmc02@gmail.com and tavareslaoanny2@gmail.com
// when a gift is reserved or a guest confirms presence.
//
// SETUP (1-time, free):
//   1. Go to https://www.emailjs.com and create a free account
//   2. Add a Gmail service (connect your Gmail)
//   3. Create a template with variables: {{to_email}}, {{subject}}, {{message}}
//   4. Copy your: Public Key, Service ID, Template ID → paste below
// ─────────────────────────────────────────────────────────────────────────

const EMAILJS_PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY';   // e.g. "abc123XYZ"
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';            // e.g. "service_xxxxx"
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';           // e.g. "template_xxxxx"

const NOIVOS_EMAILS = ['gabrielmc02@gmail.com', 'tavareslaoanny2@gmail.com'];

// Injects EmailJS SDK if not already present
function loadEmailJS() {
  return new Promise((resolve) => {
    if (window.emailjs) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    s.onload = () => { window.emailjs.init(EMAILJS_PUBLIC_KEY); resolve(); };
    document.head.appendChild(s);
  });
}

// Sends email to both noivos
async function sendEmailNotification({ subject, message }) {
  if (EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
    // Not configured yet — log & skip silently
    console.info('[EmailJS] Not configured — skipping email notification.');
    return;
  }

  try {
    await loadEmailJS();
    for (const email of NOIVOS_EMAILS) {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: email,
        subject,
        message,
        site_url: 'https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/'
      });
    }
    console.info('[EmailJS] Notifications sent!');
  } catch (err) {
    console.warn('[EmailJS] Failed to send:', err);
  }
}

// Called when a gift is reserved
async function notifyGiftReserved({ giftName, reservedBy, phone, isAnonymous }) {
  const who = isAnonymous ? 'Um convidado anônimo' : `${reservedBy} (${phone})`;
  await sendEmailNotification({
    subject: `🎁 Presente Reservado: ${giftName}`,
    message:
`Olá Laoanny e Gabriel! 💒

${who} acabou de reservar o presente "${giftName}" da lista de casamento de vocês!

Acesse o painel dos noivos para ver todos os detalhes:
https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/admin.html

Com carinho,
Site do Casamento ♡`
  });
}

// Called when a guest confirms RSVP
async function notifyRSVP({ guestName, phone, guests, message }) {
  await sendEmailNotification({
    subject: `✅ Confirmação de Presença: ${guestName}`,
    message:
`Olá Laoanny e Gabriel! 💒

${guestName} confirmou presença no casamento de vocês!

• Nome: ${guestName}
• Telefone: ${phone}
• Número de acompanhantes: ${guests}
${message ? `• Mensagem: "${message}"` : ''}

Acesse o painel dos noivos para ver a lista completa:
https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/admin.html

Com carinho,
Site do Casamento ♡`
  });
}
