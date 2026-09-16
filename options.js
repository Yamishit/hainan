// PhotoSwipe 5 全屏灯箱与相册初始化
document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll(".option-card");
  cards.forEach(card => {
    const galleryBar = card.querySelector(".gallery-bar");
    if (!galleryBar) return;

    // 为每个卡片的 gallery-bar 初始化灯箱
    const lightbox = new window.PhotoSwipeLightbox({
      gallery: galleryBar,
      children: "a.thumb-item",
      pswpModule: window.PhotoSwipe,
      showHideAnimationType: "zoom",
      bgOpacity: 0.88,
      pinchToClose: true,
      closeOnVerticalDrag: true,
      wheelToZoom: true,
      doubleTapAction: "zoom",
      padding: { top: 24, bottom: 48, left: 16, right: 16 }
    });

    // 注册底部精致半透明居中图注 (Title + 描述)
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
            if (title) {
              el.innerHTML = "<div style=\"position:absolute;bottom:16px;left:50%;transform:translateX(-50%);text-align:center;color:#fff;background:rgba(15,23,42,0.85);padding:8px 20px;font-size:13.5px;max-width:90%;width:max-content;border-radius:24px;backdrop-filter:blur(6px);box-shadow:0 4px 20px rgba(0,0,0,0.3);line-height:1.5;border:1px solid rgba(255,255,255,0.15);\">" + title + "</div>";
            } else {
              el.innerHTML = "";
            }
          });
        }
      });
    });

    lightbox.init();

    // 点击大首图时，直接触发第一张缩略图的点击，顺滑唤起全屏灯箱
    const mainLink = card.querySelector(".card-main-link");
    if (mainLink) {
      mainLink.addEventListener("click", function(e) {
        e.preventDefault();
        const firstThumb = galleryBar.querySelector("a.thumb-item");
        if (firstThumb) firstThumb.click();
      });
    }
  });

  // 绑定自定义行程制定器选项点击事件（支持即时实时联动）
  document.querySelectorAll("#chips-places input[type=\"checkbox\"], #chips-night input[type=\"radio\"], #chips-tempo input[type=\"radio\"]").forEach(inp => {
    inp.addEventListener("change", function() {
      updateChipStyles();
      generateCustomPlan(false); // 选项变化时静默实时更新，不滚屏
    });
  });

  // 初始默认生成一次定制行程
  resetPlanner();
});

