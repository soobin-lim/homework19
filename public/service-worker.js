const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  ".",
  "./index.html",
  "./index.js",
  "./styles.css",
  "./service-worker.js",
  "./manifest.webmanifest",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png"
];

// install
self.addEventListener("install", function (evt) {
  // pre cache transaction data
  evt.waitUntil(
    caches.open(DATA_CACHE_NAME).then((cache) => {cache.add("/api/transaction")})   // change it to transaction
  );
    
  // pre cache all static assets
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );

  // tell the browser to activate this service worker immediately once it
  // has finished installing
  self.skipWaiting();
});

// activate
self.addEventListener("activate", function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch
self.addEventListener("fetch", function(evt) {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)          //evt.request -> evt.request.url
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);    // when offline -> this has an error 
            //resulted in a network error response : an object that was not a Response was passed to respondWith()
          });
      }).catch(err => console.log(err))
    );
    return;
  }

  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        console.log(response)
        return response || fetch(evt.request);
      });
    })
  );
});