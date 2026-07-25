/* 行程總覽頁：渲染 21 天卡片（交通、計畫、住宿、景點照片） */
(function () {
  "use strict";

  var container = document.getElementById("days");

  // ---------- 今天是第幾天 ----------
  var TRIP_START = new Date(2027, 5, 3);   // Day 1 = 2027/6/3
  var rawDay = Math.round(
    (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - TRIP_START) / 86400000
  ) + 1;
  var tripDay = (rawDay >= 1 && rawDay <= DAYS.length) ? rawDay : null;

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

      var card = el("article", "day-card" + (d.day === tripDay ? " is-today" : ""));
      card.id = "day-" + d.day;
      var head = el("div", "day-head");
      head.appendChild(el("span", "day-num", "Day " + d.day));
      if (d.date) head.appendChild(el("span", "day-date", esc(d.date)));
      if (d.day === tripDay) head.appendChild(el("span", "today-chip", "今天"));
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
        var CAP = 6;
        var strip = el("div", "photos");
        pois.forEach(function (p, i) {
          var a = el("a", "photo-card" + (i >= CAP ? " extra is-hidden" : ""));
          a.href = "index.html?poi=" + encodeURIComponent(p.id);
          var ph = el("div", "ph", "🏞");
          ph.setAttribute("data-wiki", p.wiki || "");
          a.appendChild(ph);
          a.appendChild(el("div", "cap", esc(p.name)));
          strip.appendChild(a);
        });
        card.appendChild(strip);

        // 景點多的日子預設只顯示 6 張，避免卡片變成無止盡的長條
        if (pois.length > CAP) {
          var more = el("button", "show-more", "▾ 顯示其餘 " + (pois.length - CAP) + " 個景點");
          more.addEventListener("click", function () {
            var hidden = strip.querySelectorAll(".extra.is-hidden");
            if (hidden.length) {
              // 展開時改成網格，避免橫向滑好幾千像素
              strip.classList.add("grid");
              strip.querySelectorAll(".extra").forEach(function (e) { e.classList.remove("is-hidden"); });
              more.textContent = "▴ 收合";
              fillPhotos();
            } else {
              strip.classList.remove("grid");
              strip.querySelectorAll(".extra").forEach(function (e) { e.classList.add("is-hidden"); });
              more.textContent = "▾ 顯示其餘 " + (pois.length - CAP) + " 個景點";
            }
          });
          card.appendChild(more);
        }
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

  // ---------- 天數快速跳轉列 ----------
  function buildDayNav() {
    var nav = document.getElementById("day-nav");
    DAYS.forEach(function (d) {
      var a = el("a", "day-chip" + (d.day === tripDay ? " is-today" : ""));
      a.href = "#day-" + d.day;
      a.textContent = d.day === tripDay ? "今天" : String(d.day);
      a.title = "Day " + d.day + "　" + d.date + "　" + d.title;
      nav.appendChild(a);
    });
    // 開啟時自動捲到今天
    if (tripDay) {
      var chip = nav.querySelector(".day-chip.is-today");
      if (chip) nav.scrollLeft = Math.max(0, chip.offsetLeft - nav.clientWidth / 2);
      var card = document.getElementById("day-" + tripDay);
      if (card) window.scrollTo({ top: card.offsetTop - 96, behavior: "auto" });
    }
  }

  render();
  buildDayNav();
  var titles = POIS.map(function (p) { return p.wiki; });
  Photos.loadAll(titles, fillPhotos, fillPhotos);
  fillPhotos(); // 已有快取時立即補上
})();
