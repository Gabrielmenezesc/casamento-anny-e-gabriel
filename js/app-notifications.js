/* Enrollment for notifications on the installed app. Delivery needs a server-side push subscription. */
(function () {
  async function requestWeddingNotifications() {
    if (!("Notification" in window)) {
      window.alert("Este aparelho não oferece notificações pelo navegador.");
      return;
    }
    if (Notification.permission === "granted") {
      window.alert("Os avisos já estão permitidos neste aparelho.");
      return;
    }
    if (Notification.permission === "denied") {
      window.alert("Os avisos estão bloqueados neste aparelho. Altere a permissão nas configurações do navegador.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      window.alert("Avisos permitidos neste aparelho. Eles serão enviados quando o serviço de notificações estiver conectado.");
    }
  }
  window.enableWeddingNotifications = requestWeddingNotifications;
  window.addEventListener("appinstalled", () => setTimeout(requestWeddingNotifications, 700));
  document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("wedding_notifications_prompted") && window.matchMedia("(display-mode: standalone)").matches) {
      localStorage.setItem("wedding_notifications_prompted", "1");
      setTimeout(requestWeddingNotifications, 1800);
    }
  });
})();
