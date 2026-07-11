/* Hero's Proof · Service Worker
 * Lives at the ROOT of herosproof.github.io so its scope covers the hub
 * AND every sub-quest (/story-mode, /word-quest, /kanji-quest, ...).
 *
 * Strategy:
 *  - Pages (navigations): network-first, fall back to cached copy when offline.
 *    You always get the newest version when online, and it still opens offline.
 *  - Assets (fonts, images, audio, scripts): stale-while-revalidate.
 *    Served instantly from cache, refreshed quietly in the background.
 *
 * To force-refresh everyone's cache after a big update, bump the version below.
 */

const VERSION = 'hp-v1';
const CACHE = `heros-proof-${VERSION}`;

// The hub shell, cached immediately on install.
const PRECACHE = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('heros-proof-') && k !== CACHE)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Pages: network-first with offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match('/'))
        )
    );
    return;
  }

  // Only cache http(s) — skip extensions, data:, etc.
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

  // Assets: stale-while-revalidate (same-origin + Google Fonts + CORS assets)
  event.respondWith(
    caches.match(req).then((cached) => {
      const refresh = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || refresh;
    })
  );
});
