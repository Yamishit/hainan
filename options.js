// PhotoSwipe 5 全屏灯箱与相册初始化
document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll(".option-card");
  cards.forEach(card => {
    const lightbox = new window.PhotoSwipeLightbox({
      gallery: card,
      children: "a[data-pswp-width]",
      pswpModule: window.PhotoSwipe,
      showHideAnimationType: "zoom",
      bgOpacity: 0.85,
      pinchToClose: true,
      closeOnVerticalDrag: true,
      wheelToZoom: true,
      doubleTapAction: "zoom",
      padding: { top: 20, bottom: 20, left: 14, right: 14 }
    });

    lightbox.on("uiRegister", function() {
      lightbox.pswp.ui.registerElement({
        name: "custom-caption",
        order: 9,
        isButton: false,
        appendTo: "root",
        html: "Caption text",
        onInit: (el, pswp) => {
          lightbox.pswp.on("change", () => {
            const currSlide = lightbox.pswp.currSlide;
            let title = "";
            if (currSlide && currSlide.data && currSlide.data.element) {
              title = currSlide.data.element.getAttribute("title") || "";
            }
            el.innerHTML = "<div style=\"position:absolute;bottom:16px;left:0;right:0;text-align:center;color:white;background:rgba(0,0,0,0.65);padding:8px 18px;font-size:13.5px;max-width:620px;margin:0 auto;border-radius:20px;backdrop-filter:blur(4px);line-height:1.5;\">" + title + "</div>";
          });
        }
      });
    });

    lightbox.init();
  });

  // 绑定选项点击事件
  document.querySelectorAll("#chips-places input[type=\"checkbox\"], #chips-night input[type=\"radio\"], #chips-tempo input[type=\"radio\"]").forEach(inp => {
    inp.addEventListener("change", updateChipStyles);
  });

  // 初始默认生成一次
  resetPlanner();
});

function updateChipStyles() {
  document.querySelectorAll("#chips-places .chip-item").forEach(item => {
    const chk = item.querySelector("input[type=\"checkbox\"]");
    if (chk && chk.checked) {
      item.classList.add("active");
    } else if (chk) {
      item.classList.remove("active");
    }
  });
  document.querySelectorAll("#chips-night .chip-item").forEach(item => {
    const rad = item.querySelector("input[type=\"radio\"]");
    if (rad && rad.checked) {
      item.classList.add("active");
    } else if (rad) {
      item.classList.remove("active");
    }
  });
  document.querySelectorAll("#chips-tempo .chip-item").forEach(item => {
    const rad = item.querySelector("input[type=\"radio\"]");
    if (rad && rad.checked) {
      item.classList.add("active");
    } else if (rad) {
      item.classList.remove("active");
    }
  });
}

function resetPlanner() {
  const defaults = ["fairmont", "houhai", "yalong", "luhuitou", "cdf"];
  document.querySelectorAll("#chips-places .chip-item").forEach(item => {
    const id = item.getAttribute("data-id");
    const chk = item.querySelector("input[type=\"checkbox\"]");
    if (chk) {
      chk.checked = defaults.includes(id);
    }
  });
  const defaultNight = document.querySelector("#chips-night input[value=\"night_show\"]");
  if (defaultNight) defaultNight.checked = true;
  const defaultTempo = document.querySelector("#chips-tempo input[value=\"balanced\"]");
  if (defaultTempo) defaultTempo.checked = true;

  updateChipStyles();
  generateCustomPlan();
}

let lastGeneratedSummary = "";

