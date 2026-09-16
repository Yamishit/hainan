const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

const runtimePath = 'C:/Users/shaokang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium} = require(path.join(runtimePath, 'playwright'));
const sharp = require(path.join(runtimePath, 'sharp'));

const {nodes, days} = require('./data.cjs');
const {icon} = require('./art.cjs');
const photoSources = require('./photo-sources.json');

const root = __dirname;
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const num = value => String(value).padStart(2,'0');
const lettered = value => [...value].map(char => `<span class="letter">${char === ' ' ? '&nbsp;' : esc(char)}</span>`).join('');

const photoCreditMap = Object.fromEntries(photoSources.map(p => [p.id, p.credit || '实景资料照片']));

const iconFor = {
  1: 'arcade', 2: 'arcadepot', 3: 'lighthouse', 4: 'beach',
  5: 'beach', 6: 'boat', 7: 'museum', 8: 'boat',
  9: 'hotel', 10: 'ferris', 11: 'raft', 12: 'cablecar',
  13: 'hotel', 14: 'hotpot'
};

const kickerFor = {
  1: '海口龙华区 · 骑楼老街与水巷口',
  2: '文昌铺前镇 · 糟粕醋发源地',
  3: '文昌铺前镇 · 木兰湾风车海岸',
  4: '文昌龙楼镇 · 铜鼓岭月亮湾',
  5: '文昌东郊镇 · 椰林晚霞与椰子鸡',
  6: '琼海潭门镇 · 渔港与首夜住宿',
  7: '中国海南南海博物馆 · 琼海潭门',
  8: '陵水牛岭 · 5A海岛玻璃海',
  9: '陵水黎安镇 · 海洋欢乐世界凯悦',
  10: '海南海洋欢乐世界 · 室内馆与摩天轮',
  11: '陵水新村港 · 疍家海上浮城',
  12: '陵水新村镇 · 跨海索道与猴岛',
  13: '三亚海棠湾 · 费尔蒙度假慢生活',
  14: '三亚海棠区 · 林旺夜市大排档'
};

const sceneCaptions = {
  'characters': '咚咚 7岁半 × 甜心 9岁',
  'new-lighthouse': '木兰湾风车海岸，吹吹太平洋的海风！',
  'new-moonbay': '站在铜鼓岭揽月台，看一弯碧蓝月亮湾！',
  'new-aquarium': '深海大视窗前，鳐鱼和鲨鱼从头顶游过！',
  'new-cablecar': '凌空飞渡大海，俯瞰万亩海上浮城！',
  'boat': '一起走进水上人家，发现大海的故事',
  'sandcastle': '海滩踩沙散步，我们的沙堡今天竣工！'
};

function scene(name, caption, genericText='一路向海<br>一起长大') {
  const isChar = name === 'characters';
  return `<figure class="scene ${isChar ? 'generic' : ''}">
    ${isChar ? `<div class="travel-line">${genericText}</div>` : ''}
    <img src="art/${name}.png" alt="咚咚和甜心Q版插画">
    <figcaption>${caption || sceneCaptions[name] || '咚咚与甜心的海南大冒险'}</figcaption>
  </figure>`;
}

