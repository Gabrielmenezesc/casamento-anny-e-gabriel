/* Shared gift totals and PIX checkout. No financial state is kept in localStorage. */
(function () {
  const api = () => (window.CONTRIBUTIONS_API_BASE || "").replace(/\/$/, "");
  const money = (cents) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((cents || 0) / 100);
  const safe = (value) => String(value || "").replace(/[&<>\"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
  let gifts = [];
  let activeCategory = "Todos";
  let poll = null;

  async function request(path, options) {
    const response = await fetch(api() + path, { headers: { "Content-Type": "application/json" }, ...options });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || "Não foi possível concluir a operação.");
    return body;
  }

  function configured() { return /^https:\/\//.test(api()); }
  function renderSummary(summary) {
    const el = document.getElementById("contribution-summary");
    if (!el) return;
    if (!configured()) {
      el.innerHTML = '<p class="contribution-setup">A arrecadação automática será ativada após a configuração segura do provedor PIX.</p>';
      return;
    }
    el.innerHTML = `<div class="contribution-stat"><strong>${money(summary.pix_confirmed_cents)}</strong><span>PIX confirmado</span></div>
      <div class="contribution-stat"><strong>${summary.pix_contribution_count || 0}</strong><span>contribuições confirmadas</span></div>
      <div class="contribution-stat"><strong>${summary.physical_purchase_count || 0}</strong><span>presentes físicos confirmados</span></div>`;
  }
  function progress(gift) {
    if (gift.target_amount_cents == null) return '<p class="gift-progress-unset">Meta a configurar pelos noivos</p>';
    const confirmed = gift.confirmed_amount_cents || 0;
    const remaining = Math.max(0, gift.target_amount_cents - confirmed);
    const percent = Math.min(100, Math.round(confirmed * 100 / gift.target_amount_cents));
    const status = confirmed >= gift.target_amount_cents ? "Meta atingida" : confirmed > 0 ? "Parcialmente financiado" : "Disponível";
    return `<div class="gift-progress"><div class="gift-progress-head"><span>${status}</span><span>${money(confirmed)} de ${money(gift.target_amount_cents)}</span></div><div class="gift-progress-track"><i style="width:${percent}%"></i></div><small>Faltam ${money(remaining)}</small></div>`;
  }
  function isGuaranteed(gift) {
    return gift.target_amount_cents != null && (gift.confirmed_amount_cents || 0) >= gift.target_amount_cents;
  }
  function giftPhoto(gift) {
    if (gift.category === "🏠 Eletrodomésticos e Móveis") return "./assets/images/gifts/eletrodomesticos-moveis.jpg";
    if (gift.category === "🍳 Cozinha") return "./assets/images/gifts/cozinha.jpg";
    return "./assets/images/gifts/casa.jpg";
  }
  function storeOptions(gift) {
    const query = encodeURIComponent(gift.name);
    return `<div class="gift-store-options" aria-label="Opções de lojas para ${safe(gift.name)}">
      <span>Encontrar este presente em:</span>
      <a class="gift-store shopee" href="https://shopee.com.br/search?keyword=${query}" target="_blank" rel="noopener noreferrer">Shopee</a>
      <a class="gift-store mercado" href="https://lista.mercadolivre.com.br/${query}" target="_blank" rel="noopener noreferrer">Mercado Livre</a>
      <a class="gift-store amazon" href="https://www.amazon.com.br/s?k=${query}" target="_blank" rel="noopener noreferrer">Amazon</a>
      <small class="gift-store-note">Links de consulta. A loja não informa a compra automaticamente ao site.</small>
    </div>`;
  }
  function renderFilters() {
    const node = document.getElementById("gift-filters"); if (!node) return;
    const categories = ["Todos", ...new Set(gifts.map((gift) => gift.category))];
    node.innerHTML = categories.map((category) => `<button class="gift-filter-btn${category === activeCategory ? " active" : ""}" data-category="${safe(category)}">${safe(category)}</button>`).join("");
    node.onclick = (event) => { const button = event.target.closest("button[data-category]"); if (button) { activeCategory = button.dataset.category; renderFilters(); renderGifts(); } };
  }
  function renderGifts() {
    const grid = document.getElementById("gifts-grid"); if (!grid) return;
    const displayed = activeCategory === "Todos" ? gifts : gifts.filter((gift) => gift.category === activeCategory);
    grid.innerHTML = displayed.map((gift) => {
      const guaranteed = isGuaranteed(gift);
      const external = gift.external_purchase_url ? `<a class="gift-store-link" href="${safe(gift.external_purchase_url)}" target="_blank" rel="noopener noreferrer">Consultar loja indicada</a>` : storeOptions(gift);
      const action = guaranteed
        ? '<span class="gift-guaranteed" aria-label="Presente garantido">✓ Já garantido</span>'
        : `<button class="btn-reserve contribution-button" data-gift-id="${safe(gift.id)}">Contribuir via PIX</button>`;
      return `<article class="gift-card${guaranteed ? " gift-card-guaranteed" : ""}"><div class="gift-card-image"><img src="${giftPhoto(gift)}" alt="Foto ilustrativa de ${safe(gift.name)}" loading="lazy"></div><div class="gift-card-body"><h3 class="gift-card-name">${safe(gift.name)}</h3><p class="gift-card-desc">${safe(gift.description || "Item especial para nossa nova jornada.")}</p>${progress(gift)}${external}</div><div class="gift-card-footer">${action}</div></article>`;
    }).join("");
  }
  function modal() {
    let node = document.getElementById("contribution-modal");
    if (node) return node;
    node = document.createElement("div"); node.id = "contribution-modal"; node.className = "contribution-modal";
    node.innerHTML = `<div class="contribution-dialog" role="dialog" aria-modal="true" aria-labelledby="contribution-title"><button class="contribution-close" aria-label="Fechar">×</button><div id="contribution-modal-content"></div></div>`;
    node.addEventListener("click", (event) => { if (event.target === node || event.target.closest(".contribution-close")) closeModal(); });
    document.body.appendChild(node); return node;
  }
  function closeModal() { const node = document.getElementById("contribution-modal"); if (node) node.classList.remove("open"); clearInterval(poll); poll = null; }
  function openForm(gift) {
    const node = modal(); const content = document.getElementById("contribution-modal-content");
    content.innerHTML = `<h2 id="contribution-title">Contribuir com ${safe(gift.name)}</h2><p>Escolha o valor. A confirmação ocorre somente após o retorno oficial do pagamento.</p><form id="contribution-form"><label>Valor em reais<input name="amount" type="number" min="1" step="0.01" inputmode="decimal" required></label><label>E-mail para o provedor de pagamento<input name="email" type="email" autocomplete="email" required></label><button class="btn-reserve" type="submit">Gerar PIX exclusivo</button></form>`;
    content.querySelector("form").addEventListener("submit", async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const amountCents = Math.round(Number(String(data.get("amount")).replace(",", ".")) * 100); if (!Number.isInteger(amountCents) || amountCents < 100) return show("Informe um valor de pelo menos R$ 1,00."); try { const charge = await request("/v1/charges", { method: "POST", body: JSON.stringify({ gift_id: gift.id, amount_cents: amountCents, payer_email: data.get("email") }) }); showCharge(charge); } catch (error) { show(error.message); } });
    node.classList.add("open");
  }
  function show(message) { const content = document.getElementById("contribution-modal-content"); content.insertAdjacentHTML("afterbegin", `<p class="contribution-error">${safe(message)}</p>`); }
  function showCharge(charge) {
    const content = document.getElementById("contribution-modal-content");
    content.innerHTML = `<h2 id="contribution-title">PIX gerado</h2><p>Use este QR Code ou o código Copia e Cola. Válido até ${new Date(charge.expires_at).toLocaleString("pt-BR")}.</p><img class="contribution-qr" alt="QR Code PIX exclusivo" src="data:image/png;base64,${safe(charge.qr_code_base64)}"><textarea class="contribution-copy" readonly>${safe(charge.qr_code)}</textarea><button class="btn-reserve" id="copy-contribution">Copiar código PIX</button><p id="charge-state" aria-live="polite">Aguardando confirmação oficial do pagamento…</p>`;
    document.getElementById("copy-contribution").onclick = async () => { await navigator.clipboard.writeText(charge.qr_code); document.getElementById("copy-contribution").textContent = "Código copiado"; };
    const check = async () => { try { const status = await request(`/v1/charges/${encodeURIComponent(charge.id)}`); const statusNode = document.getElementById("charge-state"); if (!statusNode) return; statusNode.textContent = status.label; if (status.terminal) { clearInterval(poll); poll = null; await load(); } } catch (_) {} };
    check(); poll = setInterval(check, 8000);
  }
  async function load() {
    if (!configured()) { gifts = window.WEDDING_GIFT_CATALOG || []; renderSummary({}); renderFilters(); renderGifts(); return; }
    try { const [summary, catalog] = await Promise.all([request("/v1/public/summary"), request("/v1/public/gifts")]); gifts = catalog.gifts; renderSummary(summary); renderFilters(); renderGifts(); } catch (error) {
      // Keep the catalogue usable while a remote API is unavailable. It does
      // not turn on PIX checkout: the configured backend is still required.
      gifts = window.WEDDING_GIFT_CATALOG || [];
      renderSummary({});
      renderFilters();
      renderGifts();
      console.warn("Contribuições indisponíveis:", error.message);
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gifts-grid")?.addEventListener("click", (event) => { const button = event.target.closest(".contribution-button"); if (!button) return; if (!configured()) return showToast("A integração PIX ainda precisa ser configurada pelos noivos.", "info"); const gift = gifts.find((item) => item.id === button.dataset.giftId); if (gift) openForm(gift); });
    document.getElementById("direct-pix-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const status = document.getElementById("direct-pix-status");
      const data = new FormData(form);
      const amountCents = Math.round(Number(String(data.get("amount")).replace(",", ".")) * 100);
      if (!Number.isInteger(amountCents) || amountCents < 100) { status.textContent = "Informe um valor de pelo menos R$ 1,00."; return; }
      if (!configured()) { status.textContent = "O serviço PIX ainda não está configurado."; return; }
      const button = form.querySelector("button[type=submit]");
      button.disabled = true; button.textContent = "Gerando PIX…"; status.textContent = "";
      try {
        const charge = await request("/v1/charges", { method: "POST", body: JSON.stringify({ gift_id: "g_pix_livre", amount_cents: amountCents, payer_email: data.get("email") }) });
        openForm({ id: "g_pix_livre", name: "Presente via PIX" });
        showCharge(charge);
        form.reset();
      } catch (error) {
        status.textContent = error.message || "Não foi possível gerar o PIX agora.";
      } finally {
        button.disabled = false; button.textContent = "Gerar PIX Copia e Cola";
      }
    });
    load(); setInterval(load, 30000);
  });
})();
