/* 離線地圖：把指定日期（或全行程）沿線的圖磚預先抓進 Service Worker 的快取
 * 作法是在每個景點周圍取一小塊範圍（預設半徑約 1.3 公里）再取聯集，
 * 所以不會像整個外框那樣把兩座城市之間的幾百公里都抓下來。
 */
var Offline = (function () {
  "use strict";

  var TILE_CACHE = "italy2027-tiles-v1";
  var CONCURRENCY = 4;          // 同時下載數：對免費圖磚伺服器客氣一點
  var cancelled = false;

  function lon2t(lon, z) { return Math.floor((lon + 180) / 360 * Math.pow(2, z)); }
  function lat2t(lat, z) {
    var r = lat * Math.PI / 180;
    return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * Math.pow(2, z));
  }

  // 回傳涵蓋這些景點的圖磚清單（去重）
  function tileList(pois, zooms, padDeg) {
    var seen = {}, out = [];
    pois.forEach(function (p) {
      var dLat = padDeg;
      var dLng = padDeg / Math.max(0.2, Math.cos(p.lat * Math.PI / 180));
      zooms.forEach(function (z) {
        var x0 = lon2t(p.lng - dLng, z), x1 = lon2t(p.lng + dLng, z);
        var y0 = lat2t(p.lat + dLat, z), y1 = lat2t(p.lat - dLat, z);
        for (var x = x0; x <= x1; x++) {
          for (var y = y0; y <= y1; y++) {
            var k = z + "/" + x + "/" + y;
            if (!seen[k]) { seen[k] = 1; out.push({ z: z, x: x, y: y }); }
          }
        }
      });
    });
    return out;
  }

  function urlsFor(t, layers) {
    var list = [];
    if (layers.osm) list.push("https://tile.openstreetmap.org/" + t.z + "/" + t.x + "/" + t.y + ".png");
    if (layers.topo) list.push("https://tile.opentopomap.org/" + t.z + "/" + t.x + "/" + t.y + ".png");
    return list;
  }

  function cancel() { cancelled = true; }

  /* pois: 要涵蓋的景點；opts: { zooms, pad, layers, onProgress(done,total), onDone(stats) } */
  function download(pois, opts) {
    cancelled = false;
    opts = opts || {};
    var zooms = opts.zooms || [12, 13, 14, 15, 16];
    var pad = opts.pad || 0.012;
    var layers = opts.layers || { osm: true, topo: false };

    var tiles = tileList(pois, zooms, pad);
    var urls = [];
    tiles.forEach(function (t) { urls = urls.concat(urlsFor(t, layers)); });

    var total = urls.length, done = 0, failed = 0, i = 0;

    return caches.open(TILE_CACHE).then(function (cache) {
      function next() {
        if (cancelled || i >= urls.length) return Promise.resolve();
        var url = urls[i++];
        return cache.match(url).then(function (hit) {
          if (hit) return null;   // 已經有了就跳過，重複下載沒意義
          return fetch(url, { mode: "cors", cache: "no-cache" })
            .then(function (res) { if (res && res.ok) return cache.put(url, res); failed++; })
            .catch(function () { failed++; });
        }).then(function () {
          done++;
          if (opts.onProgress && done % 5 === 0) opts.onProgress(done, total);
          return next();
        });
      }
      var workers = [];
      for (var w = 0; w < CONCURRENCY; w++) workers.push(next());
      return Promise.all(workers).then(function () {
        var stats = { total: total, done: done, failed: failed, cancelled: cancelled };
        if (opts.onProgress) opts.onProgress(done, total);
        if (opts.onDone) opts.onDone(stats);
        return stats;
      });
    });
  }

  // 預估：只算張數與大約容量，不實際下載
  function estimate(pois, zooms, pad, layers) {
    var n = tileList(pois, zooms || [12, 13, 14, 15, 16], pad || 0.012).length;
    var mult = (layers && layers.osm ? 1 : 0) + (layers && layers.topo ? 1 : 0) || 1;
    return { tiles: n * mult, mb: Math.round(n * mult * 18 / 1024 * 10) / 10 };
  }

  function tileCount() {
    return caches.open(TILE_CACHE).then(function (c) { return c.keys(); }).then(function (k) { return k.length; });
  }

  function clear() { return caches.delete(TILE_CACHE); }

  function storageInfo() {
    if (navigator.storage && navigator.storage.estimate) return navigator.storage.estimate();
    return Promise.resolve(null);
  }

  return {
    download: download, estimate: estimate, cancel: cancel,
    tileCount: tileCount, clear: clear, storageInfo: storageInfo, tileList: tileList
  };
})();
