/**
 * 《生理時鐘大冒險》（Chronotype Adventure）
 * 核心遊戲邏輯：關卡管理、生活時間排程、睡眠時數計算、睡前環境互動、精神值模擬、評分與自由過關
 */

// =============================================================================
// 一、 音效管理器（Web Audio API 原生合成音效 ＋ WAV 相容，100% 離線可用）
// =============================================================================
class SoundManager {
  constructor() {
    this.muted = false;
    this.audioCtx = null;
    try {
      this.muted = localStorage.getItem('chronotype_sound_muted') === 'true';
    } catch (e) {
      this.muted = false;
    }
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem('chronotype_sound_muted', this.muted);
    } catch (e) {}
    return this.muted;
  }

  playClick() {
    if (this.muted) return;
    this.initAudio();
    if (!this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.08);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playSnap() {
    if (this.muted) return;
    this.initAudio();
    if (!this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, t);
    osc.frequency.setValueAtTime(783.99, t + 0.05);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  playCheck() {
    if (this.muted) return;
    this.initAudio();
    if (!this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.25);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  playSuccess() {
    if (this.muted) return;
    this.initAudio();
    if (!this.audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const t = this.audioCtx.currentTime + idx * 0.1;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  playFanfare() {
    if (this.muted) return;
    this.initAudio();
    if (!this.audioCtx) return;
    const chords = [
      { f: [523.25, 659.25, 783.99], dur: 0.3, offset: 0 },
      { f: [587.33, 739.99, 880.00], dur: 0.3, offset: 0.35 },
      { f: [659.25, 830.61, 1046.50], dur: 0.7, offset: 0.7 }
    ];
    chords.forEach(c => {
      c.f.forEach(freq => {
        const t = this.audioCtx.currentTime + c.offset;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + c.dur);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t);
        osc.stop(t + c.dur);
      });
    });
  }
}

// =============================================================================
// 二、 關卡資料設定（三大關卡與教育主題）
// =============================================================================
const LEVELS = [
  // -------------------------------------------------------------
  // 第一關：晨光活力計畫（晨型小狗 Inu）
  // -------------------------------------------------------------
  {
    id: 1,
    name: '第一關：晨光活力計畫',
    character: 'inu',
    charName: 'Inu（晨型小狗）',
    typeTag: '🌅 晨型小狗',
    avatar: 'assets/characters/inu.svg',
    story: '「Inu 是一隻喜歡早起的小狗！可是今天他的生活時間表被打亂了！你能幫他重新安排一天的生活嗎？」',
    cards: [
      { id: 'card_wake', title: '起床', icon: '⏰' },
      { id: 'card_breakfast', title: '吃早餐', icon: '🍳' },
      { id: 'card_school', title: '上學', icon: '🎒' },
      { id: 'card_sports', title: '運動', icon: '⚽' },
      { id: 'card_study', title: '讀書', icon: '📚' },
      { id: 'card_sleep', title: '睡覺', icon: '💤' }
    ],
    slots: [
      { id: 'slot_0700', time: '07:00', period: '早晨時光' },
      { id: 'slot_0730', time: '07:30', period: '晨間用餐' },
      { id: 'slot_0800', time: '08:00', period: '上午上學' },
      { id: 'slot_1600', time: '16:00', period: '放學課外' },
      { id: 'slot_1900', time: '19:00', period: '夜間專注' },
      { id: 'slot_2130', time: '21:30', period: '就寢時分' }
    ]
  },

  // -------------------------------------------------------------
  // 第二關：夜貓子的時間表（夜型小貓 Neko）
  // -------------------------------------------------------------
  {
    id: 2,
    name: '第二關：夜貓子的時間表',
    character: 'neko',
    charName: 'Neko（夜型小貓）',
    typeTag: '🌙 夜型小貓',
    avatar: 'assets/characters/neko.svg',
    story: '「Neko 是一隻偏向夜型的小貓！晚上總是比較有精神，早上卻常常想睡覺。今天是假日，你能幫他安排適合的生活時間表嗎？」',
    cards: [
      { id: 'card_wake', title: '起床', icon: '⏰' },
      { id: 'card_breakfast', title: '吃早餐', icon: '🥐' },
      { id: 'card_reading', title: '閱讀', icon: '📖' },
      { id: 'card_sports', title: '運動', icon: '🏸' },
      { id: 'card_freetime', title: '自由活動', icon: '🎨' },
      { id: 'card_sleep', title: '睡覺', icon: '💤' }
    ],
    slots: [
      { id: 'slot_0900', time: '09:00', period: '休閒晨間' },
      { id: 'slot_1000', time: '10:00', period: '早午餐時光' },
      { id: 'slot_1400', time: '14:00', period: '午後時光' },
      { id: 'slot_1700', time: '17:00', period: '傍晚時分' },
      { id: 'slot_2000', time: '20:00', period: '夜間專注' },
      { id: 'slot_2300', time: '23:00', period: '就寢放鬆' }
    ]
  },

  // -------------------------------------------------------------
  // 第三關：健康作息大挑戰（Neko × Usagi）
  // -------------------------------------------------------------
  {
    id: 3,
    name: '第三關：健康作息大挑戰',
    character: 'neko_usagi',
    charName: 'Neko × Usagi',
    typeTag: '✨ 健康作息挑戰',
    avatar: 'assets/characters/trio.svg',
    story: '「明天早上 8 點就要上學了！可是 Neko 平常比較晚睡，早上常常起不來。Usagi 決定陪他一起調整作息！你能幫助 Neko 找到比較健康的睡眠習慣嗎？」'
  }
];

// =============================================================================
// 三、 主遊戲類別（ChronotypeAdventure）
// =============================================================================
class ChronotypeAdventure {
  constructor() {
    this.sound = new SoundManager();
    this.currentLevelIndex = 0; // 0, 1, 2
    this.levelScores = [0, 0, 0];
    this.playerSchedule = {}; // { [slotId]: cardObject }
    this.selectedCard = null; // 支援「點擊選取 ➔ 點擊槽位放置」雙模式
    this.draggedCard = null;

    // 第三關專屬狀態
    this.bedroomState = {
      phone: 'active', // 'active' (使用中) 或 'off' (收起手機)
      lamp: 'bright',  // 'bright' (燈光明亮) 或 'soft' (柔和)
      book: 'closed'   // 'closed' (未翻開) 或 'reading' (安靜閱讀)
    };
    this.selectedBedtime = '21:00';
    this.selectedSleepHours = 10.0;

    // DOM 元素快取
    this.cacheDom();
    this.initEvents();
    this.updateSoundIcon();
  }

  cacheDom() {
    // HUD
    this.hudLevelTag = document.getElementById('hud-level-tag');
    this.hudLevelTitle = document.getElementById('hud-level-title');
    this.hudCharAvatar = document.getElementById('hud-char-avatar');
    this.hudCharName = document.getElementById('hud-char-name');
    this.hudEnergyBar = document.getElementById('hud-energy-bar');
    this.hudEnergyVal = document.getElementById('hud-energy-val');
    this.hudEnergyIcon = document.getElementById('hud-energy-icon');
    this.hudSleepChip = document.getElementById('hud-sleep-chip');
    this.hudSleepHours = document.getElementById('hud-sleep-hours');
    this.hudSleepStatus = document.getElementById('hud-sleep-status');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.soundIcon = document.getElementById('sound-icon');
    this.btnResetLevel = document.getElementById('btn-reset-level');

    // Toast
    this.toastElem = document.getElementById('toast-toast');
    this.toastText = document.getElementById('toast-text');

    // 畫面容器
    this.screenStart = document.getElementById('screen-start');
    this.screenSchedule = document.getElementById('screen-schedule');
    this.screenBedroom = document.getElementById('screen-bedroom');
    this.screenVictory = document.getElementById('screen-victory');
    this.modalResult = document.getElementById('modal-result');

    // 首頁
    this.btnStartGame = document.getElementById('btn-start-game');

    // 生活時間表畫面（第一、二關）
    this.levelCharPic = document.getElementById('level-char-pic');
    this.levelTypeTag = document.getElementById('level-type-tag');
    this.levelQuestTitle = document.getElementById('level-quest-title');
    this.levelStoryDesc = document.getElementById('level-story-desc');
    this.trayCountTag = document.getElementById('tray-count-tag');
    this.cardsPool = document.getElementById('cards-pool');
    this.scheduleFillTag = document.getElementById('schedule-fill-tag');
    this.timeSlotsContainer = document.getElementById('time-slots-container');
    this.scheduleCheckHint = document.getElementById('schedule-check-hint');
    this.btnCheckSchedule = document.getElementById('btn-check-schedule');

    // 第三關（臥室環境）
    this.envCompletedCounter = document.getElementById('env-completed-counter');
    this.itemPhone = document.getElementById('item-phone');
    this.imgPhone = document.getElementById('img-phone');
    this.badgePhone = document.getElementById('badge-phone');
    this.feedbackPhone = document.getElementById('feedback-phone');
    this.btnTogglePhone = document.getElementById('btn-toggle-phone');

    this.itemLamp = document.getElementById('item-lamp');
    this.imgLamp = document.getElementById('img-lamp');
    this.badgeLamp = document.getElementById('badge-lamp');
    this.feedbackLamp = document.getElementById('feedback-lamp');
    this.btnToggleLamp = document.getElementById('btn-toggle-lamp');

    this.itemBook = document.getElementById('item-book');
    this.imgBook = document.getElementById('img-book');
    this.badgeBook = document.getElementById('badge-book');
    this.feedbackBook = document.getElementById('feedback-book');
    this.btnToggleBook = document.getElementById('btn-toggle-book');

    this.bedtimeOptions = document.getElementById('bedtime-options');
    this.displayBedtime = document.getElementById('display-bedtime');
    this.displaySleepHours = document.getElementById('display-sleephours');
    this.guidelineStatusText = document.getElementById('guideline-status-text');
    this.btnCompleteLevel3 = document.getElementById('btn-complete-level3');

    // 評量結果彈窗
    this.resultCharAvatar = document.getElementById('result-char-avatar');
    this.resultTitle = document.getElementById('result-title');
    this.resultSubtitle = document.getElementById('result-subtitle');
    this.resultScoreVal = document.getElementById('result-score-val');
    this.resultTierBadge = document.getElementById('result-tier-badge');
    this.resultFeedbackPos = document.getElementById('result-feedback-pos');
    this.resultFeedbackAdv = document.getElementById('result-feedback-adv');
    this.btnResultAdjust = document.getElementById('btn-result-adjust');
    this.btnResultNext = document.getElementById('btn-result-next');
    this.btnResultNextText = document.getElementById('btn-result-next-text');

    // 最終通關畫面
    this.confettiCanvas = document.getElementById('confetti-canvas');
    this.summaryScore1 = document.getElementById('summary-score-1');
    this.summaryScore2 = document.getElementById('summary-score-2');
    this.summaryScore3 = document.getElementById('summary-score-3');
    this.btnPlayAgain = document.getElementById('btn-play-again');
    this.btnReturnHome = document.getElementById('btn-return-home');
  }

  initEvents() {
    // 音效開關
    this.btnSoundToggle.addEventListener('click', () => {
      const isMuted = this.sound.toggleMute();
      this.updateSoundIcon();
      this.showToast(isMuted ? '🔇 音效已關閉' : '🔊 音效已開啟');
    });

    // 重設按鈕
    this.btnResetLevel.addEventListener('click', () => {
      this.sound.playClick();
      if (this.currentLevelIndex === 2) {
        this.resetLevel3();
      } else {
        this.resetScheduleLevel();
      }
      this.showToast('時間表已重設！');
    });

    // 開始冒險按鈕
    this.btnStartGame.addEventListener('click', () => {
      this.sound.playClick();
      this.startLevel(0);
    });

    // 檢查時間表按鈕（第一、二關）
    this.btnCheckSchedule.addEventListener('click', () => {
      this.sound.playCheck();
      this.handleEvaluateSchedule();
    });

    // 完成第三關按鈕
    this.btnCompleteLevel3.addEventListener('click', () => {
      this.sound.playCheck();
      this.handleEvaluateLevel3();
    });

    // 結果彈窗按鈕
    this.btnResultAdjust.addEventListener('click', () => {
      this.sound.playClick();
      this.closeModalResult();
    });

    // 繼續下一關按鈕（絕不受分數限制！）
    this.btnResultNext.addEventListener('click', () => {
      this.sound.playClick();
      this.closeModalResult();
      this.goToNextLevel();
    });

    // 最終通關按鈕
    this.btnPlayAgain.addEventListener('click', () => {
      this.sound.playClick();
      this.startLevel(0);
    });

    this.btnReturnHome.addEventListener('click', () => {
      this.sound.playClick();
      this.showScreen(this.screenStart);
    });

    // 第三關物品點擊事件
    this.itemPhone.addEventListener('click', () => this.togglePhoneState());
    this.btnTogglePhone.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePhoneState();
    });

    this.itemLamp.addEventListener('click', () => this.toggleLampState());
    this.btnToggleLamp.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleLampState();
    });

    this.itemBook.addEventListener('click', () => this.toggleBookState());
    this.btnToggleBook.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleBookState();
    });

    // 就寢時間按鈕事件
    const bedtimeBtns = this.bedtimeOptions.querySelectorAll('.btn-bedtime-choice');
    bedtimeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        bedtimeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedBedtime = btn.getAttribute('data-time');
        this.selectedSleepHours = parseFloat(btn.getAttribute('data-hours'));
        this.updateLevel3Calculation();
      });
    });
  }

  updateSoundIcon() {
    this.soundIcon.textContent = this.sound.muted ? '🔇' : '🔊';
  }

  showToast(msg) {
    this.toastText.textContent = msg;
    this.toastElem.classList.remove('toast-hidden');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastElem.classList.add('toast-hidden');
    }, 2400);
  }

  showScreen(targetScreen) {
    [this.screenStart, this.screenSchedule, this.screenBedroom, this.screenVictory].forEach(s => {
      s.classList.remove('active');
    });
    targetScreen.classList.add('active');
  }

  // ===========================================================================
  // 四、 關卡切換與核心邏輯
  // ===========================================================================
  startLevel(index) {
    this.currentLevelIndex = index;
    const level = LEVELS[index];

    // 更新 HUD
    this.hudLevelTag.textContent = `關卡 ${level.id}／3`;
    this.hudLevelTitle.textContent = level.name.replace(/^第[一二三]關：/, '');
    this.hudCharAvatar.src = level.avatar;
    this.hudCharName.textContent = level.charName;

    // 清除選取卡片
    this.selectedCard = null;

    if (index === 0 || index === 1) {
      // 第一關或第二關：生活時間安排板
      this.showScreen(this.screenSchedule);
      this.setupScheduleLevel(level);
    } else if (index === 2) {
      // 第三關：健康作息大挑戰
      this.showScreen(this.screenBedroom);
      this.setupBedroomLevel(level);
    }
  }

  // -------------------------------------------------------------
  // 第一、二關生活時間表渲染與拖曳放置
  // -------------------------------------------------------------
  setupScheduleLevel(level) {
    this.playerSchedule = {};
    this.levelCharPic.src = level.avatar;
    this.levelTypeTag.textContent = level.typeTag;
    this.levelQuestTitle.textContent = level.name;
    this.levelStoryDesc.textContent = level.story;

    // 渲染活動卡片池
    this.renderCardsPool(level.cards);

    // 渲染時間槽位
    this.renderTimeSlots(level.slots);

    this.updateScheduleStatus();
    this.updateEnergyBar(50);
  }

  resetScheduleLevel() {
    const level = LEVELS[this.currentLevelIndex];
    this.setupScheduleLevel(level);
  }

  renderCardsPool(cards) {
    this.cardsPool.innerHTML = '';
    cards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'activity-card';
      cardEl.id = `tray_${card.id}`;
      cardEl.draggable = true;
      cardEl.setAttribute('data-card-id', card.id);

      cardEl.innerHTML = `
        <div class="card-icon-box">${card.icon}</div>
        <div class="card-title">${card.title}</div>
        <span class="card-drag-handle">⠿</span>
      `;

      // 拖曳事件
      cardEl.addEventListener('dragstart', (e) => {
        this.sound.playClick();
        this.draggedCard = card;
        cardEl.classList.add('dragging');
        e.dataTransfer.setData('text/plain', card.id);
      });

      cardEl.addEventListener('dragend', () => {
        cardEl.classList.remove('dragging');
        this.draggedCard = null;
      });

      // 點擊選取模式（適合平板、手機操作）
      cardEl.addEventListener('click', () => {
        this.sound.playClick();
        if (this.selectedCard && this.selectedCard.id === card.id) {
          // 取消選取
          this.selectedCard = null;
          cardEl.classList.remove('selected');
        } else {
          // 選取新卡片
          this.cardsPool.querySelectorAll('.activity-card').forEach(c => c.classList.remove('selected'));
          this.selectedCard = card;
          cardEl.classList.add('selected');
          this.showToast(`已選取「${card.title}」，請點擊目標時間格放置！`);
        }
      });

      // 觸控拖曳支援（平板觸控相容）
      cardEl.addEventListener('touchstart', (e) => {
        this.selectedCard = card;
        this.cardsPool.querySelectorAll('.activity-card').forEach(c => c.classList.remove('selected'));
        cardEl.classList.add('selected');
      }, { passive: true });

      this.cardsPool.appendChild(cardEl);
    });
  }

  renderTimeSlots(slots) {
    this.timeSlotsContainer.innerHTML = '';
    slots.forEach(slot => {
      const slotEl = document.createElement('div');
      slotEl.className = 'time-slot-card';
      slotEl.id = `slot_${slot.id}`;
      slotEl.setAttribute('data-slot-id', slot.id);

      slotEl.innerHTML = `
        <div class="slot-header">
          <span class="slot-time-badge">⏰ ${slot.time}</span>
          <span class="slot-period-name">${slot.period}</span>
        </div>
        <div class="slot-content-area" id="slot_content_${slot.id}">
          <span class="slot-empty-placeholder">點擊或拖入活動</span>
        </div>
      `;

      // 拖曳放置目標事件
      slotEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        slotEl.classList.add('drag-over');
      });

      slotEl.addEventListener('dragleave', () => {
        slotEl.classList.remove('drag-over');
      });

      slotEl.addEventListener('drop', (e) => {
        e.preventDefault();
        slotEl.classList.remove('drag-over');
        if (this.draggedCard) {
          this.assignCardToSlot(this.draggedCard, slot.id);
        }
      });

      // 點擊時間格放置（支援選取模式與平板）
      slotEl.addEventListener('click', () => {
        if (this.selectedCard) {
          this.assignCardToSlot(this.selectedCard, slot.id);
          this.selectedCard = null;
          this.cardsPool.querySelectorAll('.activity-card').forEach(c => c.classList.remove('selected'));
        } else if (this.playerSchedule[slot.id]) {
          // 若槽位已有活動且未選取新卡片，點擊可收回托盤
          this.sound.playClick();
          this.removeCardFromSlot(slot.id);
        }
      });

      this.timeSlotsContainer.appendChild(slotEl);
    });
  }

  assignCardToSlot(card, targetSlotId) {
    this.sound.playSnap();

    // 檢查該卡片是否已放置在其他槽位，若是則先清空舊槽位（避免重複）
    for (const [slotId, existingCard] of Object.entries(this.playerSchedule)) {
      if (existingCard && existingCard.id === card.id && slotId !== targetSlotId) {
        delete this.playerSchedule[slotId];
        this.renderSlotContent(slotId, null);
      }
    }

    // 若目標槽位原本已有其他卡片，將原卡片退回托盤或更換
    const previousCard = this.playerSchedule[targetSlotId];
    if (previousCard && previousCard.id !== card.id) {
      // 原卡片返回托盤顯示
      const prevTrayCard = document.getElementById(`tray_${previousCard.id}`);
      if (prevTrayCard) prevTrayCard.style.display = 'flex';
    }

    // 安排新卡片到槽位
    this.playerSchedule[targetSlotId] = card;
    this.renderSlotContent(targetSlotId, card);

    // 隱藏托盤中已被使用的卡片
    const trayCard = document.getElementById(`tray_${card.id}`);
    if (trayCard) trayCard.style.display = 'none';

    this.updateScheduleStatus();
  }

  removeCardFromSlot(slotId) {
    const card = this.playerSchedule[slotId];
    if (!card) return;

    delete this.playerSchedule[slotId];
    this.renderSlotContent(slotId, null);

    // 讓卡片重現於托盤
    const trayCard = document.getElementById(`tray_${card.id}`);
    if (trayCard) trayCard.style.display = 'flex';

    this.updateScheduleStatus();
  }

  renderSlotContent(slotId, card) {
    const contentArea = document.getElementById(`slot_content_${slotId}`);
    const slotCardEl = document.getElementById(`slot_${slotId}`);
    if (!contentArea || !slotCardEl) return;

    if (card) {
      slotCardEl.classList.add('has-card');
      contentArea.innerHTML = `
        <div class="placed-activity-pill">
          <div class="placed-pill-info">
            <span>${card.icon}</span>
            <span>${card.title}</span>
          </div>
          <button class="btn-remove-slot" title="移除活動回到卡片庫" aria-label="移除活動">✕</button>
        </div>
      `;
      // 綁定移除按鈕
      const removeBtn = contentArea.querySelector('.btn-remove-slot');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.sound.playClick();
        this.removeCardFromSlot(slotId);
      });
    } else {
      slotCardEl.classList.remove('has-card');
      contentArea.innerHTML = `<span class="slot-empty-placeholder">點擊或拖入活動</span>`;
    }
  }

  updateScheduleStatus() {
    const level = LEVELS[this.currentLevelIndex];
    if (!level || !level.slots) return;

    const totalSlots = level.slots.length;
    const filledCount = Object.keys(this.playerSchedule).length;
    const remainingCount = totalSlots - filledCount;

    this.scheduleFillTag.textContent = `已安排 ${filledCount} / ${totalSlots}`;
    this.trayCountTag.textContent = `${remainingCount} / ${totalSlots} 張`;

    // 精神值模擬與提示
    const percent = Math.round((filledCount / totalSlots) * 50) + 50;
    this.updateEnergyBar(percent);

    if (filledCount === totalSlots) {
      this.btnCheckSchedule.disabled = false;
      this.scheduleCheckHint.textContent = '🎉 6 張活動已全部安排完成，可以檢查囉！';
    } else {
      this.btnCheckSchedule.disabled = true;
      this.scheduleCheckHint.textContent = `還剩 ${remainingCount} 張活動卡片未安排喔！`;
    }
  }

  updateEnergyBar(val) {
    const clamped = Math.max(0, Math.min(100, val));
    this.hudEnergyBar.style.width = `${clamped}%`;
    this.hudEnergyVal.textContent = `${clamped}%`;
    if (clamped >= 80) {
      this.hudEnergyIcon.textContent = '🌟';
    } else if (clamped >= 50) {
      this.hudEnergyIcon.textContent = '⭐';
    } else {
      this.hudEnergyIcon.textContent = '💤';
    }
  }

  // ===========================================================================
  // 五、 評分系統與過關邏輯（核心分離原則：分數絕不限制過關）
  // ===========================================================================

  // 1. 基本操作任務是否已完成
  isTaskComplete() {
    if (this.currentLevelIndex === 0 || this.currentLevelIndex === 1) {
      const level = LEVELS[this.currentLevelIndex];
      return Object.keys(this.playerSchedule).length === level.slots.length;
    } else if (this.currentLevelIndex === 2) {
      // 第三關：有選取就寢時間即可完成
      return Boolean(this.selectedBedtime);
    }
    return false;
  }

  // 2. 第一、二關評分計算（0～100 分）
  calculateScheduleScore() {
    let score = 0;
    const levelId = LEVELS[this.currentLevelIndex].id;

    if (levelId === 1) {
      // 第一關：晨型小狗 Inu（07:00 起床, 07:30 早餐, 08:00 上學, 16:00 運動, 19:00 讀書, 21:30 睡覺）
      const s0700 = this.playerSchedule['slot_0700']?.id;
      const s0730 = this.playerSchedule['slot_0730']?.id;
      const s0800 = this.playerSchedule['slot_0800']?.id;
      const s1600 = this.playerSchedule['slot_1600']?.id;
      const s1900 = this.playerSchedule['slot_1900']?.id;
      const s2130 = this.playerSchedule['slot_2130']?.id;

      if (s0700 === 'card_wake') score += 20;
      if (s0730 === 'card_breakfast') score += 15;
      if (s0800 === 'card_school') score += 20;
      if (s1600 === 'card_sports') score += 15;
      if (s1900 === 'card_study') score += 15;
      if (s2130 === 'card_sleep') score += 15;

      // 順序邏輯補償：若起床在早餐前且早餐在上學前
      const allSlots = ['slot_0700', 'slot_0730', 'slot_0800', 'slot_1600', 'slot_1900', 'slot_2130'];
      const wakeIdx = allSlots.findIndex(s => this.playerSchedule[s]?.id === 'card_wake');
      const bfIdx = allSlots.findIndex(s => this.playerSchedule[s]?.id === 'card_breakfast');
      const schoolIdx = allSlots.findIndex(s => this.playerSchedule[s]?.id === 'card_school');

      if (wakeIdx !== -1 && bfIdx !== -1 && wakeIdx < bfIdx && score < 40) score += 10;
      if (bfIdx !== -1 && schoolIdx !== -1 && bfIdx < schoolIdx && score < 60) score += 10;

    } else if (levelId === 2) {
      // 第二關：夜型小貓 Neko（09:00 起床, 10:00 早餐, 14:00 自由活動, 17:00 運動, 20:00 閱讀, 23:00 睡覺）
      const s0900 = this.playerSchedule['slot_0900']?.id;
      const s1000 = this.playerSchedule['slot_1000']?.id;
      const s1400 = this.playerSchedule['slot_1400']?.id;
      const s1700 = this.playerSchedule['slot_1700']?.id;
      const s2000 = this.playerSchedule['slot_2000']?.id;
      const s2300 = this.playerSchedule['slot_2300']?.id;

      if (s0900 === 'card_wake') score += 20;
      if (s1000 === 'card_breakfast') score += 15;
      if (s1400 === 'card_freetime') score += 15;
      if (s1700 === 'card_sports') score += 15;
      if (s2000 === 'card_reading') score += 20; // 夜型人在夜晚專注閱讀
      if (s2300 === 'card_sleep') score += 15;

      // 邏輯順序加分
      const allSlots = ['slot_0900', 'slot_1000', 'slot_1400', 'slot_1700', 'slot_2000', 'slot_2300'];
      const wakeIdx = allSlots.findIndex(s => this.playerSchedule[s]?.id === 'card_wake');
      const bfIdx = allSlots.findIndex(s => this.playerSchedule[s]?.id === 'card_breakfast');
      if (wakeIdx !== -1 && bfIdx !== -1 && wakeIdx < bfIdx && score < 35) score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  // 3. 取得作息回饋與改善建議
  getScheduleFeedback(score) {
    const levelId = LEVELS[this.currentLevelIndex].id;
    let positive = '';
    let advice = '';

    if (levelId === 1) {
      if (score >= 90) {
        positive = '太棒了！你的安排完美符合晨型小狗 Inu 的生活節奏，早起早睡精神百倍！';
        advice = '維持規律的晨間陽光與準時就寢，能讓白天的學習專注力達到最高！';
      } else if (score >= 70) {
        positive = '很棒的作息規劃！Inu 一整天都能兼顧運動與學習。';
        advice = '若能把「睡覺」安排在晚上 21:30，早上起床會更神清氣爽喔！';
      } else if (score >= 50) {
        positive = '不錯的嘗試！你已經排好了完整的一天活動。';
        advice = '如果晚上能早一點休息，早晨起床精神會更好喔！';
      } else {
        positive = '你順利完成了 Inu 一天的時間表安排！';
        advice = '換個安排方式，例如讓「起床」在早餐前面、「睡覺」在夜間，會有新的發現喔！';
      }
    } else if (levelId === 2) {
      if (score >= 90) {
        positive = '太厲害了！你完全掌握了夜貓子 Neko 的假日節奏，兼顧了晚間專注與充足睡眠！';
        advice = '夜型人在傍晚和夜晚思緒清晰，安排閱讀和思考能發揮最好的學習效益！';
      } else if (score >= 70) {
        positive = '很好的假日安排！充分展現了不同作息偏好的特色。';
        advice = '假日雖然可以稍微晚起，但仍要記得保留運動與放鬆時光喔！';
      } else if (score >= 50) {
        positive = '完成了一份有趣的假日生活表，Neko 迫不及待想體驗了！';
        advice = '夜型人不代表可以無限制熬夜，睡滿 9～10 小時對健康才是最重要的基石！';
      } else {
        positive = '你探索了夜型小貓的假日時間規劃！';
        advice = '試著把閱讀安排在傍晚或晚上、把睡覺安排在夜間，看看精神值的變化吧！';
      }
    }

    return { positive, advice };
  }

  // 4. 第一、二關點擊「檢查時間表」處理
  handleEvaluateSchedule() {
    const score = this.calculateScheduleScore();
    this.levelScores[this.currentLevelIndex] = score;

    const { positive, advice } = this.getScheduleFeedback(score);
    const level = LEVELS[this.currentLevelIndex];

    this.showResultModal({
      title: `${level.name.replace(/：.*$/, '')}任務完成！`,
      subtitle: `${level.charName} 已經有一份新的生活時間表了！`,
      avatar: level.avatar,
      score: score,
      positive: positive,
      advice: advice,
      nextBtnText: '繼續下一關 ➔'
    });
  }

  // -------------------------------------------------------------
  // 第三關：健康作息大挑戰邏輯（睡前環境與就寢時數）
  // -------------------------------------------------------------
  setupBedroomLevel(level) {
    this.hudSleepChip.style.display = 'inline-flex';
    this.updateLevel3Calculation();
    this.updateLevel3EnvDisplay();
  }

  resetLevel3() {
    this.bedroomState = {
      phone: 'active',
      lamp: 'bright',
      book: 'closed'
    };
    this.selectedBedtime = '21:00';
    this.selectedSleepHours = 10.0;
    const bedtimeBtns = this.bedtimeOptions.querySelectorAll('.btn-bedtime-choice');
    bedtimeBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-time') === '21:00');
    });
    this.updateLevel3Calculation();
    this.updateLevel3EnvDisplay();
  }

  togglePhoneState() {
    this.sound.playClick();
    this.bedroomState.phone = this.bedroomState.phone === 'active' ? 'off' : 'active';
    this.updateLevel3EnvDisplay();
  }

  toggleLampState() {
    this.sound.playClick();
    this.bedroomState.lamp = this.bedroomState.lamp === 'bright' ? 'soft' : 'bright';
    this.updateLevel3EnvDisplay();
  }

  toggleBookState() {
    this.sound.playClick();
    this.bedroomState.book = this.bedroomState.book === 'closed' ? 'reading' : 'closed';
    this.updateLevel3EnvDisplay();
  }

  updateLevel3EnvDisplay() {
    // 1. 手機
    const isPhoneOff = this.bedroomState.phone === 'off';
    this.imgPhone.src = isPhoneOff ? 'assets/props/phone_off.svg' : 'assets/props/phone_active.svg';
    this.badgePhone.textContent = isPhoneOff ? '已收起' : '使用中';
    this.badgePhone.className = `item-state-badge ${isPhoneOff ? 'badge-done' : 'badge-active'}`;
    this.btnTogglePhone.textContent = isPhoneOff ? '重新拿出' : '收起手機';
    this.itemPhone.classList.toggle('is-optimized', isPhoneOff);
    this.feedbackPhone.textContent = isPhoneOff
      ? '睡前減少使用手機，可以減少光線與內容刺激。'
      : '睡前使用手機，螢幕藍光與訊息容易刺激大腦保持清醒。';

    // 2. 檯燈
    const isLampSoft = this.bedroomState.lamp === 'soft';
    this.imgLamp.src = isLampSoft ? 'assets/props/lamp_soft.svg' : 'assets/props/lamp_bright.svg';
    this.badgeLamp.textContent = isLampSoft ? '柔和光線' : '燈光明亮';
    this.badgeLamp.className = `item-state-badge ${isLampSoft ? 'badge-done' : 'badge-warn'}`;
    this.btnToggleLamp.textContent = isLampSoft ? '調為明亮' : '調為柔和';
    this.itemLamp.classList.toggle('is-optimized', isLampSoft);
    this.feedbackLamp.textContent = isLampSoft
      ? '降低睡前光線亮度，有助於營造放鬆的環境。'
      : '太亮的光線會抑制褪黑激素分泌，影響睡意產生。';

    // 3. 書本
    const isBookReading = this.bedroomState.book === 'reading';
    this.imgBook.src = isBookReading ? 'assets/props/book_open.svg' : 'assets/props/book_closed.svg';
    this.badgeBook.textContent = isBookReading ? '安靜閱讀' : '未翻開';
    this.badgeBook.className = `item-state-badge ${isBookReading ? 'badge-done' : 'badge-idle'}`;
    this.btnToggleBook.textContent = isBookReading ? '放回桌上' : '安靜閱讀';
    this.itemBook.classList.toggle('is-optimized', isBookReading);
    this.feedbackBook.textContent = isBookReading
      ? '睡前安排安靜、放鬆的活動，可以幫助建立規律的睡眠習慣。'
      : '睡前安排安靜閱讀或聆聽輕柔音樂，有助於情緒放鬆。';

    // 計數
    let completedCount = 0;
    if (isPhoneOff) completedCount++;
    if (isLampSoft) completedCount++;
    if (isBookReading) completedCount++;
    this.envCompletedCounter.textContent = `已調整 ${completedCount} / 3 項`;
  }

  updateLevel3Calculation() {
    this.displayBedtime.textContent = this.selectedBedtime;
    this.displaySleepHours.textContent = `${this.selectedSleepHours.toFixed(1)} 小時`;
    this.hudSleepHours.textContent = `${this.selectedSleepHours.toFixed(1)} 小時`;

    const isAdequate = this.selectedSleepHours >= 9.0;
    if (isAdequate) {
      this.guidelineStatusText.textContent = '🎉 很棒！你安排了符合年齡建議的睡眠時間！';
      this.guidelineStatusText.className = 'guideline-status-text';
      this.hudSleepStatus.textContent = '充足';
      this.hudSleepStatus.className = 'stat-status-badge status-good';
      this.updateEnergyBar(95);
    } else {
      this.guidelineStatusText.textContent = '💡 睡眠時間有點短喔！可以試著提早休息。';
      this.guidelineStatusText.className = 'guideline-status-text warn';
      this.hudSleepStatus.textContent = '偏短';
      this.hudSleepStatus.className = 'stat-status-badge status-warn';
      this.updateEnergyBar(60);
    }
  }

  calculateLevel3Score() {
    let score = 0;

    // 任務一：環境優化（各 15 分，共 45 分）
    if (this.bedroomState.phone === 'off') score += 15;
    if (this.bedroomState.lamp === 'soft') score += 15;
    if (this.bedroomState.book === 'reading') score += 15;

    // 任務二：睡眠時數（符合 9～12 小時得 55 分，稍短也有不同客觀分數）
    if (this.selectedSleepHours >= 9.5) {
      score += 55;
    } else if (this.selectedSleepHours >= 9.0) {
      score += 45;
    } else if (this.selectedSleepHours >= 8.5) {
      score += 35;
    } else {
      score += 25;
    }

    return Math.max(0, Math.min(100, score));
  }

  handleEvaluateLevel3() {
    const score = this.calculateLevel3Score();
    this.levelScores[2] = score;

    let envDone = 0;
    if (this.bedroomState.phone === 'off') envDone++;
    if (this.bedroomState.lamp === 'soft') envDone++;
    if (this.bedroomState.book === 'reading') envDone++;

    let posText = `睡前環境完成了 ${envDone} / 3 項調整，睡眠安排了 ${this.selectedSleepHours.toFixed(1)} 小時！`;
    let advText = '';
    if (this.selectedSleepHours < 9.0) {
      advText = '睡眠時間偏短，面對上學日可試著提早就寢，以維持整天的專注與活力！';
    } else {
      advText = '充分運用了「收起手機、柔和燈光與放鬆閱讀」，幫助夜型小貓逐步適應上學日！';
    }

    this.showResultModal({
      title: '第三關任務完成！',
      subtitle: 'Neko 與 Usagi 共同打造了優質的睡眠準備計畫！',
      avatar: 'assets/characters/trio.svg',
      score: score,
      positive: posText,
      advice: advText,
      nextBtnText: '領取通關徽章 🏆'
    });
  }

  // -------------------------------------------------------------
  // 結果展示彈窗與跑分動畫（絕不受分數限制）
  // -------------------------------------------------------------
  showResultModal(data) {
    this.resultCharAvatar.src = data.avatar;
    this.resultTitle.textContent = data.title;
    this.resultSubtitle.textContent = data.subtitle;
    this.resultFeedbackPos.textContent = data.positive;
    this.resultFeedbackAdv.textContent = data.advice;
    this.btnResultNextText.textContent = data.nextBtnText;

    // 分數等級標籤
    let tierText = '';
    if (data.score >= 90) {
      tierText = '時間規劃高手！';
    } else if (data.score >= 70) {
      tierText = '很棒的作息安排！';
    } else if (data.score >= 50) {
      tierText = '繼續探索自己的生活節奏！';
    } else {
      tierText = '換個安排方式，也許會有新的發現！';
    }
    this.resultTierBadge.textContent = tierText;

    // 顯示彈窗
    this.modalResult.classList.add('show');

    // 數字跑分滾動動畫
    this.animateScoreCounter(0, data.score, 800);
  }

  animateScoreCounter(start, end, duration) {
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const current = Math.floor(start + (end - start) * (1 - Math.pow(1 - progress, 3)));
      this.resultScoreVal.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        this.resultScoreVal.textContent = end;
        this.sound.playSuccess();
      }
    };
    requestAnimationFrame(update);
  }

  closeModalResult() {
    this.modalResult.classList.remove('show');
  }

  // -------------------------------------------------------------
  // 切換關卡（無條件自由過關）
  // -------------------------------------------------------------
  goToNextLevel() {
    if (this.currentLevelIndex < 2) {
      this.startLevel(this.currentLevelIndex + 1);
    } else {
      // 完成全部三關，進入最終榮譽通關畫面
      this.showVictoryScreen();
    }
  }

  // -------------------------------------------------------------
  // 最終通關畫面（Victory Screen）
  // -------------------------------------------------------------
  showVictoryScreen() {
    this.sound.playFanfare();
    this.showScreen(this.screenVictory);

    // 填入三關各別分數
    this.summaryScore1.textContent = `${this.levelScores[0]} 分`;
    this.summaryScore2.textContent = `${this.levelScores[1]} 分`;
    this.summaryScore3.textContent = `${this.levelScores[2]} 分`;

    // 啟動彩帶紙花效果
    this.launchConfetti();
  }

  launchConfetti() {
    const canvas = this.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = canvas.parentElement.clientHeight || 600;

    const pieces = [];
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9D4EDD', '#FFA07A'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        velY: Math.random() * 3 + 2,
        velX: Math.random() * 2 - 1,
        rot: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4
      });
    }

    let frames = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.velY;
        p.x += p.velX;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });

      frames++;
      if (frames < 360) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    requestAnimationFrame(render);
  }
}

// =============================================================================
// 六、 啟動遊戲實例
// =============================================================================
window.addEventListener('DOMContentLoaded', () => {
  window.game = new ChronotypeAdventure();
});
