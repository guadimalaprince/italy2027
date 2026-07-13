/* 景點照片：由瀏覽器直接向 Wikipedia API 批次抓取各條目的主圖縮圖，
 * 快取在 localStorage，離線或抓不到時優雅退回無圖狀態。 */
var Photos = (function () {
  "use strict";
  var KEY = "italy2027_photos_v1";
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { cache = {}; }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {}
  }

  function fetchBatch(titles, done) {
    var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*" +
      "&prop=pageimages&piprop=thumbnail&pithumbsize=640&redirects=1&titles=" +
      encodeURIComponent(titles.join("|"));
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var q = data.query || {};
      // 追蹤標題正規化與重新導向鏈：requested -> normalized -> redirected -> page title
      var alias = {};
      (q.normalized || []).forEach(function (m) { alias[m.from] = m.to; });
      (q.redirects || []).forEach(function (m) { alias[m.from] = m.to; });
      var byTitle = {};
      Object.keys(q.pages || {}).forEach(function (pid) {
        var p = q.pages[pid];
        byTitle[p.title] = (p.thumbnail && p.thumbnail.source) || "";
      });
      titles.forEach(function (t) {
        var cur = t, hops = 0;
        while (alias[cur] && hops < 4) { cur = alias[cur]; hops++; }
        cache[t] = byTitle[cur] || "";
      });
      save();
      done();
    }).catch(function () { done(); });
  }

  // 批次載入所有標題（每批 50 個），完成後呼叫 onDone；每批完成也會呼叫 onProgress
  function loadAll(titles, onProgress, onDone) {
    var todo = [];
    var seen = {};
    titles.forEach(function (t) {
      if (t && cache[t] === undefined && !seen[t]) { seen[t] = 1; todo.push(t); }
    });
    if (!todo.length) { if (onDone) onDone(); return; }
    var batches = [];
    for (var i = 0; i < todo.length; i += 50) batches.push(todo.slice(i, i + 50));
    var left = batches.length;
    batches.forEach(function (b) {
      fetchBatch(b, function () {
        if (onProgress) onProgress();
        if (--left === 0 && onDone) onDone();
      });
    });
  }

  function get(title) { return (title && cache[title]) || ""; }

  return { loadAll: loadAll, get: get };
})();
