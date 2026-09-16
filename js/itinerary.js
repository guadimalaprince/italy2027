/* 22 天行程資料（2027/6/3 抵達巴黎 – 6/24 慕尼黑出發）
 * 多洛米蒂段順序：AV1(6/11–14) → Cortina → Dobbiaco → Ortisei
 * stay.status: "confirmed"（已訂）/ "suggested"（建議，未訂）/ "hut"（山屋，需預約）/ "none"
 * transport: from/to 給 Google Maps 路線連結用（gm: 交通模式，省略則不給連結）
 * pois: 對應 pois.js 的景點 id 前綴或 id 清單，用來抓當天照片
 */
var DAYS = [
{ day: 1, date: "6/3 週四", phase: "🇫🇷 巴黎", title: "抵達巴黎：凱旋門・小皇宮・鐵塔", areas: ["巴黎"],
  transport: [
    { icon: "✈️", route: "台北 TPE（6/2 晚間起飛）→ 巴黎 CDG", time: "08:05 抵達", note: "入境後跟著 RER 指標走" },
    { icon: "🚆", route: "CDG → 市區（RER B 線）", time: "約 35–50 分", gm: ["Charles de Gaulle Airport", "Châtelet–Les Halles, Paris"], note: "買 Navigo Easy 卡或機場單程票" }
  ],
  plan: ["凱旋門（可登頂看十二大道放射星形）", "沿香榭麗舍大道散步 → 小皇宮（免費館藏＋中庭咖啡座）", "亞歷山大三世橋就在小皇宮旁，順路拍", "傍晚：比爾哈凱姆橋鋼構框景拍鐵塔 → 特羅卡德羅 → 艾菲爾鐵塔（整點閃燈）"],
  stay: { city: "巴黎（1 晚）", status: "suggested", name: "ibis Paris Montparnasse Catalogne 或 Novotel Paris Centre Gare Montparnasse",
    note: "住蒙帕納斯／Denfert-Rochereau 一帶：明天傍晚去 Orly 機場最方便（OrlyBus 與 B 線都在 Denfert 發車）" },
  warn: ["時差日別排太滿，登凱旋門和鐵塔擇一登頂就好"] },

{ day: 2, date: "6/4 週五", phase: "🇫🇷 巴黎 → 拿坡里", title: "羅浮宮・聖母院 → 傍晚飛拿坡里", areas: ["巴黎", "拿坡里"],
  transport: [
    { icon: "✈️", route: "巴黎 Orly → 拿坡里 NAP（傍晚班機）", time: "約 2 小時 5 分", note: "市區到 Orly 約 40–60 分，起飛前 2 小時到機場" },
    { icon: "🚌", route: "拿坡里機場 → 市中心（Alibus 機場巴士）", time: "約 20 分，到中央車站與港口", gm: ["Naples Airport", "Napoli Centrale"] }
  ],
  plan: ["上午：羅浮宮（鎮館三寶動線約 3 小時，提前預約）", "杜樂麗花園 → 新橋 → 西堤島：聖禮拜堂（時間夠再進）、巴黎聖母院", "河對岸莎士比亞書店、塞納河畔書報攤", "下午取行李前往 Orly", "晚上拿坡里：Via dei Tribunali 吃正宗窯烤披薩！"],
  stay: { city: "拿坡里（1 晚）", status: "suggested", name: "Starhotels Terminus 或 UNAHOTELS Napoli（中央車站旁）",
    note: "住 Napoli Centrale 旁：明早搭 Circumvesuviana 去龐貝最方便，行李也可寄車站" },
  warn: ["羅浮宮建議一開門 09:00 進場，提前線上購票", "行李寄放住宿或車站寄物處，逛完再取", "Orly 與 CDG 是不同機場，別跑錯！"] },

{ day: 3, date: "6/5 週六", phase: "🇮🇹 龐貝 → 羅馬", title: "龐貝古城 → 傍晚進羅馬", areas: ["龐貝", "羅馬"],
  transport: [
    { icon: "🚆", route: "Napoli Garibaldi → Pompei Scavi（Circumvesuviana 私鐵）", time: "約 35 分", gm: ["Napoli Centrale", "Pompei Scavi"], note: "或加價搭有空調對號座的 Campania Express" },
    { icon: "🚆", route: "Pompei → Napoli Centrale → Roma Termini（高鐵）", time: "回拿坡里 35 分＋高鐵 1 小時 10 分", gm: ["Pompei Scavi", "Roma Termini"], note: "高鐵 Frecciarossa/Italo 建議先訂 16–17 點班次" }
  ],
  plan: ["08:30 開門就從海門進場（本站有 21 個定點語音導覽！）", "廣場看維蘇威火山 → 農牧神之家 → 維提之家 → 悲劇詩人之家", "妓院 → 豐饒大道 → 熱食店 → 圓形競技場 → 逃亡者花園", "體力夠加碼城外的神秘別墅（龐貝紅壁畫）", "午後回拿坡里轉高鐵，傍晚抵羅馬 check-in", "晚上：夜訪特雷維噴泉（飯店步行 8 分，打燈後超美，記得丟硬幣！）"],
  stay: { city: "羅馬（2 晚）", status: "confirmed", name: "Comfort Hotel Bolivar（Via della Cordonata 6, 00187 Roma）",
    note: "位置絕佳：緊鄰威尼斯廣場與圖拉真市場，步行到特雷維噴泉約 8 分、萬神廟 12 分、競技場 15 分" },
  warn: ["龐貝門票提前在 pompeiisites.org 買好，週六人多", "古城內遮蔭極少：帽子、水、防曬必備；大行李寄拿坡里車站寄物處（遺址入口也有免費寄物）"] },

{ day: 4, date: "6/6 週日", phase: "🇮🇹 羅馬", title: "羅馬一日：古羅馬＋老城精華", areas: ["羅馬"],
  transport: [
    { icon: "🚶", route: "飯店 → 競技場", time: "步行 15 分", gm: ["Piazza Venezia, Rome", "Colosseo, Rome"] }
  ],
  plan: ["08:30 鬥獸場開門就進場（外牆 → 看台 → 地板 → 地下層，6 個定點解說）", "君士坦丁凱旋門 → 古羅馬廣場 → 帕拉提諾山（三點聯票）", "下午：卡比托利歐廣場 → 萬神廟 → 納沃納廣場", "傍晚：花田廣場 → 過西斯托橋 → 越台伯河區晚餐"],
  stay: { city: "羅馬", status: "confirmed", name: "Comfort Hotel Bolivar（同前晚）",
    note: "古羅馬區從飯店走路就到：卡比托利歐廣場 3 分鐘、羅馬廣場入口 10 分鐘" },
  warn: ["6/6 是每月第一個週日『免費博物館日』：競技場免費入場但人潮爆炸、無法預約——務必 08:15 前到場排隊，或考慮改買付費導覽團快速通關", "西班牙階梯與人民廣場今天塞不下就割愛，重點留給古羅馬"] },

{ day: 5, date: "6/7 週一", phase: "🇮🇹 羅馬 → 佛羅倫斯", title: "梵蒂岡早場 → 高鐵北上佛羅倫斯", areas: ["梵蒂岡", "羅馬", "佛羅倫斯"],
  transport: [
    { icon: "🚌", route: "飯店（威尼斯廣場）→ 梵蒂岡（40 或 64 號公車）", time: "約 20 分", gm: ["Piazza Venezia, Rome", "Vatican Museums"], note: "行李先寄放飯店，中午回程領取再去 Termini 搭高鐵" },
    { icon: "🚄", route: "羅馬 Termini → 佛羅倫斯 SMN（Frecciarossa／Italo 高鐵）", time: "1 小時 32 分", gm: ["Roma Termini", "Firenze Santa Maria Novella"], note: "建議訂 15:00 或 16:00 班次較穩" }
  ],
  plan: ["08:00 梵蒂岡博物館入場（地圖廊 → 拉斐爾房間 → 西斯汀禮拜堂，約 3–4 小時）", "有時間再快閃聖彼得大教堂看聖殤像，回程順路聖天使堡外觀", "下午高鐵到佛羅倫斯，check-in", "傍晚老橋（Ponte Vecchio）散步、天主聖三橋看夕陽"],
  stay: { city: "佛羅倫斯", status: "suggested", name: "Hotel Croce di Malta 或 B&B Hotel Firenze City Center",
    note: "建議住 SMN 車站與主教座堂之間，拖行李 10 分鐘內，去比薩、去美術館都方便" },
  warn: ["梵蒂岡務必提前預約 08:00 入場票（museivaticani.va），週一開館"] },

{ day: 6, date: "6/8 週二", phase: "🇮🇹 佛羅倫斯", title: "比薩半日遊 → 佛羅倫斯老城", areas: ["比薩", "佛羅倫斯"],
  transport: [
    { icon: "🚆", route: "佛羅倫斯 SMN → 比薩中央（區間車）", time: "約 1 小時，每 30 分一班", gm: ["Firenze Santa Maria Novella", "Pisa Centrale"], note: "免預約，上車前記得打票" },
    { icon: "🚶", route: "比薩車站 → 奇蹟廣場", time: "步行 25 分或 LAM Rossa 公車 10 分", gm: ["Pisa Centrale", "Piazza dei Miracoli, Pisa"] }
  ],
  plan: ["上午：斜塔、主教座堂、洗禮堂（聽回音示範！）、奇蹟廣場", "中午前後回佛羅倫斯", "下午：中央市場吃牛肚包 → 主教座堂圓頂外觀 → 領主廣場", "傍晚：可上米開朗基羅廣場看夕陽"],
  stay: { city: "佛羅倫斯", status: "suggested", name: "同前晚", note: "" },
  warn: ["想爬斜塔要事先在 opapisa.it 訂時段票"] },

{ day: 7, date: "6/9 週三", phase: "🇮🇹 佛羅倫斯 → 波爾扎諾", title: "兩大美術館 → 北上多洛米蒂門戶", areas: ["佛羅倫斯", "波爾扎諾"],
  transport: [
    { icon: "🚄", route: "佛羅倫斯 SMN → 波爾扎諾（經 Bologna 轉車）", time: "約 3.5 小時，13:30 前後出發", gm: ["Firenze Santa Maria Novella", "Bolzano"], note: "Frecciarossa 到 Bologna 轉 EC/RV 直上 Bolzano" }
  ],
  plan: ["09:00 學院美術館：大衛像本尊（約 1.5 小時）", "11:00 烏菲茲美術館：波提切利『維納斯的誕生』（約 2.5 小時）", "下午火車北上", "傍晚逛波爾扎諾義德雙語老城：瓦爾特廣場、柱廊街、草藥廣場"],
  stay: { city: "波爾扎諾", status: "suggested", name: "Stadt Hotel Città（瓦爾特廣場上）或 Hotel Greif",
    note: "住老城中心，車站步行 5 分鐘，明早搭巴士方便" },
  warn: ["兩館都要提前預約指定時段（b-ticket 官方系統），排 09:00＋11:00 剛好接得上"] },

{ day: 8, date: "6/10 週四", phase: "🏔 東多洛米蒂", title: "冰人博物館 → 進駐布萊耶斯湖", areas: ["波爾扎諾", "Alta Via 1"],
  transport: [
    { icon: "🚆", route: "波爾扎諾 → Fortezza → Dobbiaco（普斯特里亞線）", time: "約 2 小時", gm: ["Bolzano", "Dobbiaco"], note: "Fortezza 轉車" },
    { icon: "🚌", route: "Dobbiaco → Lago di Braies（442 號巴士）", time: "約 20 分", gm: ["Dobbiaco", "Lago di Braies"], note: "旺季 09:30–16:00 管制自駕，搭巴士最單純" }
  ],
  plan: ["09:00 南蒂羅爾考古博物館看冰人奧茨（約 1.5 小時）", "中午前東行，午餐在 Dobbiaco 解決", "下午進駐布萊耶斯湖，環湖一圈約 1 小時", "傍晚日歸遊客散去後湖面最平靜——拍倒影的黃金時段", "早睡：明天開始揹包上山"],
  stay: { city: "布萊耶斯湖／Villabassa", status: "suggested", name: "Hotel Lago di Braies（湖畔，AV1 起登點）或 Hotel Adler Villabassa",
    note: "住湖畔最省事，隔天出門就是登山口；訂不到就住 Villabassa／Dobbiaco，搭首班巴士上來" },
  warn: ["⚠️ 明天起連走四天：今晚把大行李寄放山下旅館，只帶上山必需品（山屋有寢具，需自備睡袋內襯）", "⚠️ Rifugio Biella（明晚）尚未訂房——六月中旬山屋才陸續開門，請盡快確認 2027 開放日並訂位"] },

{ day: 9, date: "6/11 週五", phase: "🥾 Alta Via 1", title: "AV1 第一天：布萊耶斯湖 → Biella 山屋", areas: ["Alta Via 1"],
  transport: [
    { icon: "🥾", route: "Lago di Braies → Rifugio Biella", time: "約 3.5 小時，爬升 1,000m" }
  ],
  plan: ["沿湖東岸走到南岸的 AV1 起登點", "之字坡陡上 Forcella Sora Forno 埡口", "午後抵達 Biella 山屋（2,327m）", "體力有餘可輕鬆爬 Croda del Becco 看全景", "第一天刻意排短：讓身體適應揹包與高度"],
  stay: { city: "Rifugio Biella（2,327m）", status: "hut", name: "Rifugio Biella / Seekofelhütte",
    note: "⚠️ 尚未訂房——請先確認 2027 開放日期" },
  warn: ["山屋需自備睡袋內襯；部分山屋不收信用卡，帶現金", "路上沒有水源，出發前在山下把水裝滿"] },

{ day: 10, date: "6/12 週六", phase: "🥾 Alta Via 1", title: "AV1 第二天：高原牧場 → Fanes", areas: ["Alta Via 1"],
  transport: [
    { icon: "🥾", route: "Biella → Sennes → Fodara Vedla → Pederü → Fanes", time: "約 5 小時" }
  ],
  plan: ["穿越 Sennes 高原：喀斯特地形與放牧草原，視野開闊好走", "Fodara Vedla 百年木造山屋喝一杯", "陡下 Pederü 谷底（落差 500m，護膝／登山杖）再緩上 Fanes", "Fanes 高原是 Ladin 傳說的核心舞台——今晚就住在傳說中的銀色王國"],
  stay: { city: "Rifugio Fanes（2,060m）", status: "confirmed", name: "Rifugio Fanes",
    booking: { room: "獨立房間附衛浴", total: 499, paid: 250, board: "含早餐＋晚餐（半食宿）" },
    note: "已訂房，抵達後直接報名字即可" },
  warn: [] },

{ day: 11, date: "6/13 週日", phase: "🥾 Alta Via 1", title: "AV1 第三天：全程最硬 → Lagazuoi 2,752m", areas: ["Alta Via 1"],
  transport: [
    { icon: "🥾", route: "Fanes → Limo 湖 → Forcella del Lago → Lagazuoi", time: "約 6.5 小時，全程最長最硬" }
  ],
  plan: ["清晨出發：今天路長，下午容易起雷雨", "Limo 湖與 Limo 埡口 → 翻過 Forcella del Lago（2,486m）", "接皇家獵兵之路 Kaiserjägersteig 陡上 Lagazuoi", "傍晚在山屋露台看夕陽染紅 Tofane 與 Marmolada——這是全程最好的一晚"],
  stay: { city: "Rifugio Lagazuoi（2,752m）", status: "confirmed", name: "Rifugio Lagazuoi",
    booking: { room: "上下舖通鋪，共用衛浴", total: 360, paid: 180, board: "含早餐＋晚餐（半食宿）" },
    note: "已訂房。全多洛米蒂景觀最好的山屋之一，露台正對日落" },
  warn: ["⚠️ Forcella del Lago 是北向高繞，六月中殘雪機率高——出發前向 Fanes 山屋確認雪況，必要時帶微型冰爪", "今天沒有中途補給點，水與行動糧要帶足"] },

{ day: 12, date: "6/14 週一", phase: "🥾 Alta Via 1 → Cortina", title: "AV1 第四天：一戰隧道下山 → 進 Cortina", areas: ["Alta Via 1", "Cortina"],
  transport: [
    { icon: "🥾", route: "Lagazuoi → 一戰隧道 → Passo Falzarego", time: "隧道下切約 1 小時（或搭纜車 3 分鐘）" },
    { icon: "🚌", route: "Passo Falzarego → Cortina（Dolomitibus 466）", time: "約 25 分", gm: ["Passo Falzarego", "Cortina d'Ampezzo"] }
  ],
  plan: ["穿越 Lagazuoi 一戰隧道下山（頭燈必備！義軍在岩壁裡挖出的坑道）", "馬蒂尼岩棚、女巫石：一戰前線遺跡", "Falzarego 隘口：特雷薩西要塞博物館", "順路上五塔峰露天博物館，Averau 山屋吃午餐", "下午進 Cortina：洗澡、吃一頓好的、把登山鞋晾乾"],
  stay: { city: "Cortina（3 晚）", status: "suggested", name: "Hotel Montana（市中心，CP 值高）或 Hotel de la Poste",
    note: "連住 3 晚：今晚純休息，接下來兩天走 Sorapis 與 Tofana" },
  warn: ["隧道內濕滑陰暗，頭燈與手套必備；不想走隧道可直接搭纜車下 Falzarego"] },

{ day: 13, date: "6/15 週二", phase: "🏔 Cortina", title: "Lago di Sorapis 翡翠湖", areas: ["Cortina"],
  transport: [
    { icon: "🚌", route: "Cortina → 三十字隘口 Passo Tre Croci（30/31 號巴士）", time: "約 20 分", gm: ["Cortina d'Ampezzo", "Passo Tre Croci"] }
  ],
  plan: ["215 號步道往 Sorapis 湖（單程 2 小時，有鐵索與棧道路段）", "冰河粉末造就的螢光藍綠湖水，背景是 Dito di Dio 上帝之指", "Vandelli 山屋午餐", "原路折返搭巴士回 Cortina"],
  stay: { city: "Cortina", status: "suggested", name: "同前晚", note: "" },
  warn: ["湖區禁止戲水與露營；步道後段有暴露感，懼高者注意", "熱門路線，搭早班巴士出發避開人潮"] },

{ day: 14, date: "6/16 週三", phase: "🏔 Cortina", title: "Tofana di Mezzo 3,244m（天空之箭）", areas: ["Cortina"],
  transport: [
    { icon: "🚡", route: "Freccia nel Cielo 三段纜車直上 3,244m", time: "約 20 分", note: "起點站就在 Cortina 鎮上" }
  ],
  plan: ["三段纜車登上多洛米蒂最易達的三千米級山頂", "Ra Valles 中站：1956 冬奧遺跡與終年雪原", "山頂 360 度展望——回望這幾天走過的 Lagazuoi 與 Fanes 高原", "下午 Corso Italia 散步、買伴手禮"],
  stay: { city: "Cortina", status: "suggested", name: "同前晚", note: "" },
  warn: ["山頂 3,244m 比鎮上低 15–20 度，務必帶防風外套"] },

{ day: 15, date: "6/17 週四", phase: "🏔 Dobbiaco", title: "移動到 Dobbiaco → Tre Cime 三尖峰環線", areas: ["Dobbiaco / Tre Cime"],
  transport: [
    { icon: "🚌", route: "Cortina → Dobbiaco（Cortina Express／445 號巴士）", time: "約 1 小時", gm: ["Cortina d'Ampezzo", "Dobbiaco"], note: "Cortina 沒有火車站，北上 Dobbiaco 接鐵路是唯一出口——順路不繞" },
    { icon: "🚌", route: "Dobbiaco → Auronzo 山屋（Tre Cime 接駁）", time: "約 50 分", gm: ["Dobbiaco", "Rifugio Auronzo"] }
  ],
  plan: ["上午移動並 check-in、寄放行李", "下午 Tre Cime 環線（10 公里，約 4 小時，順時針走）", "Lavaredo 埡口看三尖峰經典角度 → Locatelli 山屋看北壁", "夕陽時三座岩塔會燒成橘紅色"],
  stay: { city: "Dobbiaco（2 晚）", status: "suggested", name: "Hotel Santer 或 Hotel Laurin",
    note: "Dobbiaco 是普斯特里亞線的車站小鎮，後天往 Ortisei 的火車從這裡發車" },
  warn: ["Tre Cime 接駁與停車需預約（trecime.it），旺季名額有限", "環線海拔 2,300–2,450m，午後易起霧，早點上山"] },

{ day: 16, date: "6/18 週五", phase: "🏔 Dobbiaco", title: "米蘇里納湖 ＋ Cadini 山群（魔戒之路）", areas: ["Dobbiaco / Tre Cime"],
  transport: [
    { icon: "🚌", route: "Dobbiaco → 米蘇里納湖", time: "約 40 分", gm: ["Dobbiaco", "Lago di Misurina"] }
  ],
  plan: ["米蘇里納湖環湖：多洛米蒂最大的天然湖，湖面倒映 Sorapis", "Col de Varda 纜車上去接 Cadini 觀景點——像魔戒場景的鋸齒岩峰群", "Fonda Savio 山屋", "回程順路多比亞科湖，傍晚整理行李"],
  stay: { city: "Dobbiaco", status: "suggested", name: "同前晚", note: "" },
  warn: ["Cadini 觀景岩台沒有護欄，拍照請退後一步"] },

{ day: 17, date: "6/19 週六", phase: "🏔 西多洛米蒂", title: "移動日：順道 Val di Funes → 進駐 Ortisei", areas: ["Val di Funes", "Val Gardena"],
  transport: [
    { icon: "🚆", route: "Dobbiaco → Fortezza → Bressanone", time: "約 1.5 小時", gm: ["Dobbiaco", "Bressanone"], note: "Bressanone 車站有寄物櫃——大行李丟著再去 Funes" },
    { icon: "🚌", route: "Bressanone → 聖瑪達肋納（Val di Funes，330/331 號巴士）", time: "約 40 分", gm: ["Bressanone", "Santa Maddalena, Funes"] },
    { icon: "🚌", route: "Bressanone → Ponte Gardena → Ortisei（350 號巴士）", time: "約 1.5 小時", gm: ["Bressanone", "Ortisei"] }
  ],
  plan: ["把 Val di Funes 塞進移動日：反正 Bressanone 本來就是必經的轉車點", "聖瑪達肋納觀景點——多洛米蒂最知名的那張構圖", "Ranui 聖若望小教堂（私人土地，觀景平台需付小額門票）", "時間夠可走一段 Adolf Munkel 步道（平緩人少）", "傍晚回 Bressanone 取行李 → 進駐 Ortisei，晚上逛木雕小鎮"],
  stay: { city: "Ortisei（4 晚）", status: "suggested", name: "Hotel Angelo Engel（鎮中心）或 Adler Dolomiti Spa & Sport Resort",
    note: "連住 4 晚建議選含早餐、有 spa 的旅館；多數旅館含 Val Gardena Mobil Card 可免費搭區內巴士" },
  warn: ["今天轉乘多、行李重，建議一早出發；不想折騰的話 Funes 可捨棄，Dobbiaco 直達 Ortisei 約 3 小時", "抵達後到遊客中心買 Gardena Card（3 天 €124）"] },

{ day: 18, date: "6/20 週日", phase: "🏔 Val Gardena", title: "Seceda 刀鋒稜線", areas: ["Val Gardena"],
  transport: [
    { icon: "🚡", route: "Ortisei → Furnes → Seceda 纜車（兩段）", time: "約 15 分直上 2,500m", note: "Gardena Card Day 1" }
  ],
  plan: ["Seceda 稜線步道：Odle 峰群 45 度斜切大景", "山頂十字架 → 沿稜線散步，山屋午餐", "下午原路纜車下山，或走步道下到中站"],
  stay: { city: "Ortisei", status: "suggested", name: "同前晚", note: "" },
  warn: ["2026 起新規：Seceda 纜車需在 seceda.it 提前預約時段！", "山頂比山下低 10 度，帶風衣"] },

{ day: 19, date: "6/21 週一", phase: "🏔 Val Gardena", title: "Alpe di Siusi 修斯高原", areas: ["Val Gardena"],
  transport: [
    { icon: "🚡", route: "Ortisei → Mont Sëuc 纜車（直上高原）", time: "約 10 分", note: "Gardena Card Day 2" }
  ],
  plan: ["歐洲最大高山草原漫步（可租電動登山車）", "正面遠望 Sassolungo 山群", "傍晚看草原染金再下山"],
  stay: { city: "Ortisei", status: "suggested", name: "同前晚", note: "" },
  warn: [] },

{ day: 20, date: "6/22 週二", phase: "🏔 Val Gardena", title: "Sassolungo 棺材纜車（或 Rosengarten 鐵索）", areas: ["Val Gardena", "卡雷扎湖 / Rosengarten"],
  transport: [
    { icon: "🚌", route: "Ortisei → Passo Sella（巴士）", time: "約 40 分", gm: ["Ortisei", "Passo Sella"], note: "Gardena Card Day 3（最後一天）" },
    { icon: "🚡", route: "Passo Sella → Forcella del Sassolungo（立式吊籃纜車）", time: "約 10 分", note: "兩人一籃的復古『棺材纜車』，邊走邊跳上車！" }
  ],
  plan: ["主案：Forcella del Sassolungo（2,681m）三面峭壁壓頂 → Toni Demetz 小屋", "替代案：Rosengarten 薔薇園 Santner Pass 鐵索攀岩（經波爾扎諾轉車約 2 小時，需吊帶＋確保組）", "輕鬆案：卡雷扎湖彩虹湖環湖", "下午回 Ortisei 打包，明天長途移動"],
  stay: { city: "Ortisei", status: "suggested", name: "同前晚", note: "" },
  warn: ["吊籃纜車無預約制、風大會停駛，早上出發最穩", "Rosengarten 原本排在 6/10，改成 AV1 先行後只能從 Ortisei 當天來回，時間偏緊——當作備案即可"] },

{ day: 21, date: "6/23 週三", phase: "🇩🇪 慕尼黑", title: "Ortisei → 慕尼黑", areas: ["慕尼黑"],
  transport: [
    { icon: "🚌", route: "Ortisei → Ponte Gardena/Chiusa（350 號巴士）", time: "約 35 分，08:00 前出發", gm: ["Ortisei", "Ponte Gardena"] },
    { icon: "🚄", route: "Ponte Gardena／波爾扎諾 → 慕尼黑中央車站（EC 直達，經布倫納）", time: "約 4.5 小時", gm: ["Bolzano", "München Hbf"], note: "比原本從 Cortina 出發少一次轉車、快約 1 小時" }
  ],
  plan: ["中午前後抵達：瑪麗恩廣場（看整點音樂鐘）、聖母教堂魔鬼腳印", "穀物市場吃白香腸配椒鹽捲餅", "晚上英式花園啤酒花園慶功——中國塔下乾一杯 Mass！"],
  stay: { city: "慕尼黑", status: "suggested", name: "Eden Hotel Wolff（中央車站正對面）或 25hours Hotel The Royal Bavarian",
    note: "住中央車站旁：明早 S8 直達機場，拖行李 3 分鐘" },
  warn: ["EC 直達班次一天數班，建議先訂位"] },

{ day: 22, date: "6/24 週四", phase: "🇩🇪 回程", title: "慕尼黑機場出發", areas: ["慕尼黑"],
  transport: [
    { icon: "🚆", route: "München Hbf → 慕尼黑機場（S-Bahn S8）", time: "約 40 分，10 分鐘一班", gm: ["München Hbf", "Munich Airport"], note: "最晚 08:45 上車" }
  ],
  plan: ["09:30 前抵達機場完成報到", "✈️ 12:00 班機起飛，完美收尾！"],
  stay: { city: "—", status: "none", name: "", note: "" },
  warn: ["早上不要安排任何行程！"] }
];
