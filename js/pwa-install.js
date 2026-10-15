(function () {
  let installEvent;
  const appUrl = "https://gabrielmenezesc.github.io/casamento-anny-e-gabriel/";
  function create() {
    const host = document.createElement("aside"); host.className = "pwa-install";
    host.innerHTML = `<button class="pwa-install-close" aria-label="Fechar">×</button><div><strong>Leve nosso convite com você</strong><small>Instale o app ou abra pelo QR Code.</small></div><button class="pwa-install-button">Instalar app</button><button class="pwa-qr-button" aria-label="Ver QR Code">QR Code</button><div class="pwa-qr"><img alt="QR Code para abrir o aplicativo do casamento" src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=2&data=${encodeURIComponent(appUrl)}"><a href="${appUrl}">Abrir pelo link</a></div>`;
    host.querySelector(".pwa-install-close").onclick = () => host.remove();
    host.querySelector(".pwa-qr-button").onclick = () => host.classList.toggle("show-qr");
    host.querySelector(".pwa-install-button").onclick = async () => { if (!installEvent) { host.classList.add("show-qr"); return; } installEvent.prompt(); await installEvent.userChoice; installEvent = null; };
    document.body.appendChild(host);
  }
  window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); installEvent = event; });
  document.addEventListener("DOMContentLoaded", create);
})();
