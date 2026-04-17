/** 
 * ==========================================
 *       SERVICE WORKER (PWA & OFFLINE)
 * ==========================================
 * handles: Static Caching, Offline Support
 */

const CACHE_NAME = 'patharghata-pwa-v5';
const DYNAMIC_CACHE_NAME = 'patharghata-dynamic-v5';

// অফলাইনে যে ফাইলগুলো কাজ করবে (মেইন রুট অনুযায়ী আপডেট করা হয়েছে)
const STATIC_ASSETS = [
    './',
    'index.html',
    'manifest.json'
];

// ১. Install Event: ফাইলগুলো ক্যাশে জমা করা
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// ২. Activate Event: পুরোনো ক্যাশ ডিলিট করা
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// ৩. Fetch Event: নেটওয়ার্ক থেকে আনা এবং ক্যাশে সেভ করা
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || event.request.url.includes('onesignal')) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    // মেইন রুটের ইনডেক্স পেজ রিটার্ন করবে
                    return caches.match('index.html');
                }
            });

            return cachedResponse || fetchPromise;
        })
    );
});
