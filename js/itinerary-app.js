/* 行程總覽頁：渲染 21 天卡片（交通、計畫、住宿、景點照片） */
(function () {
  "use strict";

  var container = document.getElementById("days");

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function gmapLink(gm) {
    return "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(gm[0]) +
           "&destination=" + encodeURIComponent(gm[1]) + "&travelmode=transit";
  }

  var STAY_TAG = { confirmed: "✅ 已確認", suggested: "💡 建議（尚未預訂）", hut: "🛖 山屋（需預約）" };

  function render() {
    var lastPhase = null;
    DAYS.forEach(function (d) {
      if (d.phase !== lastPhase) {
        container.appendChild(el("div", "phase-header", esc(d.phase)));
        lastPhase = d.phase;
      }

      var card = el("article", "day-card");
      var head = el("div", "day-head");
      head.appendChild(el("span", "day-num", "Day " + d.day));
      if (d.date) head.appendChild(el("span", "day-date", esc(d.date)));
      head.appendChild(el("span", "day-title", esc(d.title)));
      card.appendChild(head);

      // 交通
      if (d.transport && d.transport.length) {
        var ts = el("div", "day-section");
        ts.appendChild(el("h4", null, "🚏 交通"));
        d.transport.forEach(function (t) {
          var leg = el("div", "leg");
          leg.appendChild(el("span", "icon", t.icon || "🚌"));
          var body = el("div", "body");
          var line = '<span class="route">' + esc(t.route) + '</span>' +
                     (t.time ? '<span class="time">' + esc(t.time) + '</span>' : "");
          if (t.gm) line += '<a class="gmap" target="_blank" rel="noopener" href="' + gmapLink(t.gm) + '">📍 路線</a>';
          body.innerHTML = line + (t.note ? '<div class="note">' + esc(t.note) + "</div>" : "");
          leg.appendChild(body);
          ts.appendChild(leg);
        });
        card.appendChild(ts);
      }

      // 行程
      if (d.plan && d.plan.length) {
        var ps = el("div", "day-section");
        ps.appendChild(el("h4", null, "🗓 行程"));
        var ul = el("ul", "plan");
        d.plan.forEach(function (p) { ul.appendChild(el("li", null, esc(p))); });
        ps.appendChild(ul);
        card.appendChild(ps);
      }

      // 住宿
      if (d.stay && d.stay.status !== "none") {
        var ss = el("div", "day-section");
        ss.appendChild(el("h4", null, "🏨 住宿：" + esc(d.stay.city)));
        var box = el("div", "stay " + d.stay.status);
        box.innerHTML = '<span class="tag">' + STAY_TAG[d.stay.status] + "</span>" + esc(d.stay.name) +
                        (d.stay.note ? '<span class="note">' + esc(d.stay.note) + "</span>" : "");
        ss.appendChild(box);
        card.appendChild(ss);
      }

      // 注意事項
      if (d.warn && d.warn.length) {
        var ws = el("div", "day-section");
        var wb = el("div", "warn-box");
        var wul = el("ul");
        d.warn.forEach(function (w) { wul.appendChild(el("li", null, "⚠️ " + esc(w))); });
        wb.appendChild(wul);
        ws.appendChild(wb);
        card.appendChild(ws);
      }

      // 當日景點照片
      var pois = POIS.filter(function (p) { return p.day === d.day; });
      if (pois.length) {
        var hs = el("div", "day-section");
        hs.appendChild(el("h4", null, "📸 當日景點（" + pois.length + "）— 點卡片開地圖與語音導覽"));
        card.appendChild(hs);
        var strip = el("div", "photos");
        pois.forEach(function (p) {
          var a = el("a", "photo-card");
          a.href = "index.html?poi=" + encodeURIComponent(p.id);
          var ph = el("div", "ph", "🏞");
          ph.setAttribute("data-wiki", p.wiki || "");
          a.appendChild(ph);
          a.appendChild(el("div", "cap", esc(p.name)));
          strip.appendChild(a);
        });
        card.appendChild(strip);
      }

      container.appendChild(card);
    });
  }

  function fillPhotos() {
    var slots = document.querySelectorAll(".ph[data-wiki]");
    for (var i = 0; i < slots.length; i++) {
      var t = slots[i].getAttribute("data-wiki");
      var src = Photos.get(t);
      if (src && !slots[i].querySelector("img")) {
        var img = document.createElement("img");
        img.loading = "lazy";
        img.alt = "";
        img.onerror = (function (slot) {
          return function () { slot.innerHTML = "🏞"; };
        })(slots[i]);
        img.src = src;
        slots[i].textContent = "";
        slots[i].appendChild(img);
      }
    }
  }

  render();
  var titles = POIS.map(function (p) { return p.wiki; });
  Photos.loadAll(titles, fillPhotos, fillPhotos);
  fillPhotos(); // 已有快取時立即補上
})();
