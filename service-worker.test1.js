

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
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/c953f9b7762b3f88147bcb1d30b6fca0d78a9f0d.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/script.js",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/e67960664419d09e492ce75f473021a2745d7e5d.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/96a3b7e63f3f285355ae0403cd41afadbf593633.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/eb30b0ce3574e7f84689ae4be9a4736222a1e581.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/1a73546bfcb9d69c792eece5b1337666a43cd897.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/dba0898ed90a0f1cab4e3897178cb09c63c036fd.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/7399df245b73a9501e894e7ee4f6a5dd525340ba.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/98c37ebe646f725b4d27876f237113ef9acfc940.png", 
]

var FECHED_ON_CLIENT = [ 
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/e573740b08597927ae2b9c85bcdcbcac346a2324.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/ac59d84710a164cd31611a4b15ff0b439a980ff5.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/1a46c7e5db3acfc9e0e7fad6f2fc3e55c92622b6.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/21e43e21aa587e86cc41476a311db0f1f8d5a770.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/91ad84739bfc71d3667c02b69da9035a3072e0ff.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/48d2dd553a5439471a4fb69646eec530ef67b3e8.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/35b8691efcdaaa7c064310e40949eaaa94de72fb.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/4bc10e7499a8a11d043226de8d9cf6f12800559f.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/92501ad97eba0f22b05aca03d90937dc4af2735b.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/d4826e03774a0c17e4b56cd20e755f1951f393d7.png", 
]

var FECHED_ON_SWCLIENT = [ 
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/9e1cb03b8302945c8215ef701e185ea47c29d642.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/f145690c17842b091e2ee7cbf63186803a57ebdc.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/e2320cc098a376354c995e41c4785ca9ecc007d4.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/271611e8fc0fed93f299e10f29c192f696761864.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/9ffc233c7a730414475ece1ad8edbea4bc35a5df.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/f4ed1eb05f9dc3c61a1171f1b0a9444956714d48.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/ba746667811f3ac211104063dea2ff6f78cd6fbf.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/6c844547e0aed4630f5c00948291484b66ae6018.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/d5e6e260b8ae11a389b4971f0461f3137a4f07e5.png",
    "https://ie-snap/scratchtests/sunggch/pwaapp1/images/9ea44a43134abc1e29b7fb4197515f2a1d983a59.png", 
]