function card(n) {
  const d = days[n.day - 1];
  const artName = n.art || 'characters';
  const kicker = n.kicker || kickerFor[n.id] || '海南自驾重点安排';
  const ic = n.icon || iconFor[n.id] || 'beach';
  const credit = n.credit || photoCreditMap[n.photo] || '实景资料照片';

  return `<article class="sheet" id="node-${n.id}" style="--accent:${d.color}">
  <div class="topline"><span class="names">咚咚 × 甜心的海南大冒险</span><strong>DAY ${n.day} / ${d.short}</strong></div>
  <header class="card-head">
    <div class="kicker">${esc(kicker)}</div>
    <h1 class="${n.title.length > 9 ? 'long' : ''}"><span class="head-number">${num(n.id)}</span><span class="art-title">${lettered(n.title)}</span></h1>
    <div class="kicker">${esc(n.time)} · 重点安排</div>
  </header>
  <div class="hero ${n.secondary ? 'dual' : ''} ${n.portrait ? 'portrait' : ''}">
    <img src="photos/${n.photo}.jpg" alt="${esc(n.title)}实景资料照片">
    ${n.secondary ? `<img class="secondary" src="photos/${n.secondary}.jpg" alt="补充实景资料照片">` : ''}
    <div class="landmark">${icon(ic)}</div>
    <span class="photo-label">实景资料照片</span>
  </div>
  <div class="image-caption">${esc(credit)}</div>
  <section class="summary">
    <h2 class="tagline">${esc(n.tag)}</h2>
    <p class="intro">${esc(n.intro)}</p>
  </section>
  <div class="info-columns">
    <section>
      <h3 class="section-title">这一站，怎么玩</h3>
      <div class="schedule">
        ${n.rows.map(row => `<div class="row"><b>${esc(row[0])}</b><span>${esc(row[1])}</span></div>`).join('')}
      </div>
    </section>
    <section>
      <h3 class="section-title">带娃重点</h3>
      <p class="side-copy">${esc(n.family)}</p>
      <h3 class="section-title">出发前确认</h3>
      <p class="side-copy note">${esc(n.note)}</p>
    </section>
  </div>
  ${scene(artName)}
  <footer class="footer">
    <span>9.26—9.28 · 海口 → 文昌 → 琼海 → 陵水 → 三亚</span>
    <strong>STOP ${num(n.id)} / 14</strong>
  </footer>
</article>`;
}

