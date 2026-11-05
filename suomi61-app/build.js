// Build: node build.js → dist/suomi61.html (Claude artifact) and docs/ (installable phone app for GitHub Pages)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const R = p => fs.readFileSync(path.join(__dirname, p), 'utf8');
const DATA = ['data/01_base.js', 'data/10_calendar.js', 'data/20_lessons.js', 'data/30_days.js', 'data/40_dialogues.js', 'data/50_tests.js'];
const APP = ['app/00_core.js', 'app/10_engine.js', 'app/20_srs.js', 'app/30_ui.js', 'app/40_today.js', 'app/50_learn.js', 'app/55_translate.js', 'app/60_train.js', 'app/90_init.js'];
const js = [...DATA, ...APP].map(f => `// ---- ${f} ----\n` + R('src/' + f)).join('\n').replace(/<\/script/gi, '<\\/script');
const css = R('src/style.css');
const shell = R('src/shell.html');
const page = (head, pre) => shell.replace('<!--HEAD-->', head).replace('/*CSS*/', () => css).replace('/*JS*/', () => pre + js);

fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist/suomi61.html'), page('', ''));

// phone app
const ver = crypto.createHash('sha1').update(js + css).digest('hex').slice(0, 10);
const head = `<link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#2C5AC8"><link rel="icon" href="icons/icon-192.png"><link rel="apple-touch-icon" href="icons/icon-192.png"><meta name="apple-mobile-web-app-capable" content="yes">`;
const doc = `<!doctype html><html lang="fi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>\n` + page(head, 'window.FI61_PWA=true;\n') + '\n</body></html>';
const D = path.join(__dirname, 'docs');
fs.mkdirSync(path.join(D, 'icons'), { recursive: true });
fs.writeFileSync(path.join(D, 'index.html'), doc);
fs.writeFileSync(path.join(D, 'manifest.webmanifest'), JSON.stringify({ name: 'Suomi 61 · Finnish A1.0–A1.3', short_name: 'Suomi 61', start_url: './', scope: './', display: 'standalone', background_color: '#F3F5F9', theme_color: '#2C5AC8', lang: 'fi', icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }] }, null, 2));
fs.writeFileSync(path.join(D, 'sw.js'), `// Suomi 61 service worker · cache ${ver}
const CACHE = 'suomi61-${ver}';
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
`);
console.log('built', (fs.statSync(path.join(__dirname, 'dist/suomi61.html')).size / 1024).toFixed(0) + ' KB', 'cache', ver);
