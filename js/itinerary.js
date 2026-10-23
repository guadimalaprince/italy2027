/* 22 天行程資料（2027/6/3 抵達巴黎 – 6/24 慕尼黑出發）
 * 多洛米蒂段順序：AV1(6/11–14) → Cortina → Dobbiaco → Ortisei
 * stay.status: "confirmed"（已訂）/ "suggested"（建議，未訂）/ "hut"（山屋，需預約）/ "none"
 * transport: from/to 給 Google Maps 路線連結用（gm: 交通模式，省略則不給連結）
 * pois: 對應 pois.js 的景點 id 前綴或 id 清單，用來抓當天照片
 */
var DAYS = [
{ day: 1, date: "6/3 週四", phase: "🇫🇷 巴黎", title: "巴黎全日：旅館周邊 → 休息 → 凱旋門・鐵塔", areas: ["巴黎"],
  transport: [
    { icon: "✈️", route: "<b>BR087</b>　台北 TPE 第二航廈 6/2(三) 23:30 → 巴黎 CDG <b>第一航廈</b>", time: "6/3(四) 08:05 抵達，飛行 14 小時 35 分", note: "長榮商務艙（D），波音 777，免費託運 <b>2 件、每件上限 32 公斤</b>。訂位代號 <b>5AV9GX</b>。\n機上盡量睡後半段：巴黎時間 21:00 睡到 06:00，落地時只醒 2 小時。一上機就睡死的話，半夜會醒、落地前已醒 6 小時" },
    { icon: "🚕", route: "CDG 第一航廈 → 旅館（計程車，政府定額）", time: "約 45–60 分", gm: ["Charles de Gaulle Airport Terminal 1", "39 Rue des Bourdonnais, 75001 Paris"], note: "右岸定額約 €56／車（含行李，三人分攤每人約 €19）。往 Taxi 官方排班處，別理航廈內拉客的。\n⚠️ <b>CDG 第一航廈</b>不是最大的 2 航廈，排班處與 CDGVAL 接駁的位置不同，落地前先看一下航廈圖" },
    { icon: "🚇", route: "16:00 旅館 → 協和廣場（地鐵 1 號線）", time: "約 15 分", gm: ["Châtelet, Paris", "Place de la Concorde, Paris"], note: "下午往西的起點。走路也可以（約 35 分，穿杜樂麗），但留點體力給晚上" },
    { icon: "🚇", route: "凱旋門 → 比爾哈凱姆（地鐵 6 號線，直達）", time: "約 8 分", gm: ["Arc de Triomphe, Paris", "Bir-Hakeim, Paris"] }
  ],
  plan: ["<b>── 10:00–15:00　旅館周邊（全程步行 15 分內）──</b>",
    "10:00 到旅館寄放行李（check-in 要等 15:00）",
    "新橋 → 西堤島散步 → <b>聖禮拜堂</b>（11:00 前後，需預約時段，約 40 分）",
    "莎士比亞書店路過拍照、塞納河畔書報攤翻一翻",
    "<b>13:00 午餐吃大一點</b>——身體時間是 19:00，剛好是正餐時段，把主餐放中午",
    "羅浮宮<b>只看外觀</b>：玻璃金字塔與方庭 → 杜樂麗花園（綠鐵椅坐一下）",
    "<b>── 15:00–16:00　旅館休息 ──</b>",
    "15:00 check-in。⚠️ 不要躺床上睡滿一小時——沖澡 20 分 → 換衣服整理隨身包 → 腳抬高閉眼 20 分（<b>設鬧鐘</b>）",
    "<b>── 16:00 出發往西 ──</b>",
    "16:30 小皇宮（免費館藏，<b>18:00 閉館</b>）→ 17:15 亞歷山大三世橋",
    "17:30 香榭麗舍大道往上走（2 公里，約 30 分）",
    "<b>18:30 凱旋門：無名戰士墓永恆之火「復燃儀式」</b>（每晚 18:30；不登頂，重點在這）",
    "19:15 晚餐——<b>吃輕、吃快，別坐超過 45 分鐘</b>（身體時間凌晨 1:15，久坐會斷電）",
    "20:15 地鐵 6 號線 → 20:30 比爾哈凱姆橋（鋼構迴廊框鐵塔）",
    "21:00 特羅卡德羅 → <b>21:50 日落 → 22:00 鐵塔整點閃燈</b>",
    "22:30 回旅館，23:00 前睡"],
  stay: { city: "巴黎（1 晚）", status: "suggested", name: "39 Rue des Bourdonnais, 75001 Paris（1 區，Châtelet／Les Halles 之間）",
    note: "<b>⚠️ 尚未下訂</b>——已選定這個位置，但訂房還沒完成。\n位置極佳：Châtelet 站步行 3 分（14 號線直達 Orly，零轉乘）、羅浮宮 8–10 分、新橋 5 分、西堤島 10 分。\n⚠️ 只住一晚、6/4 一早就要趕 Orly，<b>先確認行李可否提早寄放與退房時間</b>。" },
  warn: ["<b>時差：巴黎慢台北 6 小時。最想睡的是 17:00–20:00</b>（身體以為 23:00–02:00），剛好是香榭麗舍到凱旋門那一段——<b>保持走動，別久坐</b>",
    "<b>15:00 之後除了那一小時，不要再躺下</b>；撐到 22:00 再睡。傍晚的陽光會把生理時鐘往後推，正是向西飛需要的方向",
    "咖啡因用在 13:00–16:00 那一波，<b>16:00 後停</b>",
    "聖禮拜堂要線上預約時段（sainte-chapelle.fr），是付費景點；安檢排隊可能 20–30 分",
    "凱旋門要走<b>地下道</b>過去，別橫越圓環車陣",
    "Châtelet–Les Halles 扒手密度高；晚上回旅館走 Rue de Rivoli 那側（寬、亮、人多）"] },

{ day: 2, date: "6/4 週五", phase: "🇫🇷 巴黎 → 拿坡里", title: "塞納河晨走 → 中午飛拿坡里 → 拿坡里半日", areas: ["巴黎", "拿坡里"],
  transport: [
    { icon: "🚇", route: "旅館 → Châtelet → Orly 機場（地鐵 14 號線直達）", time: "步行 3 分＋車程約 27 分", gm: ["Châtelet, Paris", "Aéroport d'Orly"], note: "<b>最晚 09:45 出門</b>，約 10:20 到 Orly。14 號線零轉乘、不受路況影響，這段趕飛機不要改叫計程車。\n⚠️ 車票要買<b>「Paris Region ↔ Airports」機場票（約 €14／人）</b>，一般 t+ 單程票不能進 Orly 站。\n⚠️ <b>14 號線的站在 Orly 3／4 那一側，你們要去的是 Orly 1</b>——下車後還要走一段或搭免費接駁，預留 10–15 分鐘（確切時間未查證，落地前看一下機場圖）。" },
    { icon: "✈️", route: "<b>EJU4953</b>　巴黎 Orly <b>ORY1</b> 12:35 → 拿坡里 NAP 14:50", time: "約 2 小時 15 分", note: "訂位代號 <b>KDLJ94T</b>。總額 <b>€352.53</b>（3 人，含 <b>3 件 23 公斤托運行李</b>）。\n<b>行李託運櫃台 10:35 開、11:55 關</b>——這才是真正的死線，不是 12:35。\n線上報到 2027/5/5 18:35 開放。法義同時區，不用調錶。" },
    { icon: "🚌", route: "拿坡里機場 → 市中心（Alibus 機場巴士）", time: "約 20 分，約 15:45 進市區", gm: ["Naples Airport", "Napoli Centrale"], note: "<b>拿坡里不買套票</b>——只住一晚，Alibus 與隔天去龐貝的車票各自單買就好，交通卡划不來" }
  ],
  plan: ["07:30 出旅館，塞納河畔晨走：新橋 → 西堤島（清晨無人，光線最好）",
    "<b>07:50 聖母院開門</b>（週五 07:50–19:00，入場免費）：第一批進場約 40 分鐘，08:30 出來、08:45 回旅館，離 09:45 還有一小時緩衝",
    "09:00 回旅館取行李，09:45 出發",
    "14:40 抵達拿坡里 → Alibus 進市區 check-in",
    "下午：斯帕卡拿坡里老街 → 公民投票廣場 → 翁貝托一世拱廊",
    "傍晚：蛋堡與海濱大道看維蘇威火山剪影",
    "晚上：Via dei Tribunali 吃正宗窯烤披薩！"],
  stay: { city: "拿坡里（1 晚）", status: "suggested", name: "Dimora Neapolis Deluxe（走官網直訂，約 €108）",
    note: "<b>已決定這家，用官網直訂</b>（不走 OTA）。價格約 €108。\n明早要搭 Circumvesuviana 去龐貝，出發前先查一下從住處走到 Napoli Centrale／Porta Nolana 要多久，行李可寄車站。" },
  warn: ["<b>真正的死線是 11:55 行李託運關櫃</b>（10:35 開櫃），不是 12:35 起飛。09:45 出門 → 約 10:20 到站 → 轉到 Orly 1 約 10:35，剛好開櫃，還有 80 分鐘緩衝。14 號線往 Orly 方向是逆尖峰，不會塞",
    "<b>登機門在 ORY1</b>，但 14 號線停在 Orly 3／4 側，下車後要再移動一段",
    "早餐可能趕不上旅館供應時段，前一晚先買好或到機場吃",
    "聖禮拜堂 09:00、莎士比亞書店 10:00 才開門，今早都來不及——已移到 6/3。聖母院 07:50 開門是唯一趕得上的",
    "Orly 與 CDG 是不同機場，別跑錯！",
    "票務：Navigo 日票<b>不含</b>機場、週票是固定週一到週日（6/3 是週四會浪費），兩趟機場單買機場票反而最省——詳見待辦頁"] },

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
  warn: ["梵蒂岡務必提前預約 08:00 入場票（museivaticani.va），週一開館",
    "<b>64 號公車是羅馬扒手最惡名昭彰的一條線</b>（Termini ↔ 梵蒂岡，整車觀光客）。多個治安指南都點名這班。背包背前面，或改搭 40 號快線——同樣擁擠但停站少。\n羅馬的風險是扒竊不是暴力犯罪，另一個熱點是尖峰時段的地鐵與 Termini 周邊"] },

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
  warn: ["明天起連走四天：今晚把大行李寄放山下旅館，只帶上山必需品（山屋有寢具，需自備睡袋內襯）", "Rifugio Biella（明晚）尚未訂房——六月中旬山屋才陸續開門，請盡快確認 2027 開放日並訂位"] },

