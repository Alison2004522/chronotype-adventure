/**
 * 《生理時鐘大冒險》（Chronotype Adventure）
 * 核心遊戲邏輯：關卡管理、時間排程、睡眠時數計算、衝突偵測、精神值模擬、評分與互動環境
 */

// =============================================================================
// 一、 音效與 Web Audio API 合成管理器（支援離線無依賴運作）
// =============================================================================
class SoundManager {
  constructor() {
    this.muted = false;
    this.audioCtx = null;
    this.cachedBuffers = {};

    // 讀取本機靜音設定
    try {
      this.muted = localStorage.getItem('chronotype_sound_muted') === 'true';
    } catch (e) {
      this.muted = false;
    }

    this.initAudioContext();
  }

  initAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass && !this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }
  }

  ensureAudioContext() {
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

  // 1. 點擊音效（柔和 Pop 聲）
  playClick() {
    if (this.muted) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // 2. 卡片吸附鎖定音效（清脆 Snap 雙音）
  playSnap() {
    if (this.muted) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.setValueAtTime(783.99, t + 0.06); // G5

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  // 3. 成功音效（輕快上行琶音）
  playSuccess() {
    if (this.muted) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const t = this.audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const noteTime = t + idx * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.18);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.18);
    });
  }

  // 4. 評分叮咚音效
  playScore() {
    if (this.muted) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t); // A5
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.3);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // 5. 最終通關歡慶大合音
  playFanfare() {
    if (this.muted) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const chords = [
      { t: 0.0, freqs: [523.25, 659.25, 783.99] }, // C
      { t: 0.3, freqs: [587.33, 739.99, 880.00] }, // D
      { t: 0.6, freqs: [659.25, 830.61, 1046.50] }, // E
      { t: 0.9, freqs: [783.99, 987.77, 1318.51] }  // G
    ];

    const baseT = this.audioCtx.currentTime;
    chords.forEach(chord => {
      chord.freqs.forEach(freq => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const startT = baseT + chord.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.12, startT);
        gain.gain.exponentialRampToValueAtTime(0.005, startT + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startT);
        osc.stop(startT + 0.35);
      });
    });
  }
}

