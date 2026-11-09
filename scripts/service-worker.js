/* eslint-env serviceworker, es2021 */
/* global __PRECACHE__ */
/* Build placeholders are replaced by generate-pwa.mjs. */
const SHELL_CACHE = "mesbg-es-shell-__BUILD_ID__";
const IMAGE_CACHE = "mesbg-es-images-v1";
const PRECACHE = __PRECACHE__;
const IMAGE_BUDGET = 32 * 1024 * 1024;
let imageQueue = Promise.resolve();
let imageEntries;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await cache.addAll(PRECACHE);
      // Let existing windows finish with their version; never reload an edited list.
    })(),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) {
        if (name.startsWith("mesbg-es-shell-") && name !== SHELL_CACHE)
          await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  );
});

function saveImage(request, response) {
  imageQueue = imageQueue
    .catch(() => {})
    .then(async () => {
      if (
        !response.ok ||
        response.type === "opaque" ||
        !response.headers.get("content-type")?.startsWith("image/")
      )
        return;
      const body = await response.blob();
      if (body.size > IMAGE_BUDGET) return;
      const cache = await caches.open(IMAGE_CACHE);
      const headers = new Headers(response.headers);
      headers.delete("content-encoding");
      headers.delete("content-length");
      headers.set("x-mesbg-image-bytes", String(body.size));
      // Evict old image responses only. Never touch lists, preferences or other apps.
      const cacheKey = new URL(request.url);
      cacheKey.search = "";
      if (!imageEntries) {
        const keys = await cache.keys();
        imageEntries = new Map(
          await Promise.all(
            keys.map(async (key) => {
              const value = await cache.match(key);
              return [
                key.url,
                Number(value.headers.get("x-mesbg-image-bytes")) ||
                  IMAGE_BUDGET,
              ];
            }),
          ),
        );
      }
      let size = body.size;
      for (const [key, bytes] of imageEntries)
        if (key !== cacheKey.href) size += bytes;
      for (const [key, bytes] of imageEntries) {
        if (size <= IMAGE_BUDGET) break;
        if (key === cacheKey.href) continue;
        await cache.delete(key);
        imageEntries.delete(key);
        size -= bytes;
      }
      await cache.put(cacheKey.href, new Response(body, { headers }));
      imageEntries.delete(cacheKey.href);
      imageEntries.set(cacheKey.href, body.size);
    });
  return imageQueue.catch(() => {}); // Quota errors must not break a network image.
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const local = url.origin === self.location.origin;
  if (local && request.mode === "navigate") {
    event.respondWith(
      caches
        .open(SHELL_CACHE)
        .then(
          async (cache) => (await cache.match("/index.html")) || fetch(request),
        ),
    );
    return;
  }
  if (local && PRECACHE.includes(url.pathname)) {
    event.respondWith(
      caches
        .open(SHELL_CACHE)
        .then(
          async (cache) => (await cache.match(url.pathname)) || fetch(request),
        ),
    );
    return;
  }
  const resource =
    (local && url.pathname.startsWith("/static-resources/")) ||
    (url.origin === "https://resources.mesbg-list-builder.com" &&
      url.pathname.startsWith("/v2024/"));
  if (resource && /\.(png|jpe?g|webp|svg)$/i.test(url.pathname)) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (!response.ok) throw new Error("Image unavailable");
          event.waitUntil(saveImage(request, response.clone()));
          return response;
        } catch {
          const cache = await caches.open(IMAGE_CACHE);
          return (
            (await cache.match(request, { ignoreSearch: true })) ||
            Response.error()
          );
        }
      })(),
    );
  }
  // API requests, authentication, analytics and private responses are not cached.
});