function showToast(message) {
  let toast = document.querySelector(".global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "global-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add("show");
  if (window._toastTimer) clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

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
  const nightDef = document.querySelector("#chips-night input[value=\"night_show\"]");
  if (nightDef) nightDef.checked = true;

  const tempoDef = document.querySelector("#chips-tempo input[value=\"balanced\"]");
  if (tempoDef) tempoDef.checked = true;

  updateChipStyles();
  generateCustomPlan(false);
}

function generateCustomPlan(isUserClick = true) {
  const selectedPlaces = [];
  document.querySelectorAll("#chips-places .chip-item").forEach(item => {
    const chk = item.querySelector("input[type=\"checkbox\"]");
    if (chk && chk.checked) {
      selectedPlaces.push({
        id: item.getAttribute("data-id"),
        name: item.querySelector("span").textContent.trim(),
        cost: parseInt(item.getAttribute("data-cost") || "0", 10),
        drive: parseInt(item.getAttribute("data-drive") || "0", 10)
      });
    }
  });

  const nightOpt = document.querySelector("#chips-night input[name=\"night_opt\"]:checked")?.value || "night_show";
  const tempoOpt = document.querySelector("#chips-tempo input[name=\"tempo_opt\"]:checked")?.value || "balanced";

  let totalCost = 0;
  let maxDrive = 0;
  selectedPlaces.forEach(p => {
    totalCost += p.cost;
    if (p.drive > maxDrive) maxDrive = p.drive;
  });

  const countEl = document.getElementById("m-count");
  if (countEl) countEl.textContent = selectedPlaces.length + " 项";

  const costEl = document.getElementById("m-cost");
  if (costEl) costEl.textContent = totalCost === 0 ? "0 元 (免费/酒店内)" : "约 " + totalCost.toLocaleString() + " 元";

  let fatigueText = "★★★★★ 极佳 (以海棠湾为中心，轻松舒适)";
  let fatigueColor = "#2e7d32";
  if (selectedPlaces.some(p => p.id === "nanshan")) {
    fatigueText = "★★☆☆☆ 较奔波 (南山往返160km消耗体力大)";
    fatigueColor = "#d32f2f";
  } else if (selectedPlaces.some(p => p.id === "west_island")) {
    fatigueText = "★★★☆☆ 中等 (西岛需乘船过渡，耗时较多)";
    fatigueColor = "#f57c00";
  } else if (selectedPlaces.length > 5) {
    fatigueText = "★★★☆☆ 略紧凑 (项目丰富，需注意防晒补水)";
    fatigueColor = "#0288d1";
  }
  const fatigueEl = document.getElementById("m-fatigue");
  if (fatigueEl) {
    fatigueEl.textContent = fatigueText;
    fatigueEl.style.color = fatigueColor;
  }

  const badges = [];
  if (selectedPlaces.some(p => p.id === "houhai")) badges.push("赶海小能手");
  if (selectedPlaces.some(p => p.id === "yalong")) badges.push("索桥小勇士");
  if (selectedPlaces.some(p => p.id === "marina")) badges.push("掌舵小船长");
  if (selectedPlaces.some(p => p.id === "atlantis")) badges.push("深海探索家");
  if (selectedPlaces.some(p => p.id === "fairmont")) badges.push("演艺鉴赏家");
  if (badges.length === 0) badges.push("海岛度假达人");
  const badgeEl = document.getElementById("m-badge");
  if (badgeEl) badgeEl.textContent = "🏅 " + badges.join(" + ");

  const daysList = document.getElementById("res-days-list");
  if (!daysList) return;
  daysList.innerHTML = "";

  const day3Div = document.createElement("div");
  day3Div.className = "res-day-card";
  let nightHtml = "";
  if (nightOpt === "night_show") {
    nightHtml = "<b>Day 3 傍晚 (9.28) · 费尔蒙迎宾双秀 + 林旺夜市：</b><br>17:00 办理入住 ➔ 18:30 游廊观赏日落降旗黎族仪式 ➔ 19:30 滨水石库门火舞特技秀（视觉震撼）➔ 20:00 驱车10分钟去林旺夜市吃清补凉、椰子冻与烤生蚝。";
  } else {
    nightHtml = "<b>Day 3 傍晚 (9.28) · 费尔蒙沉浸式度假宴：</b><br>17:00 办理入住 ➔ 18:30 游廊看日落降旗仪式 ➔ 漫步私家运河园林 ➔ 酒店草坪海鲜BBQ自助餐或中餐厅享用慢宴，舒适不折腾。";
  }
  day3Div.innerHTML = "<div class=\"res-day-title\">🌙 9月28日 (Day 3 晚) · 抵步入驻海棠湾</div><p style=\"margin:0; font-size:13.5px; line-height:1.7; color:#37474f;\">" + nightHtml + "</p>";
  daysList.appendChild(day3Div);

  const daytimePlaces = selectedPlaces.filter(p => p.id !== "fairmont");
  const day4Places = [];
  const day5Places = [];

  daytimePlaces.forEach(p => {
    if (["yalong", "marina", "luhuitou", "west_island", "nanshan"].includes(p.id)) {
      day4Places.push(p);
    } else {
      day5Places.push(p);
    }
  });

  const day4Div = document.createElement("div");
  day4Div.className = "res-day-card";
  let day4Text = "";
  if (day4Places.length > 0) {
    day4Text = "<b>上午 / 下午核心安排：</b><br>" + day4Places.map(p => "• <b>" + p.name + "</b>：车程约 " + p.drive + " 分钟，注意正午防晒。").join("<br>") + "<br><b>午餐推荐：</b>亚龙湾东榕美食广场或第一市场特色海鲜；<br><b>傍晚/晚餐：</b>若前往鹿回头可看全城晚霞夜景，回程享受舒适海风。";
  } else {
    day4Text = "<b>海棠湾轻松慢调度假：</b><br>上午在费尔蒙体验泳池恒温水上乐园与草坪孔雀互动，午后享受水疗或亲子沙滩俱乐部，全天节奏极度放松！";
  }
  day4Div.innerHTML = "<div class=\"res-day-title\">☀️ 9月29日 (Day 4 全天) · 探索与山海之行</div><p style=\"margin:0; font-size:13.5px; line-height:1.7; color:#37474f;\">" + day4Text + "</p>";
  daysList.appendChild(day4Div);

  const day5Div = document.createElement("div");
  day5Div.className = "res-day-card";
  let day5Text = "";
  if (day5Places.length > 0) {
    day5Text = "<b>海棠湾近距离核心项目：</b><br>" + day5Places.map(p => "• <b>" + p.name + "</b>：车程仅约 " + p.drive + " 分钟，轻松无负担。").join("<br>") + "<br><b>重要提醒：</b>下午16:00后正是八月十八天文大退潮，铁炉港与皇后湾礁石滩赶海摸海星抓螃蟹绝佳时段！<br><b>晚餐推荐：</b>太琼百年糟粕醋海鲜火锅或椰子鸡。";
  } else {
    day5Text = "<b>海棠湾亲海慢调：</b><br>在费尔蒙乘坐1200米韵河木船穿行热带雨林，傍晚前往周边沙滩漫步或打卡免税城。";
  }
  day5Div.innerHTML = "<div class=\"res-day-title\">🌊 9月30日 (Day 5 全天) · 亲水乐活与大退潮</div><p style=\"margin:0; font-size:13.5px; line-height:1.7; color:#37474f;\">" + day5Text + "</p>";
  daysList.appendChild(day5Div);

  const day6Div = document.createElement("div");
  day6Div.className = "res-day-card";
  const day6Html = "<b>Day 6 (10.1) · 悠闲早午餐 ➔ 沿海大道车览 ➔ 机场还车返程：</b><br>10:00 睡到自然醒享用费尔蒙丰盛自助早午餐 ➔ 11:30 退房 ➔ 驱车沿椰梦长廊景观大道海景车览（吹海风拍美照不下海防虫）➔ 14:00 到达三亚凤凰国际机场顺畅还车，满载欢乐飞返温馨家园！";
  day6Div.innerHTML = "<div class=\"res-day-title\">✈️ 10月1日 (Day 6 上午) · 告别三亚从容返程</div><p style=\"margin:0; font-size:13.5px; line-height:1.7; color:#37474f;\">" + day6Html + "</p>";
  daysList.appendChild(day6Div);

  // 关键：务必确保结果卡片 display = block！
  const resCard = document.getElementById("custom-result");
  if (resCard) {
    resCard.style.display = "block";
  }

  // 若为用户主动点击按钮生成，赋予极强烈的视觉反馈与平滑滚动
  if (isUserClick) {
    const btn = document.getElementById("btn-generate");
    if (btn) {
      const originHtml = btn.innerHTML;
      btn.innerHTML = "<span>✨ 正在智能规划最优动线...</span>";
      btn.style.opacity = "0.85";
      setTimeout(() => {
        btn.innerHTML = "<span>✅ 专属定制路线已生成！</span>";
        btn.style.opacity = "1";
        setTimeout(() => {
          btn.innerHTML = originHtml;
        }, 1800);
      }, 250);
    }

    if (resCard) {
      resCard.classList.remove("highlight-pulse");
      void resCard.offsetWidth; // 触发 reflow 重置动画
      resCard.classList.add("highlight-pulse");

      // 平滑滚动定位到结果卡片
      resCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    showToast("🎉 已为您生成专属三亚定制方案！包含 " + selectedPlaces.length + " 项核心体验，请在下方查阅~");
  }
}

function copyPlanToClipboard() {
  const resultCard = document.getElementById("custom-result");
  if (!resultCard) return;

  const countText = document.getElementById("m-count")?.textContent || "";
  const costText = document.getElementById("m-cost")?.textContent || "";
  const fatigueText = document.getElementById("m-fatigue")?.textContent || "";
  const badgeText = document.getElementById("m-badge")?.textContent || "";

  let text = "【咚咚与甜心的三亚专属定制行程推荐】\n";
  text += "——————————————\n";
  text += "📌 包含核心项目：" + countText + "\n";
  text += "💰 门票总预算预估：" + costText + "\n";
  text += "🚗 舒适度与动线：" + fatigueText + "\n";
  text += "🏅 专属荣誉勋章：" + badgeText + "\n";
  text += "——————————————\n";

  const cards = resultCard.querySelectorAll(".res-day-card");
  cards.forEach(c => {
    const title = c.querySelector(".res-day-title")?.textContent || "";
    const desc = c.querySelector("p")?.innerText || "";
    text += "\n" + title + "\n" + desc + "\n";
  });

  text += "\n💡 欢迎大家讨论！如果觉得合适就按这个方案敲定三亚后半程~";

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 行程方案已复制到剪贴板！可以直接粘贴到微信群啦~");
      alert("🎉 行程方案已复制到剪贴板！可以直接粘贴到微信群给家人讨论啦~");
    }).catch(() => {
      prompt("请长按复制下方行程文本：", text);
    });
  } else {
    prompt("请长按复制下方行程文本：", text);
  }
}
