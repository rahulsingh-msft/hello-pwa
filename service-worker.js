

const PRECACHE = 'sw-preCache';
const RUNTIME = 'runtime';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(PRECACHE)
        .then(cache => {
            cache.addAll(FECHED_ON_SW)
        })
        .then(self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
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

        if (FECHED_ON_CLIENT.indexOf(path) !== -1) {
            // target request should be handled in the client even without attempt 
            return;
        } else if (FECHED_ON_SW.indexOf(path) !== -1 || FECHED_ON_SWCLIENT.indexOf(path) !== -1) {
            // defer checking caches.
            event.respondWith(
                caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    if (FECHED_ON_SW.indexOf(path) !== -1) {
                        return caches.open(RUNTIME).then(cache => {
                            return fetch(event.request).then(response => {
                                return cache.put(event.request, response.clone()).then(() => {
                                    console.log("[SW] fetch and return on SW: " + event.request.url);
                                    return response;
                                });
                            });
                        });
                    } else {
                        caches.open(RUNTIME).then(cache => {
                            fetch(event.request).then(response => {
                                cache.put(event.request, response);
                                console.log("[SW] fetch on client and cache on SW: " + event.request.url);
                            });
                        });
                        return new Response(); // null body returns will let client fetch on the client.
                    }
                })
            );
        }
    }
});


var FECHED_ON_SW = [ 
    "https://sunggook.github.io/hello-pwa/images/48d2dd553a5439471a4fb69646eec530ef67b3e8.png",
    "https://sunggook.github.io/hello-pwa/images/98c37ebe646f725b4d27876f237113ef9acfc940.png",
    "https://sunggook.github.io/hello-pwa/images/e573740b08597927ae2b9c85bcdcbcac346a2324.png",
    "https://sunggook.github.io/hello-pwa/images/7399df245b73a9501e894e7ee4f6a5dd525340ba.png",
    "https://sunggook.github.io/hello-pwa/images/9e1cb03b8302945c8215ef701e185ea47c29d642.png"
]

var FECHED_ON_CLIENT = [ 
    "https://sunggook.github.io/hello-pwa/images/c953f9b7762b3f88147bcb1d30b6fca0d78a9f0d.png",
    "https://sunggook.github.io/hello-pwa/images/ac59d84710a164cd31611a4b15ff0b439a980ff5.png",
    "https://sunggook.github.io/hello-pwa/images/96a3b7e63f3f285355ae0403cd41afadbf593633.png",
    "https://sunggook.github.io/hello-pwa/images/e2320cc098a376354c995e41c4785ca9ecc007d4.png",
    "https://sunggook.github.io/hello-pwa/images/f145690c17842b091e2ee7cbf63186803a57ebdc.png",
    "https://sunggook.github.io/hello-pwa/images/271611e8fc0fed93f299e10f29c192f696761864.png" 
]

var FECHED_ON_SWCLIENT = [ 
    "https://sunggook.github.io/hello-pwa/service-worker.js",
    "https://sunggook.github.io/hello-pwa/",
    "https://sunggook.github.io/hello-pwa/script.js",
    "https://sunggook.github.io/hello-pwa/images/9ffc233c7a730414475ece1ad8edbea4bc35a5df.png",
    "https://sunggook.github.io/hello-pwa/images/c526266504939bae7c907a3e0d1d2222f207e273.png",
    "https://sunggook.github.io/hello-pwa/images/3c57d1db08b92f11a11bc0d4efc86cc8f4cbdbb4.png",
    "https://sunggook.github.io/hello-pwa/images/4d42396538e42737cd645596762291f2f32f8d83.png",
    "https://sunggook.github.io/hello-pwa/images/4e4890e3a88cd8321c3c00ab4b75a9e28c0e606f.png",

    
]
