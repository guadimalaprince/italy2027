/* 21 天行程資料
 * stay.status: "confirmed"（已訂）/ "suggested"（建議，未訂）/ "hut"（山屋，需預約）/ "none"
 * transport: from/to 給 Google Maps 路線連結用（gm: 交通模式，省略則不給連結）
 * pois: 對應 pois.js 的景點 id 前綴或 id 清單，用來抓當天照片
 */
var DAYS = [
{ day: 1, phase: "🇫🇷 巴黎", title: "抵達巴黎", areas: ["巴黎"],
  transport: [
    { icon: "✈️", route: "台北 → 巴黎 CDG", time: "08:05 抵達", note: "入境後跟著 RER 指標走" },
    { icon: "🚆", route: "CDG → 市區（RER B 線）", time: "約 35–50 分", gm: ["Charles de Gaulle Airport", "Châtelet–Les Halles, Paris"], note: "買 Navigo Easy 卡或單程票" }
  ],
  plan: ["輕鬆逛塞納河畔、艾菲爾鐵塔", "傍晚上蒙馬特看夕陽（聖心堂前階梯）", "早點休息調時差"],
  stay: { city: "巴黎", status: "suggested", name: "ibis Paris Montparnasse Catalogne 或 Novotel Paris Centre Gare Montparnasse",
    note: "建議住蒙帕納斯／Denfert-Rochereau 一帶：明早去 Orly 機場最方便（OrlyBus 與 B 線都在 Denfert 發車）" },
  warn: ["明早從 Orly 出發！CDG 與 Orly 是不同機場，市區到 Orly 約 40–60 分，需提早規劃"] },

{ day: 2, phase: "🇮🇹 羅馬", title: "巴黎 → 羅馬，老城初探", areas: ["羅馬"],
  transport: [
    { icon: "✈️", route: "巴黎 Orly → 羅馬 FCO", time: "約 2 小時", note: "起飛前 2 小時到機場" },
    { icon: "🚆", route: "FCO → 特米尼車站（Leonardo Express）", time: "32 分，每 15 分一班", gm: ["Fiumicino Airport", "Roma Termini"], note: "€14，月台直上車" }
  ],
  plan: ["下午：萬神廟 → 納沃納廣場 → 特雷維噴泉（許願！）", "晚上：特拉斯提弗列區晚餐（推薦起司胡椒麵 Cacio e Pepe）"],
  stay: { city: "羅馬", status: "confirmed", name: "✅ 已確認",
    note: "把訂房名稱／地址填進 js/itinerary.js 的 Day 2 stay 欄位即可顯示在這裡" },
  warn: [] },

{ day: 3, phase: "🇮🇹 羅馬", title: "古羅馬一日：鬥獸場＋羅馬廣場＋帕拉提諾山", areas: ["羅馬"],
  transport: [
    { icon: "🚇", route: "地鐵 B 線 → Colosseo 站", time: "特米尼出發 2 站，約 5 分", gm: ["Roma Termini", "Colosseo, Rome"] }
  ],
  plan: ["鬥獸場（外牆 → 看台 → 競技場地板 → 地下層，本網站有 6 個定點解說）", "君士坦丁凱旋門 → 古羅馬廣場 → 帕拉提諾山（三點聯票）", "傍晚卡比托利歐廣場看夕陽下的羅馬廣場", "晚上再回特拉斯提弗列"],
  stay: { city: "羅馬", status: "confirmed", name: "✅ 已確認（同前晚）", note: "" },
  warn: ["鬥獸場務必提前網路預約（官網 colosseo.it），現場排隊可能 2 小時以上；地下層需加購導覽票"] },

{ day: 4, phase: "🇮🇹 羅馬 → 佛羅倫斯", title: "梵蒂岡早場 → 高鐵北上佛羅倫斯", areas: ["梵蒂岡", "羅馬", "佛羅倫斯"],
  transport: [
    { icon: "🚇", route: "地鐵 A 線 → Ottaviano 站（梵蒂岡）", time: "約 15 分", gm: ["Roma Termini", "Vatican Museums"] },
    { icon: "🚄", route: "羅馬 Termini → 佛羅倫斯 SMN（Frecciarossa／Italo 高鐵）", time: "1 小時 32 分", gm: ["Roma Termini", "Firenze Santa Maria Novella"], note: "建議訂 15:00 或 16:00 班次較穩" }
  ],
  plan: ["08:00 梵蒂岡博物館入場（地圖廊 → 拉斐爾房間 → 西斯汀禮拜堂，約 3–4 小時）", "有時間再快閃聖彼得大教堂看聖殤像", "下午高鐵到佛羅倫斯，check-in", "傍晚老橋（Ponte Vecchio）散步、天主聖三橋看夕陽"],
  stay: { city: "佛羅倫斯", status: "suggested", name: "Hotel Croce di Malta 或 B&B Hotel Firenze City Center",
    note: "建議住 SMN 車站與主教座堂之間，拖行李 10 分鐘內，去比薩、去美術館都方便" },
  warn: ["梵蒂岡務必提前預約 08:00 入場票（museivaticani.va）", "行李可寄放 Termini 車站寄物處，或直接拖去梵蒂岡對面的寄物點"] },

{ day: 5, phase: "🇮🇹 佛羅倫斯", title: "比薩半日遊 → 佛羅倫斯老城", areas: ["比薩", "佛羅倫斯"],
  transport: [
    { icon: "🚆", route: "佛羅倫斯 SMN → 比薩中央（區間車）", time: "約 1 小時，每 30 分一班", gm: ["Firenze Santa Maria Novella", "Pisa Centrale"], note: "免預約，上車前記得打票" },
    { icon: "🚶", route: "比薩車站 → 奇蹟廣場", time: "步行 25 分或 LAM Rossa 公車 10 分", gm: ["Pisa Centrale", "Piazza dei Miracoli, Pisa"] }
  ],
  plan: ["上午：斜塔、主教座堂、洗禮堂（聽回音示範！）、奇蹟廣場", "中午前後回佛羅倫斯", "下午：中央市場吃牛肚包 → 主教座堂圓頂外觀 → 領主廣場", "傍晚：可上米開朗基羅廣場看夕陽"],
  stay: { city: "佛羅倫斯", status: "suggested", name: "同前晚", note: "" },
  warn: ["想爬斜塔要事先在 opapisa.it 訂時段票"] },

{ day: 6, phase: "🇮🇹 佛羅倫斯 → 波爾扎諾", title: "兩大美術館 → 北上多洛米蒂門戶", areas: ["佛羅倫斯", "波爾扎諾"],
  transport: [
    { icon: "🚄", route: "佛羅倫斯 SMN → 波爾扎諾（經 Bologna 轉車）", time: "約 3.5 小時，13:30 前後出發", gm: ["Firenze Santa Maria Novella", "Bolzano"], note: "Frecciarossa 到 Bologna 轉 EC/RV 直上 Bolzano" }
  ],
  plan: ["09:00 學院美術館：大衛像本尊（約 1.5 小時）", "11:00 烏菲茲美術館：波提切利『維納斯的誕生』（約 2.5 小時）", "下午火車北上", "傍晚逛波爾扎諾義德雙語老城：瓦爾特廣場、柱廊街、草藥廣場"],
  stay: { city: "波爾扎諾", status: "suggested", name: "Stadt Hotel Città（瓦爾特廣場上）或 Hotel Greif",
    note: "住老城中心，車站步行 5 分鐘，明早搭巴士方便" },
  warn: ["兩館都要提前預約指定時段（b-ticket 官方系統），排 09:00＋11:00 剛好接得上"] },

{ day: 7, phase: "🏔 東多洛米蒂", title: "卡雷扎湖 → 進駐 Ortisei", areas: ["卡雷扎湖", "Val Gardena"],
  transport: [
    { icon: "🚌", route: "波爾扎諾 → 卡雷扎湖（SAD Bus 180）", time: "約 45 分", gm: ["Bolzano", "Lago di Carezza"], note: "回程同路線返回波爾扎諾" },
    { icon: "🚌", route: "波爾扎諾 → Ortisei（SAD Bus 350）", time: "約 1 小時，班次頻繁", gm: ["Bolzano", "Ortisei"] }
  ],
  plan: ["上午：卡雷扎湖（彩虹湖）環湖 30 分，看 Latemar 峰群倒影", "回波爾扎諾轉車（可順便吃午餐、超市補給）", "下午進駐 Ortisei，逛木雕小鎮", "遊客中心購買 Gardena Card（3 天 €124）"],
  stay: { city: "Ortisei（4 晚）", status: "suggested", name: "Hotel Angelo Engel（鎮中心）或 Adler Dolomiti Spa & Sport Resort",
    note: "連住 4 晚建議選含早餐、有 spa 的旅館，健行完泡湯超幸福；多數旅館含 Val Gardena Mobil Card 可免費搭區內巴士" },
  warn: ["卡雷扎湖與 Ortisei 方向不同，必須回波爾扎諾中轉，全程約 3.5 小時，早上早點出發"] },

{ day: 8, phase: "🏔 Val Gardena", title: "Seceda 刀鋒稜線", areas: ["Val Gardena"],
  transport: [
    { icon: "🚡", route: "Ortisei → Furnes → Seceda 纜車（兩段）", time: "約 15 分直上 2,500m", note: "Gardena Card Day 1" }
  ],
  plan: ["Seceda 稜線步道：Odle 峰群 45 度斜切大景", "山頂十字架 → 沿稜線散步，山屋午餐", "下午原路纜車下山，或走步道下到中站"],
  stay: { city: "Ortisei", status: "suggested", name: "同前晚", note: "" },
  warn: ["2026 起新規：Seceda 纜車需在 seceda.it 提前預約時段！", "山頂比山下低 10 度，帶風衣"] },

{ day: 9, phase: "🏔 Val Gardena", title: "Alpe di Siusi 修斯高原", areas: ["Val Gardena"],
  transport: [
    { icon: "🚡", route: "Ortisei → Mont Sëuc 纜車（直上高原）", time: "約 10 分", note: "Gardena Card Day 2" }
  ],
  plan: ["歐洲最大高山草原漫步（可租電動登山車）", "正面遠望 Sassolungo 山群", "傍晚看草原染金再下山"],
  stay: { city: "Ortisei", status: "suggested", name: "同前晚", note: "" },
  warn: [] },

{ day: 10, phase: "🏔 Val Gardena", title: "Sassolungo 山坳（棺材纜車）", areas: ["Val Gardena"],
  transport: [
    { icon: "🚌", route: "Ortisei → Passo Sella（巴士）", time: "約 40 分", gm: ["Ortisei", "Passo Sella"], note: "Gardena Card Day 3（最後一天）" },
    { icon: "🚡", route: "Passo Sella → Forcella del Sassolungo（立式吊籃纜車）", time: "約 10 分", note: "兩人一籃的復古『棺材纜車』，邊上車邊跳！" }
  ],
  plan: ["Forcella del Sassolungo（2,681m）：三面峭壁壓頂", "Toni Demetz 小屋 → 或繞山腳健行下山", "下午回 Ortisei 休整、打包，明天換基地"],
  stay: { city: "Ortisei", status: "suggested", name: "同前晚", note: "" },
  warn: ["吊籃纜車無預約制、風大會停駛，早上出發最穩"] },

{ day: 11, phase: "🏔 西多洛米蒂", title: "Val di Funes 富內斯山谷 → 移動到 Dobbiaco", areas: ["Val di Funes", "Dobbiaco / Tre Cime"],
  transport: [
    { icon: "🚌", route: "Ortisei → Bressanone → Val di Funes（St. Magdalena）", time: "約 1.5–2 小時，需轉車", gm: ["Ortisei", "St. Magdalena, Funes"] },
    { icon: "🚆", route: "Bressanone → Dobbiaco（Pustertal 鐵路，經 Fortezza 轉）", time: "約 1.5 小時", gm: ["Bressanone", "Dobbiaco"] }
  ],
  plan: ["上午：聖瑪達肋納教堂觀景點（多洛米蒂最知名構圖）", "Ranui 聖若望小教堂", "時間夠可走一段 Adolf Munkel 步道（平緩、人少）", "下午移動到 Dobbiaco，安頓早休息——接下來強度變高"],
  stay: { city: "Dobbiaco（3 晚）", status: "suggested", name: "Hotel Santer 或 Hotel Laurin",
    note: "Dobbiaco 是 Tre Cime／Braies 的交通樞紐，車站與巴士站都在鎮上；入住通常送 Holiday Pass 可免費搭區域火車巴士" },
  warn: ["行李多可考慮 Ortisei 直接巴士＋火車到 Dobbiaco，隔天再輕裝回訪 Funes（自行取捨）"] },

{ day: 12, phase: "🏔 Dobbiaco", title: "Tre Cime di Lavaredo 三尖峰環形步道", areas: ["Dobbiaco / Tre Cime"],
  transport: [
    { icon: "🚌", route: "Dobbiaco → Misurina（444/445 號巴士）", time: "約 30 分", gm: ["Dobbiaco", "Misurina"] },
    { icon: "🚐", route: "Misurina → Rifugio Auronzo（夏季接駁車）", time: "約 20 分", note: "2026 新規：收費山路強制線上預約接駁時段，班次少，最早班出發！" }
  ],
  plan: ["Tre Cime 環形步道（10km，3–4 小時，順時針走）", "Lavaredo 埡口看北壁全景 → Locatelli 山屋吃蘋果酥捲", "一戰岩洞哨所裡框三尖峰拍照", "下午接駁車＋巴士回 Dobbiaco"],
  stay: { city: "Dobbiaco", status: "suggested", name: "同前晚", note: "" },
  warn: ["山區午後常有雷陣雨，07:00 前出門最安全", "帶水 1.5L、防風外套、帽子"] },

{ day: 13, phase: "🏔 Dobbiaco", title: "米蘇里納湖＋Cadini 山群（魔戒之路）", areas: ["Dobbiaco / Tre Cime"],
  transport: [
    { icon: "🚌", route: "Dobbiaco → Misurina 湖", time: "約 30 分，比昨天晚出發沒關係", gm: ["Dobbiaco", "Lago di Misurina"] }
  ],
  plan: ["環米蘇里納湖散步（Sorapiss 倒影）", "健行上 Rifugio Fonda Savio 方向，俯瞰 Cadini 鋸齒岩塔（單程約 2 小時，或搭 Col de Varda 吊椅省一半）", "『天空之刃』稜線拍照點——務必注意腳步", "下午回 Dobbiaco 整裝：明天開始 AV1 四天，大行李寄放旅館！"],
  stay: { city: "Dobbiaco", status: "suggested", name: "同前晚", note: "跟旅館說好寄放行李到 Day 17（很多旅館可以，或寄 Cortina 的旅館）" },
  warn: [] },

{ day: 14, phase: "🥾 Alta Via 1", title: "AV1 第一天：布萊耶斯湖 → 高原山屋", areas: ["Alta Via 1"],
  transport: [
    { icon: "🚌", route: "Dobbiaco → Lago di Braies（442 號巴士）", time: "僅 20 分！", gm: ["Dobbiaco", "Lago di Braies"], note: "旺季湖區管制，巴士也建議預約" }
  ],
  plan: ["湖畔木船屋拍照（趁早避開人潮）", "沿 1 號步道陡上 900m 翻上石灰岩高原", "夜宿 Rifugio Biella（或多走 1 小時到設施較好的 Sennes）"],
  stay: { city: "山屋", status: "hut", name: "Rifugio Biella（2,327m）或 Rifugio Sennes",
    note: "AV1 山屋常在 1–2 月開放預約後迅速滿房：官網／email 預約、半食宿制（含晚早餐）、自備睡袋內襯與現金、多數無淋浴" },
  warn: ["今天爬升最陡的一段就在湖後，慢慢走", "健行四天帶：頭燈（Day 17 隧道要用）、睡袋內襯、現金、水袋、防雨"] },

{ day: 15, phase: "🥾 Alta Via 1", title: "AV1 第二天：牧場草原 → Fanes 高原", areas: ["Alta Via 1"],
  transport: [{ icon: "🥾", route: "Biella → Sennes → Fodara Vedla → Pederü → Fanes", time: "約 6 小時，先降 800m 再升 500m" }],
  plan: ["穿越 Sennes 牧場（現擠鮮奶！）", "Fodara Vedla 童話牧村", "降到 Pederü 谷底午餐，再沿古馬車道緩升", "夜宿 Fanes 高原——拉登傳說的心臟"],
  stay: { city: "山屋", status: "hut", name: "Rifugio Fanes（2,060m）",
    note: "官網 rifugiofanes.com 預約；隔壁 Lavarella 山屋號稱歐洲最高釀酒廠，可去喝一杯" },
  warn: [] },

{ day: 16, phase: "🥾 Alta Via 1", title: "AV1 第三天：史詩攀登 → Lagazuoi（2,752m）", areas: ["Alta Via 1"],
  transport: [{ icon: "🥾", route: "Fanes → Lago di Limo → Val di Fanes 陡降 → Lagazuoi 大爬升", time: "約 7 小時，總爬升 1,000m+，全程最硬一天" }],
  plan: ["清晨 Limo 湖倒影", "陡降 Val di Fanes 谷底", "沿一戰皇家獵兵之路遺線爬升", "傍晚抵達 Lagazuoi 山屋：露天一戰博物館、地雷戰爆破口、雲海夕陽與星空"],
  stay: { city: "山屋", status: "hut", name: "Rifugio Lagazuoi（2,752m）",
    note: "AV1 最搶手山屋，rifugiolagazuoi.com 一開放就要訂！睡雲端、看日出，此行最高的一夜" },
  warn: ["體力不夠的備案：在 Passo Falzarego 搭纜車上山屋，行程不減損風景"] },

{ day: 17, phase: "🥾 Alta Via 1 → Cortina", title: "AV1 第四天：一戰隧道 → 五塔峰 → 下山進 Cortina", areas: ["Alta Via 1", "Cortina"],
  transport: [
    { icon: "🥾", route: "Lagazuoi 一戰隧道下降 → Falzarego → Cinque Torri", time: "隧道下降約 1.5 小時（需頭燈），到五塔峰再 2 小時" },
    { icon: "🚌", route: "Passo Falzarego → Cortina（巴士）", time: "約 35 分", gm: ["Passo Falzarego", "Cortina d'Ampezzo"] }
  ],
  plan: ["走一戰隧道下山（1 公里岩中坑道，馬蒂尼岩棚、射擊孔）——怕黑可改前山步道", "順訪女巫石與特雷薩西要塞一戰博物館（Valparola 隘口）", "Cinque Torri 岩塔群＋露天戰壕博物館", "傍晚進 Cortina，領行李，大吃慶祝完走 AV1！"],
  stay: { city: "Cortina（3 晚）", status: "suggested", name: "Hotel Montana（市中心，CP 值高）或 Hotel de la Poste",
    note: "住 Corso Italia 徒步區周邊，餐廳、巴士站都在步行範圍" },
  warn: ["隧道內濕滑，頭燈＋手套必備，單向下行"] },

{ day: 18, phase: "🏔 Cortina", title: "Lago di Sorapis 翡翠湖步道", areas: ["Cortina"],
  transport: [
    { icon: "🚌", route: "Cortina → Passo Tre Croci（30/31 號巴士）", time: "約 20 分，登山口就在公路旁", gm: ["Cortina d'Ampezzo", "Passo Tre Croci"] }
  ],
  plan: ["215 號步道：森林 → 鋼索崖壁段 → 牛奶藍的索拉皮斯湖（單程 2.5 小時）", "Vandelli 山屋午餐", "原路折返，注意末班巴士時間"],
  stay: { city: "Cortina", status: "suggested", name: "同前晚", note: "" },
  warn: ["湖區禁止下水；鋼索段小心會用", "旺季步道人多，07:30 前的巴士出發體驗最好"] },

{ day: 19, phase: "🏔 Cortina", title: "Tofana di Mezzo 3,244m（天空之箭）", areas: ["Cortina"],
  transport: [
    { icon: "🚡", route: "Cortina 市區 → Ra Valles → Tofana di Mezzo（Freccia nel Cielo 三段纜車）", time: "全程約 30 分", note: "Cortina Vertical Pass 一日券約 €48" }
  ],
  plan: ["直上多洛米蒂第三高峰，360 度全景平台", "北望奧地利冰川、南眺威尼斯平原", "回望整趟走過的 Lagazuoi、三尖峰", "下午回 Cortina 逛街、買紀念品、打包"],
  stay: { city: "Cortina", status: "suggested", name: "同前晚", note: "" },
  warn: ["這天是彈性預備日：若前面行程延誤或天氣差，可自動變成緩衝日", "山頂 3,200m 氣溫低，帶保暖層；纜車看天氣營運"] },

{ day: 20, phase: "🇩🇪 慕尼黑", title: "Cortina → 慕尼黑", areas: ["慕尼黑"],
  transport: [
    { icon: "🚌", route: "Cortina → Dobbiaco（巴士）", time: "約 45 分，08:00 前出發", gm: ["Cortina d'Ampezzo", "Dobbiaco"] },
    { icon: "🚆", route: "Dobbiaco → Innsbruck（Pustertal 鐵路，Fortezza 轉車）", time: "約 2.5 小時", gm: ["Dobbiaco", "Innsbruck Hbf"] },
    { icon: "🚄", route: "Innsbruck → 慕尼黑中央車站（ICE/EC）", time: "約 1 小時 50 分", gm: ["Innsbruck Hbf", "München Hbf"] }
  ],
  plan: ["下午抵達：瑪麗恩廣場（看整點音樂鐘）、聖母教堂魔鬼腳印", "穀物市場吃白香腸配椒鹽捲餅", "晚上英式花園啤酒花園慶功——中國塔下乾一杯 Mass！"],
  stay: { city: "慕尼黑", status: "suggested", name: "Eden Hotel Wolff（中央車站正對面）或 25hours Hotel The Royal Bavarian",
    note: "住中央車站旁：明早 S8 直達機場，拖行李 3 分鐘" },
  warn: ["建議 08:00 前從 Cortina 出發，下午即可抵達慕尼黑"] },

{ day: 21, phase: "🇩🇪 回程", title: "慕尼黑機場出發", areas: ["慕尼黑"],
  transport: [
    { icon: "🚆", route: "München Hbf → 慕尼黑機場（S-Bahn S8）", time: "約 40 分，10 分鐘一班", gm: ["München Hbf", "Munich Airport"], note: "最晚 08:45 上車" }
  ],
  plan: ["09:30 前抵達機場完成報到", "✈️ 12:00 班機起飛，完美收尾！"],
  stay: { city: "—", status: "none", name: "", note: "" },
  warn: ["早上不要安排任何行程！"] }
];
