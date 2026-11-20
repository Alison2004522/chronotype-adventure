/**
 * 《生日蛋糕小店長》（Birthday Cake Shop Manager）
 * 核心遊戲邏輯、商品資料、運費計算與關卡驗證引擎
 */

(function () {
  "use strict";

  /* ==========================================================================
     1. Web Audio API 音效合成引擎（免外載音效檔，零失效風險）
     ========================================================================== */
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      return this.isMuted;
    }

    // 基礎音符發聲器
    playTone(freq, type, duration, startTime = 0, gainLevel = 0.15) {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + startTime;

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gainLevel, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      } catch (e) {
        console.warn("Audio playback failed", e);
      }
    }

    // 按鈕點擊聲（短促木質 Pop 聲）
    playClick() {
      this.init();
      this.playTone(600, "triangle", 0.06, 0, 0.12);
    }

    // 選取蛋糕聲（清脆雙音和弦）
    playSelectCake() {
      this.init();
      this.playTone(523.25, "sine", 0.15, 0, 0.12); // C5
      this.playTone(659.25, "sine", 0.2, 0.05, 0.12); // E5
      this.playTone(783.99, "sine", 0.25, 0.1, 0.15); // G5
    }

    // 尺寸切換聲
    playSizeSwitch() {
      this.init();
      this.playTone(880, "sine", 0.08, 0, 0.1);
    }

    // 數量微調聲
    playQty() {
      this.init();
      this.playTone(700, "triangle", 0.08, 0, 0.1);
    }

    // 收銀機結帳聲（叮噹聲 + 金幣感）
    playCashRegister() {
      this.init();
      this.playTone(1200, "sine", 0.25, 0, 0.2);
      this.playTone(2400, "sine", 0.35, 0.08, 0.15);
      // 金幣微跳動
      this.playTone(1800, "triangle", 0.1, 0.15, 0.1);
      this.playTone(2100, "triangle", 0.12, 0.2, 0.1);
    }

    // 訂單完成歡呼大和弦
    playSuccess() {
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((freq, idx) => {
        this.playTone(freq, "triangle", 0.45, idx * 0.08, 0.18);
      });
    }

    // 星星解鎖叮聲
    playStar() {
      this.init();
      this.playTone(1318.5, "sine", 0.3, 0, 0.15);
      this.playTone(1760.0, "sine", 0.4, 0.08, 0.15);
    }

    // 錯誤/需修改溫柔提示音（彈跳 Boing）
    playError() {
      this.init();
      this.playTone(330, "sine", 0.18, 0, 0.15);
      this.playTone(260, "sine", 0.25, 0.12, 0.15);
    }
  }

  /* ==========================================================================
     2. 六款蛋糕標準商品資料（依據閱讀教材嚴格建立）
     ========================================================================== */
  const CAKES = [
    {
      id: "castle",
      name: "城堡",
      description: "香草蛋糕搭配什錦水果和布丁夾層，以小巧的卡士達泡芙裝飾，造型如同城堡。",
      tasteSummary: "香草蛋糕、什錦水果、布丁、卡士達泡芙",
      prices: { 6: 660, 8: 880, 10: 1100 },
      sizes: [6, 8, 10],
      image: "./assets/cakes/castle.png",
      seasonalMonths: null, // 全年供應
      pickupOnly: false,
      preorderDays: 0,
      tags: ["人氣推薦", "水果布丁"]
    },
    {
      id: "carnival",
      name: "浪漫嘉年華",
      description: "芒果與椰子慕斯相遇，搭配明亮豐富的表層裝飾。",
      tasteSummary: "芒果、椰子慕斯",
      prices: { 6: 750, 8: 990 },
      sizes: [6, 8],
      image: "./assets/cakes/summer.png",
      seasonalMonths: [7, 8], // 7～8 月限定
      pickupOnly: false,
      preorderDays: 0,
      tags: ["7～8 月限定", "芒果椰子"]
    },
    {
      id: "cupid",
      name: "邱比特",
      description: "水蜜桃慕斯、焦糖慕斯搭配濃郁的巧克力蛋糕，外層有鮮奶油披覆。",
      tasteSummary: "水蜜桃慕斯、焦糖慕斯、巧克力蛋糕",
      prices: { 8: 880, 10: 1100 }, // 無 6 吋！
      sizes: [8, 10],
      image: "./assets/cakes/cupid.png",
      seasonalMonths: null,
      pickupOnly: false,
      preorderDays: 0,
      tags: ["濃郁巧克力", "水蜜桃焦糖"]
    },
    {
      id: "happy_time",
      name: "HAPPY TIME",
      description: "鬆軟的手指蛋糕裝盛著焦糖洋梨丁及水果慕斯。",
      tasteSummary: "焦糖洋梨丁、水果慕斯、手指蛋糕",
      prices: { 6: 750, 8: 990 }, // 無 10 吋！
      sizes: [6, 8],
      image: "./assets/cakes/happy-time.png",
      seasonalMonths: null,
      pickupOnly: true, // 限門市取貨
      preorderDays: 0,
      tags: ["限門市取貨", "焦糖洋梨"]
    },
    {
      id: "jewelry_box",
      name: "珠寶音樂盒",
      description: "香草蛋糕搭配起司布蕾夾層，以新鮮草莓裝飾。",
      tasteSummary: "香草蛋糕、起司布蕾、新鮮草莓",
      prices: { 6: 880, 8: 1100 }, // 無 10 吋！
      sizes: [6, 8],
      image: "./assets/cakes/jewelry-box.png",
      seasonalMonths: [12, 1, 2], // 12～2 月限定（含跨年）
      pickupOnly: false,
      preorderDays: 0,
      tags: ["12～2 月限定", "草莓布蕾"]
    },
    {
      id: "confession",
      name: "真情告白",
      description: "使用食品級墨水及印製材料，可將顧客提供的照片完整呈現在蛋糕上。",
      tasteSummary: "食品級照片印製客製蛋糕",
      prices: { 6: 880, 8: 1100 }, // 無 10 吋！
      sizes: [6, 8],
      image: "./assets/cakes/confession.png",
      seasonalMonths: null,
      pickupOnly: false,
      preorderDays: 7, // 需提前 7 天預訂
      tags: ["需提前 7 天預訂", "照片客製"]
    }
  ];

  /* ==========================================================================
     3. 尺寸與建議分享人數指南
     ========================================================================== */
  const SIZE_SERVINGS_GUIDE = {
    6: { label: "6 吋", min: 4, max: 6, text: "適合 4～6 人" },
    8: { label: "8 吋", min: 6, max: 8, text: "適合 6～8 人" },
    10: { label: "10 吋", min: 8, max: 10, text: "適合 8～10 人" }
  };

  /* ==========================================================================
     4. 運費計算函式（嚴格落實外送表）
     ========================================================================== */
  function calcShipping(cake, size, quantity, fulfillment) {
    if (fulfillment === "pickup") {
      return {
        fee: 0,
        available: true,
        reason: ""
      };
    }

    // 外送檢查 1：特殊蛋糕是否限門市取貨
    if (cake.pickupOnly) {
      return {
        fee: 0,
        available: false,
        reason: `${cake.name} 僅限門市取貨，不提供外送服務喔！`
      };
    }

    // 外送檢查 2：尺寸與數量運費查詢表
    if (size === 6) {
      if (quantity === 1) return { fee: 150, available: true, reason: "" };
      if (quantity === 2) return { fee: 180, available: true, reason: "" };
    } else if (size === 8) {
      if (quantity === 1) return { fee: 150, available: true, reason: "" };
      if (quantity === 2) return { fee: 200, available: true, reason: "" };
    } else if (size === 10) {
      if (quantity === 1) return { fee: 200, available: true, reason: "" };
      if (quantity === 2) {
        return {
          fee: 0,
          available: false,
          reason: "2 個 10 吋蛋糕超過配送體積上限，店家不提供外送服務喔！"
        };
      }
    }

    return {
      fee: 0,
      available: false,
      reason: "此規格未提供明確外送運費資訊"
    };
  }

  /* ==========================================================================
     5. 三大顧客訂單關卡資料
     ========================================================================== */
  const LEVELS = [
    {
      levelId: 1,
      title: "第一關：精打細算的生日派對",
      customerName: "小晴",
      customerAvatar: "assets/characters/customer_qing.svg",
      customerMessage:
        "「你好！我要幫家人準備生日蛋糕！我們總共有 5 個人，預算只有 700 元。希望吃到有水果和布丁的蛋糕。我們會自己來店裡拿，只買 1 個就好！」",
      requirements: {
        headcount: 5,
        budget: 700,
        taste: "水果與布丁",
        fulfillment: "pickup",
        quantity: 1,
        date: null
      },
      target: {
        cakeId: "castle",
        size: 6,
        quantity: 1,
        fulfillment: "pickup",
        total: 660
      },
      hints: [
        "小晴全家總共有 5 個人，先看一下哪個蛋糕尺寸適合 4～6 人分享吧！",
        "小晴預算只有 700 元，挑選單價不要超過 700 元的蛋糕喔。",
        "小晴希望能吃到『什錦水果與布丁』夾層，而且會『自己來店裡拿（門市自取）』！"
      ],
      successFeedback:
        "太棒了！你選到符合人數與口味的蛋糕，而且沒有超出預算！第一筆訂單完成！"
    },
    {
      levelId: 2,
      title: "第二關：夏日芒果派對",
      customerName: "小樂",
      customerAvatar: "assets/characters/customer_le.svg",
      customerMessage:
        "「你好！我要幫朋友辦生日派對！生日是 7 月 20 日，總共有 8 個人。朋友最喜歡芒果和椰子！我們會到門市取貨，可以幫我推薦蛋糕嗎？」",
      requirements: {
        headcount: 8,
        budget: null,
        taste: "芒果與椰子",
        fulfillment: "pickup",
        quantity: 1,
        date: "7 月 20 日",
        month: 7
      },
      target: {
        cakeId: "carnival",
        size: 8,
        quantity: 1,
        fulfillment: "pickup",
        total: 990
      },
      hints: [
        "小樂的朋友最喜歡『芒果與椰子』，找找哪款蛋糕有這兩種口味搭配！",
        "派對日期是 7 月 20 日，要注意某些季節限定蛋糕的限定月份（7～8 月）喔！",
        "總共有 8 個人要吃，8 吋蛋糕適合 6～8 人，如果選 6 吋（適合 4～6 人）會不夠吃喔！"
      ],
      successFeedback:
        "太厲害了！你不只選對了芒果口味，還注意到了季節限定月份！第二筆訂單完成！"
    },
    {
      levelId: 3,
      title: "第三關：外送訂單大挑戰",
      customerName: "小宇",
      customerAvatar: "assets/characters/customer_yu.svg",
      customerMessage:
        "「你好！我前一天已經預訂蛋糕了！這次需要 2 個 8 吋巧克力蛋糕。希望明天下午 3 點外送。總預算只有 2,000 元，可以幫我完成訂單嗎？」",
      requirements: {
        headcount: null,
        budget: 2000,
        taste: "巧克力蛋糕",
        size: 8,
        quantity: 2,
        fulfillment: "delivery",
        time: "下午 3 點",
        date: "已於前一天預訂"
      },
      target: {
        cakeId: "cupid",
        size: 8,
        quantity: 2,
        fulfillment: "delivery",
        total: 1960
      },
      hints: [
        "小宇指定要『巧克力蛋糕』，請找找介紹中有濃郁巧克力蛋糕的商品！",
        "小宇公司需要『2 個 8 吋』蛋糕，記得將數量切換為 2 個！",
        "小宇需要專人外送，2 個 8 吋蛋糕外送運費為 200 元，請確認總金額未超過 2,000 元預算！"
      ],
      successFeedback:
        "外送訂單完成！你成功計算兩個蛋糕的價格與運費！總金額是 1,960 元，沒有超出預算！"
    }
  ];

  /* ==========================================================================
     6. 遊戲運行狀態控制器（Game State Controller）
     ========================================================================== */
  class BirthdayCakeGame {
    constructor() {
      this.sound = new SoundManager();

      // 關卡進度
      this.currentLevelIndex = 0; // 0, 1, 2
      this.completedLevels = [false, false, false];

      // 目前挑選與設定暫存
      this.selectedCake = CAKES[0];
      this.selectedSize = 6;
      this.selectedQuantity = 1;
      this.selectedFulfillment = "pickup";

      // 提示進度指標
      this.hintIndex = 0;

      // 快取 DOM 元素
      this.dom = {};
      this.cacheDom();
      this.bindEvents();
      this.renderMenuCards();
      this.showScreen("start-screen");
    }

    cacheDom() {
      // 畫面切換
      this.dom.startScreen = document.getElementById("start-screen");
      this.dom.gameScreen = document.getElementById("game-screen");
      this.dom.victoryScreen = document.getElementById("victory-screen");

      // HUD
      this.dom.hudLevelBadge = document.getElementById("hud-level-badge");
      this.dom.starSlots = [
        document.getElementById("star-slot-1"),
        document.getElementById("star-slot-2"),
        document.getElementById("star-slot-3")
      ];
      this.dom.btnToggleSound = document.getElementById("btn-toggle-sound");
      this.dom.soundIcon = document.getElementById("sound-icon");
      this.dom.btnOpenRules = document.getElementById("btn-open-rules");

      // 開始頁按鈕
      this.dom.btnStartGame = document.getElementById("btn-start-game");

      // 顧客面板
      this.dom.currentLevelTitle = document.getElementById("current-level-title");
      this.dom.customerAvatarImg = document.getElementById("customer-avatar-img");
      this.dom.customerName = document.getElementById("customer-name");
      this.dom.customerDialogueText = document.getElementById("customer-dialogue-text");
      this.dom.reqHeadcount = document.getElementById("req-headcount");
      this.dom.reqBudget = document.getElementById("req-budget");
      this.dom.reqTaste = document.getElementById("req-taste");
      this.dom.reqFulfillment = document.getElementById("req-fulfillment");
      this.dom.reqQuantity = document.getElementById("req-quantity");
      this.dom.reqDateRow = document.getElementById("req-date-row");
      this.dom.reqDate = document.getElementById("req-date");
      this.dom.btnOpenHint = document.getElementById("btn-open-hint");

      // 菜單面板
      this.dom.cakeCardsGrid = document.getElementById("cake-cards-grid");

      // 點單收銀面板
      this.dom.summaryThumbnail = document.getElementById("summary-thumbnail");
      this.dom.summaryCakeName = document.getElementById("summary-cake-name");
      this.dom.summaryCakeTag = document.getElementById("summary-cake-tag");
      this.dom.sizeOptionsContainer = document.getElementById("size-options-container");
      this.dom.btnQtyMinus = document.getElementById("btn-qty-minus");
      this.dom.btnQtyPlus = document.getElementById("btn-qty-plus");
      this.dom.displayQuantity = document.getElementById("display-quantity");
      this.dom.btnFulfillPickup = document.getElementById("btn-fulfill-pickup");
      this.dom.btnFulfillDelivery = document.getElementById("btn-fulfill-delivery");
      this.dom.deliveryConditionNote = document.getElementById("delivery-condition-note");

      // 收據明細
      this.dom.rItemName = document.getElementById("r-item-name");
      this.dom.rItemUnit = document.getElementById("r-item-unit");
      this.dom.rItemQty = document.getElementById("r-item-qty");
      this.dom.rSubtotal = document.getElementById("r-subtotal");
      this.dom.rShipping = document.getElementById("r-shipping");
      this.dom.rGrandTotal = document.getElementById("r-grand-total");
      this.dom.receiptBudgetFeedback = document.getElementById("receipt-budget-feedback");

      // 結帳按鈕
      this.dom.btnSubmitOrder = document.getElementById("btn-submit-order");
      this.dom.btnResetOrder = document.getElementById("btn-reset-order");

      // 結算畫面按鈕
      this.dom.btnPlayAgain = document.getElementById("btn-play-again");
      this.dom.btnBackHome = document.getElementById("btn-back-home");

      // 彈跳視窗
      this.dom.modalRules = document.getElementById("modal-rules");
      this.dom.modalHint = document.getElementById("modal-hint");
      this.dom.modalFeedback = document.getElementById("modal-feedback");
      this.dom.modalLightbox = document.getElementById("modal-lightbox");

      this.dom.hintTextContent = document.getElementById("hint-text-content");
      this.dom.feedbackHeadline = document.getElementById("feedback-headline");
      this.dom.feedbackExplanation = document.getElementById("feedback-explanation");
      this.dom.feedbackIconBox = document.getElementById("feedback-icon-box");
      this.dom.feedbackModalFooter = document.getElementById("feedback-modal-footer");
      this.dom.feedbackModalTitle = document.getElementById("feedback-modal-title");

      this.dom.lightboxCakeName = document.getElementById("lightbox-cake-name");
      this.dom.lightboxImgContainer = document.getElementById("lightbox-img-container");
      this.dom.lightboxDesc = document.getElementById("lightbox-desc");
    }

    bindEvents() {
      // 音效切換
      this.dom.btnToggleSound.addEventListener("click", () => {
        const muted = this.sound.toggleMute();
        this.dom.soundIcon.textContent = muted ? "🔇" : "🔊";
      });

      // 開始按鈕
      this.dom.btnStartGame.addEventListener("click", () => {
        this.sound.playClick();
        this.startLevel(0);
      });

      // 規則彈窗
      this.dom.btnOpenRules.addEventListener("click", () => {
        this.sound.playClick();
        this.openModal(this.dom.modalRules);
      });

      // 提示彈窗
      this.dom.btnOpenHint.addEventListener("click", () => {
        this.sound.playClick();
        this.showCurrentHint();
      });

      // 數量加減
      this.dom.btnQtyMinus.addEventListener("click", () => {
        if (this.selectedQuantity > 1) {
          this.selectedQuantity--;
          this.sound.playQty();
          this.updateCashierUI();
        }
      });

      this.dom.btnQtyPlus.addEventListener("click", () => {
        if (this.selectedQuantity < 2) {
          this.selectedQuantity++;
          this.sound.playQty();
          this.updateCashierUI();
        }
      });

      // 取貨方式切換
      this.dom.btnFulfillPickup.addEventListener("click", () => {
        this.selectedFulfillment = "pickup";
        this.sound.playClick();
        this.dom.btnFulfillPickup.classList.add("active");
        this.dom.btnFulfillDelivery.classList.remove("active");
        this.dom.deliveryConditionNote.style.display = "none";
        this.updateCashierUI();
      });

      this.dom.btnFulfillDelivery.addEventListener("click", () => {
        this.selectedFulfillment = "delivery";
        this.sound.playClick();
        this.dom.btnFulfillDelivery.classList.add("active");
        this.dom.btnFulfillPickup.classList.remove("active");
        this.dom.deliveryConditionNote.style.display = "block";
        this.updateCashierUI();
      });

      // 提交訂單判定
      this.dom.btnSubmitOrder.addEventListener("click", () => {
        this.validateCurrentOrder();
      });

      // 重新選擇
      this.dom.btnResetOrder.addEventListener("click", () => {
        this.sound.playClick();
        this.resetCurrentLevelSelection();
      });

      // 關閉各 Modal 之 [data-close] 按鈕
      document.querySelectorAll("[data-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const targetModalId = btn.getAttribute("data-close");
          const targetModal = document.getElementById(targetModalId);
          if (targetModal) {
            this.closeModal(targetModal);
          }
        });
      });

      // 結算畫面按鈕
      this.dom.btnPlayAgain.addEventListener("click", () => {
        this.sound.playClick();
        this.restartGame();
      });

      this.dom.btnBackHome.addEventListener("click", () => {
        this.sound.playClick();
        this.showScreen("start-screen");
      });
    }

    // 視圖切換
    showScreen(screenId) {
      [this.dom.startScreen, this.dom.gameScreen, this.dom.victoryScreen].forEach((sc) => {
        sc.classList.remove("active");
      });
      const activeEl = document.getElementById(screenId);
      if (activeEl) {
        activeEl.classList.add("active");
      }
    }

    openModal(modalEl) {
      if (!modalEl) return;
      modalEl.classList.add("active");
      modalEl.setAttribute("aria-hidden", "false");
    }

    closeModal(modalEl) {
      if (!modalEl) return;
      modalEl.classList.remove("active");
      modalEl.setAttribute("aria-hidden", "true");
    }

    /* ==========================================================================
       7. 菜單卡片生成與圖片占位優雅容錯
       ========================================================================== */
    renderMenuCards() {
      this.dom.cakeCardsGrid.innerHTML = "";

      CAKES.forEach((cake) => {
        const card = document.createElement("div");
        card.className = "cake-card";
        card.setAttribute("data-cake-id", cake.id);

        // 標籤樣式分類
        let tagClass = "tag-hot";
        if (cake.seasonalMonths) tagClass = "tag-season";
        if (cake.pickupOnly) tagClass = "tag-alert";
        if (cake.preorderDays > 0) tagClass = "tag-notice";

        const primaryTag = cake.tags[0] || "精選蛋糕";

        // 價格標籤集合
        const pricePills = cake.sizes
          .map((s) => `<span class="price-pill">${s} 吋 $${cake.prices[s]}</span>`)
          .join("");

        card.innerHTML = `
          <div class="cake-img-wrap" title="點擊查看蛋糕大圖">
            <!-- 載入雲端蛋糕真實照片 -->
            <img src="${cake.image}" alt="${cake.name}" loading="lazy" class="cake-img-el">
            <span class="zoom-badge">🔍 點擊放大</span>
            <div class="img-placeholder-box" style="display: none;">
              <div class="plate-drawing"></div>
              <span class="ph-cake-title">${cake.name}</span>
              <span class="ph-file-name">[素材：${cake.image.replace("./", "")}]</span>
              <span class="ph-sub-hint">放入雲端圖片即可顯示</span>
            </div>
          </div>
          <div class="cake-info-row">
            <span class="cake-name-text">${cake.name}</span>
            <span class="cake-tag-badge ${tagClass}">${primaryTag}</span>
          </div>
          <p class="cake-desc-text">${cake.tasteSummary}</p>
          <div class="cake-price-pills">
            ${pricePills}
          </div>
        `;

        // 圖片載入失敗處理（優雅顯示占位盤）
        const imgEl = card.querySelector(".cake-img-el");
        const placeholderEl = card.querySelector(".img-placeholder-box");

        imgEl.addEventListener("error", () => {
          imgEl.style.display = "none";
          placeholderEl.style.display = "flex";
        });

        // 點擊圖片區塊：同時選取並展開大圖查看
        const imgWrap = card.querySelector(".cake-img-wrap");
        imgWrap.addEventListener("click", (e) => {
          e.stopPropagation();
          this.sound.playClick();
          this.selectCake(cake.id);
          this.openLightbox(cake);
        });

        // 點選卡片挑選商品
        card.addEventListener("click", (e) => {
          this.sound.playSelectCake();
          this.selectCake(cake.id);
        });

        this.dom.cakeCardsGrid.appendChild(card);
      });
    }

    // 選取指定蛋糕
    selectCake(cakeId) {
      const found = CAKES.find((c) => c.id === cakeId);
      if (!found) return;

      this.selectedCake = found;

      // 若目前選取之尺寸此商品不支援，自動重選其第一款可用尺寸
      if (!this.selectedCake.sizes.includes(this.selectedSize)) {
        this.selectedSize = this.selectedCake.sizes[0];
      }

      // 若商品限門市取貨且目前為外送，可主動提醒並切換或維持狀態提示
      this.updateMenuCardsSelection();
      this.updateSizeOptions();
      this.updateCashierUI();
    }

    updateMenuCardsSelection() {
      const allCards = this.dom.cakeCardsGrid.querySelectorAll(".cake-card");
      allCards.forEach((card) => {
        if (card.getAttribute("data-cake-id") === this.selectedCake.id) {
          card.classList.add("selected");
        } else {
          card.classList.remove("selected");
        }
      });
    }

    // 重新建構尺寸按鈕組
    updateSizeOptions() {
      this.dom.sizeOptionsContainer.innerHTML = "";

      this.selectedCake.sizes.forEach((size) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "size-btn";
        if (size === this.selectedSize) {
          btn.classList.add("active");
        }

        const price = this.selectedCake.prices[size];
        const serving = SIZE_SERVINGS_GUIDE[size]
          ? SIZE_SERVINGS_GUIDE[size].text
          : "";

        btn.innerHTML = `
          <span class="size-name">${size} 吋</span>
          <span class="size-price">$${price}</span>
          <span class="size-servings">${serving}</span>
        `;

        btn.addEventListener("click", () => {
          this.selectedSize = size;
          this.sound.playSizeSwitch();
          this.updateSizeOptions();
          this.updateCashierUI();
        });

        this.dom.sizeOptionsContainer.appendChild(btn);
      });
    }

    /* ==========================================================================
       8. 點單收銀台即時計算與介面更新
       ========================================================================== */
    updateCashierUI() {
      const currentLevel = LEVELS[this.currentLevelIndex];
      const cake = this.selectedCake;
      const size = this.selectedSize;
      const qty = this.selectedQuantity;
      const fulfill = this.selectedFulfillment;

      // 縮圖與名稱
      this.dom.summaryCakeName.textContent = cake.name;
      this.dom.summaryCakeTag.textContent = cake.tags.join(" ． ");

      this.dom.summaryThumbnail.innerHTML = `
        <img src="${cake.image}" alt="${cake.name}" class="summary-thumb-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <span style="display:none; font-size:0.75rem; font-weight:900; color:#8D6E63;">${cake.name}</span>
      `;

      // 數量加減器狀態
      this.dom.displayQuantity.textContent = qty;
      this.dom.btnQtyMinus.disabled = qty <= 1;
      this.dom.btnQtyPlus.disabled = qty >= 2;

      // 單價與商品小計
      const unitPrice = cake.prices[size] || 0;
      const subtotal = unitPrice * qty;

      // 運費計算
      const shippingInfo = calcShipping(cake, size, qty, fulfill);

      // 收據明細列印
      this.dom.rItemName.textContent = `${cake.name}（${size} 吋）`;
      this.dom.rItemUnit.textContent = `單價：NT$ ${unitPrice.toLocaleString()}`;
      this.dom.rItemQty.textContent = `${qty} 個`;
      this.dom.rSubtotal.textContent = `NT$ ${subtotal.toLocaleString()}`;

      if (fulfill === "pickup") {
        this.dom.rShipping.textContent = "NT$ 0（自取免運）";
        this.dom.rShipping.style.color = "var(--color-caramel-deep)";
      } else {
        if (shippingInfo.available) {
          this.dom.rShipping.textContent = `NT$ ${shippingInfo.fee.toLocaleString()}`;
          this.dom.rShipping.style.color = "#1976D2";
        } else {
          this.dom.rShipping.textContent = "無法外送";
          this.dom.rShipping.style.color = "var(--color-danger)";
        }
      }

      // 總金額與按鈕可用狀態
      if (fulfill === "delivery" && !shippingInfo.available) {
        this.dom.rGrandTotal.textContent = "無法結帳（不支援外送）";
        this.dom.rGrandTotal.style.fontSize = "0.95rem";
        this.dom.btnSubmitOrder.disabled = true;
      } else {
        const grandTotal = subtotal + (shippingInfo.available ? shippingInfo.fee : 0);
        this.dom.rGrandTotal.textContent = `NT$ ${grandTotal.toLocaleString()}`;
        this.dom.rGrandTotal.style.fontSize = "1.2rem";
        this.dom.btnSubmitOrder.disabled = false;

        // 預算比對動態標籤
        if (currentLevel && currentLevel.requirements.budget) {
          const budget = currentLevel.requirements.budget;
          if (grandTotal <= budget) {
            const diff = budget - grandTotal;
            this.dom.receiptBudgetFeedback.className = "receipt-budget-feedback ok";
            this.dom.receiptBudgetFeedback.textContent = `符合預算！預算 NT$ ${budget.toLocaleString()}（剩餘 NT$ ${diff.toLocaleString()}）`;
          } else {
            const over = grandTotal - budget;
            this.dom.receiptBudgetFeedback.className = "receipt-budget-feedback over";
            this.dom.receiptBudgetFeedback.textContent = `超出顧客預算！超額 NT$ ${over.toLocaleString()}（預算 NT$ ${budget.toLocaleString()}）`;
          }
        } else {
          this.dom.receiptBudgetFeedback.className = "receipt-budget-feedback";
          this.dom.receiptBudgetFeedback.style.display = "none";
        }
      }
    }

    /* ==========================================================================
       9. 關卡初始化與切換
       ========================================================================== */
    startLevel(levelIndex) {
      this.currentLevelIndex = levelIndex;
      this.hintIndex = 0;
      const level = LEVELS[levelIndex];

      // 更新 HUD
      this.dom.hudLevelBadge.textContent = `今日訂單：${levelIndex + 1}／3`;
      this.updateStarHUD();

      // 更新左側顧客資訊
      this.dom.currentLevelTitle.textContent = level.title;
      this.dom.customerAvatarImg.src = level.customerAvatar;
      this.dom.customerName.textContent = level.customerName;
      this.dom.customerDialogueText.textContent = level.customerMessage;

      // 填入需求標籤
      this.dom.reqHeadcount.textContent = level.requirements.headcount
        ? `${level.requirements.headcount} 人`
        : "未特別限制";
      this.dom.reqBudget.textContent = level.requirements.budget
        ? `${level.requirements.budget.toLocaleString()} 元`
        : "依顧客喜好挑選";
      this.dom.reqTaste.textContent = level.requirements.taste;
      this.dom.reqFulfillment.textContent =
        level.requirements.fulfillment === "pickup" ? "門市自取" : "專人外送";
      this.dom.reqQuantity.textContent = `${level.requirements.quantity} 個`;

      if (level.requirements.date) {
        this.dom.reqDateRow.style.display = "flex";
        this.dom.reqDate.textContent = level.requirements.date;
      } else {
        this.dom.reqDateRow.style.display = "none";
      }

      // 重設選擇狀態
      this.resetCurrentLevelSelection();

      this.showScreen("game-screen");
    }

    resetCurrentLevelSelection() {
      // 依關卡目標給予不同預設啟始
      this.selectedCake = CAKES[0];
      this.selectedSize = this.selectedCake.sizes[0];
      this.selectedQuantity = 1;
      this.selectedFulfillment = "pickup";

      this.dom.btnFulfillPickup.classList.add("active");
      this.dom.btnFulfillDelivery.classList.remove("active");
      this.dom.deliveryConditionNote.style.display = "none";

      this.updateMenuCardsSelection();
      this.updateSizeOptions();
      this.updateCashierUI();
    }

    updateStarHUD() {
      this.completedLevels.forEach((done, idx) => {
        const slot = this.dom.starSlots[idx];
        if (slot) {
          const img = slot.querySelector(".star-icon");
          if (done) {
            slot.classList.add("filled");
            img.src = "assets/icons/star_gold.svg";
          } else {
            slot.classList.remove("filled");
            img.src = "assets/icons/star_empty.svg";
          }
        }
      });
    }

    /* ==========================================================================
       10. 訂單條件嚴格驗證引擎（符合所有需求才通關，失敗提供引導線索）
       ========================================================================== */
    validateCurrentOrder() {
      const level = LEVELS[this.currentLevelIndex];
      const cake = this.selectedCake;
      const size = this.selectedSize;
      const qty = this.selectedQuantity;
      const fulfill = this.selectedFulfillment;

      const shippingInfo = calcShipping(cake, size, qty, fulfill);
      if (fulfill === "delivery" && !shippingInfo.available) {
        this.sound.playError();
        this.showFeedbackModal(false, "配送方式不符合", shippingInfo.reason);
        return;
      }

      const unitPrice = cake.prices[size] || 0;
      const total = unitPrice * qty + (fulfill === "delivery" ? shippingInfo.fee : 0);

      // 關卡 1：精打細算的生日派對
      if (level.levelId === 1) {
        // 目標：城堡 6 吋、1 個、門市自取、660 元
        if (cake.id !== "castle") {
          this.sound.playError();
          this.showFeedbackModal(
            false,
            "蛋糕口味不太對喔！",
            "小晴希望能吃到有『什錦水果和布丁』夾層的蛋糕，再仔細看一下菜單上的口味介紹吧！"
          );
          return;
        }

        if (size !== 6) {
          this.sound.playError();
          if (size > 6) {
            this.showFeedbackModal(
              false,
              "尺寸或預算超出囉！",
              `小晴家總共有 5 個人，6 吋蛋糕適合 4～6 人剛剛好；若選 ${size} 吋價格為 ${unitPrice} 元，會超出 700 元預算喔！`
            );
          } else {
            this.showFeedbackModal(false, "尺寸不太合適！", "5 個人要分享，挑選 6 吋蛋糕最剛好喔！");
          }
          return;
        }

        if (qty !== 1) {
          this.sound.playError();
          this.showFeedbackModal(false, "購買數量有誤！", "小晴說今天只買 1 個蛋糕就好囉！");
          return;
        }

        if (fulfill !== "pickup") {
          this.sound.playError();
          this.showFeedbackModal(
            false,
            "取貨方式不符合！",
            "小晴在對話中特別提到『會自己來店裡拿』，請將取貨方式切換為『門市自取』！"
          );
          return;
        }

        if (total > 700) {
          this.sound.playError();
          this.showFeedbackModal(
            false,
            "超出顧客預算囉！",
            `這筆訂單總金額為 ${total} 元，超過了小晴 700 元的預算上限！`
          );
          return;
        }

        // 通關！
        this.onOrderSuccess(level.successFeedback);
        return;
      }

      // 關卡 2：夏日芒果派對
      if (level.levelId === 2) {
        // 目標：浪漫嘉年華 8 吋、1 個、門市自取、990 元
        if (cake.id !== "carnival") {
          this.sound.playError();
          if (cake.id === "jewelry_box") {
            this.showFeedbackModal(
              false,
              "限定月份與口味不符合！",
              "珠寶音樂盒是 12～2 月的冬季限定蛋糕，小樂朋友的生日是 7 月 20 日，而且朋友最愛的是芒果與椰子喔！"
            );
          } else {
            this.showFeedbackModal(
              false,
              "口味或限定月份不符！",
              "小樂朋友最喜歡芒果和椰子，而且派對日期是 7 月 20 日，請挑選在 7 月限定供應的芒果椰子蛋糕！"
            );
          }
          return;
        }

        if (size !== 8) {
          this.sound.playError();
          if (size === 6) {
            this.showFeedbackModal(
              false,
              "蛋糕尺寸可能不夠分喔！",
              "這次派對總共有 8 個人要一起吃蛋糕，6 吋蛋糕只適合 4～6 人；8 吋蛋糕才適合 6～8 人分享喔！"
            );
          } else {
            this.showFeedbackModal(false, "尺寸不太合適！", "8 個人聚會，挑選 8 吋蛋糕最剛剛好！");
          }
          return;
        }

        if (qty !== 1) {
          this.sound.playError();
          this.showFeedbackModal(false, "購買數量有誤！", "小樂只需要 1 個生日蛋糕喔！");
          return;
        }

        if (fulfill !== "pickup") {
          this.sound.playError();
          this.showFeedbackModal(
            false,
            "取貨方式不符合！",
            "小樂說會到門市自取蛋糕，請選擇『門市自取』！"
          );
          return;
        }

        // 通關！
        this.onOrderSuccess(level.successFeedback);
        return;
      }

      // 關卡 3：外送訂單大挑戰
      if (level.levelId === 3) {
        // 目標：邱比特 8 吋 × 2、外送、運費 200、總金額 1960 元
        if (cake.id !== "cupid") {
          this.sound.playError();
          if (cake.id === "happy_time") {
            this.showFeedbackModal(
              false,
              "特殊蛋糕無法外送！",
              "HAPPY TIME 限門市自取，無法提供外送服務；而且小宇指定要濃郁的巧克力蛋糕喔！"
            );
          } else {
            this.showFeedbackModal(
              false,
              "蛋糕口味不符合！",
              "小宇指定公司要吃『濃郁巧克力蛋糕』，請仔細比對哪一款蛋糕含有巧克力蛋糕！"
            );
          }
          return;
        }

        if (size !== 8) {
          this.sound.playError();
          if (size === 10) {
            this.showFeedbackModal(
              false,
              "尺寸不符合且無法外送！",
              "小宇指定每個都要 8 吋蛋糕；而且 2 個 10 吋蛋糕超過配送體積，店家不提供外送服務喔！"
            );
          } else {
            this.showFeedbackModal(false, "尺寸不符合！", "小宇指定要 8 吋蛋糕喔！");
          }
          return;
        }

        if (qty !== 2) {
          this.sound.playError();
          this.showFeedbackModal(
            false,
            "數量不正確！",
            "小宇公司這次需要替同事準備 2 個蛋糕，請將數量調整為 2 個！"
          );
          return;
        }

        if (fulfill !== "delivery") {
          this.sound.playError();
          this.showFeedbackModal(
            false,
            "取貨方式不符合！",
            "小宇需要專人外送並希望下午 3 點送達，請將取貨方式切換為『專人外送』！"
          );
          return;
        }

        if (total > 2000) {
          this.sound.playError();
          this.showFeedbackModal(
            false,
            "超出公司預算上限！",
            `這筆訂單總金額為 ${total} 元，超出了 2,000 元的預算上限！`
          );
          return;
        }

        if (total !== 1960) {
          this.sound.playError();
          this.showFeedbackModal(
            false,
            "金額計算需再確認！",
            `2 個 8 吋邱比特單價 880 元（小計 1,760 元），外送運費 200 元，總金額應為 1,960 元。`
          );
          return;
        }

        // 通關！
        this.onOrderSuccess(level.successFeedback);
        return;
      }
    }

    // 訂單成功處理
    onOrderSuccess(successText) {
      this.sound.playCashRegister();
      this.sound.playSuccess();
      this.sound.playStar();

      // 標記關卡完成
      this.completedLevels[this.currentLevelIndex] = true;
      this.updateStarHUD();

      const isLastLevel = this.currentLevelIndex === LEVELS.length - 1;

      this.showFeedbackModal(true, "🎉 訂單完成！", successText, isLastLevel);
    }

    // 顯示回饋視窗
    showFeedbackModal(isSuccess, headline, message, isLastLevel = false) {
      this.dom.feedbackHeadline.textContent = headline;
      this.dom.feedbackExplanation.textContent = message;

      if (isSuccess) {
        this.dom.feedbackModalTitle.textContent = "✨ 點單成功！";
        this.dom.feedbackIconBox.innerHTML = `
          <img src="assets/icons/star_gold.svg" alt="成功星星" class="fb-icon" style="animation: starPop 0.5s ease;">
        `;
        this.dom.feedbackModalFooter.innerHTML = `
          <button id="btn-next-customer" class="btn-primary">
            <span>${isLastLevel ? "🏆 查看今日營業成果 ➔" : "🍰 接洽下一位顧客 ➔"}</span>
          </button>
        `;

        document.getElementById("btn-next-customer").addEventListener("click", () => {
          this.sound.playClick();
          this.closeModal(this.dom.modalFeedback);

          if (isLastLevel) {
            this.showVictoryScreen();
          } else {
            this.startLevel(this.currentLevelIndex + 1);
          }
        });
      } else {
        this.dom.feedbackModalTitle.textContent = "💡 小店長貼心提醒";
        this.dom.feedbackIconBox.innerHTML = `
          <img src="assets/characters/manager_normal.svg" alt="思考店長" class="fb-icon">
        `;
        this.dom.feedbackModalFooter.innerHTML = `
          <button class="btn-primary" data-close="modal-feedback">我知道了，我來修改！</button>
        `;

        this.dom.feedbackModalFooter
          .querySelector("[data-close]")
          .addEventListener("click", () => {
            this.closeModal(this.dom.modalFeedback);
          });
      }

      this.openModal(this.dom.modalFeedback);
    }

    // 顯示循序遞進提示
    showCurrentHint() {
      const level = LEVELS[this.currentLevelIndex];
      const hint = level.hints[this.hintIndex % level.hints.length];
      this.hintIndex++;

      this.dom.hintTextContent.textContent = hint;
      this.openModal(this.dom.modalHint);
    }

    // 顯示通關結算畫面
    showVictoryScreen() {
      this.sound.playSuccess();
      this.showScreen("victory-screen");
    }

    // 開啟蛋糕大圖預覽
    openLightbox(cake) {
      this.dom.lightboxCakeName.textContent = `🎂 ${cake.name} - 蛋糕大圖查看`;
      this.dom.lightboxImgContainer.innerHTML = `
        <img src="${cake.image}" alt="${cake.name}" style="max-width:100%; max-height:350px; object-fit:contain; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
      `;
      this.dom.lightboxDesc.textContent = `${cake.name}：${cake.description}（${cake.tags.join(" ． ")}）`;
      this.openModal(this.dom.modalLightbox);
    }

    // 重新開始完整遊戲
    restartGame() {
      this.completedLevels = [false, false, false];
      this.currentLevelIndex = 0;
      this.updateStarHUD();
      this.startLevel(0);
    }
  }

  // 頁面載入完成後啟動遊戲實例
  window.addEventListener("DOMContentLoaded", () => {
    window.cakeGameApp = new BirthdayCakeGame();
  });
})();