function timetableCard() {
  const scheduleData = [
    {
      day: 'Day 1 · 9月26日 周六',
      route: '海口老味&省博 ➔ 文昌风车海岸 ➔ 直达东郊椰林 ➔ 夜宿潭门',
      color: '#db6b70',
      rows: [
        ['05:35 - 08:00', '海口站取车整顿', '火车抵站交接MPV，分发儿童对讲机，沿滨海大道向东整顿出发'],
        ['08:00 - 09:30', '骑楼老街 (水巷口)', '姚记辣汤饭/亚妹正宗海南粉暖胃；看水巷口骑楼群，尝鲜文昌鸡'],
        ['09:30 - 11:30', '海南省博物馆', '国家一级馆强劲冷气避暑，看“华光礁I号”沉船、苏轼与琼州非遗'],
        ['11:30 - 13:15', '跨海文大桥 ➔ 铺前老街', '过海文大桥抵铺前胜利街，吃百年老字号【林花糟粕醋】消暑酸辣小吃'],
        ['13:15 - 15:45', '最美风车海岸 (木兰湾)', '旅游公路自驾，打卡白色风车、亚洲第一木兰灯塔、黑礁石踏浪拾贝'],
        ['15:45 - 17:15', '直奔东郊椰林 (铜鼓岭免进)', '避开正午暴晒与爬山排队，经旅游公路直达东郊椰林，沿途车览山海'],
        ['17:15 - 19:30', '东郊椰林 (日落+椰子鸡)', '百莱玛海滩踩沙散步、喝现砍新鲜文昌红椰、椰林深处纯椰水椰子鸡'],
        ['19:30 - 21:15', '夜行前往琼海潭门', '经清澜大桥走快速路驶往潭门老渔港（65公里），夜宿渔港海景客栈']
      ]
    },
    {
      day: 'Day 2 · 9月27日 周日',
      route: '南海博物馆 ➔ 潭门海鲜 ➔ 分界洲岛果冻海 ➔ 宿凯悦 ➔ 乐园夜游',
      color: '#168d9a',
      rows: [
        ['08:30 - 09:20', '早餐与退房出发', '客栈清晨散步，早餐后收拾行李出发（车程仅约20分钟）'],
        ['09:20 - 11:20', '中国南海博物馆', '强劲冷气避暑，看800年南宋华光礁I号沉船、万件出水瓷器与抹香鲸'],
        ['11:20 - 12:15', '潭门老渔港海鲜午餐', '出门即老码头排档，品尝现捞白灼小海鲜、海白野菜豆腐煲、清蒸海鱼'],
        ['12:15 - 13:45', '高速直达分界洲岛', '走G98高速直达牛岭码头（80公里/55分），两家孩子车内深度午睡'],
        ['13:45 - 17:00', '分界洲岛 5A 景区', '10分快艇破浪；浅滩亲手摸喂野生魔鬼鱼；果冻海踏浪捉小寄居蟹'],
        ['17:00 - 18:00', '驱车直达富力凯悦', '出岛取车沿黎安海港20分钟直抵酒店，办理入住豪华海湾客房'],
        ['18:30 - 20:30', '海洋欢乐世界夜游', '南海之眼摩天轮俯瞰灯火；园区简餐；广场观赏无人机星空编队秀'],
        ['20:30 - 21:00', '回酒店安稳休息', '步行回房，或去凯悦海景泳池戏水放松，吹海风早睡']
      ]
    },
    {
      day: 'Day 3 · 9月28日 周一',
      route: '乐园水族馆 ➔ 新村港疍家浮城 ➔ 猴岛索道 ➔ 奔赴海棠湾费尔蒙',
      color: '#c07096',
      rows: [
        ['08:30 - 09:30', '凯悦豪华自助早餐', '享用中西早点与热带水果；整理行李并办理退房预处理与行李寄存'],
        ['09:30 - 11:30', '海洋欢乐世界室内馆', '全程空调避暑，深海大视窗看鲨鱼鳐鱼巡游；动物剧场海豚逗趣杂技'],
        ['11:30 - 12:15', '前往新村旅游码头', '办理离店取车，南下13公里直抵陵水新村码头，穿戴救生衣登船'],
        ['12:15 - 13:30', '新村港疍家水上浮城', '小木船登海上网箱鱼排，近距离观察刺豚生活，享海鲜酸粉特色午宴'],
        ['13:30 - 15:30', '南湾猴岛跨海观光索道', '乘2.1公里观光索道凌空飞越大海，俯瞰万亩水上浮城，看野生猕猴群'],
        ['15:30 - 16:30', '自驾转场三亚海棠湾', '索道下岛取车，走G98高速向南38公里（35分钟）直达海棠湾费尔蒙'],
        ['16:30 - 18:30', '入住海棠湾费尔蒙', '古典贡多拉木船在1200米韵河古建中泛舟；恒温深海泳池水滑梯放电'],
        ['19:00 - 20:30', '林旺夜市大排档晚餐', '车程10分至林旺夜市，吃现砍椰水椰子鸡火锅、海鲜炒粉、清补凉收官']
      ]
    }
  ];

  return `<article class="sheet timetable" id="timetable" style="--accent:#2f7b9a">
  <div class="topline">
    <span class="names">咚咚 × 甜心的海南大冒险</span>
    <strong>前三日日程表 · 2026.09.26—09.28</strong>
  </div>
  <header class="card-head">
    <div class="kicker">两家同行 · 4位大人 + 咚咚（7岁半）+ 甜心（9岁）· 一台大空间MPV自驾</div>
    <h1><span class="art-title">${lettered('前三日自驾时间行程表')}</span></h1>
    <div class="kicker">三日黄金动线 · 时间段、核心环节与亲子要诀总览</div>
  </header>

  ${scheduleData.map(d => `<section class="day-block" style="--day-color:${d.color}">
    <div class="day-block-header">
      <b>${d.day}</b>
      <span>${d.route}</span>
    </div>
    <table class="day-table">
      ${d.rows.map(r => `<tr>
        <td class="t-time">${r[0]}</td>
        <td class="t-spot">${r[1]}</td>
        <td class="t-desc">${r[2]}</td>
      </tr>`).join('')}
    </table>
  </section>`).join('')}

  <figure class="timetable-scene">
    <img src="art/voyah-dreamer.png" alt="咚咚与甜心海边公路自驾出发向大海">
    <figcaption>两家同行 · 欢声笑语，一路向海！</figcaption>
  </figure>

  <footer class="footer">
    <span>资料核对：2026.09.16 · 环岛车程、潮汐与演出场次以出行当天为准</span>
    <strong>EXTRA / 全程时间表</strong>
  </footer>
</article>`;
}

