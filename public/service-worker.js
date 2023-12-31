const CACHE_NAME = "v1";
const urlsToCache = [
    "./static/js/main.chunk.js",
    "./static/js/0.chunk.js",
    "./static/js/bundle.js",
    "./public/index.html",
    "./",
];

// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Respond with cached resource
            }
            // Fetch new resource from network
            return fetch(event.request)
                .then((networkResponse) => {
                    // Save response to cache
                    let cache = caches.open(CACHE_NAME);
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                })
                .catch(() => {
                    return cachedResponse; // Return cached response if network fails
                });
        })
    );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});
