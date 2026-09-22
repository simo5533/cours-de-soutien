/* CorrecteurPlus PWA — service worker (installabilité + cache assets) */
/* v2 — fix syntaxe évaluation */
const CACHE = "correcteurplus-v2";
const PRECACHE = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.all(
          PRECACHE.map((url) =>
            cache.add(url).catch(function () {
              /* un asset manquant ne doit pas bloquer l'install SW */
            }),
          ),
        ),
      )
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k !== CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

self.addEventListener("fetch", (event) => {
  var request = event.request;
  if (request.method !== "GET") return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/api/") === 0) return;

  var isStatic =
    url.pathname.indexOf("/icons/") === 0 ||
    url.pathname.indexOf("/brand/") === 0 ||
    url.pathname.indexOf("/bg/") === 0 ||
    /\.(png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request).then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) {
              c.put(request, copy);
            });
          }
          return res;
        });
      }),
    );
    return;
  }

  var accept = request.headers.get("accept") || "";
  if (accept.indexOf("text/html") !== -1) {
    event.respondWith(
      fetch(request)
        .then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) {
              c.put(request, copy);
            });
          }
          return res;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            return cached || caches.match("/fr");
          });
        }),
    );
  }
});
