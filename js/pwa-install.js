(function () {
  let installEvent = null;
  const appUrl = "https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/?install=true";
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  // Se já estiver rodando dentro do App instalado, não precisa mostrar botão de instalar
  if (isStandalone) return;

  window.triggerAppInstall = async function () {
    if (installEvent) {
      installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === 'accepted') {
        const bar = document.getElementById("pwa-install-bar");
        if (bar) bar.remove();
        closePwaModal();
      }
      installEvent = null;
    } else {
      openPwaModal();
    }
  };

  function createModal() {
    if (document.getElementById("pwa-modal-overlay")) return;

    const modal = document.createElement("div");
    modal.id = "pwa-modal-overlay";
    modal.className = "pwa-modal-overlay";

    const qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=" + encodeURIComponent(appUrl);

    modal.innerHTML = `
      <div class="pwa-modal-card" role="dialog" aria-modal="true" aria-label="Instalar Aplicativo">
        <button class="pwa-modal-close" onclick="closePwaModal()" aria-label="Fechar">✕</button>
        <img class="pwa-modal-app-icon" src="./assets/images/capa.jpg" alt="Casamento Laoanny e Gabriel" onerror="this.src='./assets/images/capa.jfif'">
        <h3 class="pwa-modal-title">Baixar o Aplicativo</h3>
        <p class="pwa-modal-desc">Tenha o convite e todas as informações no seu celular direto na tela inicial.</p>
        
        <div class="pwa-qr-box">
          <img src="${qrSrc}" alt="QR Code para baixar o app" width="160" height="160">
          <div class="pwa-qr-help">Aponte a câmera do seu celular para baixar</div>
        </div>

        <button class="pwa-modal-btn-install" id="pwa-modal-install-btn" onclick="triggerNativeInstall()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Instalar no Aparelho
        </button>

        ${isIOS ? `
          <div class="pwa-ios-instructions">
            <strong>No iPhone/iPad:</strong> Toque no botão de compartilhar <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> do Safari e selecione <b>"Adicionar à Tela de Início"</b>.
          </div>
        ` : ''}
      </div>
    `;

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePwaModal();
    });

    document.body.appendChild(modal);
  }

  function openPwaModal() {
    createModal();
    const modal = document.getElementById("pwa-modal-overlay");
    if (modal) modal.classList.add("open");
  }

  window.closePwaModal = function () {
    const modal = document.getElementById("pwa-modal-overlay");
    if (modal) modal.classList.remove("open");
  };

  window.triggerNativeInstall = async function () {
    if (installEvent) {
      installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === 'accepted') {
        closePwaModal();
      }
      installEvent = null;
    } else {
      if (!isIOS) {
        alert("Para instalar, você também pode tocar no menu de opções do seu navegador (⋮) e escolher 'Instalar aplicativo' ou 'Adicionar à tela inicial'.");
      }
    }
  };

  function createBottomBar() {
    if (document.getElementById("pwa-install-bar")) return;

    const bar = document.createElement("div");
    bar.id = "pwa-install-bar";
    bar.className = "pwa-install-bar";
    bar.innerHTML = `
      <div class="pwa-bar-info" onclick="triggerAppInstall()" style="cursor:pointer;">
        <img class="pwa-bar-icon" src="./assets/images/capa.jpg" alt="App" onerror="this.src='./assets/images/capa.jfif'">
        <div class="pwa-bar-text">
          <strong>Instalar Aplicativo</strong>
          <small>Toque para baixar no celular</small>
        </div>
      </div>
      <div class="pwa-bar-actions">
        <button class="pwa-bar-btn" onclick="triggerAppInstall()">Baixar App</button>
        <button class="pwa-bar-close" onclick="document.getElementById('pwa-install-bar').remove()" aria-label="Fechar">✕</button>
      </div>
    `;

    document.body.appendChild(bar);
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installEvent = event;

    // Se a URL tiver ?install=true (por exemplo quando o convidado lê o QR Code pelo celular), dispara a instalação logo que pronto
    if (new URLSearchParams(window.location.search).get("install") === "true") {
      setTimeout(() => {
        if (installEvent) {
          installEvent.prompt();
        }
      }, 800);
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    createModal();
    // Exibe a barra de convite para download após 1.5s de carregamento
    setTimeout(createBottomBar, 1500);

    // Auto-prompt se acessado via QR Code
    if (new URLSearchParams(window.location.search).get("install") === "true") {
      setTimeout(() => {
        if (!installEvent && !isStandalone) {
          openPwaModal();
        }
      }, 1000);
    }
  });
})();
