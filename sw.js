// THANGIT.COM — PWA Service Worker (Multi-Page Architecture Engine)
const CACHE_NAME = 'tit-hub-v12';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/it/',
  '/tools/',
  '/css/style.css',
  '/js/core.js',
  '/js/lunar.js',
  '/js/qrcode.min.js',
  '/manifest.json',
  '/favicon.svg',
  '/assets/images/apple-touch-icon.png',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/assets/images/avata.jpg',
  '/subnet/',
  '/dns/',
  '/wifi-qr/',
  '/ports/',
  '/password/',
  '/telemetry/',
  '/terminal/',
  '/cv/',
  '/projects/',
  '/vietqr/',
  '/calc/',
  '/lunar/',
  '/weather/',
  '/converter/',
  '/world/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First Strategy: always fetch freshest content; fallback to cache if offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
