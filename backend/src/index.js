const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "access-control-allow-origin": "https://gabrielmenezesc.github.io", "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "Content-Type" } });
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const cents = (value) => Math.round(Number(value || 0) * 100);

async function provider(path, env, init = {}) {
  const response = await fetch(`https://api.mercadopago.com${path}`, { ...init, headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`, "Content-Type": "application/json", ...(init.headers || {}) } });
  if (!response.ok) throw new Error(`Mercado Pago respondeu ${response.status}`);
  return response.json();
}
async function hmac(secret, text) { const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text))); return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join(""); }
async function validSignature(request, dataId, env) { const values = Object.fromEntries((request.headers.get("x-signature") || "").split(",").map((item) => item.trim().split("=")).filter(([key, value]) => key && value)); const requestId = request.headers.get("x-request-id") || ""; if (!values.ts || !values.v1 || !requestId || !dataId) return false; const manifest = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${values.ts};`; return (await hmac(env.MP_WEBHOOK_SECRET, manifest)) === values.v1; }
function label(status) { return ({ pending: "Aguardando confirmação oficial do PIX.", approved: "Pagamento confirmado. Obrigado pelo carinho!", cancelled: "Cobrança cancelada.", rejected: "Pagamento não aprovado.", refunded: "Pagamento devolvido." })[status] || "Cobrança encerrada."; }
function normalizeName(value) { return String(value || "").trim().replace(/\s+/g, " "); }
function onlyDigits(value) { return String(value || "").replace(/\D/g, ""); }
function ageOnWedding(birthDate) { const birth = new Date(`${birthDate}T12:00:00Z`); const wedding = new Date("2027-04-25T12:00:00Z"); let age = wedding.getUTCFullYear() - birth.getUTCFullYear(); if (wedding.getUTCMonth() < birth.getUTCMonth() || (wedding.getUTCMonth() === birth.getUTCMonth() && wedding.getUTCDate() < birth.getUTCDate())) age--; return age; }
function validBirthDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value || "") && !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime()); }

