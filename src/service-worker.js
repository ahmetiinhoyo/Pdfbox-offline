/* ============================================================
   PDFBox Offline — Service Worker
   Bu dosya bir şablondur: vite.config.js içindeki eklenti,
   build sırasında tüm JS/CSS/HTML/ikon dosyalarının listesini
   ve sürüm numarasını buraya enjekte eder.
   ============================================================ */

const CACHE_VERSION = '__CACHE_VERSION__';
const CACHE_NAME = 'pdfbox-' + CACHE_VERSION;

// Build sırasında doldurulur (dist köküne göre yollar)
const PRECACHE_ASSETS = /*__PRECACHE_MANIFEST__*/[];

// SW'nin kapsamı: /Pdfbox-offline/
const SW_SCOPE = self.location.pathname.replace(/service-worker\.js$/, '');
const toUrl = (path) => SW_SCOPE + path;

// ------------------------------------------------------------
// KURULUM: tüm varlıkları önbelleğe al
// ------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(
        PRECACHE_ASSETS.map((path) =>
          cache.add(new Request(toUrl(path), { cache: 'reload' }))
        )
      );
      await self.skipWaiting();
    })()
  );
});

// ------------------------------------------------------------
// ETKİNLEŞTİRME: eski sürüm önbelleklerini temizle
// ------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('pdfbox-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// ------------------------------------------------------------
// İSTEK YAKALAMA
// ------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  event.respondWith(handleAsset(request));
});

// Sayfa: önce ağ, çevrimdışıysa önbellekten index
async function handleNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(toUrl('index.html'), response.clone());
    return response;
  } catch {
    const fallback =
      (await cache.match(request)) ||
      (await cache.match(toUrl('index.html'))) ||
      (await cache.match(toUrl('')));
    if (fallback) return fallback;
    return new Response('Çevrimdışı / Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// Statik varlık: önce önbellek, yoksa ağ + önbelleğe ekle
async function handleAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 504 });
  }
}
