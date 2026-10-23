/* 待辦事項資料
 * opens: 開賣／開放訂位日（YYYY-MM-DD）；null = 隨時可訂
 * prio: 排序優先度，小的排前面（省略 = 50）。用在「現在就該做」但 opens 是 null 的項目，
 *       否則「隨時可訂」會被排到清單最後面，反而看不到。
 * 行程日期：2027/6/2 台北出發 – 6/24 慕尼黑回程
 */
var TRIP_DEPART = "2027-06-02";

/* ---------- 必訂項目 ---------- */
var MUST_BOOK = [
  { id: "bk-sennes", cat: "山屋", title: "Rifugio Sennes（6/11 住）", opens: "2026-11-04", prio: 1,
    who: "3 人 1 晚",
    note: "店家明講 11/4 開放訂房。AV1 第一晚，六月中旬山屋床位極少，開放當天就訂。",
    url: "https://www.sennes.com/" },

  { id: "bk-trains-de", cat: "火車", title: "Ortisei → 慕尼黑 EC 車票（6/23）", opens: "2026-12-23",
    note: "ÖBB Sparschiene 早鳥票約出發前 180 天開賣，€29 起；晚訂會貴 3–4 倍。這是回程前最後一段，訂有座位的班次。",
    url: "https://www.oebb.at/" },

  { id: "bk-huts-other", cat: "山屋", title: "確認 Fanes／Lagazuoi 尾款與抵達方式", opens: "2027-01-15",
    note: "兩間已付訂金（Fanes €250／Lagazuoi €180）。出發前一個月再次來信確認訂房仍在、尾款金額與是否收卡。" },

  { id: "bk-hotels-dolomiti", cat: "住宿", title: "多洛米蒂住宿：Braies／Cortina／Dobbiaco／Ortisei", opens: "2027-01-01",
    note: "⚠️ Hotel Lago di Braies（湖畔唯一旅館）通常前一年就滿，想住湖畔要最早動手。Ortisei 連住 4 晚、Cortina 3 晚也要早訂。" },

  { id: "bk-hotel-munich", cat: "住宿", title: "慕尼黑中央車站住宿（6/23 一晚）", opens: null, prio: 2,
    who: "3 人 1 晚",
    note: "⚠️ <b>6/22–25 Messe München 三展同期</b>（automatica、LASER World of PHOTONICS、World of QUANTUM），6/23 是尖峰。<b>2026/10/23 實際查價已證實漲價</b>：原本建議的 Eden Hotel Wolff 這晚要 <b>€420–467</b>。\n<b>現在就訂、選可免費取消</b>——還有 8 個月，部分通路仍掛基礎價。\n\n<b>以下皆為 3 人 1 房 1 晚、已逐項查證私人衛浴／三人房／空調：</b>\n\n<b>① Creatif Hotel Elephant（最便宜且達標）</b>　Lämmerstraße 6，車站<b>北側</b>步行約 5 分\n私人衛浴 ✓　三人房 ✓　電梯 ✓　<b>無空調（只有電扇）</b>　評分 7.5／7.7（5,682 則）\n報價：trivago Book &amp; Go <b>€125（可免費取消）</b>｜Super.com €116｜Booking €164\n\n<b>② Hotel Amba（三張獨立床）</b>　Arnulfstraße 20，<b>北側</b>步行約 5 分\n私人衛浴 ✓　<b>三人房＝三張分開的床</b> ✓　電梯 ✓　<b>無空調</b>　評分 7.1／7.5\n報價：trivago Book &amp; Go <b>€157（可免費取消）</b>｜Super.com €145｜Booking €182\n\n<b>③ Vi Vadi Hotel Bayer 89（評價最高＋有空調）</b>　Bayerstraße 89，車站西側步行約 12–15 分\n私人衛浴 ✓　家庭房 ✓　電梯 ✓　<b>空調 ✓</b>　<b>評分 8.6／8.8（8,434 則，全場最高）</b>\n報價：飯店官網 <b>€243（可免費取消）</b>｜Super.com €214｜Booking €243\n\n<b>④ AWA Hotel — 直訂省很大但位置差</b>　Schillerstraße 10\n<b>官方直訂 €253 vs Booking €401</b>，價差 €148。但這條街就是紅燈區核心。\n\n<b>⚠️ Downtown Vi Vadi Hotel — 位置最好但第三人睡沙發床</b>　Marsstraße 6-10，<b>距車站僅 250 公尺</b>（全場最近），北側｜評分 7.9／8.0（8,753 則）\n私人衛浴 ✓　電梯 ✓　<b>無空調（強力電扇）</b>　<b>三人房＝Maisonette 樓中樓套房，一張 king bed ＋一張沙發床</b>\n<b>同一晚報價從 €182 到 €381，差一倍</b>：Super.com €182｜Agoda €190｜官網直訂 €310｜<b>Booking €380.8</b>。DirectBooker 查不到 3 人直訂價。\n若 Agoda €190 屬實，位置贏 Amba 150 公尺、評分也高一點，但沙發床是實質降級。訂之前先確認那個價格真的是 3 人房型。\n\n<b>⚠️ THE 4YOU Hostel &amp; Hotel — 唯一含早餐，但是社交型青旅</b>　Hirtenstraße 18，北側步行約 6 分｜評分 7.9（7,989 則）／7.8（17,882 則）\n訂<b>私人房</b>則<b>房內有專屬衛浴</b> ✓（非床位）　電梯 ✓　<b>無空調</b>　<b>含歐陸自助早餐</b>（全場唯一）\n⚠️ <b>床型不確定：可能是三張單人床，也可能是上下舖</b>——訂之前要指定房型。\n⚠️ 設施有酒吧、撞球、飛鏢、歡樂時光、現場轉播球賽＝<b>社交型青旅，晚上可能吵</b>。隔天 07:30 要起床趕機。\n報價：Super.com €168｜Booking €219.3。另可能收城市稅。\n\n<b>❌ Pension Locarno（€93，Bahnhofsplatz 5）已排除：共用衛浴、無空調。</b>便宜是有原因的。\n\n⚠️ 便宜報價多數<b>不可退、不含早餐</b>；上面標「可免費取消」的才是 8 個月前該訂的那種。\n⚠️ Super.com 是轉售平台，價格最低但無法代為背書。\n⚠️ 價格為 2026/10/23 查詢結果，下訂前請重查；展期日期以 messe-muenchen.de 為準。",
    url: "https://www.messe-muenchen.de/" },

  { id: "bk-hotels-city", cat: "住宿", title: "城市住宿：拿坡里／佛羅倫斯／波爾扎諾", opens: null,
    note: "已訂：巴黎（39 Rue des Bourdonnais, 1 區）、羅馬（Comfort Hotel Bolivar）。其餘可用免費取消的訂單先卡位，之後再優化。\n⚠️ <b>巴黎以外的城市也要注意三人房稀少</b>——多數歐洲旅館最多雙人房，triple 房型數量少、很早被訂走。" },

  { id: "bk-notredame", cat: "門票", title: "聖母院免費時段預約（6/4 早上 07:50 場）", opens: "2027-06-01",
    note: "<b>入內免費</b>，已確認週五 07:50–19:00（週四延長到 22:00），末班入場閉館前 30 分。\n免費時段預約<b>非強制</b>，只是縮短排隊，<b>開放窗口只有出發前 48–72 小時</b>——人在巴黎或飛機上才訂得到，手機記得設提醒。07:50 開門第一批通常不用排。\n鐘樓是另外付費 €16，走 CMN 官網，<b>現場不售票</b>。",
    url: "https://www.notredamedeparis.fr/" },

  { id: "bk-saintechapelle", cat: "門票", title: "聖禮拜堂時段票（6/3）", opens: "2027-03-03",
    note: "跳過羅浮宮後，這是巴黎唯一排進去的室內景點，<b>要線上預約時段——訂 11:00 前後那場</b>。旅館步行 10 分，約 40 分鐘看完，安檢排隊可能 20–30 分。\n下午 3 點 check-in 前的行程都排在旅館步行 15 分內，這場剛好卡在中間。",
    url: "https://www.sainte-chapelle.fr/" },

  { id: "bk-paris-fares", cat: "票務", title: "巴黎交通票：確認 Navigo 日票是否含機場", opens: "2027-05-03",
    note: "<b>目前結論：三人都買單程票最省，不要買週票。</b>\n・Navigo 日票<b>不含</b>機場路段\n・Navigo 週票含機場，但固定週一至週日，6/3 是週四會浪費前三天，再加 €5 Découverte 卡費與證件照\n・你們只有兩趟機場＋極少市區移動（住 1 區幾乎全程走路），單買約 €100／3 人，比週票 €111 還便宜\n出發前一個月上 iledefrance-mobilites.fr 複查規則與 2027 票價。",
    url: "https://www.iledefrance-mobilites.fr/" },

  { id: "bk-flight-nap", cat: "機票", title: "巴黎 Orly → 拿坡里機票（6/4 中午 12:35）", opens: null,
    note: "越早越便宜。⚠️ 務必買可改期的票種——法國空管罷工是這趟最高風險的一段（見下方交通規劃）。" },

  { id: "bk-trains-it", cat: "火車", title: "義大利高鐵三段（6/5 拿坡里→羅馬、6/7 羅馬→佛羅倫斯、6/9 佛羅倫斯→波爾扎諾）", opens: "2027-02-05",
    note: "Trenitalia／Italo 約出發前 4 個月開賣，Super Economy 早鳥票便宜非常多。兩家是不同公司，罷工時互為備案，可以刻意分開訂。",
    url: "https://www.trenitalia.com/" },

  { id: "bk-uffizi", cat: "門票", title: "烏菲茲 ＋ 學院美術館（6/9，09:00 大衛像／11:00 烏菲茲）", opens: "2027-03-09",
    note: "官方 b-ticket 系統約 3 個月前開賣。當天下午要趕火車北上，時段一定要卡準。",
    url: "https://www.b-ticket.com/" },

  { id: "bk-vatican", cat: "門票", title: "梵蒂岡博物館 08:00 早場（6/7 週一）", opens: "2027-04-08",
    note: "官網約 60 天前開賣，早場名額秒殺。西斯汀禮拜堂人潮在 10 點後爆炸，一定要搶 08:00。",
    url: "https://tickets.museivaticani.va/" },

  { id: "bk-seceda", cat: "纜車", title: "Seceda 纜車時段預約（6/20）", opens: "2027-04-01",
    note: "2026 起新規需線上預約時段。Tre Cime 接駁（6/17）也要在 trecime.it 預約。",
    url: "https://www.seceda.it/" },

  { id: "bk-colosseo", cat: "門票", title: "羅馬競技場 ＋ 古羅馬廣場聯票（6/6 週日）", opens: "2027-05-07",
    note: "⚠️ 6/6 是每月第一個週日免費開放日：免費但「無法預約」、人潮爆炸。要嘛 08:15 前到場排隊，要嘛改買含導覽的付費團走快速通道。",
    url: "https://colosseo.it/" },

  { id: "bk-pisa", cat: "門票", title: "比薩斜塔登塔時段票（6/8）", opens: "2027-05-19",
    note: "opapisa.it 約 20 天前開賣。不登塔就不用訂，現場買主教座堂＋洗禮堂聯票即可。",
    url: "https://www.opapisa.it/" },

  { id: "bk-pompeii", cat: "門票", title: "龐貝古城門票（6/5 週六）", opens: null,
    note: "pompeiisites.org 隨時可買。週六人多，先買好從海門直接進場。",
    url: "https://pompeiisites.org/" },

  { id: "bk-gear", cat: "裝備", title: "AV1 裝備：睡袋內襯、頭燈、登山杖、現金", opens: null,
    note: "山屋提供寢具但一律要自備睡袋內襯。Lagazuoi 一戰隧道下山必須有頭燈。多數山屋不收卡——每人帶 €250–300 現金上山。" },

  { id: "bk-insurance", cat: "保險", title: "旅遊平安險＋高山健行不便險", opens: null,
    note: "AV1 有鐵索路段，確認保單涵蓋 via ferrata／高山健行，以及直升機救援。" }
];

