const fs = require('node:fs/promises');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {createRequire} = require('node:module');
const runtime = createRequire('C:/Users/shaokang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.cjs');
const {chromium} = runtime('playwright');
const sharp = runtime('sharp');
const {nodes, days} = require('../data.cjs');
const {icon} = require('../art.cjs');
const root = __dirname;
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const num = value => String(value).padStart(2,'0');
const lettered = value => [...value].map(char => `<span class="letter">${char === ' ' ? '&nbsp;' : esc(char)}</span>`).join('');
const document = body => `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>咚咚和甜心的海南大冒险</title><link rel="stylesheet" href="style.css"></head><body>${body}</body></html>`;
const sceneFor = {3:'rocket-salute',4:'sandcastle',5:'boat',6:'boat',7:'forest',8:'surfing',9:'boat',10:'characters',12:'sandcastle',15:'forest'};
const captions = {characters:'咚咚 7岁半 × 甜心 9岁', 'rocket-salute':'小小航天员，向火箭敬个礼！',surfing:'跟着浪花，出发吧！',sandcastle:'我们的沙堡，今天竣工！',boat:'一起发现水上人家的故事',forest:'小小探险家，去雨林找答案'};
function scene(name, caption, genericText='一路向海<br>一起长大') {
  return `<figure class="scene ${name === 'characters' ? 'generic' : ''}">${name === 'characters' ? `<div class="travel-line">${genericText}</div>` : ''}<img src="art/${name}.png" alt="咚咚和甜心Q版插画"><figcaption>${caption || captions[name]}</figcaption></figure>`;
}
function card(n) {
  const d = days[n.day-1];
  const art = sceneFor[n.id] || 'characters';
  return `<article class="sheet" id="node-${n.id}" style="--accent:${d.color}">
  <div class="topline"><span class="names">咚咚 × 甜心的海南大冒险</span><strong>DAY ${n.day} / ${n.date}</strong></div>
  <header class="card-head"><div class="kicker">${esc(n.kicker)}</div><h1 class="${n.title.length>9?'long':''}"><span class="head-number">${num(n.id)}</span><span class="art-title">${lettered(n.title)}</span></h1><div class="kicker">${esc(n.time)} · 重点安排</div></header>
  <div class="hero ${n.secondary?'dual':''} ${n.portrait?'portrait':''}"><img src="../photos/${n.photo}.jpg" alt="${esc(n.title)}实景资料照片">${n.secondary?`<img class="secondary" src="../photos/${n.secondary}.jpg" alt="补充实景资料照片">`:''}${n.portrait?`<div class="photo-note">${icon(n.icon)}<b>向太空出发</b><p>看看火箭模型<br>听听航天故事<br>带上自己的问题</p></div>`:`<div class="landmark">${icon(n.icon)}</div>`}<span class="photo-label">实景资料照片</span></div>
  <div class="image-caption">${esc(n.credit)}</div>
  <section class="summary"><h2 class="tagline">${esc(n.tag)}</h2><p class="intro">${esc(n.intro)}</p></section>
  <div class="info-columns"><section><h3 class="section-title">这一站，怎么玩</h3><div class="schedule">${n.rows.map(row=>`<div class="row"><b>${esc(row[0])}</b><span>${esc(row[1])}</span></div>`).join('')}</div></section><section><h3 class="section-title">带娃重点</h3><p class="side-copy">${esc(n.family)}</p><h3 class="section-title">出发前确认</h3><p class="side-copy note">${esc(n.note)}</p></section></div>
  ${scene(art,n.id === 6?'跟着文物，想象古人的海上远航':undefined)}
  <footer class="footer"><span>9.26—9.30 · 海口 → 文昌 → 琼海 → 万宁 → 陵水 → 三亚</span><strong>STOP ${num(n.id)} / 16</strong></footer></article>`;
}
function checklist() {
  const sections = [
    ['beach','轻装防晒 · 海边玩耍','防晒霜（按儿童适用标签选择）、大檐帽、防晒衣、墨镜；挖沙工具、涉水鞋、速干衣、毛巾与防水袋。','合身救生衣用于乘船；游泳选择开放泳区，浮具不能代替成人看护。'],
    ['rocket','证件票务 · 提前确认','有效身份证件、驾驶证、车票／机票、租车订单、儿童座椅；航天场馆确认准确名称、地址、票种和室内项目。','南海博物馆查当期入馆公告；森林公园确认观光车与各体验项目是否包含。'],
    ['hotel','入住酒店 · 预约体验','入住费尔蒙时确认韵河游船、泳池、儿童俱乐部的时间、适用年龄与费用；提前确认退房时间。','博鳌／潭门与新村周边以预算、停车和位置筛选住宿，不将参考价视为已锁定房价。'],
    ['car','自驾准备 · 旅途舒适','两车先共享目的地、集合点和停车点；对讲机由乘客使用。出发前检查轮胎、油量、儿童座椅与手机充电。','备饮水、防蚊用品、创口贴及家庭惯用药。儿童药物按医生指导或说明书使用，不为“预防水土不服”常规服药。']
  ];
  return `<article class="sheet checklist" id="checklist" style="--accent:#298f94"><div class="topline"><span class="names">咚咚 × 甜心的海南大冒险</span><strong>行前清单</strong></div><header class="card-head"><div class="kicker">两家同行也从容 · 按实际人数准备</div><h1><span class="art-title">${lettered('行前打包与预约清单')}</span></h1><div class="kicker">把小事准备好，把时间留给旅行。</div></header>${sections.map(s=>`<section class="check-block"><div class="art">${icon(s[0])}</div><div><h2>${s[1]}</h2><p>${s[2]}</p><p>${s[3]}</p></div></section>`).join('')}<div class="check-last"><b>日期提醒：</b>原行程未注明年份。如按2026年出行，9月26–27日为中秋假期，住宿和道路情况应按假期重新核对。<br><b>转场提醒：</b>海口、文昌、琼海、万宁、陵水及三亚各片区之间，统一按实际导航与孩子状态调整，不把原文估算车程当作保证。</div>${scene('characters',undefined,'小小行李箱<br>装满大期待')}<footer class="footer"><span>资料核对：2026.09.15 · 景区当期公告优先</span><strong>EXTRA / 行前清单</strong></footer></article>`;
}
const filenames = nodes.map(n => `${num(n.id)}-${n.slug}.png`);
async function run() {
  await fs.mkdir(path.join(root,'images'),{recursive:true});
  await fs.writeFile(path.join(root,'print.html'),document(nodes.map(card).join('')+checklist()));
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1800,height:1450},deviceScaleFactor:2});
    await page.goto(pathToFileURL(path.join(root,'print.html')).href);
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
    const qa = [];
    for (const [id,file] of [...nodes.map((n,i)=>['node-'+n.id,filenames[i]]),['checklist','17-checklist.png']]) {
      const el = page.locator('#'+id);
      const report = await el.evaluate(sheet => {
        const sceneTop=sheet.querySelector('.scene').getBoundingClientRect().top;
        const textEls=[...sheet.querySelectorAll('.row,.side-copy,.check-block,.check-last,.card-head h1,.intro,.tagline,.image-caption')];
        return {width:sheet.clientWidth,height:sheet.clientHeight,overflow:textEls.filter(el=>el.getBoundingClientRect().bottom>sceneTop-4 || el.scrollWidth>el.clientWidth+2).map(el=>el.className),broken:[...sheet.querySelectorAll('img')].filter(img=>!img.complete||!img.naturalWidth).length,fontLoaded:document.fonts.check('24px Travel')};
      });
      await el.screenshot({path:path.join(root,'images',file),scale:'device'});
      const meta=await sharp(path.join(root,'images',file)).metadata();
      qa.push({id,...report,pixels:[meta.width,meta.height]});
      console.log(file,JSON.stringify(report));
    }
    const arts=['characters','rocket-salute','surfing','sandcastle','boat','forest'];
    const gallery=`<main class="gallery"><header class="gallery-header"><div><h1>咚咚和甜心的海南大冒险</h1><p>9月26日—9月30日 · 咚咚 7岁半 · 甜心 9岁<br>海口 → 文昌 → 琼海 → 万宁 → 陵水 → 三亚</p></div><img class="pair" src="art/characters.png" alt="咚咚与甜心Q版角色"></header><nav class="nav"><a href="hainan-dongdong-tianxin-chibi.zip">整套图片 ZIP</a><a href="images/00-main-map.png">主地图</a><a href="#nodes">16站图文路书</a><a href="#art">角色插画</a><a href="sources.md">照片与资料来源</a></nav><div class="cover"><div><h2>我们的海南大冒险</h2><a href="images/00-main-map.png"><img src="images/00-main-map.png" alt="海南东线Q版主地图"></a></div><div><h2>出发前的小清单</h2><a href="images/17-checklist.png"><img src="images/17-checklist.png" alt="行前打包与预约清单"></a></div></div><section id="nodes"><h2>一路向海，16站旅行日记</h2><div class="grid">${nodes.map((n,i)=>`<a class="tile" href="images/${filenames[i]}"><img loading="lazy" src="images/${filenames[i]}" alt="${esc(n.title)}"><b>${num(n.id)} ${esc(n.title)}</b></a>`).join('')}</div></section><section id="art"><h2>咚咚与甜心的小小世界</h2><div class="art-grid">${arts.map(name=>`<a href="art/${name}.png"><img ${name==='characters'?'class="character-img"':''} loading="lazy" src="art/${name}.png" alt="${esc(captions[name])}"></a>`).join('')}</div></section><small>实景资料照片与Q版创作插画分开展示。角色及场景插画由AI生成，地图为位置与路线示意，非导航地图；行程细节以节点图文卡为准。甜心为原创Q版设定。仅供家庭旅行规划与私人欣赏，照片版权归原作者或机构所有。</small></main>`;
    await fs.writeFile(path.join(root,'index.html'),document(gallery));
    await fs.writeFile(path.join(root,'contact.html'),document(`<main class="contact"><h1>咚咚和甜心的海南大冒险 · 16站实景图文路书</h1><div class="contact-grid">${nodes.map((n,i)=>`<div><img src="images/${filenames[i]}"><p>${num(n.id)} ${esc(n.title)}</p></div>`).join('')}</div></main>`));
    await page.goto(pathToFileURL(path.join(root,'contact.html')).href);
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
    await page.locator('.contact').screenshot({path:path.join(root,'images','18-all-nodes-preview.png'),scale:'css'});
    const galleryQA=[];
    for (const viewport of [{width:390,height:844},{width:1440,height:1000}]) {
      await page.setViewportSize(viewport);
      await page.goto(pathToFileURL(path.join(root,'index.html')).href);
      await page.evaluate(()=>document.fonts.ready);
      await page.locator('img').evaluateAll(imgs=>imgs.forEach(img=>{img.loading='eager';}));
      await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
      const report=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(img=>!img.naturalWidth).length}));
      galleryQA.push({viewport,...report});
      await page.screenshot({path:path.join(root,`qa-gallery-${viewport.width}.png`)});
      console.log('Gallery',viewport.width,report);
    }
    await fs.writeFile(path.join(root,'qa.json'),JSON.stringify({cards:qa,gallery:galleryQA},null,2));
    if(qa.some(item=>item.overflow.length||item.broken||!item.fontLoaded)||galleryQA.some(item=>item.overflow||item.broken)) process.exitCode=1;
  } finally {await browser.close();}
}
run().catch(error=>{console.error(error);process.exitCode=1;});