function checklist() {
  const sections = [
    ['beach', '轻装防晒 · 涉水玩耍', '儿童物理防晒霜、遮阳大檐帽、防晒衣；洞洞鞋、折叠挖沙工具套、涉水速干衣与大毛巾。', '乘船全程穿合身救生衣；沙滩踏浪与泳池玩耍由大人近身看护，浮具不能代替监护。'],
    ['museum', '证件票务 · 提前预约', '海南省博物馆（微信提前实名预约9月26日门票）；中国南海博物馆（预约9月27日上午门票）；分界洲岛门船票提前预订。', '全员成人身份证、咚咚与甜心户口本/身份证件、租车驾照与订单务必随身携带。'],
    ['hotel', '入住酒店 · 预约体验', '富力凯悦入住时向前台核对海洋欢乐世界门票权益（夜场与次晨入园、儿童票标准）；', '海棠湾费尔蒙入住第一时间向礼宾部预约韵河贡多拉游船时段；泳池按当天开放时段使用。'],
    ['car', '自驾准备 · 旅途舒适', 'MPV车况与两个适配儿童座椅提前确认；配备两副手持对讲机方便下车集合呼叫。', '随车备足饮水、防蚊喷雾、创口贴及益生菌/常备药；动物以观察为主，不逗弄刺豚鼓气。']
  ];
  return `<article class="sheet checklist" id="checklist" style="--accent:#168d9a">
  <div class="topline"><span class="names">咚咚 × 甜心的海南大冒险</span><strong>行前清单</strong></div>
  <header class="card-head">
    <div class="kicker">两家同行 · 4大2小一台MPV · 旅途从容</div>
    <h1><span class="art-title">${lettered('行前打包与预约清单')}</span></h1>
    <div class="kicker">把小事准备好，把时间留给风景与笑容。</div>
  </header>
  ${sections.map(s => `<section class="check-block"><div class="art">${icon(s[0])}</div><div><h2>${s[1]}</h2><p>${s[2]}</p><p>${s[3]}</p></div></section>`).join('')}
  <div class="check-last">
    <b>假期提醒：</b>2026年9月25–27日适逢中秋小长假，26–27日客流与路况应按假期预留缓冲，不赶夜路、疲劳及时轮换驾驶。<br>
    <b>安全提示：</b>新村港鱼排以观察渔居生态为主，严禁刺激触摸刺豚鱼，不食用刺豚粥；猴岛收好塑料袋不私自投喂。
  </div>
  ${scene('characters', undefined, '小小行李箱<br>装满大期待')}
  <footer class="footer">
    <span>资料核对：2026.09.16 · 景区与酒店当期公告优先</span>
    <strong>EXTRA / 行前清单</strong>
  </footer>
</article>`;
}

const documentHtml = (body, isGallery = false) => `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes">
  <title>咚咚与甜心的海南大冒险</title>
  <link rel="stylesheet" href="style.css?v=20260916_v33">
  <link rel="stylesheet" href="vendor/photoswipe.css?v=5.4.3">
  ${isGallery ? `<style>
    /* 关键排版尺寸与防错乱保护样式 (Critical Layout CSS) */
    .cover-triad { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 22px; align-items: stretch; }
    .cover-triad > div { display: flex; flex-direction: column; }
    .cover-triad a { display: block; flex: 1; }
    .cover-triad img { width: 100%; height: auto; display: block; border-radius: 4px; }
    .cover-triad > div:first-child img { aspect-ratio: 941 / 1672; }
    .cover-triad > div:nth-child(2) img, .cover-triad > div:nth-child(3) img { aspect-ratio: 1600 / 2840; }
    .gallery .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
    .tile { display: flex; flex-direction: column; }
    .tile img { width: 100%; height: auto; aspect-ratio: 1600 / 2480; object-fit: cover; display: block; }
    .character-hero { max-width: 540px; margin: 0 auto 32px; text-align: center; }
    .character-hero a { display: inline-block; max-width: 100%; }
    .character-hero img { width: 100%; max-width: 516px; aspect-ratio: 1536 / 1024; height: auto; display: block; border-radius: 4px; }
    .art-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }
    .art-grid img { width: 100%; aspect-ratio: 1983 / 793; object-fit: contain; display: block; }
    @media(max-width:760px){
      .cover-triad { grid-template-columns: 1fr; gap: 22px; }
      .gallery .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
      .character-hero { max-width: 100%; }
      .art-grid { grid-template-columns: 1fr; gap: 16px; }
    }
  </style>` : ''}
</head>
<body>${body}</body>
</html>`;