{ day: 9, date: "6/11 週五", phase: "🥾 Alta Via 1", title: "AV1 第一天：布萊耶斯湖 → Sennes 山屋", areas: ["Alta Via 1"],
  transport: [
    { icon: "🥾", route: "Lago di Braies → Forcella Sora Forno → Biella → Sennes", time: "約 5 小時，爬升 1,000m" }
  ],
  plan: ["沿湖東岸走到南岸的 AV1 起登點", "之字坡陡上 Forcella Sora Forno 埡口（全天最硬的一段）", "Biella 山屋休息、補水（2,327m）", "續行穿越 Sennes 高原：喀斯特地形與放牧草原，平緩好走", "午後抵 Sennes 山屋（2,126m）"],
  stay: { city: "Rifugio Sennes（2,126m）", status: "hut", name: "Rifugio Sennes / Senneshütte",
    note: "⚠️ 尚未訂房——店家表示 2026/11/4 開放訂房，當天就去訂" },
  warn: ["山屋需自備睡袋內襯；部分山屋不收信用卡，帶現金", "Biella 之前沒有水源，出發前在湖畔把水裝滿"] },

{ day: 10, date: "6/12 週六", phase: "🥾 Alta Via 1", title: "AV1 第二天：高原牧場 → Fanes", areas: ["Alta Via 1"],
  transport: [
    { icon: "🥾", route: "Sennes → Fodara Vedla → Pederü → Fanes", time: "約 3.5 小時（比第一天輕鬆）" }
  ],
  plan: ["今天路程短，可以睡飽再走", "Fodara Vedla 百年木造山屋喝一杯", "陡下 Pederü 谷底（落差 500m，護膝／登山杖）再緩上 Fanes", "Fanes 高原是 Ladin 傳說的核心舞台——今晚就住在傳說中的銀色王國"],
  stay: { city: "Rifugio Fanes（2,060m）", status: "confirmed", name: "Rifugio Fanes",
    booking: { room: "Stöa de Dolasilla – Piz Stiga（大床或分床，附私人衛浴）", people: 3, nights: 1, total: 499.5, paid: 250, board: "含早餐＋晚餐（半食宿）", ref: "Offer 4270/2026" },
    note: "已訂房，抵達後直接報名字即可" },
  warn: [] },

