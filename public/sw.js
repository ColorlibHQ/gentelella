// Gentelella v4 — service worker
// Strategy: cache-first for hashed assets (Vite emits content-hashed URLs),
// network-first for HTML so navigations always pull the freshest shell, with
// a fallback to the offline page when the network is unavailable.

// Bump the suffix on every release to bust users' caches when CSS/JS hashes
// change but the same URL is requested. Activate handler clears old caches.
const CACHE = 'gentelella-v4-r2';

// Subpath-aware: scope is the directory the SW is registered against. Under
// `/` it's `https://example.com/`; under `/theme/gentelella-v4-rc1/` it's that
// path. Resolving relative URLs against the scope makes the SW work in both.
const SCOPE = self.registration?.scope || self.location.origin + '/';
const OFFLINE_URL = new URL('production/offline.html', SCOPE).href;
const PRECACHE = [OFFLINE_URL];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Only handle same-origin requests; pass through cross-origin (Google Fonts, CDNs, etc.).
  if (url.origin !== self.location.origin) return;

  // HTML — network first, fallback to cache, then offline page.
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match(OFFLINE_URL)) || Response.error())
    );
    return;
  }

  // Hashed assets (/js, /assets, /images, /fonts) — cache-first.
  if (/\/(js|assets|images|fonts)\//.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }))
    );
  }
});
