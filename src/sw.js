// Files to cache
const cacheName = 'time-tracker-v1';
const appShellFiles = [
    '/time-tracker/components/AddActivityModal.mjs',
    '/time-tracker/components/App.mjs',
    '/time-tracker/components/EditableText.mjs',
    '/time-tracker/components/Header.mjs',
    '/time-tracker/components/Modal.mjs',
    '/time-tracker/deps/date-fns.mjs',
    '/time-tracker/deps/goober.mjs',
    '/time-tracker/deps/idb.mjs',
    '/time-tracker/deps/route-parser.mjs',
    '/time-tracker/deps/vue.mjs',
    '/time-tracker/imgs/github-logo.svg',
    '/time-tracker/imgs/icons/icon-192x192.png',
    '/time-tracker/imgs/icons/icon-256x256.png',
    '/time-tracker/imgs/icons/icon-384x384.png',
    '/time-tracker/imgs/icons/icon-512x512.png',
    '/time-tracker/index.html',
    '/time-tracker/index.mjs',
    '/time-tracker/manifest.webmanifest',
    '/time-tracker/pages/TimeTrack.mjs',
    '/time-tracker/services/data.mjs',
    '/time-tracker/services/db/constant.mjs',
    '/time-tracker/services/db/index.mjs',
    '/time-tracker/services/db/initialData.js',
    '/time-tracker/services/db/migrations/20221201.001.mjs',
    '/time-tracker/services/db/migrations/20221203.002.mjs',
    '/time-tracker/services/db/migrations/index.mjs',
    '/time-tracker/services/routes.mjs',
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