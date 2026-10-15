// =====================================================
// SERVICE WORKER - Network-First com Auto-Update Realtime
// Atualiza imediatamente quando o site ou app sofre alterações
// =====================================================
const CACHE_NAME = "casamento-v" + Date.now();

self.addEventListener("install", (event) => {
  // Pula a fila de espera para que a nova versão assuma o controle na hora
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Limpa qualquer cache antigo do celular
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Apenas requisições GET locais
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== location.origin) {
    return;
  }

  // ESTRATÉGIA NETWORK-FIRST (Rede primeiro):
  // Sempre busca a versão mais recente do GitHub Pages primeiro.
  // Se estiver sem internet ou offline, usa o cache como fallback.
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback offline caso o celular perca o sinal de internet
        return caches.match(event.request);
      })
  );
});
