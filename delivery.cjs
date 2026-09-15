const fs = require('node:fs/promises');
const path = require('node:path');
const {createRequire} = require('node:module');
const runtime = createRequire('C:/Users/shaokang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.cjs');
const sharp = runtime('sharp');
const root = __dirname;
async function run() {
  const qa = JSON.parse(await fs.readFile(path.join(root,'qa.json'),'utf8'));
  if(qa.cards.some(item=>item.overflow.length || item.broken || !item.fontLoaded) || qa.gallery.some(item=>item.overflow || item.broken)) throw Error('Layout QA failed.');
  const files=(await fs.readdir(path.join(root,'images'))).filter(file=>file.endsWith('.png'));
  if(files.length!==19) throw Error('Expected 19 PNGs including contact sheet.');
  const dimensions={};
  for(const file of files){const meta=await sharp(path.join(root,'images',file)).metadata();dimensions[file]=[meta.width,meta.height];}
  const original=await fs.readFile(path.join(root,'..','sources.md'),'utf8');
  await fs.writeFile(path.join(root,'sources.md'),original+'\n\n## Q版新版视觉说明\n\n- 主地图、角色立绘及5张场景插画使用 Codex 内置 image_gen 创作，2026-09-15生成；非实拍图片。\n- 咚咚：7岁半，照片仅参考短黑发、刘海和笑容，按用户最新要求改为夸张大眼睛、大头小身体的Q版。\n- 甜心：9岁，没有提供照片，采用原创高马尾、粉色爱心上衣的Q版设计。\n- 写实风格的早期角色图未纳入新版；真人参考照片也未纳入交付包。\n- 地图是艺术路线示意，不能据此判断真实距离、地理比例或导航；详细安排以独立节点卡为准。\n- 插画里的乘船、冲浪、雨林等为情境创作，不证明该地点必有对应设施或包含该项目。\n- 标题字体：[站酷快乐体 / ZCOOL KuaiLe](https://github.com/googlefonts/zcool-kuaile)，SIL Open Font License 1.1；随包保留 fonts/OFL.txt。\n- 版式中的小型地标图标沿用原版可编辑矢量图；人物及主要场景使用生成的水彩彩铅位图。\n');
  await fs.writeFile(path.join(root,'README.md'),`# 咚咚和甜心的海南大冒险\n\n大眼睛Q版定稿，9月26日—9月30日。原版行程、安排与清单内容保持不变。\n\n## 文件导航\n\n- index.html：离线图片画廊。\n- images/00-main-map.png：主地图，${dimensions['00-main-map.png'].join(' × ')} 像素。\n- images/01-*.png 至 16-*.png：16站实景照片+介绍+安排+Q版插画，每张1600 × 2480像素。\n- images/17-checklist.png：打包与预约清单，1600 × 2160像素。\n- images/18-all-nodes-preview.png：16站总览。\n- art/characters.png：咚咚与甜心的统一角色设定。\n- art/rocket-salute.png、surfing.png、sandcastle.png、boat.png、forest.png：5张可独立使用的宽幅插画。\n- sources.md：原实景照片、资料和字体来源。\n- generation-prompts.md：内置图像工具使用的提示词记录。\n- qa.json：图片加载、文字边界、字体和390/1440像素视口检查，均通过。\n\n## 角色原则\n\n咚咚7岁半：只保留短黑发、刘海和开朗笑容的概括特征，夸张圆眼睛和简化五官优先，不追求真人肖像。甜心9岁：略高、高马尾、粉色爱心上衣，原创新设定。两人统一为水彩彩铅Q版。\n\n## 使用范围\n\n真人参考照片不包含在本文件夹及ZIP。实景照片版权归原作者或机构，图片包供家庭旅行规划与私人欣赏，不附带商业授权。插画与照片在卡片中分区呈现；艺术地图非导航地图。\n\n本目录为新版本，旧版文件保留在上级目录；旧版画廊备份为 index-v1.html。\n`);
  const parent = path.join(root,'..');
  try {await fs.access(path.join(parent,'index-v1.html'));} catch {await fs.copyFile(path.join(parent,'index.html'),path.join(parent,'index-v1.html'));}
  await fs.writeFile(path.join(parent,'index.html'),'<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=v2-chibi/index.html"><title>咚咚和甜心的海南大冒险</title></head><body><p><a href="v2-chibi/index.html">打开大眼睛Q版新版路书</a></p><p><a href="index-v1.html">查看旧版</a></p></body></html>');
  console.log(JSON.stringify({images:files.length,art:6,dimensions,qa:'passed',entry:'v2-chibi/index.html'},null,2));
}
run().catch(error=>{console.error(error);process.exitCode=1;});
