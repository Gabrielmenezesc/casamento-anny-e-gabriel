(function () {
  let installEvent = null;
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (isStandalone || !isMobile) return;

  function setButtonState(ready) {
    const btn = document.getElementById("pwa-action-btn");
    if (!btn) return;
    if (ready) {
      btn.textContent = "Instalar App";
      btn.style.opacity = "1";
    }
  }

  // Ação de clique: dispara a instalação automática no celular
  window.triggerAppInstall = async function () {
    if (installEvent) {
      // Dispara o prompt nativo oficial do Android/Chrome
      installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice && choice.outcome === 'accepted') {
        const bar = document.getElementById("pwa-install-bar");
        if (bar) bar.remove();
      }
      installEvent = null;
    } else {
      if (isIOS) {
        openPwaIosModal();
      } else {
        // Se o evento ainda estiver sendo preparado pelo Chrome, aguarda alguns milissegundos
        const btn = document.getElementById("pwa-action-btn");
        if (btn) btn.textContent = "Preparando...";
        setTimeout(function() {
          if (installEvent) {
            installEvent.prompt();
          } else {
            // Em navegadores Android sem suporte ou prompt já fechado, guia de forma suave sem popup intrusivo
            openAndroidModal();
          }
        }, 500);
      }
    }
  };

  function createIosModal() {
    if (document.getElementById("pwa-ios-modal")) return;

    const modal = document.createElement("div");
    modal.id = "pwa-ios-modal";
    modal.className = "pwa-modal-overlay";
    modal.innerHTML = `
      <div class="pwa-modal-card" role="dialog" aria-modal="true" aria-label="Instalar Aplicativo">
        <button class="pwa-modal-close" onclick="closePwaIosModal()" aria-label="Fechar">✕</button>
        <img class="pwa-modal-app-icon" src="./assets/images/capa.jpg" alt="Casamento Laoanny e Gabriel">
        <h3 class="pwa-modal-title">Instalar Aplicativo</h3>
        <p class="pwa-modal-desc">Adicione o aplicativo do casamento à sua tela de início:</p>
        
        <div class="pwa-ios-instructions" style="font-size:0.85rem;padding:1rem;margin-bottom:1rem;">
          <p style="margin-bottom:0.75rem;"><b>1.</b> Toque no botão de <b>Compartilhar</b> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin:0 2px;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> no rodapé do Safari.</p>
          <p><b>2.</b> Selecione <br><span style="display:inline-flex;align-items:center;gap:4px;font-weight:700;color:#15803d;margin-top:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> Adicionar à Tela de Início</span>.</p>
        </div>

        <button class="pwa-modal-btn-install" onclick="closePwaIosModal()">Entendi</button>
      </div>
    `;

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePwaIosModal();
    });

    document.body.appendChild(modal);
  }

  function openPwaIosModal() {
    createIosModal();
    const modal = document.getElementById("pwa-ios-modal");
    if (modal) modal.classList.add("open");
  }

  window.closePwaIosModal = function () {
    const modal = document.getElementById("pwa-ios-modal");
    if (modal) modal.classList.remove("open");
  };

  function createAndroidModal() {
    if (document.getElementById("pwa-android-modal")) return;

    const modal = document.createElement("div");
    modal.id = "pwa-android-modal";
    modal.className = "pwa-modal-overlay";
    modal.innerHTML = `
      <div class="pwa-modal-card" role="dialog" aria-modal="true" aria-label="Instalar Aplicativo">
        <button class="pwa-modal-close" onclick="closeAndroidModal()" aria-label="Fechar">✕</button>
        <img class="pwa-modal-app-icon" src="./assets/images/capa.jpg" alt="Casamento Laoanny e Gabriel">
        <h3 class="pwa-modal-title">Instalar na Tela Inicial</h3>
        <p class="pwa-modal-desc">O seu navegador está pronto para adicionar o app:</p>
        
        <div class="pwa-ios-instructions" style="background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-size:0.85rem;padding:1rem;margin-bottom:1rem;">
          <p style="margin-bottom:0.6rem;">Toque no menu <b>(⋮)</b> no topo do navegador e escolha:</p>
          <p style="font-weight:700;font-size:0.92rem;">📲 "Instalar aplicativo" ou "Adicionar à tela inicial"</p>
        </div>

        <button class="pwa-modal-btn-install" onclick="closeAndroidModal()">OK</button>
      </div>
    `;

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAndroidModal();
    });

    document.body.appendChild(modal);
  }

  function openAndroidModal() {
    createAndroidModal();
    const modal = document.getElementById("pwa-android-modal");
    if (modal) modal.classList.add("open");
  }

  window.closeAndroidModal = function () {
    const modal = document.getElementById("pwa-android-modal");
    if (modal) modal.classList.remove("open");
  };

  function createMobileInstallBar() {
    if (document.getElementById("pwa-install-bar") || isStandalone || !isMobile) return;

    const bar = document.createElement("div");
    bar.id = "pwa-install-bar";
    bar.className = "pwa-install-bar";
    bar.innerHTML = `
      <div class="pwa-bar-info" onclick="triggerAppInstall()" style="cursor:pointer;">
        <img class="pwa-bar-icon" src="./assets/images/capa.jpg" alt="App">
        <div class="pwa-bar-text">
          <strong>Baixar Aplicativo</strong>
          <small>Instalar direto no seu celular</small>
        </div>
      </div>
      <div class="pwa-bar-actions">
        <button class="pwa-bar-btn" id="pwa-action-btn" onclick="triggerAppInstall()">Instalar App</button>
        <button class="pwa-bar-close" onclick="document.getElementById('pwa-install-bar').remove()" aria-label="Fechar">✕</button>
      </div>
    `;

    document.body.appendChild(bar);
  }

  // Captura o evento nativo assim que o celular liberar
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installEvent = event;
    setButtonState(true);
    createMobileInstallBar();
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (isMobile) {
      setTimeout(createMobileInstallBar, 800);
    }
  });
})();
