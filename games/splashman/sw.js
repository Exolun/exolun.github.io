const SHELL_CACHE = "splashman-shell-v1";
const RUNTIME_CACHE = "splashman-runtime-v1";
const OFFLINE_URL = "./index.html";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./styles.css",
  "./game.js",
  "./manifest.webmanifest",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/splashman-192.png",
  "./assets/icons/splashman-512.png",
  "./assets/botsly/1.png",
  "./assets/botsly/2.png",
  "./assets/botsly/3.png",
  "./assets/botsly/4.png",
  "./assets/botsly/5.png",
  "./assets/botsly/6.png",
  "./assets/botsly/7.png",
  "./assets/botsly/8.png",
  "./assets/botsly/9.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => ![SHELL_CACHE, RUNTIME_CACHE].includes(cacheName))
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  event.respondWith(handleAssetRequest(request));
});

async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch {
    return (await caches.match(request)) || caches.match(OFFLINE_URL);
  }
}

async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request, { ignoreSearch: true });

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    return new Response("Offline", {
      status: 503,
      statusText: "Offline"
    });
  }
}
