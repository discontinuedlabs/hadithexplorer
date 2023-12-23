import { precacheAndRoute } from "workbox-precaching";

const cacheData = "mainCache";
this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                "/static/js/main.chunk.js",
                "/static/js/0.chunk.js",
                "/static/js/bundle.js",
                "/public/index.html",
                "/",
            ]);
        })
    );
});

this.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Respond with cached resource
            }
            // Fetch new resource from network
            return fetch(event.request)
                .then((networkResponse) => {
                    // Save response to cache
                    let cache = caches.open(cacheData);
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                })
                .catch(() => {
                    return cachedResponse; // Return cached response if network fails
                });
        })
    );
});

precacheAndRoute(self.__WB_MANIFEST);
