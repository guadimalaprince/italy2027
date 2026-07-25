/* Italy 2027 離線支援
 * - 應用程式本體（HTML/CSS/JS/Leaflet）：安裝時就快取，之後永遠可離線開啟
 * - 地圖圖磚：cache-first，看過或預先下載過的就能離線用
 * - 維基照片：cache-first
 */
var SHELL = "italy2027-shell-v3";
var TILES = "italy2027-tiles-v1";
var PHOTOS = "italy2027-photos-v1";

var SHELL_FILES = [
  "./",
  "./index.html",
  "./itinerary.html",
  "./css/style.css",
  "./css/itinerary.css",
  "./js/pois.js",
  "./js/itinerary.js",
  "./js/itinerary-app.js",
  "./js/photos.js",
  "./js/routes.js",
  "./js/offline.js",
  "./js/app.js",
  "./vendor/leaflet/leaflet.js",
  "./vendor/leaflet/leaflet.css",
  "./vendor/leaflet/images/marker-icon.png",
  "./vendor/leaflet/images/marker-icon-2x.png",
  "./vendor/leaflet/images/marker-shadow.png",
  "./vendor/leaflet/images/layers.png",
  "./vendor/leaflet/images/layers-2x.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(SHELL).then(function (c) {
      // 個別加入，單一檔案失敗不會讓整個安裝失敗
      return Promise.all(SHELL_FILES.map(function (u) {
        return c.add(new Request(u, { cache: "reload" })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== SHELL && k !== TILES && k !== PHOTOS) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isTile(url) {
  return /tile\.openstreetmap\.org|tile\.opentopomap\.org|tiles\.wmflabs\.org|basemaps\.cartocdn\.com/.test(url.host);
}
function isPhoto(url) {
  return /wikimedia\.org|wikipedia\.org/.test(url.host);
}

// 圖磚與照片：先看快取，沒有才連網（連到就順手存起來）
function cacheFirst(req, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
        return res;
      }).catch(function () {
        return hit || Response.error();
      });
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  if (isTile(url)) { e.respondWith(cacheFirst(req, TILES)); return; }
  if (isPhoto(url)) { e.respondWith(cacheFirst(req, PHOTOS)); return; }

  // 只處理自己網站的請求
  if (url.origin !== self.location.origin) return;

  // 頁面導覽：優先連網取得最新版，離線時回快取
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(SHELL).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match("./index.html");
        });
      })
    );
    return;
  }

  // 靜態資源：快取優先，背景更新
  e.respondWith(
    caches.open(SHELL).then(function (cache) {
      return cache.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      });
    })
  );
});

// 主頁面用來查詢／清除圖磚快取
self.addEventListener("message", function (e) {
  var msg = e.data || {};
  if (msg.type === "TILE_STATS") {
    caches.open(TILES).then(function (c) { return c.keys(); }).then(function (keys) {
      e.source.postMessage({ type: "TILE_STATS", count: keys.length });
    });
  } else if (msg.type === "CLEAR_TILES") {
    caches.delete(TILES).then(function () {
      e.source.postMessage({ type: "TILES_CLEARED" });
    });
  }
});