/* ---------- 交通規劃與罷工備案 ---------- */
var LEGS = [
  { id: "lg-tpe", date: "6/2–6/3", leg: "台北 TPE → 巴黎 CDG → 1 區旅館", mode: "✈️", risk: "low",
    plan: "已訂。08:05 抵達，出關後到官方 Taxi 排班處，<b>計程車政府定額右岸 €56／車</b>（含行李，三人分攤每人約 €19），約 45–60 分到 39 Rue des Bourdonnais。\n剛下長途飛機又撞上早上尖峰，不建議拖三人行李擠 RER B。三人＋大行李可請調度員安排大車（van）。",
    fallback: "班機延誤就把 Day 1 的凱旋門／小皇宮壓縮，直接傍晚去鐵塔——鐵塔整點閃燈到晚上，晚到也看得到。" },

  { id: "lg-orly14", date: "6/4 上午", leg: "1 區旅館 → Orly 機場（地鐵 14 號線）", mode: "🚇", risk: "low",
    plan: "<b>最晚 09:45 出門</b>（12:35 起飛，10:35 前要到）。旅館步行 3 分到 Châtelet，<b>14 號線直達 Orly，約 27 分、零轉乘</b>（2024 年 6 月通車）。往機場方向是逆尖峰，不會塞。",
    fallback: "<b>這段刻意不搭計程車</b>：地鐵不受路況影響，時間可預測。\n14 號線若故障，改 RER B 到 Antony 轉 Orlyval，或在 Châtelet 叫車（右岸定額 €44／車）。\n抓 2 小時到機場，比正常多留 30 分緩衝。" },

  { id: "lg-orly", date: "6/4 中午", leg: "巴黎 Orly 12:35 → 拿坡里 NAP 14:40", mode: "✈️", risk: "high",
    plan: "起飛前 2 小時到機場。中午班機比傍晚班機好：萬一取消，當天還有時間改簽。",
    fallback: "⚠️ 全程風險最高的一段：法國空管（ATC）罷工頻繁，且屬 EC261「特殊情況」不理賠。\n① 買可改期票種，別買最低價不可改的。\n② 手機先存好隔天早班替代航班。\n③ 真的取消：改飛羅馬（班次多很多）當晚住羅馬，6/5 改從羅馬南下龐貝當天來回（高鐵 1h10 到拿坡里），行程照走只是順序倒過來。\n④ 出發前一週查法國罷工公告。" },

  { id: "lg-circum", date: "6/5 上午", leg: "拿坡里 → 龐貝（Circumvesuviana）", mode: "🚆", risk: "high",
    plan: "Napoli Garibaldi 搭 EAV 私鐵到 Pompei Scavi，約 35 分。",
    fallback: "⚠️ EAV 是義大利最常罷工的路線之一。\n<b>最有用的備案：改搭 Trenitalia</b>——國鐵是完全不同的公司，Napoli Centrale → Pompei 站約 40 分，下車走到遺址東門 Porta Nocera 約 10 分鐘，一樣能進場。\n再不行就計程車／Uber，約 €50–60、30 分鐘，三人分攤划算。" },

  { id: "lg-rome", date: "6/5 下午", leg: "拿坡里 → 羅馬（高鐵）", mode: "🚄", risk: "med",
    plan: "Frecciarossa／Italo，1 小時 10 分。",
    fallback: "Trenitalia 與 Italo 是不同公司，罷工常只影響一家——另一家照跑。\n義大利鐵路罷工有「保障班次」（treni garantiti）：平日 06:00–09:00 與 18:00–21:00 一定有車，把票改到這兩個時段。\n最後手段：Flixbus 拿坡里→羅馬約 3 小時。" },

  { id: "lg-florence", date: "6/7 下午", leg: "羅馬 → 佛羅倫斯（高鐵）", mode: "🚄", risk: "med",
    plan: "Termini → SMN，1 小時 32 分，建議訂 15:00 或 16:00。",
    fallback: "同上：Italo ↔ Trenitalia 互為備案，或改到保障班次時段。Flixbus 約 3.5 小時。\n真的卡住就當晚住羅馬、隔天一早北上，把比薩那半天讓出來。" },

  { id: "lg-bolzano", date: "6/9 下午", leg: "佛羅倫斯 → 波爾扎諾", mode: "🚄", risk: "med",
    plan: "經 Bologna 轉 EC／RV 直上 Bolzano，約 3.5 小時。",
    fallback: "替代路線：Firenze → Verona → Bolzano（Verona 轉車班次多）。\n這段在義大利國鐵網內，罷工時走保障班次時段。\nFlixbus 有 Firenze→Bolzano 直達班次可備著。" },

  { id: "lg-braies", date: "6/10", leg: "波爾扎諾 → Dobbiaco → 布萊耶斯湖", mode: "🚌", risk: "med",
    plan: "普斯特里亞線火車到 Dobbiaco（約 2h，Fortezza 轉車）→ 442 號巴士到湖畔（約 20 分）。",
    fallback: "南蒂羅爾區域交通（SAD／STA）罷工時，租車一天最實際：波爾扎諾車站有 Europcar／Hertz，開到 Braies 約 2 小時。\n⚠️ 6–9 月 09:30–16:00 管制自駕上湖，但<b>住湖畔旅館的房客可通行</b>，訂房確認信要印出來備查。" },

  { id: "lg-av1", date: "6/11–6/14", leg: "AV1 四天步行段", mode: "🥾", risk: "low",
    plan: "Braies → Sennes → Fanes → Lagazuoi → Falzarego，全程走路，不受罷工影響。",
    fallback: "這四天唯一的風險是天氣與殘雪，不是罷工。\n逃生點：Pederü（6/12 中途，有產業道路可叫車下山）、Lagazuoi 纜車（6/13–14 可直接下 Falzarego）。\n6/13 Forcella del Lago 若積雪過深，可從 Fanes 走 Pederü 下撤搭車到 Cortina，犧牲 Lagazuoi 但安全。" },

  { id: "lg-cortina", date: "6/17 上午", leg: "Cortina → Dobbiaco", mode: "🚌", risk: "med",
    plan: "Cortina Express 或 445 號巴士，約 1 小時。Cortina 沒有火車站，北上 Dobbiaco 接鐵路是唯一出口。",
    fallback: "Cortina Express 與 Dolomitibus 是不同業者，一家停另一家常還在跑。\n計程車 Cortina→Dobbiaco 約 €80–100，三人分攤可接受。" },

  { id: "lg-ortisei", date: "6/19", leg: "Dobbiaco → Bressanone → Ortisei", mode: "🚆", risk: "med",
    plan: "火車到 Bressanone（1.5h）→ 350 號巴士上 Val Gardena（1.5h）。中途順道 Val di Funes。",
    fallback: "轉乘多，罷工影響大。備案是全程巴士（SAD 有 Dobbiaco→Brunico→Bressanone 路線）或直接放棄 Funes、拉計程車接駁。\n這天行程彈性大，晚到 Ortisei 只是少逛小鎮，不影響隔天纜車。" },

  { id: "lg-munich", date: "6/23", leg: "Ortisei → 慕尼黑", mode: "🚄", risk: "high",
    plan: "350 號巴士到 Ponte Gardena（35 分）→ EC 直達慕尼黑（約 4.5 小時）。08:00 前出發。",
    fallback: "⚠️ <b>這是最不能失敗的一段：隔天中午就是回台北的班機，只有一晚緩衝。</b>\n① 德國（GDL／EVG）與奧地利鐵路都可能罷工，出發前 3 天開始每天查。\n② 備案：Flixbus 波爾扎諾 → 慕尼黑直達約 5 小時，和鐵路完全不同系統。\n③ 真的全停擺：Innsbruck 是中繼點，從 Ortisei 拉車到 Innsbruck 再想辦法進慕尼黑。\n④ <b>最保險的作法：如果出發前看到 6/23 有公告罷工，就把 6/22 的 Sassolungo 砍掉，提早一天移動到慕尼黑。</b>" },

  { id: "lg-home", date: "6/24 中午", leg: "慕尼黑 → 台北", mode: "✈️", risk: "low",
    plan: "已訂。München Hbf 搭 S8 到機場約 40 分，最晚 08:45 上車。",
    fallback: "住中央車站旁就是為了這段。S8 罷工時改搭 S1（走機場北側，慢 10 分鐘）或計程車約 €70。早上不要排任何行程。" }
];