// =============================================================================
// 二、 關卡資料與時段模型定義（Level Configurations）
// =============================================================================
const LEVELS = [
  // -------------------------------------------------------------
  // 第一關：晨光活力計畫（Inu - 晨型人）
  // -------------------------------------------------------------
  {
    id: 1,
    name: '第一關：晨光活力計畫',
    character: 'inu',
    charName: 'Inu（晨型人）',
    typeBadge: '🌅 晨型人代表',
    typeClass: 'morning',
    avatar: 'assets/characters/inu.svg',
    story: '「Inu 喜歡早起，早上總是精神滿滿！可是今天他的時間表被打亂了。你能幫他重新安排一天的生活，確保充足睡眠嗎？」',
    targetSleep: 9.5, // 建議 9.5 小時
    slots: [
      {
        id: 'slot_sleep_night',
        timeRange: '21:00～06:30',
        period: '深夜至清晨',
        hours: 9.5,
        isFixed: false,
        isSleepSlot: true,
        bestActId: 'act_sleep',
        label: '晚間深層好眠時段'
      },
      {
        id: 'slot_wake_morning',
        timeRange: '06:30～07:15',
        period: '清晨甦醒',
        hours: 0.75,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_wakeup',
        label: '晨間甦醒梳洗時段'
      },
      {
        id: 'slot_breakfast_morning',
        timeRange: '07:15～07:50',
        period: '晨間早餐',
        hours: 0.58,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_breakfast',
        label: '活力營養早餐時段'
      },
      {
        id: 'slot_school_day',
        timeRange: '08:00～16:00',
        period: '白天學習',
        hours: 8.0,
        isFixed: true,
        fixedAct: {
          id: 'act_school',
          name: '學校上學課程',
          icon: '🏫',
          type: '學習',
          desc: '固定課堂學習'
        },
        isSleepSlot: false,
        bestActId: 'act_school',
        label: '學校固定上學時間'
      },
      {
        id: 'slot_exercise_afternoon',
        timeRange: '16:30～17:30',
        period: '課後傍晚',
        hours: 1.0,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_sport',
        label: '課後體育運動時段'
      },
      {
        id: 'slot_study_evening',
        timeRange: '18:30～19:45',
        period: '夜間專注',
        hours: 1.25,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_study',
        label: '晚間作業複習時段'
      },
      {
        id: 'slot_rest_prebed',
        timeRange: '20:00～21:00',
        period: '睡前準備',
        hours: 1.0,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_rest',
        label: '睡前放鬆沉澱時段'
      }
    ],
    cards: [
      { id: 'act_wakeup', name: '晨間起床', icon: '🌅', type: '起床', desc: '起床梳洗、拉開窗簾' },
      { id: 'act_breakfast', name: '營養早餐', icon: '🍳', type: '飲食', desc: '補充早晨活力' },
      { id: 'act_sport', name: '戶外運動', icon: '⚽', type: '運動', desc: '跑步、打球活絡筋骨' },
      { id: 'act_study', name: '作業讀書', icon: '📖', type: '學習', desc: '專注完成學校作業' },
      { id: 'act_rest', name: '放鬆休息', icon: '🍵', type: '休息', desc: '聊天、整理書包' },
      { id: 'act_sleep', name: '充足睡眠', icon: '💤', type: '睡眠', desc: '安心進入深層睡眠' }
    ]
  },

  // -------------------------------------------------------------
  // 第二關：夜貓子的時間表（Neko - 夜型人 - 假日自由安排）
  // -------------------------------------------------------------
  {
    id: 2,
    name: '第二關：夜貓子的時間表',
    character: 'neko',
    charName: 'Neko（夜型人）',
    typeBadge: '🌙 夜型人代表',
    typeClass: 'night',
    avatar: 'assets/characters/neko.svg',
    story: '「Neko 晚上總是比較有精神！大家卻一直叫他早點睡、早點起。今天是週末假日，你能幫 Neko 安排一份符合夜型作息的生活時間表嗎？」',
    targetSleep: 9.5, // 23:00～08:30 = 9.5 小時
    slots: [
      {
        id: 'slot_sleep_night',
        timeRange: '23:00～08:30',
        period: '深夜至早晨',
        hours: 9.5,
        isFixed: false,
        isSleepSlot: true,
        bestActId: 'act_sleep',
        label: '夜型人深層好眠時段'
      },
      {
        id: 'slot_wake_morning',
        timeRange: '08:30～09:30',
        period: '早晨甦醒',
        hours: 1.0,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_wakeup',
        label: '自然醒甦醒時段'
      },
      {
        id: 'slot_brunch_morning',
        timeRange: '09:30～10:30',
        period: '上午早午餐',
        hours: 1.0,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_breakfast',
        label: '美味早午餐時段'
      },
      {
        id: 'slot_exercise_afternoon',
        timeRange: '14:30～16:00',
        period: '下午活力',
        hours: 1.5,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_sport',
        label: '午後戶外運動時段'
      },
      {
        id: 'slot_rest_evening',
        timeRange: '16:30～18:00',
        period: '傍晚休閒',
        hours: 1.5,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_rest',
        label: '傍晚休閒放鬆時段'
      },
      {
        id: 'slot_study_night',
        timeRange: '19:30～21:30',
        period: '夜間專注高峰',
        hours: 2.0,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_study',
        label: '夜貓專注高效自學時段'
      }
    ],
    cards: [
      { id: 'act_wakeup', name: '自然醒起床', icon: '🛌', type: '起床', desc: '充足休息後自然醒' },
      { id: 'act_breakfast', name: '美味早午餐', icon: '🥞', type: '飲食', desc: '營養均衡的早午餐' },
      { id: 'act_sport', name: '體育運動', icon: '🏃', type: '運動', desc: '慢跑、伸展運動' },
      { id: 'act_rest', name: '休閒放鬆', icon: '🎮', type: '休息', desc: '音樂、繪畫或閱讀' },
      { id: 'act_study', name: '夜間高效學習', icon: '💡', type: '學習', desc: '夜間精神敏銳時段' },
      { id: 'act_sleep', name: '夜間充足睡眠', icon: '🌙', type: '睡眠', desc: '睡滿 9.5 小時好眠' }
    ]
  },

  // -------------------------------------------------------------
  // 第三關：健康作息大挑戰（Neko + Usagi - 12歲上學日作息調整）
  // -------------------------------------------------------------
  {
    id: 3,
    name: '第三關：健康作息大挑戰',
    character: 'neko_usagi',
    charName: 'Neko（12 歲學生）',
    typeBadge: '🌟 挑戰關卡',
    typeClass: 'challenge',
    avatar: 'assets/characters/neko.svg',
    story: '「明天早上 8 點就要上學了！可是 12 歲的 Neko 平常習慣晚睡，早上常起不來。Usagi 決定陪他一起調整作息。你能幫助 Neko 兼顧固定上學與健康睡眠嗎？」',
    targetSleep: 9.5, // 21:30～07:00 = 9.5 小時（符合 12 歲兒童 9-12 小時建議）
    slots: [
      {
        id: 'slot_sleep_night',
        timeRange: '21:30～07:00',
        period: '深夜至清晨',
        hours: 9.5,
        isFixed: false,
        isSleepSlot: true,
        bestActId: 'act_sleep',
        label: '提早就寢深層好眠（9.5 小時）'
      },
      {
        id: 'slot_wake_morning',
        timeRange: '07:00～07:30',
        period: '清晨準時起床',
        hours: 0.5,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_wakeup',
        label: '07:00 準時甦醒梳洗'
      },
      {
        id: 'slot_breakfast_morning',
        timeRange: '07:30～08:00',
        period: '晨間營養早餐',
        hours: 0.5,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_breakfast',
        label: '出門前營養早餐'
      },
      {
        id: 'slot_school_fixed',
        timeRange: '08:00～16:00',
        period: '固定學校作息',
        hours: 8.0,
        isFixed: true,
        fixedAct: {
          id: 'act_school_fixed',
          name: '學校固定課程',
          icon: '🏫',
          type: '學習',
          desc: '準時上學不遲到'
        },
        isSleepSlot: false,
        bestActId: 'act_school_fixed',
        label: '學校固定上學時間（不可衝突）'
      },
      {
        id: 'slot_homework_evening',
        timeRange: '18:30～20:00',
        period: '晚間作業複習',
        hours: 1.5,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_study',
        label: '課後作業與課業複習'
      },
      {
        id: 'slot_relax_prebed',
        timeRange: '20:30～21:30',
        period: '睡前放鬆活動',
        hours: 1.0,
        isFixed: false,
        isSleepSlot: false,
        bestActId: 'act_relax',
        label: '睡前放鬆與環境調整'
      }
    ],
    cards: [
      { id: 'act_sleep', name: '提早睡眠', icon: '🛌', type: '睡眠', desc: '睡足 9.5 小時好眠' },
      { id: 'act_wakeup', name: '準時起床', icon: '⏰', type: '起床', desc: '07:00 鬧鐘響起' },
      { id: 'act_breakfast', name: '活力早餐', icon: '🥣', type: '飲食', desc: '補足晨間上學能量' },
      { id: 'act_study', name: '作業複習', icon: '📖', type: '學習', desc: '專注完成當日功課' },
      { id: 'act_relax', name: '睡前放鬆活動', icon: '🧘', type: '休息', desc: '聽輕音樂、簡單伸展' }
    ]
  }
];

