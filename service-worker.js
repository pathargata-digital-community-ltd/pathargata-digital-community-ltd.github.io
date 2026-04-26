/** 
 * ==========================================
 *       SERVICE WORKER (PATHARGATA DIGITAL)
 * ==========================================
 * handles: Static Caching, Dynamic Updates, Offline Support
 * Version: 6.0
 */

const CACHE_NAME = 'patharghata-pwa-v6.0';
const DYNAMIC_CACHE_NAME = 'patharghata-dynamic-v6.0';

// রুটে থাকা মেইন ফাইলগুলো (messages.html যুক্ত করা হয়েছে)
const STATIC_ASSETS = [
    './',
    './index.html',
    './messages.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ১. Install Event: ফাইলগুলো ক্যাশে জমা করা
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching static assets...');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// ২. Activate Event: পুরোনো ক্যাশ ডিলিট করা (যাতে নতুন আপডেট পাওয়া যায়)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
                        console.log('Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// ৩. Fetch Event: নেটওয়ার্ক থেকে আনা এবং ক্যাশে সেভ করা (Smart Caching)
self.addEventListener('fetch', (event) => {
    // OneSignal বা অন্য কোনো API রিকোয়েস্ট ক্যাশ করা হবে না
    if (event.request.method !== 'GET' || event.request.url.includes('onesignal') || event.request.url.includes('firebase')) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // নতুন ফাইল পাওয়া গেলে তা ডাইনামিক ক্যাশে সেভ করো
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // যদি ইন্টারনেট না থাকে এবং ফাইলটি ক্যাশে না থাকে, তবে index.html দেখাবে
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });

            // ক্যাশ থাকলে ক্যাশ দেখাবে, নতুবা নেটওয়ার্ক থেকে লোড করবে
            return cachedResponse || fetchPromise;
        })
    );
});