{ day: 11, date: "6/13 週日", phase: "🥾 Alta Via 1", title: "AV1 第三天：全程最硬 → Lagazuoi 2,752m", areas: ["Alta Via 1"],
  transport: [
    { icon: "🥾", route: "Fanes → Limo 湖 → Forcella del Lago → Lagazuoi", time: "約 6.5 小時，全程最長最硬" }
  ],
  plan: ["清晨出發：今天路長，下午容易起雷雨", "Limo 湖與 Limo 埡口 → 翻過 Forcella del Lago（2,486m）", "接皇家獵兵之路 Kaiserjägersteig 陡上 Lagazuoi", "傍晚在山屋露台看夕陽染紅 Tofane 與 Marmolada——這是全程最好的一晚"],
  stay: { city: "Rifugio Lagazuoi（2,752m）", status: "confirmed", name: "Rifugio Lagazuoi",
    booking: { room: "通鋪上下舖 3 床，共用衛浴", people: 3, nights: 1, total: 360, paid: 180, board: "含早餐＋晚餐（半食宿）", ref: "Lag-2026-09-16-46937" },
    note: "已訂房。全多洛米蒂景觀最好的山屋之一，露台正對日落" },
  warn: ["Forcella del Lago 是北向高繞，六月中殘雪機率高——出發前向 Fanes 山屋確認雪況，必要時帶微型冰爪", "今天沒有中途補給點，水與行動糧要帶足"] },

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
  plan: ["中午前後抵達：瑪麗恩廣場（看整點音樂鐘）、聖母教堂魔鬼腳印", "穀物市場吃白香腸配椒鹽捲餅",
    "傍晚英式花園：先到衝浪橋看 Eisbach 駐波（2026/5 才重新開放，限有經驗者）",
    "<b>想漂流的話往下游走</b>——這一段是慕尼黑人夏天的消暑方式，但先看下面的警示",
    "晚上中國塔啤酒花園慶功——乾一杯 Mass！"],
  stay: { city: "慕尼黑", status: "confirmed", name: "Downtown Vi Vadi Hotel（Marsstraße 6-10，Maxvorstadt）",
    booking: { room: "Double or Twin Room ＋ 1 張加床", people: 3, nights: 1, board: "未含早餐（Room Only）", ref: "Agoda 1789322094" },
    note: "<b>車站北側，步行約 250 公尺</b>，明早 S8 直達機場。Agoda 訂，MasterCard 尾號 1704 付款。\n<b>✅ 可免費取消至 2027/6/22</b>——6/22 之後取消或 no-show 收全額。\n含快速入住與免費 WiFi；備註已填 NonSmoke、LargeBed（依現場供應狀況）。\n⚠️ <b>入住要出示與訂房人同名、且有地址的附照片證件。</b>\n⚠️ 不含早餐；房內無空調（只有強力電扇）。" },
  warn: ["EC 直達班次一天數班，建議先訂位",
    "<b>⚡ 6/22–25 Messe München 三展同期</b>（automatica、LASER World of PHOTONICS、World of QUANTUM），6/23 正好是尖峰——房價約翻倍且可能訂不到。<b>現在就訂可免費取消的房間卡位</b>，別等",
    "車站南側（Schillerstr./Landwehrstr./Bayerstr.）入夜後是紅燈區，Alter Botanischer Garten 附近有毒品活動、扒手多。主要風險是扒竊而非暴力犯罪，但從中國塔喝完回來走北側比較安心",
    "<b>Eisbach 漂流：慕尼黑市規定河道禁止游泳</b>。夏天大量市民照漂、警方多半默許，但不是合法活動，出事自負",
    "水溫全年約 10°C、盛夏也只有 <b>14–17°C</b>；水流比看起來強，淺處僅半公尺且有暗樁與橋墩，<b>每年都有意外、出過人命</b>",
    "<b>沒有官方標示的上下岸點</b>——先在岸邊看二十分鐘，確認別人從哪下水、從哪上岸再決定",
    "要下水就帶泳衣與快乾毛巾（登山裝備裡應該有）；貴重物品別留岸邊無人看管"] },