// =============================================================================
// 三、 第三關臥室物件互動定義（Bedroom Interactive Items）
// =============================================================================
const BEDROOM_ITEMS = {
  phone: {
    name: '手機使用',
    icon: '📱',
    badState: '睡前滑手機中',
    goodState: '關閉手機放進收納盒',
    badReason: '睡前滑手機螢幕藍光刺激大腦，會強烈抑制褪黑激素分泌！',
    goodReason: '太棒了！睡前 1 小時停止使用手機，大腦能順利切換到休息模式！'
  },
  lamp: {
    name: '臥室燈光',
    icon: '💡',
    badState: '刺眼強光 (100%)',
    goodState: '柔和暖黃夜燈 (20%)',
    badReason: '刺眼的大白光會讓身體誤以為仍處於正午，難以產生睡意！',
    goodReason: '降低燈光亮度並改用暖色光，能向大腦發出「夜晚已到」的生理訊號！'
  },
  desk: {
    name: '書桌狀態',
    icon: '📚',
    badState: '散落考卷雜物',
    goodState: '收拾整齊書包已備',
    badReason: '雜亂的課本容易帶來心理壓力和焦慮，影響入睡放鬆！',
    goodReason: '將書包與作業收拾整齊，代表今天的任務結束，心情更踏實好眠！'
  },
  curtain: {
    name: '臥室窗簾',
    icon: '🪟',
    badState: '大開（路燈直射）',
    goodState: '拉上雙層遮光窗簾',
    badReason: '窗外的路燈與清晨強光會干擾褪黑激素與深度睡眠週期！',
    goodReason: '拉上遮光窗簾營造幽暗安靜的睡眠環境，睡眠品質大幅提升！'
  },
  alarm: {
    name: '起床鬧鐘',
    icon: '⏰',
    badState: '未定鬧鐘',
    goodState: '設定 07:00 鬧鐘',
    badReason: '沒定鬧鐘容易睡過頭或讓晨間出門時手忙腳亂，增加緊張感！',
    goodReason: '設定 07:00 鬧鐘，保留充足時間梳洗吃早餐，上學從容不迫！'
  },
  bed: {
    name: '床鋪整潔',
    icon: '🛏️',
    badState: '堆滿雜物',
    goodState: '蓬鬆舒適床鋪',
    badReason: '床上堆滿雜物會影響睡眠姿勢，且無法建立床鋪與睡眠的良好大腦制約！',
    goodReason: '乾淨舒適的床鋪能強化「上床就是要放鬆入睡」的正向大腦制約！'
  }
};

// =============================================================================
// 四、 遊戲主體狀態機與控制器（Game Controller）
// =============================================================================
class ChronotypeGame {
  constructor() {
    this.sound = new SoundManager();
    this.currentLevelIndex = 0;
    this.playerSchedule = {}; // { [slotId]: cardObject }
    this.selectedCard = null; // 支援「點擊卡片 ➔ 點擊槽位」雙模式
    this.roomItemsState = {
      phone: false,
      lamp: false,
      desk: false,
      curtain: false,
      alarm: false,
      bed: false
    };

    // Confetti 動畫狀態
    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.confettiParticles = [];
    this.confettiAnimId = null;

    this.initDOMReferences();
    this.bindEvents();
    this.updateSoundIcon();
  }

  // 1. 初始化 DOM 參考
  initDOMReferences() {
    // 畫面 Sections
    this.screenStart = document.getElementById('screen-start');
    this.screenLevel = document.getElementById('screen-level');
    this.modalEval = document.getElementById('modal-eval');
    this.screenVictory = document.getElementById('screen-victory');

    // 頂部 HUD
    this.hudLevelTag = document.getElementById('hud-level-tag');
    this.hudLevelTitle = document.getElementById('hud-level-title');
    this.hudCharAvatar = document.getElementById('hud-char-avatar');
    this.hudCharName = document.getElementById('hud-char-name');
    this.hudSleepHours = document.getElementById('hud-sleep-hours');
    this.hudSleepStatus = document.getElementById('hud-sleep-status');
    this.hudEnergyBar = document.getElementById('hud-energy-bar');
    this.hudEnergyVal = document.getElementById('hud-energy-val');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.soundIcon = document.getElementById('sound-icon');
    this.btnResetLevel = document.getElementById('btn-reset-level');

    // 關卡引導與橫幅
    this.levelStoryAvatar = document.getElementById('level-story-avatar');
    this.levelTagBadge = document.getElementById('level-tag-badge');
    this.characterTypeBadge = document.getElementById('character-type-badge');
    this.levelStoryText = document.getElementById('level-story-text');

    // 第三關臥室面板
    this.level3EnvPanel = document.getElementById('level3-environment-panel');
    this.envCompletedCount = document.getElementById('env-completed-count');
    this.envRequirementTag = document.getElementById('env-requirement-tag');
    this.roomDialogText = document.getElementById('room-dialog-text');

    // 時間軸與卡片托盤
    this.slotsGrid = document.getElementById('slots-grid');
    this.cardsTray = document.getElementById('cards-tray');
    this.trayCountBadge = document.getElementById('tray-count-badge');
    this.placedSlotsCount = document.getElementById('placed-slots-count');
    this.totalSlotsCount = document.getElementById('total-slots-count');

    // 精神評估與即時回饋
    this.energyFaceEmoji = document.getElementById('energy-face-emoji');
    this.energyGradeText = document.getElementById('energy-grade-text');
    this.energyGaugeFill = document.getElementById('energy-gauge-fill');
    this.liveCompanionTip = document.getElementById('live-companion-tip');
    this.btnCheckSchedule = document.getElementById('btn-check-schedule');

    // 結算彈窗評分項目
    this.evalTierStamp = document.getElementById('eval-tier-stamp');
    this.evalLevelName = document.getElementById('eval-level-name');
    this.evalTotalScore = document.getElementById('eval-total-score');
    this.rubricScoreSleep = document.getElementById('rubric-score-sleep');
    this.rubricBarSleep = document.getElementById('rubric-bar-sleep');
    this.rubricDescSleep = document.getElementById('rubric-desc-sleep');
    this.rubricScoreSchedule = document.getElementById('rubric-score-schedule');
    this.rubricBarSchedule = document.getElementById('rubric-bar-schedule');
    this.rubricDescSchedule = document.getElementById('rubric-desc-schedule');
    this.rubricScoreChronotype = document.getElementById('rubric-score-chronotype');
    this.rubricBarChronotype = document.getElementById('rubric-bar-chronotype');
    this.rubricDescChronotype = document.getElementById('rubric-desc-chronotype');
    this.rubricScoreHabits = document.getElementById('rubric-score-habits');
    this.rubricBarHabits = document.getElementById('rubric-bar-habits');
    this.rubricDescHabits = document.getElementById('rubric-desc-habits');
    this.evalDetailedFeedback = document.getElementById('eval-detailed-feedback');
    this.btnEvalTweak = document.getElementById('btn-eval-tweak');
    this.btnEvalNext = document.getElementById('btn-eval-next');
    this.btnEvalNextText = document.getElementById('btn-eval-next-text');

    // 最終通關按鈕
    this.btnVictoryReplay = document.getElementById('btn-victory-replay');
    this.btnVictoryHome = document.getElementById('btn-victory-home');

    // 浮動提示 Toast
    this.toastElem = document.getElementById('toast-toast');
    this.toastText = document.getElementById('toast-text');

    // 開始冒險按鈕
    this.btnStartAdventure = document.getElementById('btn-start-adventure');
  }

