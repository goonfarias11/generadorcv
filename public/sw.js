// Service Worker para GeneradorCV PWA
// Estrategia: App Shell + Stale-While-Revalidate

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `generadorcv-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `generadorcv-dynamic-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Archivos del App Shell (cache estático)
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install: cachear App Shell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Activar inmediatamente
});

// Activate: limpiar caches antiguos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Tomar control inmediato
});

// Fetch: Stale-While-Revalidate con fallback offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests no-HTTP (chrome-extension://, etc.)
  if (!request.url.startsWith('http')) {
    return;
  }

  // Ignorar API de Vercel Analytics y otros servicios externos
  if (
    url.hostname.includes('vercel.live') ||
    url.hostname.includes('mercadopago.com') ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.startsWith('/api/webhooks')
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Stale-While-Revalidate: devolver cache inmediatamente
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          // Solo cachear respuestas exitosas
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            
            // Cachear en dinámico (excepto API)
            if (!url.pathname.startsWith('/api/')) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
          }
          return networkResponse;
        })
        .catch((error) => {
          console.log('[SW] Fetch failed, returning offline page:', error);
          
          // Si es navegación (HTML) y falla → offline page
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match(OFFLINE_PAGE);
          }
          
          // Para otros recursos, intentar devolver desde cache
          return caches.match(request);
        });

      // Devolver cache si existe, sino esperar red
      return cachedResponse || fetchPromise;
    })
  );
});

// Background Sync (opcional para futuras features)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
    // Aquí podrías sincronizar datos cuando vuelva la conexión
  }
});

// Push Notifications (preparado para futuro)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
    });
  }
});
