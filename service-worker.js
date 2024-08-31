const PRECACHE = 'precache-v1.4'
const RUNTIME = 'runtime-v1.4'

const assets = 'assets-v4'

const PRECACHE_URLS = [
  'index.html',
  './',
  `${assets}/main.css`,
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
          return caches
            .open(RUNTIME)
            .then((cache) =>
              cache.put(event.request, response.clone()).then(() => response)
            )
        })
        .catch(() => caches.match(event.request))
    )
  }
})