  // 2. 綁定按鈕與全域互動事件
  bindEvents() {
    // 開始冒險
    this.btnStartAdventure.addEventListener('click', () => {
      this.sound.playClick();
      this.startLevel(0);
    });

    // 音效開關
    this.btnSoundToggle.addEventListener('click', () => {
      const isMuted = this.sound.toggleMute();
      this.updateSoundIcon();
      if (!isMuted) this.sound.playClick();
    });

    // 重設本關
    this.btnResetLevel.addEventListener('click', () => {
      this.sound.playClick();
      this.resetCurrentLevel();
      this.showToast('已重設本關時間表！');
    });

    // 檢查我的時間表
    this.btnCheckSchedule.addEventListener('click', () => {
      this.sound.playClick();
      this.evaluateSchedule();
    });

    // 結算彈窗按鈕
    this.btnEvalTweak.addEventListener('click', () => {
      this.sound.playClick();
      this.closeModal();
    });

    this.btnEvalNext.addEventListener('click', () => {
      this.sound.playClick();
      this.closeModal();
      if (this.currentLevelIndex < LEVELS.length - 1) {
        this.startLevel(this.currentLevelIndex + 1);
      } else {
        this.showVictoryScreen();
      }
    });

    // 最終畫面按鈕
    this.btnVictoryReplay.addEventListener('click', () => {
      this.sound.playClick();
      this.stopConfetti();
      this.startLevel(0);
    });

    this.btnVictoryHome.addEventListener('click', () => {
      this.sound.playClick();
      this.stopConfetti();
      this.showStartScreen();
    });

    // 第三關臥室物件點擊切換
    const roomBtns = document.querySelectorAll('.room-item-btn');
    roomBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemKey = btn.dataset.item;
        this.toggleRoomItem(itemKey);
      });
    });

    // 視窗大小改變時重整 Confetti Canvas
    window.addEventListener('resize', () => {
      if (this.confettiCanvas) {
        this.confettiCanvas.width = this.screenVictory.clientWidth;
        this.confettiCanvas.height = this.screenVictory.clientHeight;
      }
    });
  }

  updateSoundIcon() {
    this.soundIcon.textContent = this.sound.muted ? '🔇' : '🔊';
  }

  showToast(message) {
    if (!this.toastElem) return;
    this.toastText.textContent = message;
    this.toastElem.classList.remove('toast-hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastElem.classList.add('toast-hidden');
    }, 2500);
  }

  showStartScreen() {
    this.screenStart.classList.add('active');
    this.screenLevel.classList.remove('active');
    this.modalEval.classList.remove('active');
    this.screenVictory.classList.remove('active');
  }

  // ===========================================================================
  // 五、 關卡啟動與介面渲染（Level Initialization & UI Rendering）
  // ===========================================================================
  startLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    const level = LEVELS[levelIndex];

    // 切換顯示
    this.screenStart.classList.remove('active');
    this.screenLevel.classList.add('active');
    this.modalEval.classList.remove('active');
    this.screenVictory.classList.remove('active');

    // 重設狀態
    this.playerSchedule = {};
    this.selectedCard = null;

    // 若第三關，重設房間物件狀態
    if (level.id === 3) {
      this.roomItemsState = {
        phone: false,
        lamp: false,
        desk: false,
        curtain: false,
        alarm: false,
        bed: false
      };
      this.level3EnvPanel.classList.remove('room-panel-hidden');
      this.updateRoomItemsUI();
    } else {
      this.level3EnvPanel.classList.add('room-panel-hidden');
    }

    // 更新 HUD 資訊
    this.hudLevelTag.textContent = `關卡 ${level.id}／${LEVELS.length}`;
    this.hudLevelTitle.textContent = level.name.replace(/^第[一二三]關：/, '');
    this.hudCharAvatar.src = level.avatar;
    this.hudCharName.textContent = level.charName;

    // 更新關卡引導條
    this.levelStoryAvatar.src = level.avatar;
    this.levelTagBadge.textContent = level.name;
    this.characterTypeBadge.textContent = level.typeBadge;
    this.characterTypeBadge.className = `type-badge ${level.typeClass}`;
    this.levelStoryText.textContent = level.story;

    // 若槽位中有固定活動，自動填入
    level.slots.forEach(slot => {
      if (slot.isFixed && slot.fixedAct) {
        this.playerSchedule[slot.id] = { ...slot.fixedAct, isFixed: true };
      }
    });

    // 渲染槽位與卡片
    this.renderSlots();
    this.renderCardsTray();
    this.updateStatsAndInsights();
  }

  resetCurrentLevel() {
    const level = LEVELS[this.currentLevelIndex];
    this.playerSchedule = {};
    this.selectedCard = null;

    // 固定活動保留
    level.slots.forEach(slot => {
      if (slot.isFixed && slot.fixedAct) {
        this.playerSchedule[slot.id] = { ...slot.fixedAct, isFixed: true };
      }
    });

    this.renderSlots();
    this.renderCardsTray();
    this.updateStatsAndInsights();
  }

  // 3. 渲染槽位（Timeline Slots）
  renderSlots() {
    const level = LEVELS[this.currentLevelIndex];
    this.slotsGrid.innerHTML = '';

    level.slots.forEach(slot => {
      const slotElem = document.createElement('div');
      slotElem.className = 'time-slot';
      slotElem.dataset.slotId = slot.id;

      const placedAct = this.playerSchedule[slot.id];

      // 頂部時段標籤
      const metaDiv = document.createElement('div');
      metaDiv.className = 'slot-meta';
      metaDiv.innerHTML = `
        <span class="slot-time-range">${slot.timeRange}</span>
        <span class="slot-period-tag">${slot.period}</span>
      `;
      slotElem.appendChild(metaDiv);

      if (slot.isFixed) {
        // 固定時段（如學校固定課程）
        slotElem.classList.add('slot-fixed');
        const actCardDiv = document.createElement('div');
        actCardDiv.className = 'slot-activity-card';
        actCardDiv.innerHTML = `
          <div class="slot-act-left">
            <span class="slot-act-icon">${placedAct.icon}</span>
            <span class="slot-act-name">${placedAct.name}</span>
            <span class="slot-fixed-badge">固定上學</span>
          </div>
        `;
        slotElem.appendChild(actCardDiv);
      } else if (placedAct) {
        // 已排入玩家活動卡片
        slotElem.classList.add('slot-filled');
        const actCardDiv = document.createElement('div');
        actCardDiv.className = 'slot-activity-card';
        actCardDiv.innerHTML = `
          <div class="slot-act-left">
            <span class="slot-act-icon">${placedAct.icon}</span>
            <div>
              <div class="slot-act-name">${placedAct.name}</div>
              <span class="slot-act-type-tag">${placedAct.type}</span>
            </div>
          </div>
          <button class="slot-act-remove-btn" title="移回卡片" aria-label="移回卡片">✕</button>
        `;

        // 點擊移除按鈕移回托盤
        actCardDiv.querySelector('.slot-act-remove-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          this.removeActivityFromSlot(slot.id);
        });

        slotElem.appendChild(actCardDiv);
      } else {
        // 尚未安排卡片
        slotElem.classList.add('slot-empty');
        const placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'slot-placeholder';
        placeholderDiv.innerHTML = `
          <span>📥 點擊或拖曳安排活動</span>
        `;
        slotElem.appendChild(placeholderDiv);
      }

      // 綁定拖曳吸附（HTML5 Drag & Drop）事件
      if (!slot.isFixed) {
        slotElem.addEventListener('dragover', (e) => {
          e.preventDefault();
          slotElem.classList.add('slot-dragover');
        });

        slotElem.addEventListener('dragleave', () => {
          slotElem.classList.remove('slot-dragover');
        });

        slotElem.addEventListener('drop', (e) => {
          e.preventDefault();
          slotElem.classList.remove('slot-dragover');
          const cardId = e.dataTransfer.getData('text/plain');
          if (cardId) {
            this.placeCardInSlot(cardId, slot.id);
          }
        });

        // 支援「點擊卡片 ➔ 點擊槽位」放置
        slotElem.addEventListener('click', () => {
          if (this.selectedCard) {
            this.placeCardInSlot(this.selectedCard.id, slot.id);
          } else if (this.playerSchedule[slot.id]) {
            // 若槽位已有卡片且無選中新卡片，點擊可直接移回托盤
            this.removeActivityFromSlot(slot.id);
          }
        });
      }

      this.slotsGrid.appendChild(slotElem);
    });

    // 更新槽位計數
    const totalSlots = level.slots.length;
    const placedCount = Object.keys(this.playerSchedule).length;
    this.placedSlotsCount.textContent = placedCount;
    this.totalSlotsCount.textContent = totalSlots;
  }

  // 4. 渲染卡片托盤（Cards Tray）
  renderCardsTray() {
    const level = LEVELS[this.currentLevelIndex];
    this.cardsTray.innerHTML = '';

    // 找出已排入槽位之活動 ID
    const placedCardIds = Object.values(this.playerSchedule).map(act => act.id);

    // 篩選尚未安排之可用卡片
    const availableCards = level.cards.filter(c => !placedCardIds.includes(c.id));
    this.trayCountBadge.textContent = `剩餘 ${availableCards.length} 張`;

    availableCards.forEach(card => {
      const cardElem = document.createElement('div');
      cardElem.className = 'act-card';
      cardElem.draggable = true;
      cardElem.dataset.cardId = card.id;

      if (this.selectedCard && this.selectedCard.id === card.id) {
        cardElem.classList.add('card-selected');
      }

      cardElem.innerHTML = `
        <span class="card-icon">${card.icon}</span>
        <span class="card-name">${card.name}</span>
        <span class="card-tag">${card.type}</span>
      `;

      // HTML5 Drag 監聽
      cardElem.addEventListener('dragstart', (e) => {
        cardElem.classList.add('card-dragging');
        e.dataTransfer.setData('text/plain', card.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      cardElem.addEventListener('dragend', () => {
        cardElem.classList.remove('card-dragging');
      });

      // 點擊選取模式
      cardElem.addEventListener('click', () => {
        this.sound.playClick();
        if (this.selectedCard && this.selectedCard.id === card.id) {
          // 取消選取
          this.selectedCard = null;
          this.clearSlotHighlights();
        } else {
          // 選中此卡片
          this.selectedCard = card;
          this.highlightEmptySlots();
        }
        this.renderCardsTray();
      });

      this.cardsTray.appendChild(cardElem);
    });
  }

  highlightEmptySlots() {
    const slotElems = this.slotsGrid.querySelectorAll('.time-slot.slot-empty');
    slotElems.forEach(el => el.classList.add('slot-selected-target'));
  }

  clearSlotHighlights() {
    const slotElems = this.slotsGrid.querySelectorAll('.time-slot');
    slotElems.forEach(el => el.classList.remove('slot-selected-target'));
  }

  // 5. 放置卡片至槽位
  placeCardInSlot(cardId, slotId) {
    const level = LEVELS[this.currentLevelIndex];
    const slot = level.slots.find(s => s.id === slotId);
    if (!slot || slot.isFixed) {
      this.showToast('這個時段是固定學校課程，無法更動喔！');
      return;
    }

    const card = level.cards.find(c => c.id === cardId);
    if (!card) return;

    // 若原槽位已有活動，先退回原活動
    this.playerSchedule[slotId] = card;
    this.selectedCard = null;
    this.clearSlotHighlights();

    this.sound.playSnap();
    this.renderSlots();
    this.renderCardsTray();
    this.updateStatsAndInsights();
  }

  // 6. 將卡片從槽位移回托盤
  removeActivityFromSlot(slotId) {
    const level = LEVELS[this.currentLevelIndex];
    const slot = level.slots.find(s => s.id === slotId);
    if (!slot || slot.isFixed) return;

    if (this.playerSchedule[slotId]) {
      delete this.playerSchedule[slotId];
      this.sound.playClick();
      this.renderSlots();
      this.renderCardsTray();
      this.updateStatsAndInsights();
    }
  }

  // ===========================================================================
  // 六、 睡眠時數計算與精神能量模擬引擎（Simulation Engine）
  // ===========================================================================
  calculateTotalSleepHours() {
    const level = LEVELS[this.currentLevelIndex];
    let sleepHours = 0;

    level.slots.forEach(slot => {
      const placed = this.playerSchedule[slot.id];
      if (placed && (placed.type === '睡眠' || slot.isSleepSlot && placed.id.includes('sleep'))) {
        sleepHours += slot.hours;
      }
    });

    return sleepHours;
  }

  updateStatsAndInsights() {
    const level = LEVELS[this.currentLevelIndex];
    const sleepHours = this.calculateTotalSleepHours();

    // 1. 更新睡眠時數 HUD
    this.hudSleepHours.textContent = `${sleepHours.toFixed(1)} 小時`;
    if (sleepHours === 0) {
      this.hudSleepStatus.textContent = '未安排';
      this.hudSleepStatus.className = 'stat-status-badge status-warn';
    } else if (sleepHours >= 9.0 && sleepHours <= 11.5) {
      this.hudSleepStatus.textContent = '充足良好 💤';
      this.hudSleepStatus.className = 'stat-status-badge status-ok';
    } else if (sleepHours >= 8.0) {
      this.hudSleepStatus.textContent = '略嫌不足';
      this.hudSleepStatus.className = 'stat-status-badge status-warn';
    } else {
      this.hudSleepStatus.textContent = '嚴重不足 ⚠️';
      this.hudSleepStatus.className = 'stat-status-badge status-danger';
    }

    // 2. 計算即時精神能量值（0～100 遊戲化模擬）
    let energyScore = 50;

    // 睡眠時數影響
    if (sleepHours >= 9.0 && sleepHours <= 11.5) {
      energyScore += 25;
    } else if (sleepHours >= 8.0) {
      energyScore += 10;
    } else if (sleepHours > 0) {
      energyScore -= 15;
    } else {
      energyScore -= 20; // 沒排睡眠
    }

    // 早餐影響
    const hasBreakfast = Object.values(this.playerSchedule).some(act => act.type === '飲食');
    if (hasBreakfast) energyScore += 5;

    // 休息/運動影響
    const hasSport = Object.values(this.playerSchedule).some(act => act.type === '運動');
    const hasRest = Object.values(this.playerSchedule).some(act => act.type === '休息');
    if (hasSport) energyScore += 5;
    if (hasRest) energyScore += 5;

    // 時型特色加權
    if (level.character === 'inu') {
      // 晨型人早晨有安排讀書或運動，精神更旺盛
      const morningSlot = this.playerSchedule['slot_exercise_afternoon'];
      if (morningSlot && morningSlot.type === '運動') energyScore += 10;
    } else if (level.character === 'neko') {
      // 夜型人在夜間學習時段安排學習，精神旺盛
      const nightStudySlot = this.playerSchedule['slot_study_night'];
      if (nightStudySlot && nightStudySlot.type === '學習') energyScore += 10;
    } else if (level.id === 3) {
      // 第三關臥室環境優化項目加權
      const envGoodCount = Object.values(this.roomItemsState).filter(Boolean).length;
      energyScore += Math.min(10, envGoodCount * 2);
    }

    energyScore = Math.max(10, Math.min(100, energyScore));

    // 更新精神能量條
    this.hudEnergyBar.style.width = `${energyScore}%`;
    this.hudEnergyVal.textContent = `${energyScore}%`;
    this.energyGaugeFill.style.width = `${energyScore}%`;

    // 表情與精神評語
    if (energyScore >= 85) {
      this.energyFaceEmoji.textContent = '😆';
      this.energyGradeText.textContent = '活力充沛';
      this.energyGradeText.style.color = '#10B981';
      this.liveCompanionTip.textContent = '太棒了！睡眠時數與活動安排非常均衡，角色充滿精神！';
    } else if (energyScore >= 70) {
      this.energyFaceEmoji.textContent = '😊';
      this.energyGradeText.textContent = '精神良好';
      this.energyGradeText.style.color = '#059669';
      this.liveCompanionTip.textContent = '作息很不錯喔！試著再安排足夠的睡眠或睡前放鬆，會更棒！';
    } else if (energyScore >= 50) {
      this.energyFaceEmoji.textContent = '😐';
      this.energyGradeText.textContent = '普通狀態';
      this.energyGradeText.style.color = '#D97706';
      this.liveCompanionTip.textContent = '目前作息還可以，記得不要犧牲睡眠時間喔！';
    } else if (energyScore >= 30) {
      this.energyFaceEmoji.textContent = '🥱';
      this.energyGradeText.textContent = '有點疲累';
      this.energyGradeText.style.color = '#EA580C';
      this.liveCompanionTip.textContent = '睡眠時間有點短喔！試著讓角色多休息一下吧。';
    } else {
      this.energyFaceEmoji.textContent = '😵';
      this.energyGradeText.textContent = '極度疲倦';
      this.energyGradeText.style.color = '#DC2626';
      this.liveCompanionTip.textContent = '糟糕！作息嚴重失衡或缺少充足睡眠，快排入睡眠卡片！';
    }
  }

  // ===========================================================================
  // 七、 第三關臥室環境互動面板（Bedroom Environment System）
  // ===========================================================================
  toggleRoomItem(itemKey) {
    if (!BEDROOM_ITEMS[itemKey]) return;
    const item = BEDROOM_ITEMS[itemKey];

    // 切換狀態
    this.roomItemsState[itemKey] = !this.roomItemsState[itemKey];
    const isGood = this.roomItemsState[itemKey];

    this.sound.playClick();
    this.updateRoomItemsUI();

    // 更新 Usagi 對話引導
    if (isGood) {
      this.sound.playSnap();
      this.roomDialogText.textContent = `${item.goodReason}`;
    } else {
      this.roomDialogText.textContent = `${item.badReason}`;
    }

    this.updateStatsAndInsights();
  }

  updateRoomItemsUI() {
    let completedCount = 0;
    Object.keys(BEDROOM_ITEMS).forEach(key => {
      const isGood = this.roomItemsState[key];
      const itemConfig = BEDROOM_ITEMS[key];
      const btn = document.getElementById(`room-item-${key}`);
      const statusSpan = document.getElementById(`${key}-status`);

      if (isGood) {
        completedCount++;
        btn.className = 'room-item-btn item-good';
        statusSpan.textContent = itemConfig.goodState;
      } else {
        btn.className = 'room-item-btn item-bad';
        statusSpan.textContent = itemConfig.badState;
      }
    });

    this.envCompletedCount.textContent = completedCount;
    if (completedCount >= 2) {
      this.envRequirementTag.textContent = '已達標 ✅';
      this.envRequirementTag.className = 'req-tag ready';
    } else {
      this.envRequirementTag.textContent = `尚未達標（還需 ${2 - completedCount} 項）`;
      this.envRequirementTag.className = 'req-tag';
    }
  }

  // ===========================================================================
  // 八、 結算評分與回饋系統（Schedule Evaluation Engine）
  // ===========================================================================
  evaluateSchedule() {
    const level = LEVELS[this.currentLevelIndex];
    const sleepHours = this.calculateTotalSleepHours();

    // 檢查是否有未安排的槽位
    const unplacedSlots = level.slots.filter(s => !this.playerSchedule[s.id]);
    if (unplacedSlots.length > 0) {
      this.showToast(`還有 ${unplacedSlots.length} 個時段尚未安排活動喔！`);
    }

    // 1. 睡眠安排評分 (40 分)
    let sleepScore = 0;
    let sleepComment = '';
    if (sleepHours >= 9.0 && sleepHours <= 11.5) {
      sleepScore = 40;
      sleepComment = `安排了 ${sleepHours.toFixed(1)} 小時充足睡眠，完全符合 10～13 歲學生每日 9～12 小時的健康需求！`;
    } else if (sleepHours >= 8.0 && sleepHours < 9.0) {
      sleepScore = 28;
      sleepComment = `安排了 ${sleepHours.toFixed(1)} 小時睡眠。雖然能勉強應付上學，但對成長中學生偏低，長期易累積睡眠債！`;
    } else if (sleepHours >= 7.0 && sleepHours < 8.0) {
      sleepScore = 15;
      sleepComment = `僅安排 ${sleepHours.toFixed(1)} 小時睡眠，睡眠嚴重不足，容易造成白天專注力下降與生長發育不良！`;
    } else if (sleepHours > 0 && sleepHours < 7.0) {
      sleepScore = 5;
      sleepComment = `睡眠時數大幅不足（僅 ${sleepHours.toFixed(1)} 小時）！請提早就寢或延後起床。`;
    } else if (sleepHours > 11.5) {
      sleepScore = 25;
      sleepComment = `睡眠時間過長（超過 12 小時），可能導致白天生活節奏紊亂與精神昏沉。`;
    } else {
      sleepScore = 0;
      sleepComment = '尚未安排任何睡眠時間！充足睡眠是所有學習與健康的基石喔！';
    }

    // 2. 時間規劃合理性 (30 分)
    let scheduleScore = 30;
    let scheduleIssues = [];

    // 順序檢查 A：起床是否在早餐前？
    let wakeSlotIndex = -1;
    let breakfastSlotIndex = -1;
    level.slots.forEach((s, idx) => {
      const act = this.playerSchedule[s.id];
      if (act && act.type === '起床') wakeSlotIndex = idx;
      if (act && act.type === '飲食') breakfastSlotIndex = idx;
    });

    if (wakeSlotIndex !== -1 && breakfastSlotIndex !== -1) {
      if (wakeSlotIndex > breakfastSlotIndex) {
        scheduleScore -= 10;
        scheduleIssues.push('順序不合理：尚未起床就先吃了早餐！');
      }
    } else if (wakeSlotIndex === -1) {
      scheduleScore -= 8;
      scheduleIssues.push('未安排起床活動');
    } else if (breakfastSlotIndex === -1) {
      scheduleScore -= 5;
      scheduleIssues.push('未安排早餐時間');
    }

    // 順序檢查 B：第三關上學前是否有起床
    if (level.id === 3) {
      const schoolSlot = this.playerSchedule['slot_school_fixed'];
      const wakeSlot = this.playerSchedule['slot_wake_morning'];
      if (!wakeSlot || wakeSlot.type !== '起床') {
        scheduleScore -= 10;
        scheduleIssues.push('上學前未安排及時起床與準備！');
      }
    }

    // 未填滿槽位扣分
    if (unplacedSlots.length > 0) {
      const penalty = Math.min(10, unplacedSlots.length * 3);
      scheduleScore -= penalty;
      scheduleIssues.push(`尚有 ${unplacedSlots.length} 個空白時段`);
    }

    scheduleScore = Math.max(5, scheduleScore);
    const scheduleComment = scheduleIssues.length === 0
      ? '時間安排條理分明，起居飲食順序合乎生活邏輯且無時間衝突！'
      : `時間規劃可再改善：${scheduleIssues.join('、')}。`;

    // 3. 符合作息需求 (20 分)
    let chronotypeScore = 20;
    let chronotypeComment = '';

    if (level.character === 'inu') {
      // 晨型人：白天的活動與學習適應
      const sleepSlot = this.playerSchedule['slot_sleep_night'];
      if (sleepSlot && sleepSlot.type === '睡眠') {
        chronotypeScore = 20;
        chronotypeComment = '完美契合晨型人規律早起、提早就寢的健康節奏！';
      } else {
        chronotypeScore = 12;
        chronotypeComment = '晨型人早晨容易清醒，但仍需要提早入睡以保障充足睡眠喔！';
      }
    } else if (level.character === 'neko') {
      // 夜型人：假日時段靈活安排
      const nightStudySlot = this.playerSchedule['slot_study_night'];
      if (nightStudySlot && nightStudySlot.type === '學習') {
        chronotypeScore = 20;
        chronotypeComment = '發揮了夜型人在傍晚與夜間的高效專注特質，學習時段安排得宜！';
      } else {
        chronotypeScore = 14;
        chronotypeComment = '夜型人在下午到晚間專注力較佳，可試著把動腦自學排在夜間時段。';
      }
    } else if (level.id === 3) {
      // 第三關：夜型人面對上學日的調整
      const prebedRelax = this.playerSchedule['slot_relax_prebed'];
      if (prebedRelax && prebedRelax.type === '休息') {
        chronotypeScore = 20;
        chronotypeComment = '成功引導夜型人在睡前安排放鬆活動，逐步適應提早上床！';
      } else {
        chronotypeScore = 12;
        chronotypeComment = '面對固定上學時間，建議夜型人在睡前安排靜態放鬆，幫助大腦平穩入睡。';
      }
    }

    // 4. 健康生活習慣 (10 分)
    let habitsScore = 10;
    let habitsComment = '';

    if (level.id === 3) {
      // 第三關考量臥室睡前環境
      const envGoodCount = Object.values(this.roomItemsState).filter(Boolean).length;
      if (envGoodCount >= 4) {
        habitsScore = 10;
        habitsComment = `臥室環境優化達成 ${envGoodCount} 項（減光、不滑手機、收納整齊），入睡條件極佳！`;
      } else if (envGoodCount >= 2) {
        habitsScore = 8;
        habitsComment = `臥室環境優化達成 ${envGoodCount} 項，達到基本健康入睡門檻！`;
      } else {
        habitsScore = 3;
        habitsComment = `臥室環境僅優化 ${envGoodCount} 項（至少需 2 項），強光與手機藍光會大幅阻礙入眠！`;
      }
    } else {
      // 第一、二關考量休閒與運動平衡
      const hasSport = Object.values(this.playerSchedule).some(act => act.type === '運動');
      const hasRest = Object.values(this.playerSchedule).some(act => act.type === '休息');
      if (hasSport && hasRest) {
        habitsScore = 10;
        habitsComment = '運動與休息兼備，身心調節非常平衡！';
      } else if (hasSport || hasRest) {
        habitsScore = 7;
        habitsComment = '有安排適當活動，若能兼顧運動與沉澱放鬆會更完美！';
      } else {
        habitsScore = 4;
        habitsComment = '缺少運動或放鬆活動，生活節奏稍嫌緊繃。';
      }
    }

    // 總分計算
    const totalScore = sleepScore + scheduleScore + chronotypeScore + habitsScore;

    // 評價等級判定
    let tierText = '';
    let stampClass = '';
    if (totalScore >= 90) {
      tierText = '👑 生理時鐘管理大師！';
      stampClass = 'tier-stamp stamp-gold';
    } else if (totalScore >= 70) {
      tierText = '🌟 作息安排高手！';
      stampClass = 'tier-stamp stamp-silver';
    } else if (totalScore >= 50) {
      tierText = '🌱 很棒的時間規劃員！';
      stampClass = 'tier-stamp stamp-bronze';
    } else {
      tierText = '💡 再調整一下，時間表會更理想！';
      stampClass = 'tier-stamp stamp-adjust';
    }

    // 渲染評分彈窗
    this.evalTierStamp.textContent = tierText;
    this.evalTierStamp.className = stampClass;
    this.evalLevelName.textContent = `${level.name} ． 作息審查報告`;
    this.evalTotalScore.textContent = totalScore;

    // 細項進度條與文字
    this.rubricScoreSleep.textContent = `${sleepScore}／40 分`;
    this.rubricBarSleep.style.width = `${(sleepScore / 40) * 100}%`;
    this.rubricDescSleep.textContent = sleepComment;

    this.rubricScoreSchedule.textContent = `${scheduleScore}／30 分`;
    this.rubricBarSchedule.style.width = `${(scheduleScore / 30) * 100}%`;
    this.rubricDescSchedule.textContent = scheduleComment;

    this.rubricScoreChronotype.textContent = `${chronotypeScore}／20 分`;
    this.rubricBarChronotype.style.width = `${(chronotypeScore / 20) * 100}%`;
    this.rubricDescChronotype.textContent = chronotypeComment;

    this.rubricScoreHabits.textContent = `${habitsScore}／10 分`;
    this.rubricBarHabits.style.width = `${(habitsScore / 10) * 100}%`;
    this.rubricDescHabits.textContent = habitsComment;

    // Usagi 綜合建議
    let advice = '';
    if (totalScore >= 85) {
      advice = level.id === 1
        ? '太棒了！你幫 Inu 安排了一份兼具活力與充足睡眠的日程！記住，早起的前提永遠是有充足的睡眠喔！'
        : level.id === 2
          ? '做得好！原來只要確保充足睡眠，夜型人也能在週末找到屬於自己的高效生活節奏，晨型與夜型並無優劣之分！'
          : '太精彩了！透過優化睡前臥室環境與提早放鬆，Neko 也能在固定上學時間下睡飽 9.5 小時，健康與學業雙贏！';
      this.sound.playSuccess();
    } else {
      advice = '作息還差一點點就更完美了！建議檢查睡眠時數是否有達到 9 小時以上，並確保起居順序合乎生活常理，試著再微調一次吧！';
      this.sound.playScore();
    }
    this.evalDetailedFeedback.textContent = advice;

    // 下一關按鈕文案
    if (this.currentLevelIndex < LEVELS.length - 1) {
      this.btnEvalNextText.textContent = '進入下一關 ➔';
    } else {
      this.btnEvalNextText.textContent = '領取通關獎章 🏆';
    }

    // 彈出 Modal
    this.modalEval.classList.add('active');
  }

  closeModal() {
    this.modalEval.classList.remove('active');
  }

  // ===========================================================================
  // 九、 最終通關畫面與彩帶動畫（Victory Screen & Confetti）
  // ===========================================================================
  showVictoryScreen() {
    this.screenStart.classList.remove('active');
    this.screenLevel.classList.remove('active');
    this.modalEval.classList.remove('active');
    this.screenVictory.classList.add('active');

    this.sound.playFanfare();
    this.startConfetti();
  }

  startConfetti() {
    this.confettiCanvas = document.getElementById('victory-confetti-canvas');
    if (!this.confettiCanvas) return;

    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.confettiCanvas.width = this.screenVictory.clientWidth || 1280;
    this.confettiCanvas.height = this.screenVictory.clientHeight || 720;

    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#FCD34D'];
    this.confettiParticles = [];

    for (let i = 0; i < 90; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: Math.random() * -this.confettiCanvas.height,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 8
      });
    }

    const render = () => {
      if (!this.confettiCtx) return;
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

      this.confettiParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;

        if (p.y > this.confettiCanvas.height) {
          p.y = -10;
          p.x = Math.random() * this.confettiCanvas.width;
        }

        this.confettiCtx.save();
        this.confettiCtx.translate(p.x, p.y);
        this.confettiCtx.rotate((p.rot * Math.PI) / 180);
        this.confettiCtx.fillStyle = p.color;
        this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        this.confettiCtx.restore();
      });

      this.confettiAnimId = requestAnimationFrame(render);
    };

    if (this.confettiAnimId) cancelAnimationFrame(this.confettiAnimId);
    this.confettiAnimId = requestAnimationFrame(render);
  }

  stopConfetti() {
    if (this.confettiAnimId) {
      cancelAnimationFrame(this.confettiAnimId);
      this.confettiAnimId = null;
    }
    if (this.confettiCtx && this.confettiCanvas) {
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }
}

// 啟動遊戲控制器
window.addEventListener('DOMContentLoaded', () => {
  window.chronotypeGame = new ChronotypeGame();
});
