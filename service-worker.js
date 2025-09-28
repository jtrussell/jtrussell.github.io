const PRECACHE = 'precache-v2.1'
const RUNTIME = 'runtime-v2.1'

const assets = 'assets-v7'

const PRECACHE_URLS = [
  'index.html',
  './',
  `${assets}/main.css`,
  `${assets}/theme-switcher.js`,
  'zyx/index.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  const currentCaches = [RUNTIME, PRECACHE]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        )
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete)
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            return caches
              .open(RUNTIME)
              .then((cache) =>
                cache.put(event.request, response.clone()).then(() => response)
              )
          }
          return response
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            
            if (event.request.destination === 'document') {
              return caches.match('index.html')
            }
            
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            })
          })
        })
    )
  }
})
