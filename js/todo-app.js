/* 待辦頁：必訂項目、住宿安排、交通規劃（含罷工備案） */
(function () {
  "use strict";

  var KEY = "italy2027_todo_v1";
  var done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { done = {}; }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // 資料裡允許 <b> <strong> 與換行，其餘轉義
  function rich(s) {
    return esc(s).replace(/&lt;(\/?(?:b|strong))&gt;/g, "<$1>").replace(/\n/g, "<br>");
  }

  var today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  function daysUntil(iso) {
    if (!iso) return null;
    var p = iso.split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return Math.round((d - today) / 86400000);
  }
  function fmtDate(iso) {
    var p = iso.split("-");
    return p[0] + "/" + (+p[1]) + "/" + (+p[2]);
  }

  // ---------- 出發倒數 ----------
  function renderCountdown() {
    var n = daysUntil(TRIP_DEPART);
    var box = document.getElementById("countdown");
    if (n > 0) box.innerHTML = "距離出發還有 <strong>" + n + "</strong> 天　<span>（" + fmtDate(TRIP_DEPART) + " 台北起飛）</span>";
    else if (n === 0) box.innerHTML = "<strong>今天出發！</strong>";
    else box.innerHTML = "行程進行中或已結束";
  }

  // ---------- 勾選列 ----------
  function checkRow(id, cls) {
    var row = el("div", cls + (done[id] ? " is-done" : ""));
    var cb = el("input");
    cb.type = "checkbox";
    cb.id = "cb-" + id;
    cb.checked = !!done[id];
    cb.addEventListener("change", function () {
      if (cb.checked) done[id] = Date.now(); else delete done[id];
      save();
      row.classList.toggle("is-done", cb.checked);
      renderProgress();
    });
    row.appendChild(cb);
    return { row: row, cb: cb };
  }

  // ---------- 必訂項目 ----------
  function renderBook() {
    var box = document.getElementById("book-list");
    box.innerHTML = "";
    var list = MUST_BOOK.slice().sort(function (a, b) {
      var da = a.opens ? daysUntil(a.opens) : 9999;
      var db = b.opens ? daysUntil(b.opens) : 9999;
      return da - db;
    });

    list.forEach(function (it) {
      var r = checkRow(it.id, "todo-item");
      var body = el("label", "ti-body");
      body.setAttribute("for", "cb-" + it.id);

      var head = el("div", "ti-head");
      head.appendChild(el("span", "ti-cat", esc(it.cat)));

      var n = daysUntil(it.opens);
      var chip;
      if (it.opens === null) {
        chip = el("span", "ti-when now", "隨時可訂");
      } else if (n > 0) {
        chip = el("span", "ti-when " + (n <= 45 ? "soon" : "later"),
          fmtDate(it.opens) + " 開放（" + n + " 天後）");
      } else {
        chip = el("span", "ti-when now", fmtDate(it.opens) + " 已開放");
      }
      head.appendChild(chip);
      body.appendChild(head);

      body.appendChild(el("div", "ti-title", esc(it.title) + (it.who ? ' <span class="ti-who">' + esc(it.who) + "</span>" : "")));
      if (it.note) body.appendChild(el("div", "ti-note", rich(it.note)));
      r.row.appendChild(body);

      if (it.url) {
        var a = el("a", "ti-link", "↗");
        a.href = it.url; a.target = "_blank"; a.rel = "noopener";
        a.setAttribute("aria-label", "開啟 " + it.title + " 官網");
        r.row.appendChild(a);
      }
      box.appendChild(r.row);
    });
  }

  // ---------- 住宿安排（由 DAYS 生成） ----------
  var STAY_LABEL = { confirmed: "✅ 已訂", suggested: "💡 待訂", hut: "🛖 山屋", none: "—" };

  function renderStay() {
    var box = document.getElementById("stay-list");
    box.innerHTML = "";
    var lastCity = null;

    DAYS.forEach(function (d) {
      if (!d.stay || d.stay.status === "none") return;
      var isSame = /同前晚/.test(d.stay.name);
      var id = "stay-" + d.day;
      var r = checkRow(id, "stay-item " + d.stay.status + (isSame ? " is-cont" : ""));
      var body = el("label", "ti-body");
      body.setAttribute("for", "cb-" + id);

      var head = el("div", "ti-head");
      head.appendChild(el("span", "st-date", esc(d.date.replace(/\s.*/, ""))));
      head.appendChild(el("span", "st-badge " + d.stay.status, STAY_LABEL[d.stay.status] || ""));
      head.appendChild(el("span", "st-city", esc(d.stay.city)));
      body.appendChild(head);

      if (!isSame) body.appendChild(el("div", "ti-title", esc(d.stay.name)));

      var b = d.stay.booking;
      if (b) {
        var due = b.total - b.paid;
        body.appendChild(el("div", "st-money",
          esc(b.room) + "　總額 €" + b.total +
          (b.people ? "（" + b.people + " 人，每人 €" + Math.round(b.total / b.people) + "）" : "") +
          "　已付 €" + b.paid + '　<strong class="bk-due">待付 €' + due + "</strong>"));
      } else if (d.stay.note) {
        body.appendChild(el("div", "ti-note", esc(d.stay.note)));
      }
      r.row.appendChild(body);
      box.appendChild(r.row);
      lastCity = d.stay.city;
    });

    // 山屋費用小計
    var bks = DAYS.filter(function (d) { return d.stay && d.stay.booking; });
    if (bks.length) {
      var total = 0, paid = 0;
      bks.forEach(function (d) { total += d.stay.booking.total; paid += d.stay.booking.paid; });
      var people = bks[0].stay.booking.people || 1;
      box.appendChild(el("div", "st-sum",
        "已訂山屋小計：總額 €" + total + "　已付 €" + paid +
        '　<strong class="bk-due">現場待付 €' + (total - paid) +
        "</strong>（每人約 €" + Math.round((total - paid) / people) + "）　— 山屋多半只收現金"));
    }
  }

  // ---------- 交通規劃 ----------
  var RISK = { high: "高", med: "中", low: "低" };

  function renderMove() {
    var box = document.getElementById("move-list");
    box.innerHTML = "";
    LEGS.forEach(function (lg) {
      var card = el("div", "leg-card risk-" + lg.risk);
      var head = el("div", "lc-head");
      head.appendChild(el("span", "lc-date", esc(lg.date)));
      head.appendChild(el("span", "lc-leg", lg.mode + " " + esc(lg.leg)));
      head.appendChild(el("span", "lc-risk " + lg.risk, "罷工風險 " + RISK[lg.risk]));
      card.appendChild(head);
      card.appendChild(el("div", "lc-plan", "<b>主方案</b>　" + rich(lg.plan)));
      card.appendChild(el("div", "lc-fb", "<b>備案</b>　" + rich(lg.fallback)));
      box.appendChild(card);
    });
  }

  // ---------- 罷工總則 ----------
  function renderStrike() {
    var box = document.getElementById("strike-list");
    box.innerHTML = "";
    STRIKE_TIPS.forEach(function (s) {
      var d = el("div", "tip");
      d.appendChild(el("div", "tip-t", esc(s.t)));
      d.appendChild(el("div", "tip-d", rich(s.d)));
      box.appendChild(d);
    });
  }

  // ---------- 進度 ----------
  function renderProgress() {
    var bd = MUST_BOOK.filter(function (i) { return done[i.id]; }).length;
    document.getElementById("book-progress").textContent = bd + " / " + MUST_BOOK.length;
    var stays = DAYS.filter(function (d) { return d.stay && d.stay.status !== "none"; });
    var sd = stays.filter(function (d) { return done["stay-" + d.day]; }).length;
    document.getElementById("stay-progress").textContent = sd + " / " + stays.length;
  }

  // ---------- boot ----------
  renderCountdown();
  renderBook();
  renderStay();
  renderMove();
  renderStrike();
  renderProgress();

  document.getElementById("btn-reset-todo").addEventListener("click", function () {
    if (!confirm("確定清除所有勾選紀錄嗎？")) return;
    done = {};
    save();
    renderBook(); renderStay(); renderProgress();
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
