// 🎯 ทุกครั้งที่คุณ  แก้ไขโค้ด index.html ให้มาเปลี่ยนตัวเลขเวอร์ชันตรงนี้เพิ่มขึ้นเรื่อย ๆ ครับ
// เช่น ครั้งต่อไปเปลี่ยนเป็น 'stock-master-cache-v3', 'stock-master-cache-v4'
const CACHE_NAME = 'stock-master-cache-v8';

const assets = [
  'index.html',
  'manifest.json',
  'Logologin.PNG'
];

// 1. ขั้นตอนติดตั้ง (Install) และจัดเก็บไฟล์ลง Cache ใหม่
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    }).then(() => {
      // บังคับให้ Service Worker ตัวใหม่ทำงานทันที ไม่ต้องรอปิดแอปก่อน
      return self.skipWaiting();
    })
  );
});

// 2. ขั้นตอนเปิดทำงาน (Activate) -> 💡 ส่วนสำคัญ: สั่งล้างแคชเวอร์ชันเก่าทิ้งทันที
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 กำลังลบแคชเวอร์ชันเก่า:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // บังคับให้ควบคุมแอปทุกหน้าต่างทันที
      return self.clients.claim();
    })
  );
});

// 3. เรียกใช้งานไฟล์จาก Cache (ดึงข้อมูลมาแสดงผลได้แม้ไม่มีเน็ต)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});