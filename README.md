# 🇫🇷🇮🇹🇩🇪 Italy 2027 — GPS 語音導覽網站

巴黎 + 義大利 + 多洛米蒂 + 慕尼黑 22 天行程（2027/6/2 台北出發－6/24 慕尼黑回程）（巴黎 → 拿坡里 → 龐貝 → 羅馬 → 佛羅倫斯 →
波爾扎諾 → Rosengarten → Val Gardena → Val di Funes → Tre Cime → Alta Via 1 → Cortina → 慕尼黑）的
**GPS 定位語音導覽網站**：地圖即時追蹤你的位置，走到景點附近（預設 10 公尺）
自動用 **台灣口音中文（zh-TW）** 播放該景點的語音導覽。

## ✨ 功能

- 🗺️ **Leaflet + OpenStreetMap 地圖**，204 個景點涵蓋全部 22 天行程（含龐貝古城 21 個定點解說、羅馬競技場內部 6 個細部解說點、Alta Via 1 沿線一戰戰場遺跡）
- 📍 **GPS 即時追蹤**（`watchPosition`，高精度模式），藍點 + 精度圈
- 🔊 **接近自動播放**：進入觸發半徑（10–100 公尺可調，預設 10）自動朗讀中文導覽
- 🗣️ **台灣口音**：自動優先挑選裝置上的 zh-TW 語音（iPhone「美佳 Mei-Jia」、Android「Google 國語（臺灣）」、Windows「Microsoft HsiaoChen 曉臻」）
- ✅ **已播放記錄**（localStorage）：同一景點不會重複轟炸，可一鍵重設
- 🧪 **模擬模式**：在家點擊地圖假裝走到該處，測試觸發與語音
- 📋 **景點側欄**：依區域/天數分組，顯示與你的即時距離，可手動播放任一景點
- 📱 手機優先設計；追蹤時嘗試保持螢幕喚醒（Wake Lock）
- 📅 **行程總覽分頁**（itinerary.html）：22 天卡片式行程（含實際日期），含每段交通方式／時間／Google Maps 路線連結、住宿資訊（羅馬已確認、其餘為建議）、每日景點照片牆（照片由瀏覽器向 Wikipedia API 抓取並快取，點卡片跳回地圖開啟該景點）

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
├── index.html         # 導覽地圖主頁
├── itinerary.html     # 行程總覽分頁（交通/住宿/照片）
├── css/style.css      # 地圖頁樣式
├── css/itinerary.css  # 行程頁樣式
├── js/app.js          # 地圖、GPS 追蹤、地理圍欄、zh-TW 語音合成
├── js/pois.js         # 204 個景點資料庫（座標 + 中文導覽稿 + 維基條目）
├── js/itinerary.js    # 22 天行程資料（交通、住宿、注意事項）
├── js/itinerary-app.js# 行程頁渲染
├── js/photos.js       # Wikipedia 照片批次載入與快取
└── README.md
```

## 📍 景點涵蓋

| 區域 | 天數 | 景點數 |
|---|---|---|
| 巴黎 | Day 1–2（6/3–6/4） | 15 |
| 拿坡里 | Day 2 | 5 |
| 龐貝古城 | Day 3 | 21 |
| 羅馬（含競技場內部細解） | Day 3–5 | 34 |
| 梵蒂岡 | Day 5 | 12 |
| 佛羅倫斯 | Day 5–7 | 26 |
| 比薩 | Day 6 | 10 |
| 波爾扎諾 | Day 7 | 8 |
| 卡雷扎湖 / Rosengarten 薔薇園 | Day 8 | 5 |
| Val Gardena（Seceda / Alpe di Siusi / Sassolungo） | Day 8–11 | 10 |
| Val di Funes 富內斯山谷 | Day 12 | 4 |
| Dobbiaco / Tre Cime / Misurina | Day 12–14 | 13 |
| Alta Via 1（Braies → Falzarego，含一戰遺跡） | Day 15–18 | 18 |
| Cortina（Sorapis + Tofana di Mezzo） | Day 18–20 | 9 |
| 慕尼黑 | Day 21–22（6/23–6/24） | 14 |

> 山屋與步道點位（Alta Via 1、Tre Cime 等）座標為近似值，觸發半徑建議調大；
> 想修改或新增景點，直接編輯 `js/pois.js` 即可，格式一看就懂。

## 🔒 隱私

定位資料只在你的瀏覽器內計算距離，**不會上傳到任何伺服器**。
「已播放」記錄存在手機本機的 localStorage。
