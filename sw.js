const V = 'partition-v1';
const FICHIERS = ['./', 'index.html', 'styles.css', 'portee.js', 'audio.js', 'clavier.js', 'store.js', 'exo.js', 'app.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon.svg', 'contenu/core.js', 'contenu/ressources.js', 'contenu/rythmes.js', 'contenu/v1-ch1.js', 'contenu/v1-ch2.js', 'contenu/v1-ch3.js', 'contenu/v1-ch4.js', 'contenu/v1-ch5.js', 'contenu/v1-ch6.js', 'contenu/v1-ch7.js', 'contenu/v1-ch8.js', 'contenu/v1-ch9.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== V).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); if (r.ok) caches.open(V).then((ch) => ch.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))));
});
