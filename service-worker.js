

const PRECACHE = 'sw-preCache';
const RUNTIME = 'runtime';

// every checkin change this value
let hash = '12/04:22:00/2019';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(PRECACHE)
        .then(cache => {
            // cache.addAll(sites_v1);
            cache.addAll(persistent_image_v1);
        })
        .then(self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    // New service worker upgrade, then delete caches other than whitelist..
    const whiteList = [PRECACHE];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !whiteList.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        var path = event.request.url;

        if (sites_v1.indexOf(path) !== -1 ||
                persistent_image_v1.indexOf(path) !== -1) {
            // defer checking caches.
            event.respondWith(
                caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request).then(
                        function(response) {
                          // Check if we received a valid response
                          if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                          }

                          // IMPORTANT: Clone the response. A response is a stream
                          // and because we want the browser to consume the response
                          // as well as the cache consuming the response, we need
                          // to clone it so we have two streams.
                          var responseToCache = response.clone();

                          caches.open(RUNTIME)
                            .then(function(cache) {
                              cache.put(event.request, responseToCache);
                            });

                          return response;
                        }
                      );

                    // if (FECHED_ON_SW.indexOf(path) !== -1) {
                    //     return caches.open(RUNTIME).then(cache => {
                    //         return fetch(event.request).then(response => {
                    //             return cache.put(event.request, response.clone()).then(() => {
                    //                 console.log("[SW] fetch and return on SW: " + event.request.url);
                    //                 return response;
                    //             });
                    //         });
                    //     });
                    // } else
                    // {
                    //     caches.open(RUNTIME).then(cache => {
                    //         fetch(event.request).then(response => {
                    //             cache.put(event.request, response);
                    //             console.log("[SW] fetch on client and cache on SW: " + event.request.url);
                    //         });
                    //     });
                    //     return new Response(); // null body returns will let client fetch on the client.
                    // }
                })
            );
        }
    }
});


// var FECHED_ON_SW = [
//     "https://sunggook.github.io/hello-pwa/images/48d2dd553a5439471a4fb69646eec530ef67b3e8.png",
//     "https://sunggook.github.io/hello-pwa/images/98c37ebe646f725b4d27876f237113ef9acfc940.png",
//     "https://sunggook.github.io/hello-pwa/images/e573740b08597927ae2b9c85bcdcbcac346a2324.png",
//     "https://sunggook.github.io/hello-pwa/images/7399df245b73a9501e894e7ee4f6a5dd525340ba.png",
//     "https://sunggook.github.io/hello-pwa/images/9e1cb03b8302945c8215ef701e185ea47c29d642.png"
// ]

// var FECHED_ON_CLIENT = [
//     "https://sunggook.github.io/hello-pwa/images/c953f9b7762b3f88147bcb1d30b6fca0d78a9f0d.png",
//     "https://sunggook.github.io/hello-pwa/images/ac59d84710a164cd31611a4b15ff0b439a980ff5.png",
//     "https://sunggook.github.io/hello-pwa/images/96a3b7e63f3f285355ae0403cd41afadbf593633.png",
//     "https://sunggook.github.io/hello-pwa/images/e2320cc098a376354c995e41c4785ca9ecc007d4.png",
//     "https://sunggook.github.io/hello-pwa/images/f145690c17842b091e2ee7cbf63186803a57ebdc.png",
//     "https://sunggook.github.io/hello-pwa/images/271611e8fc0fed93f299e10f29c192f696761864.png"
// ]

var sites_v1 = [
    "https://sunggook.github.io/hello-pwa/service-worker.js",
    "https://sunggook.github.io/hello-pwa/",
    "https://sunggook.github.io/hello-pwa/script.js",
    "https://sunggook.github.io/hello-pwa/share.js",
    "https://sunggook.github.io/hello-pwa/badging.js",
    "https://sunggook.github.io/hello-pwa/style.css",

   ]

var persistent_image_v1 = [
    "https://sunggook.github.io/hello-pwa/skull192.png",
    "https://sunggook.github.io/hello-pwa/skull512.png",
]