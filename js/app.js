/* 義大利 2027 GPS 語音導覽
 * - Leaflet 地圖 + 瀏覽器 Geolocation 追蹤
 * - 進入景點觸發半徑（預設 10 公尺）自動以 zh-TW（台灣）語音播放導覽
 * - 模擬模式：點地圖假裝走到該處，方便在家測試
 */
(function () {
  "use strict";

  // ---------- state ----------
  var map, userMarker = null, accuracyCircle = null;
  var watchId = null;
  var simulateMode = false;
  var triggerRadius = 10; // metres
  var chosenVoice = null;
  var speaking = false;
  var speechQueue = [];
  var currentUtterance = null;
  var visited = {};
  var poiById = {};
  var poiLayers = {}; // id -> { marker, circle, listEl }
  var areaFilter = "";
  var wakeLock = null;

  try { visited = JSON.parse(localStorage.getItem("italy2027_visited") || "{}"); } catch (e) { visited = {}; }

  var AREA_COLORS = {
    "巴黎": "#d81b60",
    "羅馬": "#8e44ad",
    "梵蒂岡": "#f1c40f",
    "佛羅倫斯": "#c0392b",
    "比薩": "#d35400",
    "波爾扎諾": "#16a085",
    "卡雷扎湖": "#1abc9c",
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

  // ---------- speech (zh-TW, Taiwan accent) ----------
  function pickVoice() {
    var voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    if (!voices.length) return null;
    // 台灣國語優先：先找 zh-TW，再依名稱挑常見台灣語音
    var zhTW = voices.filter(function (v) { return /zh[-_]TW/i.test(v.lang); });
    var preferNames = /Mei-?Jia|美佳|HsiaoChen|曉臻|HsiaoYu|曉雨|Yating|雅婷|HanHan|涵涵|國語|Taiwan|臺灣|台灣/i;
    var best = zhTW.find(function (v) { return preferNames.test(v.name); });
    if (best) return best;
    if (zhTW.length) return zhTW[0];
    // 退而求其次：任何中文語音
    var zh = voices.find(function (v) { return /^zh/i.test(v.lang); });
    return zh || null;
  }

  function refreshVoice() { chosenVoice = pickVoice(); }

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
    function finish() {
      if (done) return;
      done = true;
      if (onend) onend();
    }
    u.onend = finish;
    u.onerror = finish;
    currentUtterance = u;
    showNowPlaying(label || text.slice(0, 40));
    speechSynthesis.speak(u);
    // 保險機制：若裝置沒有可用語音導致播放卡住，2 秒後檢查並自動跳過
    setTimeout(function () {
      if (!done && !speechSynthesis.speaking && !speechSynthesis.pending) finish();
    }, 2000);
  }

  function enqueuePoi(poi) {
    speechQueue.push(poi);
    processQueue();
  }

  function processQueue() {
    if (speaking || !speechQueue.length) return;
    speaking = true;
    var poi = speechQueue.shift();
    var full = poi.name + "。" + poi.text;
    speakText(full, "🔊 " + poi.name + "（" + poi.en + "）", function () {
      speaking = false;
      if (!speechQueue.length) hideNowPlaying();
      processQueue();
    });
  }

  function skipCurrent() {
    speechQueue = [];
    if (window.speechSynthesis) speechSynthesis.cancel();
    speaking = false;
    hideNowPlaying();
  }

  function showNowPlaying(text) {
    $("np-text").textContent = text;
    $("now-playing").classList.remove("hidden");
  }
  function hideNowPlaying() { $("now-playing").classList.add("hidden"); }

  // iOS/Safari 需在使用者手勢中先「解鎖」語音
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
      if (simulateMode) {
        handlePosition(e.latlng.lat, e.latlng.lng, 5, true);
      }
    });
  }

  function addPoiMarker(poi) {
    var color = AREA_COLORS[poi.area] || "#555";
    var isVisited = !!visited[poi.id];
    var marker = L.circleMarker([poi.lat, poi.lng], {
      radius: 8,
      color: "#fff",
      weight: 2,
      fillColor: isVisited ? "#999" : color,
      fillOpacity: 0.95
    }).addTo(map);

    var circle = L.circle([poi.lat, poi.lng], {
      radius: triggerRadius,
      color: color,
      weight: 1,
      fillColor: color,
      fillOpacity: 0.08,
      interactive: false
    }).addTo(map);

    var popupEl = document.createElement("div");
    popupEl.className = "poi-popup";
    popupEl.innerHTML =
      "<h3>" + poi.name + "</h3>" +
      '<div class="en">' + poi.en + "</div>" +
      '<span class="day-tag">Day ' + poi.day + "｜" + poi.area + "</span>" +
      "<p>" + poi.text + "</p>";
    var btn = document.createElement("button");
    btn.textContent = "🔊 播放導覽";
    btn.addEventListener("click", function () { enqueuePoi(poi); });
    popupEl.appendChild(btn);
    marker.bindPopup(popupEl);

    poiLayers[poi.id] = { marker: marker, circle: circle, listEl: null };
  }

  function updateTriggerCircles() {
    Object.keys(poiLayers).forEach(function (id) {
      poiLayers[id].circle.setRadius(triggerRadius);
    });
  }

  function setMarkerVisited(id) {
    var layer = poiLayers[id];
    if (layer) layer.marker.setStyle({ fillColor: "#999" });
    if (layer && layer.listEl) layer.listEl.classList.add("visited");
  }

  // ---------- geolocation ----------
  function startTracking() {
    if (!navigator.geolocation) {
      alert("此瀏覽器不支援定位功能。");
      return;
    }
    unlockSpeech();
    requestWakeLock();
    $("btn-start").classList.add("hidden");
    $("btn-stop").classList.remove("hidden");
    $("gps-status").textContent = "GPS：定位中…";
    watchId = navigator.geolocation.watchPosition(
      function (pos) {
        handlePosition(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, false);
      },
      function (err) {
        $("gps-status").textContent = "GPS 錯誤：" + err.message;
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );
  }

  function stopTracking() {
    if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
    $("btn-start").classList.remove("hidden");
    $("btn-stop").classList.add("hidden");
    $("gps-status").textContent = "GPS：已停止";
    releaseWakeLock();
  }

  var firstFix = true;
  function handlePosition(lat, lng, accuracy, isSim) {
    var latlng = [lat, lng];
    if (!userMarker) {
      var icon = L.divIcon({ className: "user-dot", iconSize: [18, 18] });
      userMarker = L.marker(latlng, { icon: icon, zIndexOffset: 1000 }).addTo(map);
      accuracyCircle = L.circle(latlng, {
        radius: accuracy, color: "#1976d2", weight: 1, fillOpacity: 0.12, interactive: false
      }).addTo(map);
    } else {
      userMarker.setLatLng(latlng);
      accuracyCircle.setLatLng(latlng).setRadius(accuracy);
    }

    if (firstFix || isSim) {
      map.setView(latlng, Math.max(map.getZoom(), 16));
      firstFix = false;
    }

    $("gps-status").textContent = (isSim ? "模擬位置" : "GPS") + "：精度 ±" + Math.round(accuracy) + "m";

    checkGeofences(lat, lng);
    updateNearest(lat, lng);
    updateListDistances(lat, lng);
  }

  function candidatePois() {
    return POIS.filter(function (p) { return !areaFilter || p.area === areaFilter; });
  }

  function checkGeofences(lat, lng) {
    candidatePois().forEach(function (poi) {
      if (visited[poi.id]) return;
      var d = haversine(lat, lng, poi.lat, poi.lng);
      if (d <= triggerRadius) {
        visited[poi.id] = Date.now();
        saveVisited();
        setMarkerVisited(poi.id);
        enqueuePoi(poi);
      }
    });
  }

  function updateNearest(lat, lng) {
    var best = null, bestD = Infinity;
    candidatePois().forEach(function (poi) {
      var d = haversine(lat, lng, poi.lat, poi.lng);
      if (d < bestD) { bestD = d; best = poi; }
    });
    if (best) {
      $("nearest").textContent = "最近景點：" + best.name + "（" + fmtDist(bestD) + "）";
    }
  }

  // ---------- wake lock（避免手機螢幕休眠中斷追蹤）----------
  function requestWakeLock() {
    if ("wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then(function (wl) {
        wakeLock = wl;
      }).catch(function () {});
    }
  }
  function releaseWakeLock() {
    if (wakeLock) { wakeLock.release().catch(function () {}); wakeLock = null; }
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && watchId !== null) requestWakeLock();
  });

  // ---------- side panel list ----------
  function buildList() {
    var container = $("poi-list");
    container.innerHTML = "";
    var areas = [];
    POIS.forEach(function (p) { if (areas.indexOf(p.area) === -1) areas.push(p.area); });

    areas.forEach(function (area) {
      if (areaFilter && area !== areaFilter) return;
      var pois = POIS.filter(function (p) { return p.area === area; });
      var details = document.createElement("details");
      var summary = document.createElement("summary");
      var days = pois.map(function (p) { return p.day; });
      var dayMin = Math.min.apply(null, days), dayMax = Math.max.apply(null, days);
      var dayLabel = dayMin === dayMax ? "Day " + dayMin : "Day " + dayMin + "–" + dayMax;
      summary.innerHTML = area + ' <span class="count">' + dayLabel + "｜" + pois.length + " 個景點</span>";
      details.appendChild(summary);

      pois.forEach(function (poi) {
        var item = document.createElement("div");
        item.className = "poi-item" + (visited[poi.id] ? " visited" : "");
        var info = document.createElement("div");
        info.className = "info";
        info.innerHTML = '<div class="name">' + poi.name + '</div>' +
          '<div class="meta">' + poi.en + '｜Day ' + poi.day +
          ' <span class="dist" data-id="' + poi.id + '"></span></div>';
        info.addEventListener("click", function () {
          map.setView([poi.lat, poi.lng], 17);
          poiLayers[poi.id].marker.openPopup();
          $("panel").classList.add("hidden");
        });
        var playBtn = document.createElement("button");
        playBtn.textContent = "🔊";
        playBtn.title = "播放導覽";
        playBtn.addEventListener("click", function () { unlockSpeech(); enqueuePoi(poi); });
        item.appendChild(info);
        item.appendChild(playBtn);
        details.appendChild(item);
        poiLayers[poi.id].listEl = item;
      });
      container.appendChild(details);
    });
  }

  function updateListDistances(lat, lng) {
    var spans = document.querySelectorAll("#poi-list .dist");
    for (var i = 0; i < spans.length; i++) {
      var poi = poiById[spans[i].getAttribute("data-id")];
      if (poi) spans[i].textContent = "｜" + fmtDist(haversine(lat, lng, poi.lat, poi.lng));
    }
  }

  // ---------- area filter ----------
  function buildAreaFilter() {
    var sel = $("area-filter");
    var areas = [];
    POIS.forEach(function (p) { if (areas.indexOf(p.area) === -1) areas.push(p.area); });
    areas.forEach(function (a) {
      var opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", function () {
      areaFilter = sel.value;
      buildList();
      Object.keys(poiLayers).forEach(function (id) {
        var poi = poiById[id];
        var show = !areaFilter || poi.area === areaFilter;
        var layer = poiLayers[id];
        if (show) { layer.marker.addTo(map); layer.circle.addTo(map); }
        else { map.removeLayer(layer.marker); map.removeLayer(layer.circle); }
      });
    });
  }

  // ---------- wire up UI ----------
  function bindUI() {
    $("btn-start").addEventListener("click", startTracking);
    $("btn-stop").addEventListener("click", stopTracking);
    $("btn-skip").addEventListener("click", skipCurrent);
    $("btn-panel").addEventListener("click", function () { $("panel").classList.toggle("hidden"); });
    $("btn-close-panel").addEventListener("click", function () { $("panel").classList.add("hidden"); });

    $("btn-test-voice").addEventListener("click", function () {
      unlockSpeech();
      refreshVoice();
      var name = chosenVoice ? chosenVoice.name + "（" + chosenVoice.lang + "）" : "系統預設";
      speakText("大家好，歡迎參加義大利二〇二七之旅。目前使用的語音是：" + name + "。祝你旅途愉快！",
        "🔊 語音測試：" + name,
        function () { hideNowPlaying(); });
    });

    $("chk-sim").addEventListener("change", function () {
      simulateMode = this.checked;
      if (simulateMode) {
        $("gps-status").textContent = "模擬模式：點擊地圖任一處假裝走到該位置";
      }
    });

    $("radius").addEventListener("input", function () {
      triggerRadius = parseInt(this.value, 10);
      $("radius-value").textContent = triggerRadius;
      updateTriggerCircles();
    });

    $("btn-reset-visited").addEventListener("click", function () {
      if (!confirm("確定要清除所有「已播放」紀錄嗎？所有景點將可重新自動播放。")) return;
      visited = {};
      saveVisited();
      Object.keys(poiLayers).forEach(function (id) {
        var poi = poiById[id];
        var color = AREA_COLORS[poi.area] || "#555";
        poiLayers[id].marker.setStyle({ fillColor: color });
        if (poiLayers[id].listEl) poiLayers[id].listEl.classList.remove("visited");
      });
    });
  }

  // ---------- boot ----------
  initMap();
  buildAreaFilter();
  buildList();
  bindUI();

  // 測試用掛鉤：可在瀏覽器 console 呼叫 __tour.simulateAt(緯度, 經度) 模擬走到某處
  window.__tour = {
    map: map,
    simulateAt: function (lat, lng) { handlePosition(lat, lng, 5, true); }
  };
})();
