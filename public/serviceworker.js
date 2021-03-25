const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/manifest.json",
    "/index.html",
    "/styles.css",
    "/index.js"


];



// install and catch the files
self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Files caught!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});


//deletes old cache data
self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Bye Bye old data!", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

// fetches the data that was saved and merges it with old data
self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/")) {

        evt.respondWith(
            caches
                .open(DATA_CACHE_NAME).then(cache => {

                    return fetch(evt.request)
                        .then(response => {

                            //will clone the data if it produces a good response 
                            if (response.status === 200) {
                                cache.put(evt.request.url, response.clone());
                            }

                            return response;
                        })
                        //network failure, trys to get saved data from cache
                        .catch(err => {

                            return cache.match(evt.request);

                        });
                }).catch(err => {
                    console.log(err)
                })
        );

        return;
    }
    //opens catch and returns the fetch request
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});