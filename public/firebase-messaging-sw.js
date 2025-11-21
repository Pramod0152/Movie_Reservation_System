/*
 * Firebase Cloud Messaging service worker placeholder.
 * Update notification handling logic here to match your application's needs.
 */

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event || !event.data) {
    return;
  }

  let payload;
  try {
    payload = event.data.json();
  } catch (error) {
    // fall back to raw text if JSON parsing fails
    payload = { title: event.data.text() };
  }

  const notification = payload.notification || {};
  const title = notification.title || payload.title || 'New notification';
  const options = {
    body: notification.body || payload.body || '',
    icon: notification.icon,
    data: notification.data || payload.data,
    actions: notification.actions,
    tag: notification.tag,
    renotify: notification.renotify,
    requireInteraction: notification.requireInteraction,
    silent: notification.silent,
    badge: notification.badge,
    image: notification.image,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url;

  if (!targetUrl) {
    return;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const matchingClient = clientList.find((client) => client.url === targetUrl);
      if (matchingClient) {
        return matchingClient.focus();
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});
