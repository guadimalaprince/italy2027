/* 義大利 2027 GPS 語音導覽
 * - Leaflet 地圖 + 瀏覽器 Geolocation 追蹤
 * - 進入景點觸發半徑（預設 10 公尺）自動以 zh-TW（台灣）語音播放導覽
 * - 「今天」模式：依實際日期自動只顯示當天景點
 * - 模擬模式：點地圖假裝走到該處，方便在家測試
 */
(function () {
  "use strict";

  // ---------- 行程日期 ----------
  var TRIP_START = new Date(2027, 5, 3);   // Day 1 = 2027/6/3
  var TRIP_DAYS = 22;

  function daysFromStart() {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((today - TRIP_START) / 86400000) + 1;
  }

  // 實際的今天是第幾天；行程外回傳 null
  var rawDay = daysFromStart();
  var tripDay = (rawDay >= 1 && rawDay <= TRIP_DAYS) ? rawDay : null;
  // 「只看今天」實際採用的日子：行程外預覽 Day 1（出發前）或最後一天（結束後）
  var focusDay = tripDay || (rawDay < 1 ? 1 : TRIP_DAYS);

  function dayMeta(d) {
    if (typeof DAYS === "undefined") return null;
    for (var i = 0; i < DAYS.length; i++) if (DAYS[i].day === d) return DAYS[i];
    return null;
  }

  // ---------- state ----------
  var map, userMarker = null, accuracyCircle = null;
  var watchId = null;
  var simulateMode = false;
  var triggerRadius = 10;
  var chosenVoice = null;
  var speaking = false;
  var speechQueue = [];
  var playingId = null;
  var paused = false;
  var visited = {};
  var poiById = {};
  var poiLayers = {};
  var areaFilter = "";
  var todayOnly = false;
  var searchTerm = "";
  var wakeLock = null;
  var lastAccuracy = null;
  var MAX_PENDING = 3;   // 佇列上限，避免走過頭還在播前面的點

  try { visited = JSON.parse(localStorage.getItem("italy2027_visited") || "{}"); } catch (e) { visited = {}; }
  try { triggerRadius = parseInt(localStorage.getItem("italy2027_radius"), 10) || 10; } catch (e) {}
  try { todayOnly = localStorage.getItem("italy2027_today_only") === "1"; } catch (e) {}

  var AREA_COLORS = {
    "巴黎": "#d81b60",
    "拿坡里": "#ef6c00",
    "龐貝": "#795548",
    "羅馬": "#8e44ad",
    "梵蒂岡": "#f1c40f",
    "佛羅倫斯": "#c0392b",
    "比薩": "#d35400",
    "波爾扎諾": "#16a085",
    "卡雷扎湖 / Rosengarten": "#1abc9c",
    "Val Gardena": "#27ae60",
    "Val di Funes": "#8d6e63",
    "Dobbiaco / Tre Cime": "#2980b9",
    "Alta Via 1": "#2c3e50",
    "Cortina": "#e67e22",
    "慕尼黑": "#3498db"
  };

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }

  function haversine(lat1, lng1, lat2, lng2) {
    var R = 6371000;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function fmtDist(m) {
    if (m >= 1000) return (m / 1000).toFixed(1) + " 公里";
    return Math.round(m) + " 公尺";
  }

  function saveVisited() {
    try { localStorage.setItem("italy2027_visited", JSON.stringify(visited)); } catch (e) {}
  }

  function colorOf(area) { return AREA_COLORS[area] || "#555"; }

  // ---------- speech (zh-TW, Taiwan accent) ----------
  function pickVoice() {
    var voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    if (!voices.length) return null;
    var zhTW = voices.filter(function (v) { return /zh[-_]TW/i.test(v.lang); });
    var preferNames = /Mei-?Jia|美佳|HsiaoChen|曉臻|HsiaoYu|曉雨|Yating|雅婷|HanHan|涵涵|國語|Taiwan|臺灣|台灣/i;
    var best = zhTW.find(function (v) { return preferNames.test(v.name); });
    if (best) return best;
    if (zhTW.length) return zhTW[0];
    var zh = voices.find(function (v) { return /^zh/i.test(v.lang); });
    return zh || null;
  }

  function refreshVoice() {
    chosenVoice = pickVoice();
    var el = $("voice-name");
    if (el) el.textContent = chosenVoice
      ? "目前語音：" + chosenVoice.name + "（" + chosenVoice.lang + "）"
      : "找不到中文語音，請到手機設定下載中文（台灣）語音。";
  }

  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = refreshVoice;
    refreshVoice();
  }

  function speakText(text, label, onend) {
    if (!window.speechSynthesis) {
      alert("此瀏覽器不支援語音合成（Web Speech API），請改用 Safari 或 Chrome。");
      if (onend) onend();
      return;
    }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-TW";
    if (!chosenVoice) refreshVoice();
    if (chosenVoice) u.voice = chosenVoice;
    u.rate = 0.95;
    u.pitch = 1.0;
    var done = false;
    function finish() { if (done) return; done = true; if (onend) onend(); }
    u.onend = finish;
    u.onerror = finish;
    showNowPlaying(label || text.slice(0, 40));
    speechSynthesis.speak(u);
    setTimeout(function () {
      if (!done && !speechSynthesis.speaking && !speechSynthesis.pending) finish();
    }, 2000);
  }

  function enqueuePoi(poi) {
    if (playingId === poi.id) return;
    for (var i = 0; i < speechQueue.length; i++) if (speechQueue[i].id === poi.id) return;
    speechQueue.push(poi);
    // 佇列太長就丟掉最舊的：人已經走過去了，聽舊的沒意義
    while (speechQueue.length > MAX_PENDING) speechQueue.shift();
    updateQueueLabel();
    processQueue();
  }

  function processQueue() {
    if (speaking || !speechQueue.length) return;
    speaking = true;
    paused = false;
    $("btn-pause").textContent = "⏸";
    var poi = speechQueue.shift();
    playingId = poi.id;
    markPlaying(poi.id, true);
    updateQueueLabel();
    speakText(poi.name + "。" + poi.text, "🔊 " + poi.name + "（" + poi.en + "）", function () {
      markPlaying(poi.id, false);
      playingId = null;
      speaking = false;
      if (!speechQueue.length) hideNowPlaying();
      processQueue();
    });
  }

  // 只跳過目前這一段，後面排隊的照常播
  function skipCurrent() {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    if (!speaking) { hideNowPlaying(); return; }
    // cancel() 會觸發 onend，佇列自動接續
  }

  function togglePause() {
    if (!window.speechSynthesis || !speaking) return;
    if (paused) { speechSynthesis.resume(); paused = false; $("btn-pause").textContent = "⏸"; }
    else { speechSynthesis.pause(); paused = true; $("btn-pause").textContent = "▶"; }
  }

  function updateQueueLabel() {
    var el = $("np-queue");
    if (speechQueue.length) {
      el.textContent = "還有 " + speechQueue.length + " 段待播";
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  }

  function markPlaying(id, on) {
    var layer = poiLayers[id];
    if (!layer) return;
    var el = layer.marker.getElement && layer.marker.getElement();
    if (el) el.classList[on ? "add" : "remove"]("poi-playing");
    if (layer.listEl) layer.listEl.classList[on ? "add" : "remove"]("playing");
  }

  function showNowPlaying(text) {
    $("np-text").textContent = text;
    $("now-playing").classList.remove("hidden");
    document.body.classList.add("is-playing");
  }
  function hideNowPlaying() {
    $("now-playing").classList.add("hidden");
    document.body.classList.remove("is-playing");
    updateQueueLabel();
  }

  function unlockSpeech() {
    if (!window.speechSynthesis) return;
    try {
      var u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ---------- map ----------
  function initMap() {
    map = L.map("map", { zoomControl: true }).setView([44.5, 11.5], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    POIS.forEach(function (poi) {
      poiById[poi.id] = poi;
      addPoiMarker(poi);
    });

    map.on("click", function (e) {
      if (simulateMode) handlePosition(e.latlng.lat, e.latlng.lng, 5, true);
    });
  }

  function addPoiMarker(poi) {
    var color = colorOf(poi.area);
    var marker = L.circleMarker([poi.lat, poi.lng], {
      radius: 9, color: "#fff", weight: 2,
      fillColor: visited[poi.id] ? "#999" : color, fillOpacity: 0.95
    });

    var circle = L.circle([poi.lat, poi.lng], {
      radius: triggerRadius, color: color, weight: 1,
      fillColor: color, fillOpacity: 0.08, interactive: false
    });

    var popupEl = document.createElement("div");
    popupEl.className = "poi-popup";
    popupEl.innerHTML =
      '<div class="popup-photo"></div>' +
      "<h3>" + poi.name + "</h3>" +
      '<div class="en">' + poi.en + "</div>" +
      '<span class="day-tag">Day ' + poi.day + "｜" + poi.area + "</span>" +
      "<p>" + poi.text + "</p>";
    var btn = document.createElement("button");
    btn.textContent = "🔊 播放導覽";
    btn.addEventListener("click", function () { unlockSpeech(); enqueuePoi(poi); });
    popupEl.appendChild(btn);
    marker.bindPopup(popupEl);

    marker.on("popupopen", function () {
      var slot = popupEl.querySelector(".popup-photo");
      var src = (window.Photos && Photos.get(poi.wiki)) || "";
      if (src && slot && !slot.firstChild) {
        var img = document.createElement("img");
        img.alt = "";
        img.onload = function () { marker.getPopup().update(); };
        img.onerror = function () { slot.innerHTML = ""; };
        img.src = src;
        slot.appendChild(img);
      }
    });

    poiLayers[poi.id] = { marker: marker, circle: circle, listEl: null, shown: false };
  }

  // 依「今天／區域」篩選，決定哪些景點要出現在地圖與清單
  function isInScope(poi) {
    if (todayOnly && poi.day !== focusDay) return false;
    if (areaFilter && poi.area !== areaFilter) return false;
    return true;
  }

  function refreshMapLayers() {
    POIS.forEach(function (poi) {
      var layer = poiLayers[poi.id];
      var want = isInScope(poi);
      if (want && !layer.shown) { layer.marker.addTo(map); layer.circle.addTo(map); layer.shown = true; }
      else if (!want && layer.shown) { map.removeLayer(layer.marker); map.removeLayer(layer.circle); layer.shown = false; }
    });
  }

  function updateTriggerCircles() {
    Object.keys(poiLayers).forEach(function (id) { poiLayers[id].circle.setRadius(triggerRadius); });
  }

  function setMarkerVisited(id) {
    var layer = poiLayers[id];
    if (layer) layer.marker.setStyle({ fillColor: "#999" });
    if (layer && layer.listEl) layer.listEl.classList.add("visited");
  }

  // ---------- geolocation ----------
  function startTracking() {
    if (!navigator.geolocation) { alert("此瀏覽器不支援定位功能。"); return; }
    unlockSpeech();
    requestWakeLock();
    $("btn-start").classList.add("hidden");
    $("btn-stop").classList.remove("hidden");
    $("gps-status").textContent = "GPS：定位中…";
    watchId = navigator.geolocation.watchPosition(
      function (pos) { handlePosition(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, false); },
      function (err) {
        $("gps-status").textContent = err.code === 1
          ? "⚠ 定位權限被拒，請到瀏覽器設定開啟"
          : "⚠ GPS 錯誤：" + err.message;
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );
  }

  function stopTracking() {
    if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
    $("btn-start").classList.remove("hidden");
    $("btn-stop").classList.add("hidden");
    $("gps-status").textContent = "GPS：已停止";
    $("accuracy-hint").classList.add("hidden");
    releaseWakeLock();
  }

  var firstFix = true;
  function handlePosition(lat, lng, accuracy, isSim) {
    var latlng = [lat, lng];
    if (!userMarker) {
      userMarker = L.marker(latlng, { icon: L.divIcon({ className: "user-dot", iconSize: [18, 18] }), zIndexOffset: 1000 }).addTo(map);
      accuracyCircle = L.circle(latlng, { radius: accuracy, color: "#1976d2", weight: 1, fillOpacity: 0.12, interactive: false }).addTo(map);
    } else {
      userMarker.setLatLng(latlng);
      accuracyCircle.setLatLng(latlng).setRadius(accuracy);
    }

    if (firstFix || isSim) { map.setView(latlng, Math.max(map.getZoom(), 16)); firstFix = false; }

    lastAccuracy = accuracy;
    $("gps-status").textContent = (isSim ? "模擬位置" : "GPS") + "：精度 ±" + Math.round(accuracy) + "m";
    checkAccuracyHint(accuracy);
    checkGeofences(lat, lng);
    updateNearest(lat, lng);
    updateListDistances(lat, lng);
  }

  // GPS 精度比觸發半徑還差時，主動建議調大——否則會「走到門口卻沒播」
  function suggestedRadius(accuracy) {
    return Math.max(10, Math.min(100, Math.ceil(accuracy * 1.5 / 5) * 5));
  }

  function checkAccuracyHint(accuracy) {
    var box = $("accuracy-hint");
    if (accuracy > triggerRadius && suggestedRadius(accuracy) > triggerRadius) {
      var s = suggestedRadius(accuracy);
      $("accuracy-hint-text").textContent =
        "GPS 精度只有 ±" + Math.round(accuracy) + "m，比觸發距離 " + triggerRadius + "m 還大，可能不會自動播放。建議改成 " + s + "m。";
      $("btn-apply-radius").textContent = "改成 " + s + "m";
      $("btn-apply-radius").dataset.value = s;
      box.classList.remove("hidden");
    } else {
      box.classList.add("hidden");
    }
  }

  function checkGeofences(lat, lng) {
    POIS.forEach(function (poi) {
      if (!isInScope(poi) || visited[poi.id]) return;
      if (haversine(lat, lng, poi.lat, poi.lng) <= triggerRadius) {
        visited[poi.id] = Date.now();
        saveVisited();
        setMarkerVisited(poi.id);
        enqueuePoi(poi);
      }
    });
  }

  var nearestPoi = null;
  function updateNearest(lat, lng) {
    var best = null, bestD = Infinity;
    POIS.forEach(function (poi) {
      if (!isInScope(poi)) return;
      var d = haversine(lat, lng, poi.lat, poi.lng);
      if (d < bestD) { bestD = d; best = poi; }
    });
    nearestPoi = best;
    $("nearest").textContent = best ? "📍 " + best.name + "　" + fmtDist(bestD) : "—";
  }

  // ---------- wake lock ----------
  function requestWakeLock() {
    if ("wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then(function (wl) { wakeLock = wl; }).catch(function () {});
    }
  }
  function releaseWakeLock() {
    if (wakeLock) { wakeLock.release().catch(function () {}); wakeLock = null; }
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && watchId !== null) requestWakeLock();
  });

  // ---------- 景點清單 ----------
  // 名稱、原文、區域都找不到時再找導覽稿內文（例如搜「一戰」「維蘇威」「米開朗基羅」）
  function matchesSearch(poi) {
    if (!searchTerm) return true;
    var q = searchTerm.toLowerCase();
    return poi.name.toLowerCase().indexOf(q) >= 0 ||
           poi.en.toLowerCase().indexOf(q) >= 0 ||
           poi.area.toLowerCase().indexOf(q) >= 0 ||
           poi.text.indexOf(searchTerm) >= 0;
  }

  function makeItem(poi, showDay) {
    var item = document.createElement("div");
    item.className = "poi-item" + (visited[poi.id] ? " visited" : "");
    var info = document.createElement("div");
    info.className = "info";
    info.innerHTML = '<div class="name">' + poi.name + "</div>" +
      '<div class="meta">' + poi.en + (showDay ? "｜Day " + poi.day + "・" + poi.area : "｜Day " + poi.day) +
      ' <span class="dist" data-id="' + poi.id + '"></span></div>';
    info.addEventListener("click", function () { focusPoi(poi.id); });
    var playBtn = document.createElement("button");
    playBtn.textContent = "🔊";
    playBtn.setAttribute("aria-label", "播放 " + poi.name + " 的語音導覽");
    playBtn.addEventListener("click", function () { unlockSpeech(); enqueuePoi(poi); });
    item.appendChild(info);
    item.appendChild(playBtn);
    poiLayers[poi.id].listEl = item;
    return item;
  }

  function buildList() {
    var container = $("poi-list");
    container.innerHTML = "";

    var pool = POIS.filter(function (p) {
      return isInScope(p) && matchesSearch(p);
    });

    if (!pool.length) {
      var empty = document.createElement("div");
      empty.id = "poi-empty";
      empty.textContent = searchTerm ? "找不到「" + searchTerm + "」相關的景點。"
        : (todayOnly ? "今天（Day " + focusDay + "）在這個篩選下沒有景點。" : "沒有符合的景點。");
      container.appendChild(empty);
      return;
    }

    // 搜尋時直接給扁平清單，不分組
    if (searchTerm) {
      pool.forEach(function (poi) { container.appendChild(makeItem(poi, true)); });
      return;
    }

    var areas = [];
    pool.forEach(function (p) { if (areas.indexOf(p.area) === -1) areas.push(p.area); });

    areas.forEach(function (area) {
      var pois = pool.filter(function (p) { return p.area === area; });
      var details = document.createElement("details");
      if (todayOnly || areas.length === 1) details.open = true;
      var summary = document.createElement("summary");
      var days = pois.map(function (p) { return p.day; });
      var dMin = Math.min.apply(null, days), dMax = Math.max.apply(null, days);
      var dayLabel = dMin === dMax ? "Day " + dMin : "Day " + dMin + "–" + dMax;
      summary.innerHTML = '<span class="swatch" style="background:' + colorOf(area) + '"></span>' +
        area + ' <span class="count">' + dayLabel + "｜" + pois.length + " 個</span>";
      details.appendChild(summary);
      pois.forEach(function (poi) { details.appendChild(makeItem(poi, false)); });
      container.appendChild(details);
    });
  }

  function focusPoi(id) {
    var poi = poiById[id];
    if (!poi) return;
    if (!poiLayers[id].shown) { poiLayers[id].marker.addTo(map); poiLayers[id].shown = true; }
    map.setView([poi.lat, poi.lng], 17);
    poiLayers[id].marker.openPopup();
    closePanel();
  }

  function updateListDistances(lat, lng) {
    var spans = document.querySelectorAll("#poi-list .dist");
    for (var i = 0; i < spans.length; i++) {
      var poi = poiById[spans[i].getAttribute("data-id")];
      if (poi) spans[i].textContent = "｜" + fmtDist(haversine(lat, lng, poi.lat, poi.lng));
    }
  }

  // ---------- 今天 ----------
  function applyTodayState() {
    var btn = $("btn-today");
    btn.classList.toggle("is-active", todayOnly);
    btn.setAttribute("aria-pressed", todayOnly ? "true" : "false");
    document.querySelectorAll(".scope-btn").forEach(function (b) {
      b.classList.toggle("is-active", (b.dataset.scope === "today") === todayOnly);
    });
    try { localStorage.setItem("italy2027_today_only", todayOnly ? "1" : "0"); } catch (e) {}
    refreshMapLayers();
    buildList();
  }

  function renderDayBadge() {
    var meta = dayMeta(focusDay);
    var num = $("day-badge-num"), date = $("day-badge-date");
    if (tripDay) {
      num.textContent = "Day " + tripDay;
      date.textContent = meta ? meta.date + "・" + (meta.areas ? meta.areas[0] : "") : "";
    } else if (rawDay < 1) {
      num.textContent = "出發倒數 " + (1 - rawDay) + " 天";
      date.textContent = "預覽 D1";
    } else {
      num.textContent = "行程已結束";
      date.textContent = "預覽 D" + TRIP_DAYS;
    }
  }

  // ---------- 面板 / 設定 ----------
  function openPanel() {
    $("panel").classList.remove("hidden");
    $("panel-backdrop").classList.remove("hidden");
  }
  function closePanel() {
    $("panel").classList.add("hidden");
    $("panel-backdrop").classList.add("hidden");
  }
  function openSettings() { $("settings-sheet").classList.remove("hidden"); $("panel-backdrop").classList.remove("hidden"); }
  function closeSettings() { $("settings-sheet").classList.add("hidden"); $("panel-backdrop").classList.add("hidden"); }

  function buildAreaFilter() {
    var sel = $("area-filter");
    var areas = [];
    POIS.forEach(function (p) { if (areas.indexOf(p.area) === -1) areas.push(p.area); });
    areas.forEach(function (a) {
      var opt = document.createElement("option");
      opt.value = a; opt.textContent = a;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", function () {
      areaFilter = sel.value;
      refreshMapLayers();
      buildList();
    });
  }

  function setRadius(v) {
    triggerRadius = v;
    $("radius").value = v;
    $("radius-value").textContent = v;
    try { localStorage.setItem("italy2027_radius", String(v)); } catch (e) {}
    updateTriggerCircles();
    if (lastAccuracy !== null) checkAccuracyHint(lastAccuracy);
  }

  function bindUI() {
    $("btn-start").addEventListener("click", startTracking);
    $("btn-stop").addEventListener("click", stopTracking);
    $("btn-skip").addEventListener("click", skipCurrent);
    $("btn-pause").addEventListener("click", togglePause);

    $("btn-panel").addEventListener("click", openPanel);
    $("btn-close-panel").addEventListener("click", closePanel);
    $("btn-settings").addEventListener("click", openSettings);
    $("btn-close-settings").addEventListener("click", closeSettings);
    $("panel-backdrop").addEventListener("click", function () { closePanel(); closeSettings(); });

    $("btn-today").addEventListener("click", function () { todayOnly = !todayOnly; applyTodayState(); });
    document.querySelectorAll(".scope-btn").forEach(function (b) {
      b.addEventListener("click", function () { todayOnly = b.dataset.scope === "today"; applyTodayState(); });
    });

    $("nearest").addEventListener("click", function () { if (nearestPoi) focusPoi(nearestPoi.id); });

    var searchEl = $("poi-search");
    searchEl.addEventListener("input", function () { searchTerm = searchEl.value.trim(); buildList(); });

    $("btn-apply-radius").addEventListener("click", function () {
      setRadius(parseInt(this.dataset.value, 10));
      $("accuracy-hint").classList.add("hidden");
    });

    $("btn-test-voice").addEventListener("click", function () {
      unlockSpeech();
      refreshVoice();
      var name = chosenVoice ? chosenVoice.name + "（" + chosenVoice.lang + "）" : "系統預設";
      speakText("大家好，歡迎參加義大利二〇二七之旅。目前使用的語音是：" + name + "。祝你旅途愉快！",
        "🔊 語音測試：" + name, hideNowPlaying);
    });

    $("chk-sim").addEventListener("change", function () {
      simulateMode = this.checked;
      if (simulateMode) {
        $("gps-status").textContent = "模擬模式：點地圖任一處";
        closeSettings();
      }
    });

    $("radius").addEventListener("input", function () { setRadius(parseInt(this.value, 10)); });

    $("btn-reset-visited").addEventListener("click", function () {
      if (!confirm("確定要清除所有「已播放」紀錄嗎？所有景點將可重新自動播放。")) return;
      visited = {};
      saveVisited();
      Object.keys(poiLayers).forEach(function (id) {
        poiLayers[id].marker.setStyle({ fillColor: colorOf(poiById[id].area) });
        if (poiLayers[id].listEl) poiLayers[id].listEl.classList.remove("visited");
      });
      closeSettings();
    });
  }

  // ---------- boot ----------
  initMap();
  buildAreaFilter();
  renderDayBadge();
  setRadius(triggerRadius);
  applyTodayState();          // 內含 refreshMapLayers + buildList
  bindUI();

  if (window.Photos) Photos.loadAll(POIS.map(function (p) { return p.wiki; }), null, null);

  // 從行程頁跳轉：index.html?poi=<id>
  var qp = /[?&]poi=([^&]+)/.exec(location.search);
  if (qp) {
    var target = poiById[decodeURIComponent(qp[1])];
    if (target) {
      if (todayOnly && target.day !== focusDay) { todayOnly = false; applyTodayState(); }
      map.setView([target.lat, target.lng], 17);
      setTimeout(function () { poiLayers[target.id].marker.openPopup(); }, 300);
    }
  }

  // 測試掛鉤
  window.__tour = {
    map: map,
    simulateAt: function (lat, lng, acc) { handlePosition(lat, lng, acc || 5, true); },
    setDay: function (d) { focusDay = d; tripDay = d; renderDayBadge(); applyTodayState(); },
    state: function () { return { focusDay: focusDay, todayOnly: todayOnly, queue: speechQueue.length, radius: triggerRadius }; }
  };
})();
