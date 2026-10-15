(function () {
  let installEvent = null;
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (isStandalone || !isMobile) return;

  function removeBar() {
    const bar = document.getElementById('pwa-install-bar');
    if (bar) bar.remove();
  }

  function showInstructions() {
    if (document.getElementById('pwa-ios-instructions')) return;
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const modal = document.createElement('div');
    modal.id = 'pwa-ios-instructions';
    modal.className = 'pwa-modal-overlay open';
    modal.innerHTML = `
      <div class="pwa-modal-card" role="dialog" aria-modal="true" aria-labelledby="pwa-instructions-title">
        <button class="pwa-modal-close" aria-label="Fechar">×</button>
        <img class="pwa-modal-app-icon" src="./assets/images/capa.jpg" alt="Laoanny e Gabriel">
        <h2 class="pwa-modal-title" id="pwa-instructions-title">Instalar o aplicativo</h2>
        <p class="pwa-modal-desc">${isIOS
          ? 'No Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”.'
          : 'Abra este link no Chrome do celular e use o menu do navegador para escolher “Instalar aplicativo” ou “Adicionar à tela inicial”.'}</p>
      </div>`;
    modal.querySelector('.pwa-modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (event) => { if (event.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  }

  function createMobileInstallBar() {
    if (document.getElementById('pwa-install-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'pwa-install-bar';
    bar.className = 'pwa-install-bar';
    bar.innerHTML = `
      <div class="pwa-bar-info" role="button" tabindex="0">
        <img class="pwa-bar-icon" src="./assets/images/capa.jpg" alt="App do casamento">
        <div class="pwa-bar-text"><strong>Baixar aplicativo</strong><small>Instale no seu celular</small></div>
      </div>
      <div class="pwa-bar-actions">
        <button class="pwa-bar-btn" id="pwa-action-btn" type="button">Instalar</button>
        <button class="pwa-bar-close" type="button" aria-label="Fechar">×</button>
      </div>`;
    const install = () => window.triggerAppInstall();
    bar.querySelector('.pwa-bar-info').addEventListener('click', install);
    bar.querySelector('.pwa-bar-info').addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') install(); });
    bar.querySelector('#pwa-action-btn').addEventListener('click', install);
    bar.querySelector('.pwa-bar-close').addEventListener('click', removeBar);
    document.body.appendChild(bar);
  }

  window.triggerAppInstall = async function () {
    if (!installEvent) {
      showInstructions();
      return;
    }
    installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice && choice.outcome === 'accepted') removeBar();
    installEvent = null;
  };

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installEvent = event;
    createMobileInstallBar();
    if (new URLSearchParams(window.location.search).get('install') === 'true') {
      window.setTimeout(() => { if (installEvent) window.triggerAppInstall(); }, 350);
    }
  });

  window.addEventListener('appinstalled', () => {
    installEvent = null;
    removeBar();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createMobileInstallBar, { once: true });
  else createMobileInstallBar();
})();