{ day: 22, date: "6/24 週四", phase: "🇩🇪 回程", title: "慕尼黑機場出發", areas: ["慕尼黑"],
  transport: [
    { icon: "🚆", route: "München Hbf → 慕尼黑機場（S-Bahn S8）", time: "約 40 分，10 分鐘一班", gm: ["München Hbf", "Munich Airport"], note: "最晚 08:45 上車。飯店在 Marsstraße，走到 Hbf 約 250 公尺" },
    { icon: "✈️", route: "<b>BR072</b>　慕尼黑 MUC <b>第二航廈</b> 12:00 → 台北 TPE 第二航廈", time: "6/25(五) 06:35 抵達，飛行 12 小時 35 分", note: "長榮商務艙（D），波音 777，託運 2 件各 32 公斤。訂位代號 <b>5AV9GX</b>" },
    { icon: "✈️", route: "<b>BR255</b>　台北 TPE 第二航廈 6/25(五) 09:50 → 峇里島 DPS", time: "15:15 抵達", note: "⚠️ <b>接續航段，桃園只停留 3 小時 15 分</b>" }
  ],
  plan: ["09:30 前抵達機場完成報到（MUC 第二航廈）", "✈️ 12:00 BR072 起飛", "6/25 06:35 回到桃園 → <b>09:50 轉 BR255 飛峇里島</b>"],
  stay: { city: "—", status: "none", name: "", note: "" },
  warn: ["早上不要安排任何行程！",
    "<b>6/25 桃園只有 3 小時 15 分轉機</b>（06:35 落地 → 09:50 起飛）。同一訂位代號、同為第二航廈，但<b>林劭學與另外兩人的機票號碼分屬不同票號序列</b>，行李是否直掛峇里島<b>要先跟長榮確認</b>——若不直掛，得入境提行李再重新報到，3 小時會很緊",
    "機票須<b>按順序使用</b>：前段未搭，後段會被取消。6/24 這班若沒搭上，6/25 的峇里島段也會失效",
    "多洛米蒂買的東西注意重量——託運雖有 2 件 ×32 公斤，但登機箱與液體規定照舊"] }
];
