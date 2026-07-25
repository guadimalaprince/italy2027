/* 步道路線
 * 兩種來源：
 *  1) GPX 匯入——真實軌跡（從 Komoot / AllTrails / 官網下載），可離線保存
 *  2) 每日示意連線——把當天景點依步行順序連起來，僅供辨認方向，不是實際步道
 * 山區導航請以 GPX 或 OpenTopoMap 圖層上的實際步道為準。
 */
var Routes = (function () {
  "use strict";

  var KEY = "italy2027_gpx_v1";
  var tracks = [];
  try { tracks = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { tracks = []; }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(tracks)); return true; }
    catch (e) { return false; }   // 超過容量
  }

  // ---------- GPX ----------
  function parseGPX(text, name) {
    var doc = new DOMParser().parseFromString(text, "application/xml");
    if (doc.querySelector("parsererror")) throw new Error("GPX 格式錯誤");
    var pts = doc.querySelectorAll("trkpt");
    if (!pts.length) pts = doc.querySelectorAll("rtept");
    if (!pts.length) throw new Error("這個檔案裡找不到軌跡點");
    var coords = [];
    for (var i = 0; i < pts.length; i++) {
      var la = parseFloat(pts[i].getAttribute("lat"));
      var ln = parseFloat(pts[i].getAttribute("lon"));
      if (isFinite(la) && isFinite(ln)) coords.push([la, ln]);
    }
    var gpxName = doc.querySelector("trk > name, metadata > name");
    return {
      id: "gpx-" + Date.now() + "-" + Math.floor(Math.random() * 1e4),
      name: (gpxName && gpxName.textContent.trim()) || name.replace(/\.gpx$/i, ""),
      coords: simplify(coords, 0.00002),   // 約 2 公尺容差：山區導航夠精細，檔案又不會爆掉
      raw: coords.length
    };
  }

  // Douglas–Peucker：把點數降下來，才存得進 localStorage
  function simplify(pts, tol) {
    if (pts.length < 3) return pts;
    function sqSegDist(p, a, b) {
      var x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
      if (dx !== 0 || dy !== 0) {
        var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) { x = b[0]; y = b[1]; }
        else if (t > 0) { x += dx * t; y += dy * t; }
      }
      dx = p[0] - x; dy = p[1] - y;
      return dx * dx + dy * dy;
    }
    // 用索引標記要保留的點，最後依原始順序取出（用 indexOf 排序會在重複座標時出錯）
    var mark = new Uint8Array(pts.length);
    mark[0] = 1; mark[pts.length - 1] = 1;
    var stack = [[0, pts.length - 1]];
    while (stack.length) {
      var seg = stack.pop(), first = seg[0], last = seg[1];
      var maxD = tol * tol, idx = -1;
      for (var i = first + 1; i < last; i++) {
        var d = sqSegDist(pts[i], pts[first], pts[last]);
        if (d > maxD) { idx = i; maxD = d; }
      }
      if (idx > 0) { mark[idx] = 1; stack.push([first, idx]); stack.push([idx, last]); }
    }
    var keep = [];
    for (var j = 0; j < pts.length; j++) if (mark[j]) keep.push(pts[j]);
    return keep;
  }

  function addFromFile(file) {
    return file.text().then(function (t) {
      var track = parseGPX(t, file.name);
      tracks.push(track);
      if (!save()) { tracks.pop(); throw new Error("儲存空間不足，請先刪掉其他軌跡"); }
      return track;
    });
  }

  function remove(id) {
    tracks = tracks.filter(function (t) { return t.id !== id; });
    save();
  }

  function all() { return tracks; }

  // ---------- 每日示意連線 ----------
  function haversine(a, b) {
    var R = 6371000, dLat = (b[0] - a[0]) * Math.PI / 180, dLng = (b[1] - a[1]) * Math.PI / 180;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  // 用最近鄰接把當天景點串成一條合理的步行順序；相距超過 8 公里就斷開（代表換城市／搭車）
  function dayLines(pois) {
    if (pois.length < 2) return [];
    var pool = pois.slice();
    var cur = pool.shift();
    var seg = [[cur.lat, cur.lng]];
    var lines = [];
    while (pool.length) {
      var bi = 0, bd = Infinity;
      for (var i = 0; i < pool.length; i++) {
        var d = haversine([cur.lat, cur.lng], [pool[i].lat, pool[i].lng]);
        if (d < bd) { bd = d; bi = i; }
      }
      var nxt = pool.splice(bi, 1)[0];
      if (bd > 8000) { if (seg.length > 1) lines.push(seg); seg = [[nxt.lat, nxt.lng]]; }
      else seg.push([nxt.lat, nxt.lng]);
      cur = nxt;
    }
    if (seg.length > 1) lines.push(seg);
    return lines;
  }

  return { addFromFile: addFromFile, remove: remove, all: all, dayLines: dayLines, parseGPX: parseGPX };
})();
