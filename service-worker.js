// =====================================================
// SERVICE WORKER - Casamento Laoanny & Gabriel
// =====================================================
const CACHE_NAME = "casamento-app-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Apenas deixa o tráfego fluir normalmente pela rede (sem prender recursos em loop)
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
