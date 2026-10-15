(function () {
  let installEvent = null;
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  // Se já for app instalado ou desktop, não mostra a barra
  if (isStandalone || !isMobile) return;

  function createMobileInstallBar() {
    if (document.getElementById("pwa-install-bar") || isStandalone) return;

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

  // Ao clicar, aciona diretamente a instalação do navegador (sem nenhuma mensagem intermediária)
  window.triggerAppInstall = async function () {
    if (installEvent) {
      installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice && choice.outcome === 'accepted') {
        const bar = document.getElementById("pwa-install-bar");
        if (bar) bar.remove();
      }
      installEvent = null;
    }
  };

  // Captura o evento nativo do Android/Chrome
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installEvent = event;
    // Exibe a barra somente quando a instalação nativa do celular estiver 100% pronta para disparar no clique
    createMobileInstallBar();

    // Se o link de instalação direta foi clicado, abre na hora a janela nativa de instalar
    if (new URLSearchParams(window.location.search).get("install") === "true") {
      setTimeout(() => {
        if (installEvent) {
          installEvent.prompt();
        }
      }, 300);
    }
  });

  // Se o app for instalado com sucesso, remove a barra
  window.addEventListener("appinstalled", () => {
    installEvent = null;
    const bar = document.getElementById("pwa-install-bar");
    if (bar) bar.remove();
  });
})();
