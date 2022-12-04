// Files to cache
const cacheName = 'time-tracker-v1';
const appShellFiles = [
    '/components/AddActivityModal.mjs',
    '/components/App.mjs',
    '/components/Auth.mjs',
    '/components/EditableText.mjs',
    '/components/Header.mjs',
    '/components/Modal.mjs',
    '/deps/date-fns.mjs',
    '/deps/goober.mjs',
    '/deps/idb.mjs',
    '/deps/route-parser.mjs',
    '/deps/vue.mjs',
    '/imgs/github-logo.svg',
    '/imgs/icons/icon-192x192.png',
    '/imgs/icons/icon-256x256.png',
    '/imgs/icons/icon-384x384.png',
    '/imgs/icons/icon-512x512.png',
    '/index.html',
    '/index.mjs',
    '/manifest.webmanifest',
    '/pages/TimeTrack.mjs',
    '/services/data.mjs',
    '/services/db/constant.mjs',
    '/services/db/index.mjs',
    '/services/db/initialData.js',
    '/services/db/migrations/20221201.001.mjs',
    '/services/db/migrations/20221203.002.mjs',
    '/services/db/migrations/index.mjs',
    '/services/routes.mjs',
];
const contentToCache = appShellFiles;

// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});