async function notifyRsvpWhatsApp(rsvp, env) {
  const token = env.WHATSAPP_ACCESS_TOKEN, phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID, recipient = env.WHATSAPP_RECIPIENT || "5538991621135", template = env.WHATSAPP_TEMPLATE_NAME;
  if (!token || !phoneNumberId || !template) return { status: "disabled", error: "Integração do WhatsApp ainda não configurada." };
  const endpoint = `https://graph.facebook.com/${env.WHATSAPP_GRAPH_API_VERSION || "v23.0"}/${encodeURIComponent(phoneNumberId)}/messages`;
  const values = [rsvp.fullName, rsvp.phone, rsvp.personType === "child" ? "Criança" : "Adulto", rsvp.birthDate || "Não informado"];
  const payload = { messaging_product: "whatsapp", to: recipient, type: "template", template: { name: template, language: { code: "pt_BR" }, components: [{ type: "body", parameters: values.map((text) => ({ type: "text", text })) }] } };
  const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || `WhatsApp respondeu ${response.status}`);
  return { status: "accepted", providerMessageId: body?.messages?.[0]?.id || null };
}
async function recordRsvpNotification(rsvp, env) {
  const timestamp = now(); let result;
  try { result = await notifyRsvpWhatsApp(rsvp, env); } catch (error) { result = { status: "failed", error: String(error.message || error) }; }
  await env.DB.prepare("INSERT INTO rsvp_notifications(id,rsvp_identity_key,status,provider_message_id,last_error,attempts,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(rsvp_identity_key) DO UPDATE SET status=excluded.status,provider_message_id=excluded.provider_message_id,last_error=excluded.last_error,attempts=rsvp_notifications.attempts + 1,updated_at=excluded.updated_at").bind(id(), rsvp.identityKey, result.status, result.providerMessageId || null, result.error || null, 1, timestamp, timestamp).run();
  return result;
}
async function reconcilePayment(paymentId, env, eventId, rawEvent) {
  const payment = await provider(`/v1/payments/${encodeURIComponent(paymentId)}`, env);
  const charge = await env.DB.prepare("SELECT * FROM charges WHERE provider_payment_id = ?").bind(String(payment.id)).first();
  if (!charge) return;
  const expected = charge.requested_amount_cents;
  const valid = payment.external_reference === charge.external_reference && payment.currency_id === "BRL" && cents(payment.transaction_amount) === expected && String(payment.collector_id) === String(env.MP_COLLECTOR_ID);
  const providerStatus = valid ? payment.status : "rejected";
  const refunded = cents(payment.transaction_details?.total_refunded_amount || 0);
  const contributionStatus = providerStatus === "approved" ? (refunded ? "partially_refunded" : "confirmed") : providerStatus;
  const eventKey = eventId || `payment:${payment.id}:${payment.status}:${payment.date_last_updated || ""}`;
  await env.DB.batch([
    env.DB.prepare("INSERT OR IGNORE INTO webhook_events(event_id, provider, payload) VALUES(?,?,?)").bind(eventKey, "mercadopago", JSON.stringify(rawEvent || payment)),
    env.DB.prepare("UPDATE charges SET status=?, updated_at=? WHERE id=?").bind(providerStatus, now(), charge.id),
    env.DB.prepare("INSERT INTO contributions(id,charge_id,gift_id,provider_payment_id,gross_amount_cents,refunded_amount_cents,net_amount_cents,currency,status,confirmed_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE ? IN ('approved','refunded') ON CONFLICT(provider_payment_id) DO UPDATE SET refunded_amount_cents=excluded.refunded_amount_cents,net_amount_cents=excluded.net_amount_cents,status=excluded.status,updated_at=excluded.updated_at").bind(id(), charge.id, charge.gift_id, String(payment.id), expected, refunded, Math.max(0, expected - refunded), "BRL", contributionStatus, now(), now(), providerStatus)
  ]);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return json({});
    const url = new URL(request.url);
    try {
      if (request.method === "POST" && url.pathname === "/v1/rsvps") {
        const body = await request.json();
        const fullName = normalizeName(body.full_name); const phone = onlyDigits(body.phone);
        const personType = body.person_type === "child" ? "child" : body.person_type === "adult" ? "adult" : "";
        const birthDate = body.birth_date || null;
        const email = String(body.email || "").trim(); const notes = String(body.notes || "").trim();
        if (fullName.split(" ").length < 2 || fullName.length > 120 || phone.length < 10 || phone.length > 13 || !personType || body.identity_confirmed !== true) return json({ message: "Dados de identificação inválidos." }, 400);
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ message: "E-mail inválido." }, 400);
        if (personType === "child" && (!validBirthDate(birthDate) || ageOnWedding(birthDate) < 0 || ageOnWedding(birthDate) > 9)) return json({ message: "Crianças devem ter até 9 anos na data do casamento." }, 400);
        if (personType === "adult" && birthDate) return json({ message: "Data de nascimento é exclusiva para confirmação de criança." }, 400);
        const identityKey = `${personType}:${fullName.toLocaleLowerCase("pt-BR")}:${phone}:${birthDate || ""}`;
        const timestamp = now(); const rsvpId = id();
        await env.DB.prepare("INSERT INTO rsvps(id,full_name,phone,email,person_type,birth_date,identity_key,identity_confirmed_at,notes,confirmed_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(identity_key) DO UPDATE SET full_name=excluded.full_name,email=excluded.email,identity_confirmed_at=excluded.identity_confirmed_at,notes=excluded.notes,updated_at=excluded.updated_at").bind(rsvpId, fullName, phone, email || null, personType, birthDate, identityKey, timestamp, notes || null, timestamp, timestamp).run();
        const notification = await recordRsvpNotification({ fullName, phone, personType, birthDate, identityKey }, env);
        return json({ ok: true, id: rsvpId, confirmed_at: timestamp, notification_status: notification.status });
      }
      if (request.method === "GET" && url.pathname === "/v1/public/summary") {
        const pix = await env.DB.prepare("SELECT COALESCE(SUM(net_amount_cents),0) amount, COUNT(*) count FROM contributions WHERE status IN ('confirmed','partially_refunded')").first();
        const physical = await env.DB.prepare("SELECT COUNT(*) count FROM external_orders WHERE payment_status='paid'").first();
        return json({ pix_confirmed_cents: pix.amount, pix_contribution_count: pix.count, physical_purchase_count: physical.count });
      }
      if (request.method === "GET" && url.pathname === "/v1/public/gifts") {
        const result = await env.DB.prepare("SELECT g.*, COALESCE(SUM(CASE WHEN c.status IN ('confirmed','partially_refunded') THEN c.net_amount_cents ELSE 0 END),0) confirmed_amount_cents FROM gifts g LEFT JOIN contributions c ON c.gift_id=g.id GROUP BY g.id ORDER BY g.name").all();
        return json({ gifts: result.results });
      }
      if (request.method === "POST" && url.pathname === "/v1/charges") {
        const body = await request.json(); const amount = Number(body.amount_cents);
        if (!Number.isSafeInteger(amount) || amount < 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.payer_email || "")) return json({ message: "Dados de contribuição inválidos." }, 400);
        let gift = await env.DB.prepare("SELECT id,name FROM gifts WHERE id=?").bind(body.gift_id).first();
        // A contribuição livre is still recorded as a real, traceable gift.
        // This also makes existing databases work without a manual seed step.
        if (!gift && body.gift_id === "g_pix_livre") {
          await env.DB.prepare("INSERT OR IGNORE INTO gifts(id,name,category,description,target_amount_cents) VALUES(?,?,?,?,NULL)").bind("g_pix_livre", "Presente via PIX", "PIX", "Contribuição livre para o casal.").run();
          gift = await env.DB.prepare("SELECT id,name FROM gifts WHERE id=?").bind("g_pix_livre").first();
        }
        if (!gift) return json({ message: "Presente não encontrado." }, 404);
        const chargeId = id(); const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        const payment = await provider("/v1/payments", env, { method: "POST", headers: { "X-Idempotency-Key": chargeId }, body: JSON.stringify({ transaction_amount: amount / 100, description: `Contribuição: ${gift.name}`, payment_method_id: "pix", payer: { email: body.payer_email }, external_reference: chargeId, notification_url: `${env.PUBLIC_API_URL}/webhooks/mercadopago`, metadata: { contribution_id: chargeId, gift_id: gift.id }, date_of_expiration: expires }) });
        await env.DB.prepare("INSERT INTO charges(id,gift_id,requested_amount_cents,provider_payment_id,external_reference,status,payer_email,expires_at) VALUES(?,?,?,?,?,?,?,?)").bind(chargeId, gift.id, amount, String(payment.id), chargeId, payment.status, body.payer_email, expires).run();
        const data = payment.point_of_interaction?.transaction_data; if (!data?.qr_code || !data?.qr_code_base64) throw new Error("O provedor não retornou o QR Code PIX.");
        return json({ id: chargeId, qr_code: data.qr_code, qr_code_base64: data.qr_code_base64, expires_at: expires });
      }
      const statusMatch = url.pathname.match(/^\/v1\/charges\/([\w-]+)$/);
      if (request.method === "GET" && statusMatch) { const charge = await env.DB.prepare("SELECT status,expires_at FROM charges WHERE id=?").bind(statusMatch[1]).first(); if (!charge) return json({ message: "Cobrança não encontrada." }, 404); const expired = charge.status === "pending" && new Date(charge.expires_at) < new Date(); return json({ status: expired ? "cancelled" : charge.status, label: label(expired ? "cancelled" : charge.status), terminal: expired || !["pending","in_process"].includes(charge.status) }); }
      if (request.method === "POST" && url.pathname === "/webhooks/mercadopago") { const event = await request.json(); const paymentId = event?.data?.id; if (!(await validSignature(request, paymentId, env))) return json({ message: "Assinatura inválida." }, 401); if (event.type === "payment" && paymentId) await reconcilePayment(paymentId, env, String(event.id || ""), event); return json({ ok: true }); }
      return json({ message: "Não encontrado." }, 404);
    } catch (error) { console.error(error); return json({ message: "Não foi possível processar a solicitação." }, 500); }
  },
  async scheduled(_, env) { await env.DB.prepare("UPDATE charges SET status='cancelled', updated_at=? WHERE status IN ('pending','in_process') AND expires_at <= ?").bind(now(), now()).run(); const pending = await env.DB.prepare("SELECT provider_payment_id FROM charges WHERE status IN ('pending','in_process') AND expires_at > ? LIMIT 100").bind(now()).all(); for (const charge of pending.results) { try { await reconcilePayment(charge.provider_payment_id, env); } catch (error) { console.error("Reconciliação", error); } } }
};
