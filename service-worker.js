const CACHE_NAME = 'stock-master-cache-v1';
const assets = [
  'index.html',
  'manifest.json',
  'Logologin.PNG'
];

// ติดตั้ง Service Worker และทำ Caching ข้อมูลพื้นฐาน
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// เรียกใช้งาน Cache เมื่อออฟไลน์
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});