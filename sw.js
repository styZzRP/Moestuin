// Service worker — maakt de app offline beschikbaar.
const CACHE = "moestuin-v6";

// Kernbestanden die echt nodig zijn (installatie faalt als deze ontbreken).
const CORE = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.json",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
];

// Optionele bestanden — een ontbrekend bestand laat de installatie niet mislukken.
const OPTIONAL = [
  "./garden-bg.jpg",
  "./garden-bg.jpeg",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      await c.addAll(CORE);
      // optionele bestanden stuk voor stuk; fouten negeren
      await Promise.all(OPTIONAL.map((u) => c.add(u).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Strategie:
// - HTML en JS (de app zelf): network-first, zodat updates meteen zichtbaar zijn.
// - Overige bestanden (afbeeldingen, iconen, libs): cache-first voor snelheid/offline.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = e.request.url;
  const isAppCode = url.endsWith(".js") || url.endsWith("/") || url.endsWith(".html");

  if (isAppCode) {
    e.respondWith(
      fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
    })
  );
});
