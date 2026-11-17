// blush. Service Worker
const CACHE_NAME = 'blush-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let network handle API requests directly
  if (event.request.url.includes('/api/')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Web Push Notification Support
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'blush. Reminder ♡';
  const options = {
    body: data.message || "Time for your gentle wellness check-in.",
    icon: '/favicon.ico',
    badge: '/favicon.ico',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