const filenames = nodes.map(n => `${num(n.id)}-${n.slug}.png`);

async function run() {
  console.log('Starting Hainan Roadbook V3 Build...');
  await fs.mkdir(path.join(root, 'images'), {recursive: true});

  // 1. Write print.html
  const printHtmlContent = documentHtml(nodes.map(card).join('') + timetableCard() + checklist());
  await fs.writeFile(path.join(root, 'print.html'), printHtmlContent);
  console.log('Written print.html');

  // 2. Launch headless browser
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1800, height: 1600}, deviceScaleFactor: 2});
    await page.goto(pathToFileURL(path.join(root, 'print.html')).href);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));

    const qa = [];
    const tasks = [
      ...nodes.map((n, i) => ({id: 'node-' + n.id, file: filenames[i]})),
      {id: 'timetable', file: '15-timetable.png'},
      {id: 'checklist', file: '17-checklist.png'}
    ];

    for (const {id, file} of tasks) {
      const el = page.locator('#' + id);
      const report = await el.evaluate(sheet => {
        const sceneEl = sheet.querySelector('.scene, .timetable-scene');
        const sceneTop = sceneEl ? sceneEl.getBoundingClientRect().top : sheet.clientHeight;
        const textEls = [...sheet.querySelectorAll('.row, .side-copy, .check-block, .check-last, .card-head h1, .intro, .tagline, .image-caption, .day-table td')];
        const overflow = textEls
          .filter(el => el.getBoundingClientRect().bottom > sceneTop - 2 || el.scrollWidth > el.clientWidth + 2)
          .map(el => el.className);
        const broken = [...sheet.querySelectorAll('img')].filter(img => !img.complete || !img.naturalWidth).length;
        const fontLoaded = document.fonts.check('24px Travel');
        return {
          width: sheet.clientWidth,
          height: sheet.clientHeight,
          overflow,
          broken,
          fontLoaded
        };
      });

      const outPath = path.join(root, 'images', file);
      await el.screenshot({path: outPath, scale: 'device'});
      const webpOut = outPath.replace(/\.png$/, '.webp');
      await sharp(outPath).webp({ quality: 85, effort: 6 }).toFile(webpOut);
      const meta = await sharp(outPath).metadata();
      qa.push({id, file, ...report, pixels: [meta.width, meta.height]});
      console.log(`Rendered ${file}: ${meta.width}x${meta.height}, overflow: ${report.overflow.length}, broken: ${report.broken}`);
    }

    // 3. Write contact.html and screenshot 18-all-nodes-preview.png
    const filenamesWebp = nodes.map(n => `${num(n.id)}-${n.slug}.webp`);
    const contactHtml = documentHtml(`<main class="contact">
      <h1>咚咚与甜心的海南大冒险 · 14站实景图文路书 + 时间行程总表</h1>
      <div class="contact-grid">
        ${nodes.map((n, i) => `<div><img src="images/${filenamesWebp[i]}"><p>${num(n.id)} ${esc(n.title)}</p></div>`).join('')}
        <div><img src="images/15-timetable.webp"><p>15 时间行程表</p></div>
        <div><img src="images/17-checklist.webp"><p>17 行前清单</p></div>
        <div><img src="images/00-main-map.webp"><p>00 路线主地图</p></div>
      </div>
    </main>`);
    await fs.writeFile(path.join(root, 'contact.html'), contactHtml);
    await page.goto(pathToFileURL(path.join(root, 'contact.html')).href);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
    const prevPng = path.join(root, 'images', '18-all-nodes-preview.png');
    await page.locator('.contact').screenshot({path: prevPng, scale: 'css'});
    await sharp(prevPng).webp({ quality: 85, effort: 6 }).toFile(prevPng.replace(/\.png$/, '.webp'));
    console.log('Rendered 18-all-nodes-preview.webp');

    // Ensure main map & art webps are generated
    const syncWebp = async (file) => {
      const webpFile = file.replace(/\.png$/, '.webp');
      if (fsSync.existsSync(file)) {
        await sharp(file).webp({ quality: 85, effort: 6 }).toFile(webpFile);
      }
    };
    await syncWebp(path.join(root, 'images', '00-main-map.png'));

    // 4. Generate index.html (Gallery with PhotoSwipe integration & centered characters hero)
    const landscapeArts = [
      {name: 'new-lighthouse', caption: '木兰灯塔与风车海岸宽幅插画', w: 1983, h: 793},
      {name: 'new-moonbay', caption: '铜鼓岭俯瞰月亮湾宽幅插画', w: 1983, h: 793},
      {name: 'new-aquarium', caption: '海洋欢乐世界水族馆宽幅插画', w: 1983, h: 793},
      {name: 'new-cablecar', caption: '新村港跨海观光索道宽幅插画', w: 1983, h: 793},
      {name: 'boat', caption: '疍家渔排与海岛木船通用插画', w: 1983, h: 793},
      {name: 'sandcastle', caption: '海滩散步与沙堡通用插画', w: 1983, h: 793}
    ];

    for (const a of ['characters', 'voyah-dreamer', ...landscapeArts.map(x => x.name)]) {
      await syncWebp(path.join(root, 'art', `${a}.png`));
    }

    const gallery = `<main class="gallery">
      <header class="gallery-header">
        <div>
          <h1>咚咚与甜心的海南大冒险</h1>
          <p>前三日黄金自驾路书 · 2026年9月26日—9月28日<br>
          两家同行 · 4位大人 + 咚咚（7岁半）+ 甜心（9岁）· 一台大空间MPV自驾<br>
          海口老味&省博 ➔ 文昌风车海岸 ➔ 直达东郊椰林 ➔ 南海博物馆 ➔ 分界洲岛 ➔ 海洋乐园 ➔ 新村港 ➔ 猴岛索道 ➔ 海棠湾费尔蒙</p>
        </div>
        <img class="pair" src="art/characters.webp" alt="咚咚与甜心Q版角色">
      </header>
      <nav class="nav">
        <a href="hainan-first3days-chibi.zip">📦 离线高清图片包 ZIP</a>
        <a href="#cover-triad">🗺️ 路线、时刻与清单</a>
        <a href="#nodes">📖 14站图文路书</a>
        <a href="#art">🎨 绘本插画展厅</a>
        <a href="sanya-options.html" style="background:#e1f5fe;color:#0277bd;font-weight:bold;border-radius:4px;padding:2px 8px;">🔍 三亚8大备选景点评测</a>
        <a href="photo-sources.json">📷 资料来源</a>
      </nav>

      <div class="cover-triad" id="cover-triad">
        <div>
          <h2>🗺️ 路线主地图</h2>
          <a href="images/00-main-map.webp" data-pswp-width="941" data-pswp-height="1672" target="_blank">
            <img src="images/00-main-map.webp" alt="海南东线前三日Q版主地图">
          </a>
        </div>
        <div>
          <h2>⏱️ 时间行程总表</h2>
          <a href="images/15-timetable.webp" data-pswp-width="1600" data-pswp-height="2840" target="_blank">
            <img src="images/15-timetable.webp" alt="前三日自驾时间行程表">
          </a>
        </div>
        <div>
          <h2>🎒 出发行前清单</h2>
          <a href="images/17-checklist.webp" data-pswp-width="1600" data-pswp-height="2840" target="_blank">
            <img src="images/17-checklist.webp" alt="行前打包与预约清单">
          </a>
        </div>
      </div>

      <section id="nodes">
        <h2>一路向海，14站旅行图文日记 (点击任意卡片即可弹出全屏大图)</h2>
        <div class="grid">
          ${nodes.map((n, i) => `<a class="tile" href="images/${filenamesWebp[i]}" data-pswp-width="1600" data-pswp-height="2480" target="_blank">
            <img loading="lazy" src="images/${filenamesWebp[i]}" alt="${esc(n.title)}">
            <b>${num(n.id)} ${esc(n.title)}</b>
          </a>`).join('')}
        </div>
      </section>

      <section id="art">
        <h2>咚咚与甜心的小小绘本世界 (点击放大原画细节)</h2>
        
        <!-- 角色设定居中展示 -->
        <div class="character-hero">
          <a href="art/characters.webp" data-pswp-width="1536" data-pswp-height="1024" target="_blank">
            <img loading="lazy" src="art/characters.webp" alt="咚咚与甜心Q版角色形象设定">
          </a>
          <p>咚咚与甜心Q版角色形象设定</p>
        </div>

        <!-- 6幅手绘宽幅风景插画 2x3 网格 -->
        <div class="art-grid">
          ${landscapeArts.map(a => `<div class="art-item">
            <a href="art/${a.name}.webp" data-pswp-width="${a.w}" data-pswp-height="${a.h}" target="_blank">
              <img loading="lazy" src="art/${a.name}.webp" alt="${esc(a.caption)}">
            </a>
            <p style="text-align:center;font-size:13px;color:#546f7b;margin:6px 0 0;">${esc(a.caption)}</p>
          </div>`).join('')}
        </div>
      </section>
      <small>
        实景资料照片与Q版创作插画分区呈现。点击图片支持顺滑弹出放大、双击缩放、手势滑动查阅。仅供家庭旅行规划与私人欣赏，照片版权归原作者或发布机构所有。
      </small>
    </main>

    <script src="vendor/photoswipe-bundle.min.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const galleryConfigs = [
          { gallery: '.cover-triad', children: 'a' },
          { gallery: '#nodes .grid', children: 'a.tile' },
          { gallery: '#art .character-hero', children: 'a' },
          { gallery: '#art .art-grid', children: 'a' }
        ];

        galleryConfigs.forEach(function(cfg) {
          const lightbox = new window.PhotoSwipeLightbox({
            gallery: cfg.gallery,
            children: cfg.children,
            pswpModule: window.PhotoSwipe,
            showHideAnimationType: 'zoom',
            bgOpacity: 0.78,
            pinchToClose: true,
            closeOnVerticalDrag: true,
            wheelToZoom: true,
            doubleTapAction: 'zoom',
            padding: { top: 24, bottom: 24, left: 16, right: 16 }
          });
          lightbox.init();
        });
      });
    </script>`;

    await fs.writeFile(path.join(root, 'index.html'), documentHtml(gallery, true));
    console.log('Written index.html with PhotoSwipe & centered character hero');

    // 5. Gallery QA
    const galleryQA = [];
    for (const viewport of [{width: 390, height: 844}, {width: 1440, height: 1000}]) {
      await page.setViewportSize(viewport);
      await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('img').evaluateAll(imgs => imgs.forEach(img => { img.loading = 'eager'; }));
      await page.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));

      const report = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        broken: [...document.images].filter(img => !img.naturalWidth).length
      }));
      galleryQA.push({viewport, ...report});
      await page.screenshot({path: path.join(root, `qa-gallery-${viewport.width}.png`)});
      console.log(`Gallery QA ${viewport.width}px: overflow=${report.overflow}, broken=${report.broken}`);
    }

    // 6. Output qa.json
    const qaResult = {
      verified: new Date().toISOString().slice(0, 10),
      cards: qa,
      gallery: galleryQA,
      totalCards: qa.length,
      allPassed: qa.every(item => item.overflow.length === 0 && item.broken === 0 && item.fontLoaded) &&
                 galleryQA.every(item => !item.overflow && item.broken === 0)
    };
    await fs.writeFile(path.join(root, 'qa.json'), JSON.stringify(qaResult, null, 2));
    console.log('QA completed. Overall passed:', qaResult.allPassed);

    if (!qaResult.allPassed) {
      console.error('Some QA checks failed!');
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