/* ---------- 罷工應變總則 ---------- */
var STRIKE_TIPS = [
  { t: "去哪裡查", d: "義大利交通部官方罷工日曆 <b>scioperi.mit.gov.it</b>，可以查未來已公告的罷工日期，出發前一個月就能先看。法國看 <b>vols.dgac.fr</b>（空管罷工預告），德國看 DB 官網公告。" },
  { t: "提前多久公告", d: "義大利法律規定全國性罷工須提前公告，通常提早 10 天以上。也就是說：出發前查一次、旅途中每 2–3 天查一次，幾乎都來得及應變。" },
  { t: "保障班次", d: "義大利鐵路罷工一定保留「treni garantiti」：平日 06:00–09:00 與 18:00–21:00。把長途移動盡量排在這兩個時段，罷工日也走得掉。" },
  { t: "罷工多長", d: "多半是 24 小時或更短（常見 8 小時、21:00 到隔天 21:00），而且週五最多。很少連續兩天。" },
  { t: "分散風險", d: "同一段路刻意訂不同公司（Italo vs Trenitalia、Cortina Express vs Dolomitibus），一家罷工另一家通常照跑。" },
  { t: "退改規則", d: "罷工造成的取消，義大利鐵路可全額退款或免費改期。航空的 ATC 罷工屬「特殊情況」，只退票不賠償——所以機票要買可改期的。" },
  { t: "現金", d: "罷工日計程車需求暴增、有時只收現金。身上永遠留 €100 以上的緩衝。" }
];
