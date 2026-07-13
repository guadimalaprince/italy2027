# 🇮🇹 Italy 2027 — GPS 語音導覽網站

義大利 21 天行程（佛羅倫斯 → 羅馬 → 多洛米蒂 Alta Via 1 → 國王湖 → 慕尼黑）的
**GPS 定位語音導覽網站**：地圖即時追蹤你的位置，走到景點附近（預設 10 公尺）
自動用 **台灣口音中文（zh-TW）** 播放該景點的語音導覽。

## ✨ 功能

- 🗺️ **Leaflet + OpenStreetMap 地圖**，152 個景點涵蓋全部 21 天行程
- 📍 **GPS 即時追蹤**（`watchPosition`，高精度模式），藍點 + 精度圈
- 🔊 **接近自動播放**：進入觸發半徑（10–100 公尺可調，預設 10）自動朗讀中文導覽
- 🗣️ **台灣口音**：自動優先挑選裝置上的 zh-TW 語音（iPhone「美佳 Mei-Jia」、Android「Google 國語（臺灣）」、Windows「Microsoft HsiaoChen 曉臻」）
- ✅ **已播放記錄**（localStorage）：同一景點不會重複轟炸，可一鍵重設
- 🧪 **模擬模式**：在家點擊地圖假裝走到該處，測試觸發與語音
- 📋 **景點側欄**：依區域/天數分組，顯示與你的即時距離，可手動播放任一景點
- 📱 手機優先設計；追蹤時嘗試保持螢幕喚醒（Wake Lock）

## 🚀 部署（GitHub Pages）

純靜態網站，不需要 build。

**開啟 GitHub Pages（只需做一次）：**

1. 到本 repo 的 **Settings → Pages**
2. Build and deployment → Source 選 **Deploy from a branch**
3. Branch 選 **main**、資料夾選 **/ (root)**，按 **Save**
4. 等 1–2 分鐘，網站就在：**https://guadimalaprince.github.io/italy2027/**

**本機測試：**

```bash
python3 -m http.server 8000
# 打開 http://localhost:8000
```

> ⚠️ **一定要用 HTTPS（或 localhost）**：瀏覽器的定位 API 只在安全來源下運作，
> GitHub Pages 天生就是 HTTPS，沒問題。

## 📱 旅途中怎麼用

1. 手機開瀏覽器（建議 iPhone 用 Safari、Android 用 Chrome）打開網站
2. 按「▶ 開始 GPS 導覽」，允許定位權限
3. 把手機放口袋走路即可——接近景點時會自動開始講解
4. 想先聽某個景點：打開「☰ 景點」側欄按 🔊，或點地圖上的圓點

### 小提醒

- **10 公尺是很嚴格的觸發距離**：市區高樓間 GPS 誤差常有 15–30 公尺，
  若發現走到門口沒觸發，把上方滑桿調到 25–35 公尺會順很多。
- **台灣口音取決於裝置內建語音**：iPhone 可到
  設定 → 輔助使用 → 朗讀內容 → 聲音 → 中文，下載「美佳（進階）」音質更好；
  Android 到 設定 → 系統 → 語言 → 文字轉語音，確認 Google TTS 有中文（台灣）。
  按網站上的「🔊 測試語音」可確認目前用的是哪個聲音。
- 開著螢幕追蹤很耗電，帶行動電源。
- 地圖圖磚需要網路；山區（Alta Via 1）訊號時有時無，語音本身是離線合成不受影響，
  建議出發前先在住宿處把當天區域的地圖縮放瀏覽一遍讓瀏覽器暫存。

## 🗂️ 檔案結構

```
italy2027/
├── index.html      # 主頁面
├── css/style.css   # 樣式
├── js/app.js       # 地圖、GPS 追蹤、地理圍欄、zh-TW 語音合成
├── js/pois.js      # 152 個景點資料庫（座標 + 中文導覽稿）
└── README.md
```

## 📍 景點涵蓋

| 區域 | 天數 | 景點數 |
|---|---|---|
| 佛羅倫斯 | Day 1–3 | 26 |
| 比薩 | Day 2 | 10 |
| 羅馬 | Day 4–6 | 28 |
| 梵蒂岡 | Day 6 | 12 |
| 波爾扎諾 | Day 7 | 8 |
| Val Gardena（Seceda / Alpe di Siusi） | Day 8–9 | 10 |
| Dobbiaco / Tre Cime / Misurina | Day 9–11 | 13 |
| Alta Via 1（Braies → Falzarego） | Day 12–15 | 13 |
| Cortina / Lago di Sorapis | Day 15–16 | 6 |
| 國王湖 / 貝希特斯加登 | Day 17–18 | 9 |
| 慕尼黑 | Day 19–21 | 17 |

> 山屋與步道點位（Alta Via 1、Tre Cime 等）座標為近似值，觸發半徑建議調大；
> 想修改或新增景點，直接編輯 `js/pois.js` 即可，格式一看就懂。

## 🔒 隱私

定位資料只在你的瀏覽器內計算距離，**不會上傳到任何伺服器**。
「已播放」記錄存在手機本機的 localStorage。
