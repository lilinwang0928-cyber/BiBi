/* 國中英文轉運站　離線快取 */
const CACHE = "station-v2026.08.24";
const PRECACHE = [
  "./",
  "./appendix.html",
  "./ch01.html",
  "./ch02.html",
  "./ch03.html",
  "./ch04.html",
  "./ch05.html",
  "./ch06.html",
  "./ch07.html",
  "./ch08.html",
  "./ch09.html",
  "./ch10.html",
  "./ch11.html",
  "./ch12.html",
  "./ch13.html",
  "./ch14.html",
  "./ch15.html",
  "./ch16.html",
  "./ch17.html",
  "./ch18.html",
  "./ch19.html",
  "./ch20.html",
  "./index.html",
  "./review.html",
  "./review2.html",
  "./review3.html",
  "./review4.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-64.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* 網頁：先給快取、背景更新；其他資源：快取優先 */
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit || caches.match("./index.html"));
      return hit || net;
    })
  );
});

self.addEventListener("message", e => {
  if (e.data === "skipWaiting") self.skipWaiting();
});
