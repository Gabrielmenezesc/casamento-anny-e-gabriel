/* The public site is a landing page; interactive wedding content lives in the separate app. */
(function () {
  const appTarget = (href) => {
    if (/^presentes\.html/.test(href)) return "./app.html#presentes";
    if (/^local\.html/.test(href)) return "./app.html#detalhes";
    if (/^convidados\.html/.test(href)) return "./app.html#confirmar";
    if (/^padrinhos\.html/.test(href)) return "./app.html#historia";
    if (/^lua-de-mel\.html/.test(href)) return "./app.html#presentes";
    return "./app.html";
  };
  document.addEventListener("DOMContentLoaded", () => {
    // Leave the public website as the invitation cover. The deeper content
    // is intentionally available only through the app.
    document.querySelectorAll(".wedding-video-section, .countdown-section, .story-section, .gallery-section, .cta-section, footer, .hero-scroll").forEach((node) => { node.hidden = true; });
  });
  window.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.dataset.keepSite === "true") return;
    const href = link.getAttribute("href") || "";
    if (/^(presentes|local|convidados|padrinhos|lua-de-mel|qrcode)\.html/.test(href) || (href.startsWith("#") && href !== "#inicio")) {
      event.preventDefault();
      location.href = appTarget(href);
    }
  }, true);
})();