function generateCustomPlan() {
  updateChipStyles();
  const selectedIds = [];
  let totalCost = 0;
  let totalDrive = 0;

  document.querySelectorAll("#chips-places .chip-item").forEach(item => {
    const chk = item.querySelector("input[type=\"checkbox\"]");
    if (chk && chk.checked) {
      const id = item.getAttribute("data-id");
      selectedIds.push(id);
      totalCost += parseInt(item.getAttribute("data-cost") || "0", 10);
      totalDrive += parseInt(item.getAttribute("data-drive") || "0", 10);
    }
  });

  const nightRadio = document.querySelector("#chips-night input:checked");
  const nightOpt = nightRadio ? nightRadio.value : "night_show";

  // 专属勋章
  const badges = [];
  if (selectedIds.includes("yalong")) badges.push("🌲 索桥小勇士");
  if (selectedIds.includes("houhai")) badges.push("🦀 赶海大王 & 小冲浪手");
  if (selectedIds.includes("marina")) badges.push("⛵ 小小领航船长");
  if (selectedIds.includes("fairmont")) badges.push("🔥 演艺鉴赏家");
  if (selectedIds.includes("atlantis")) badges.push("🐋 深海探秘员");
  if (badges.length === 0) badges.push("🌴 南国度假小达人");

  // 奔波度
  let fatigueRating = "★★★★★ 极其轻松 (几乎无长途)";
  if (totalDrive > 100) {
    fatigueRating = "★★★☆☆ 稍有奔波 (单程较远注意车上补觉)";
  } else if (totalDrive > 60) {
    fatigueRating = "★★★★☆ 适中从容 (全在1小时生活圈内)";
  }

  const elCount = document.getElementById("m-count");
  if (elCount) elCount.innerText = selectedIds.length + " 项核心体验";
  const elCost = document.getElementById("m-cost");
  if (elCost) elCost.innerText = "约 " + totalCost + " 元";
  const elFatigue = document.getElementById("m-fatigue");
  if (elFatigue) elFatigue.innerText = fatigueRating;
  const elBadge = document.getElementById("m-badge");
  if (elBadge) elBadge.innerText = badges.join(" · ");

  const daysContainer = document.getElementById("res-days-list");
  if (!daysContainer) return;
  daysContainer.innerHTML = "";

  let day3Text = "";
  if (nightOpt === "night_show") {
    day3Text = "17:00 办妥入住海棠湾费尔蒙 ➔ 18:30 游廊码头看日落降旗黎族传说仪式 ➔ 19:30 百年石库门前排看震撼火舞杂技秀 ➔ 20:00 驱车10分钟去林旺夜市吃清补凉与烤生蚝。";
  } else {
    day3Text = "17:00 办妥入住海棠湾费尔蒙 ➔ 18:30 欣赏游廊日落 ➔ 19:00 酒店草坪海鲜自助烧烤或中餐厅慢宴，全晚不出酒店，极致放松。";
  }

  let day4Title = "山海探险与全景日落";
  let day4Details = [];
  let day5Title = "海棠湾深度玩乐与大潮赶海";
  let day5Details = [];
  let day6Title = "免税采买与从容返程";
  let day6Details = [];

  if (selectedIds.includes("yalong")) {
    day4Details.push("【上午】驱车前往【亚龙湾森林公园】：乘坐刺激敞篷观光车，挑战168米过江龙索桥，山巅俯瞰天下第一湾");
  }
  if (selectedIds.includes("marina")) {
    day4Details.push("【下午】前往【半山半岛帆船港】：4大2小包一艘法国博纳多帆船出海掌舵切浪，体验航海家乐趣");
  }
  if (selectedIds.includes("luhuitou")) {
    day4Details.push("【傍晚】登顶【鹿回头风景区】（免大门票）：吹着习习山风看漫天晚霞，华灯初上俯瞰凤凰岛与全城梦幻夜景，随后在市区享用海鲜大餐");
  }
  if (day4Details.length === 0) {
    day4Details.push("全家慢调睡到自然醒，在海棠湾悠闲度假与品尝当地美食");
  }

  if (selectedIds.includes("fairmont")) {
    day5Details.push("【上午】在费尔蒙体验【1200米韵河木船泛舟】，带小朋友在户外恒温泳池滑梯嬉水，打卡绿野仙踪孔雀园");
  }
  if (selectedIds.includes("atlantis")) {
    day5Details.push("【中午/下午】前往【三亚亚特兰蒂斯】：在失落的空间水族馆看巨幕白鲸与成群鲨鱼，室内强冷气避开正午烈日");
  }
  if (selectedIds.includes("houhai")) {
    day5Details.push("【傍晚16:00】前往隔壁【皇后湾/铁炉港】：正逢八月十八天文大退潮，带上小桶与夹子在原生礁石滩抓海星、摸海胆、逮青蟹（孩子收获感爆棚，可选儿童冲浪体验）");
  }
  if (day5Details.length === 0) {
    day5Details.push("海棠湾海滩慢步，享受热带暖阳与慢节奏假期");
  }

  if (selectedIds.includes("cdf")) {
    day6Details.push("【退房后】前往【cdf三亚国际免税城】：打卡空中云戒桥，逛乐高潮玩玩具区与伴手礼采买，顺便吃午餐");
  }
  if (selectedIds.includes("yemeng")) {
    day6Details.push("【午后】驱车沿【椰梦长廊】20公里滨海大道自驾车览，摇下车窗吹海风赏椰林（车览防虫咬）");
  }
  day6Details.push("【返程】前往三亚凤凰国际机场顺畅还车，安检登机，满载回忆平安返家");

  const daysData = [
    { day: "Day 3 晚 (9.28)", title: "费尔蒙迎宾与夜色之旅", desc: day3Text },
    { day: "Day 4 (9.29)", title: day4Title, desc: day4Details.join(" ➔ ") },
    { day: "Day 5 (9.30)", title: day5Title, desc: day5Details.join(" ➔ ") },
    { day: "Day 6 (10.1)", title: day6Title, desc: day6Details.join(" ➔ ") }
  ];

  daysData.forEach(d => {
    const b = document.createElement("div");
    b.className = "result-day-block";
    b.innerHTML = "<div class=\"result-day-title\">📅 " + d.day + " · " + d.title + "</div>" +
                  "<div class=\"result-day-desc\">" + d.desc + "</div>";
    daysContainer.appendChild(b);
  });

  let text = "🌴【咚咚与甜心海南大冒险 · 三亚定制路线方案】🌴\n";
  text += "👥 同行配置：4位大人 + 咚咚(7岁半) + 甜心(9岁) · MPV自驾\n";
  text += "🏨 下榻大本营：海棠湾熹棠费尔蒙酒店 (9.28~10.1)\n";
  text += "💰 预估门票总开销：" + totalCost + " 元 (4大2小)\n";
  text += "🏅 专属收获勋章：" + badges.join("、") + "\n";
  text += "--------------------------------\n";
  daysData.forEach(d => {
    text += d.day + "：" + d.title + "\n" + d.desc + "\n\n";
  });
  text += "大家看下这个安排怎么样？有想调整的地方随时说，然后让 AI 助手直接落地精细路书！";
  lastGeneratedSummary = text;

  const resCard = document.getElementById("custom-result");
  if (resCard) {
    resCard.style.display = "block";
  }
}

function copyPlanToClipboard() {
  if (!lastGeneratedSummary) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(lastGeneratedSummary).then(() => {
      alert("✅ 定制方案文本已成功复制到剪贴板！\n可以直接粘贴发送到微信家庭群里商量啦~");
    }).catch(() => {
      prompt("请手动复制下方方案文案：", lastGeneratedSummary);
    });
  } else {
    prompt("请手动复制下方方案文案：", lastGeneratedSummary);
  }
}
