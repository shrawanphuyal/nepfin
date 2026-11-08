// Suomi 61 service worker · cache 2774a852a2
const CACHE = 'suomi61-2774a852a2';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); });
// only old app caches are removed; 'suomi61-lib' (translator engine) and 'transformers-cache' (offline packs) are kept
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('suomi61-') && k !== CACHE && k !== 'suomi61-lib').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // fonts: cache first, so they work offline after the first visit
  if (u.hostname.endsWith('googleapis.com') || u.hostname.endsWith('gstatic.com')) {
    e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }).catch(() => r))));
    return;
  }
  // translator engine from jsDelivr: cache first in its own cache, so offline packs keep working
  if (u.hostname === 'cdn.jsdelivr.net' && u.pathname.includes('/@huggingface/transformers@')) {
    e.respondWith(caches.open('suomi61-lib').then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
    return;
  }
  if (u.origin === location.origin) e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res; }).catch(() => caches.match('index.html'))));
});
