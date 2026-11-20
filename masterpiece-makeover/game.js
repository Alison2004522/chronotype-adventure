/**
 * 《名畫變裝大師》（Masterpiece Makeover）
 * 2D 互動式藝術教育遊戲
 * 技術：HTML5, CSS3, 原生 JavaScript, Web Audio API, Canvas 離線海報匯出
 */

(function () {
  'use strict';

  // =========================================================================
  // 一、 音效引擎（Web Audio API 零延遲合成器 + 本機音訊相容）
  // =========================================================================

  class SoundManager {
    constructor() {
      this.enabled = true;
      this.audioCtx = null;
      this.initContext();
    }

    initContext() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      } catch (e) {
        console.warn('AudioContext 不支援：', e);
      }
    }

    resume() {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playClick() {
      if (!this.enabled || !this.audioCtx) return;
      this.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const t = this.audioCtx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }

    playSnap() {
      if (!this.enabled || !this.audioCtx) return;
      this.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const t = this.audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.09);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    }

    playUnequip() {
      if (!this.enabled || !this.audioCtx) return;
      this.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const t = this.audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    }

    playScore() {
      if (!this.enabled || !this.audioCtx) return;
      this.resume();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const t = this.audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const start = t + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(start);
        osc.stop(start + 0.15);
      });
    }

    playFanfare() {
      if (!this.enabled || !this.audioCtx) return;
      this.resume();
      const melody = [
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.15 },
        { f: 783.99, d: 0.15 },
        { f: 1046.5, d: 0.4 }
      ];
      let t = this.audioCtx.currentTime;

      melody.forEach(item => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + item.d);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t);
        osc.stop(t + item.d);
        t += item.d + 0.05;
      });
    }
  }

  // =========================================================================
  // 二、 遊戲關卡資料庫（3 大經典名畫、道具、姿勢、構圖與評分規準）
  // =========================================================================

  const LEVELS_DATA = [
    {
      id: 'pearl_girl',
      number: 1,
      title: '第一關：神祕的珍珠少女',
      paintingName: '《戴珍珠耳環的少女》',
      originalImg: 'assets/paintings/pearl_girl.jpg',
      artistTag: '維梅爾 ． 約 1665 年',
      museum: '荷蘭海牙毛里茨之家博物館館藏',
      chibiBaseImg: 'assets/characters/pose_pearl_target.svg',
      defaultBg: 'bg-pearl-dark',
      bgOptions: [
        { id: 'bg-pearl-dark', name: '深黑經典背景 [★推薦]' },
        { id: 'bg-pearl-studio', name: '明亮工作室背景' }
      ],
      targetPose: 'pearl_turn',
      poseOptions: [
        { id: 'pearl_turn', name: '微微側身回眸 [★推薦]', isTarget: true },
        { id: 'pearl_front', name: '正面端坐', isTarget: false },
        { id: 'pearl_away', name: '轉身背對', isTarget: false }
      ],
      targetExpr: 'pearl_gentle',
      exprOptions: [
        { id: 'pearl_gentle', name: '溫柔微張雙唇凝視 [★推薦]', isTarget: true },
        { id: 'pearl_smile', name: '燦爛大笑', isTarget: false },
        { id: 'pearl_blink', name: '俏皮眨眼', isTarget: false }
      ],
      targetComp: {
        posX: 50,
        scale: 100,
        bg: 'bg-pearl-dark'
      },
      hasTable: false,
      keyProps: ['blue_towel', 'yellow_cloth', 'pearl_earring'],
      bonusProps: ['brown_jacket'],
      distractorProps: ['red_cap', 'sunglasses', 'flower_hairpin'],
      propsPool: [
        {
          id: 'blue_towel',
          name: '藍色毛巾',
          tip: '折疊包覆頭頂（模仿頭巾）',
          svg: 'assets/props/blue_towel.svg',
          slot: 'head',
          isKey: true
        },
        {
          id: 'yellow_cloth',
          name: '黃色布料',
          tip: '垂於頭巾後方（模仿披巾）',
          svg: 'assets/props/yellow_cloth.svg',
          slot: 'hair-accent',
          isKey: true
        },
        {
          id: 'pearl_earring',
          name: '珍珠造型耳環',
          tip: '戴在耳朵閃耀微光',
          svg: 'assets/props/pearl_earring.svg',
          slot: 'ear',
          isKey: true
        },
        {
          id: 'brown_jacket',
          name: '棕色大衣',
          tip: '大地色系溫暖披肩',
          svg: 'assets/props/brown_jacket.svg',
          slot: 'body',
          isKey: false,
          isBonus: true
        },
        {
          id: 'red_cap',
          name: '紅色帽子',
          tip: '現代運動棒球帽',
          svg: 'assets/props/red_cap.svg',
          slot: 'head',
          isKey: false
        },
        {
          id: 'sunglasses',
          name: '太陽眼鏡',
          tip: '酷炫黑色墨鏡',
          svg: 'assets/props/sunglasses.svg',
          slot: 'face',
          isKey: false
        },
        {
          id: 'flower_hairpin',
          name: '花朵髮飾',
          tip: '粉嫩櫻花造型髮夾',
          svg: 'assets/props/flower_hairpin.svg',
          slot: 'hair-accent',
          isKey: false
        }
      ],
      inspectGuide: {
        clothes: '少女頭上包覆著鮮明的藍色頭巾，後方垂下金黃色的披巾，身穿樸實的棕色披風外套。',
        pose: '身體微微側向左方，頭部轉向觀眾，眼睛專注地凝視前方，雙唇微張，帶著若有似無的微笑。',
        props: '左耳上戴著一顆巨大的水滴形珍珠耳環，在深暗背景中反射出亮麗高光。',
        composition: '極簡深黑的沉靜背景，烘托出藍黃對比的頭飾與珍珠光澤，人物端正位於中央偏前。',
        lifeTip: '家中的普通「藍色毛巾」摺一摺就能當頭巾，「黃色布料」垂在腦後，再加上「珍珠耳環」，就能完美神還原！'
      },
      clearPrompt: '太棒了！你用生活中的毛巾和飾品，成功模仿了經典名畫！',
      eduFocus: '學生能觀察到服裝配色、人物角度及背景對整體構圖的影響。'
    },
    {
      id: 'milkmaid',
      number: 2,
      title: '第二關：牛奶魔法師',
      paintingName: '《倒牛奶的女僕》',
      originalImg: 'assets/paintings/milkmaid.jpg',
      artistTag: '維梅爾 ． 約 1660 年',
      museum: '荷蘭阿姆斯特丹國家博物館館藏',
      chibiBaseImg: 'assets/characters/pose_milkmaid_target.svg',
      defaultBg: 'bg-milkmaid-room',
      bgOptions: [
        { id: 'bg-milkmaid-room', name: '古樸灰白牆與窗光 [★推薦]' },
        { id: 'bg-milkmaid-modern', name: '現代亮黃廚房' }
      ],
      targetPose: 'milkmaid_pour',
      poseOptions: [
        { id: 'milkmaid_pour', name: '站立雙手倒牛奶 [★推薦]', isTarget: true },
        { id: 'milkmaid_wave', name: '單手比讚打招呼', isTarget: false },
        { id: 'milkmaid_hips', name: '雙手叉腰站立', isTarget: false }
      ],
      targetExpr: 'milkmaid_focus',
      exprOptions: [
        { id: 'milkmaid_focus', name: '專注垂眸凝視 [★推薦]', isTarget: true },
        { id: 'milkmaid_smile', name: '大笑歡呼', isTarget: false },
        { id: 'milkmaid_confused', name: '疑惑抓頭', isTarget: false }
      ],
      targetComp: {
        posX: 65,
        scale: 95,
        bg: 'bg-milkmaid-room'
      },
      hasTable: true,
      keyProps: ['white_bonnet', 'blue_apron', 'milk_jug', 'bread_basket'],
      bonusProps: [],
      distractorProps: ['soccer_ball', 'toy_car', 'plush_bear'],
      propsPool: [
        {
          id: 'white_bonnet',
          name: '白色頭巾',
          tip: '折疊端莊的亞麻女僕帽',
          svg: 'assets/props/white_bonnet.svg',
          slot: 'head',
          isKey: true
        },
        {
          id: 'blue_apron',
          name: '藍色圍裙',
          tip: '工作必備的台夫特藍圍裙',
          svg: 'assets/props/blue_apron.svg',
          slot: 'body',
          isKey: true
        },
        {
          id: 'milk_jug',
          name: '水壺',
          tip: '陶土壺傾斜倒出香醇牛奶',
          svg: 'assets/props/milk_jug.svg',
          slot: 'hand',
          isKey: true
        },
        {
          id: 'bread_basket',
          name: '麵包',
          tip: '放置在桌上的藤編麵包籃',
          svg: 'assets/props/bread_basket.svg',
          slot: 'table',
          isKey: true
        },
        {
          id: 'soccer_ball',
          name: '足球',
          tip: '黑白相間的現代足球',
          svg: 'assets/props/soccer_ball.svg',
          slot: 'table',
          isKey: false
        },
        {
          id: 'toy_car',
          name: '玩具汽車',
          tip: '鮮紅色的迷你玩具跑車',
          svg: 'assets/props/toy_car.svg',
          slot: 'table',
          isKey: false
        },
        {
          id: 'plush_bear',
          name: '毛絨玩偶',
          tip: '可愛棕色小熊布偶',
          svg: 'assets/props/plush_bear.svg',
          slot: 'hand',
          isKey: false
        }
      ],
      inspectGuide: {
        clothes: '身穿鮮豔的黃色緊身上衣與長裙，腰間繫著經典的台夫特藍色圍裙，頭戴白色亞麻帽。',
        pose: '專注地站立在桌前，雙手端著陶罐，神情平靜而沉著，目光落在倒出的涓涓牛奶上。',
        props: '陶壺正倒出一道白色的細長牛奶，桌上有竹籃與碎麵包，形成生動的日常生活即景。',
        composition: '人物位於畫面中偏右，前景有一張擺放麵包與陶罐的木桌，左側窗戶灑入柔和光線。',
        lifeTip: '白色毛巾摺成頭巾、圍上藍色圍裙、拿起水壺做出倒水姿勢，桌上放顆麵包，就能重現經典！'
      },
      clearPrompt: '你成功還原倒牛奶的動作！原來物品的位置和前後關係，也會影響模仿的相似度！',
      eduFocus: '讓學生觀察動作、構圖、前景與背景的關係。'
    },
    {
      id: 'vangogh',
      number: 3,
      title: '第三關：畫家的神祕帽子',
      paintingName: '《戴灰氈帽的自畫像》',
      originalImg: 'assets/paintings/vangogh.jpg',
      artistTag: '梵谷 ． 1887 年',
      museum: '荷蘭阿姆斯特丹國家博物館館藏',
      chibiBaseImg: 'assets/characters/pose_vangogh_target.svg',
      defaultBg: 'bg-vangogh-swirl',
      bgOptions: [
        { id: 'bg-vangogh-swirl', name: '梵谷動感筆觸光環 [★推薦]' },
        { id: 'bg-vangogh-plain', name: '素色灰藍暗牆' }
      ],
      targetPose: 'vangogh_bust',
      poseOptions: [
        { id: 'vangogh_bust', name: '半身胸像微側凝視 [★推薦]', isTarget: true },
        { id: 'vangogh_side', name: '側面凝視遠方', isTarget: false },
        { id: 'vangogh_cross', name: '雙手抱胸嚴肅', isTarget: false }
      ],
      targetExpr: 'vangogh_pierce',
      exprOptions: [
        { id: 'vangogh_pierce', name: '沉穩深邃畫家眼神 [★推薦]', isTarget: true },
        { id: 'vangogh_happy', name: '開心露齒笑', isTarget: false },
        { id: 'vangogh_wink', name: '滑稽鬥雞眼', isTarget: false }
      ],
      targetComp: {
        posX: 50,
        scale: 105,
        bg: 'bg-vangogh-swirl'
      },
      hasTable: false,
      keyProps: ['grey_hat', 'blue_jacket', 'white_scarf'],
      bonusProps: ['palette'],
      distractorProps: ['red_baseball_cap', 'yellow_raincoat', 'sunglasses'],
      propsPool: [
        {
          id: 'grey_hat',
          name: '灰色帽子',
          tip: '帶有豐富筆觸質感的灰氈帽',
          svg: 'assets/props/grey_hat.svg',
          slot: 'head',
          isKey: true
        },
        {
          id: 'blue_jacket',
          name: '藍色外套',
          tip: '深邃群青色羊毛厚外套',
          svg: 'assets/props/blue_jacket.svg',
          slot: 'body',
          isKey: true
        },
        {
          id: 'white_scarf',
          name: '白色圍巾',
          tip: '塞入衣領內的整齊領巾',
          svg: 'assets/props/white_scarf.svg',
          slot: 'neck',
          isKey: true
        },
        {
          id: 'palette',
          name: '調色盤',
          tip: '五彩顏料與木質調色板',
          svg: 'assets/props/palette.svg',
          slot: 'hand',
          isKey: false,
          isBonus: true
        },
        {
          id: 'red_baseball_cap',
          name: '紅色棒球帽',
          tip: '街頭平沿棒球帽',
          svg: 'assets/props/red_baseball_cap.svg',
          slot: 'head',
          isKey: false
        },
        {
          id: 'yellow_raincoat',
          name: '黃色雨衣',
          tip: '連帽防雨風衣',
          svg: 'assets/props/yellow_raincoat.svg',
          slot: 'body',
          isKey: false
        },
        {
          id: 'sunglasses',
          name: '太陽眼鏡',
          tip: '現代墨鏡',
          svg: 'assets/props/sunglasses.svg',
          slot: 'face',
          isKey: false
        }
      ],
      inspectGuide: {
        clothes: '頭戴俐落的灰色毛氈軟帽，身穿深藍色厚外套，領口整齊地繫著白色圍巾。',
        pose: '經典的半身肖像角度，微側的臉部與緊鎖的眼神直接凝視觀賞者，帶有強烈而深邃的意志。',
        props: '灰色氈帽上有紅橙色與藍色短線條筆觸，象徵梵谷在巴黎時期探索點描與色彩節奏的突破。',
        composition: '人物上半身充滿畫面中央，頭部周圍以同心圓放射狀的藍綠筆觸環繞，產生如光芒般的動態感。',
        lifeTip: '家中的灰呢帽、藍色大衣與白圍巾，就能化身梵谷！別忘了眼神要專注深邃喔！'
      },
      clearPrompt: '畫家變裝成功！除了服裝與姿勢，色彩和筆觸也是名畫的重要特色！',
      eduFocus: '讓學生理解不同藝術風格的特色，以及模仿名畫不只有服裝，也包含色彩與構圖。'
    }
  ];

  // =========================================================================
  // 三、 遊戲核心控制器 (MasterpieceMakeoverGame)
  // =========================================================================

  class MasterpieceMakeoverGame {
    constructor() {
      this.sound = new SoundManager();
      this.currentLevelIndex = 0;

      // 玩家目前關卡狀態
      this.state = {
        equipped: {},
        pose: '',
        expression: '',
        posX: 50,
        scale: 100,
        bg: ''
      };

      // 玩家完成三關的評分成果快照
      this.levelResults = [];

      // 互動暫存
      this.selectedPropId = null;
      this.draggingProp = null;

      // DOM 元件快取
      this.cacheDom();
      this.bindEvents();
    }

    cacheDom() {
      this.screens = {
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen'),
        exhibition: document.getElementById('exhibition-screen')
      };

      this.modals = {
        inspect: document.getElementById('modal-inspect'),
        score: document.getElementById('modal-score')
      };

      this.hud = {
        levelBadge: document.getElementById('hud-level-badge'),
        paintingTitle: document.getElementById('hud-painting-title'),
        soundBtn: document.getElementById('btn-toggle-sound'),
        soundIcon: document.getElementById('sound-icon'),
        inspectBtn: document.getElementById('btn-inspect-painting')
      };

      this.instructionText = document.getElementById('instruction-text');
      this.paintingImg = document.getElementById('painting-img');
      this.paintingArtistTag = document.getElementById('painting-artist-tag');
      this.placardTitle = document.getElementById('placard-title');
      this.placardMuseum = document.getElementById('placard-museum');
      this.equippedCountTag = document.getElementById('equipped-count-tag');

      this.makeoverStage = document.getElementById('makeover-stage');
      this.stageBgLayer = document.getElementById('stage-bg-layer');
      this.characterActorGroup = document.getElementById('character-actor-group');
      this.chibiBaseImg = document.getElementById('chibi-base-img');
      this.foregroundTable = document.getElementById('stage-foreground-table');
      this.dragGhost = document.getElementById('drag-ghost');

      this.slots = {
        head: document.getElementById('slot-content-head'),
        'hair-accent': document.getElementById('slot-content-hair-accent'),
        ear: document.getElementById('slot-content-ear'),
        face: document.getElementById('slot-content-face'),
        body: document.getElementById('slot-content-body'),
        neck: document.getElementById('slot-content-neck'),
        hand: document.getElementById('slot-content-hand'),
        table: document.getElementById('slot-content-table')
      };

      this.propsShelf = document.getElementById('props-shelf');
      this.poseButtons = document.getElementById('pose-buttons');
      this.expressionButtons = document.getElementById('expression-buttons');
      this.sliderPosX = document.getElementById('slider-pos-x');
      this.posXVal = document.getElementById('pos-x-val');
      this.sliderScale = document.getElementById('slider-scale');
      this.scaleVal = document.getElementById('scale-val');
      this.bgButtons = document.getElementById('bg-buttons');
      this.bgNameVal = document.getElementById('bg-name-val');

      this.btnStartGame = document.getElementById('btn-start-game');
      this.btnQuickZoom = document.getElementById('btn-quick-zoom');
      this.btnResetStage = document.getElementById('btn-reset-stage');
      this.btnFinishMakeover = document.getElementById('btn-finish-makeover');
      this.btnCloseInspect = document.getElementById('btn-close-inspect');
      this.btnInspectGotIt = document.getElementById('btn-inspect-got-it');
      this.btnReadjust = document.getElementById('btn-readjust');
      this.btnNextLevel = document.getElementById('btn-next-level');
      this.btnDownloadCertificate = document.getElementById('btn-download-certificate');
      this.btnReplayGame = document.getElementById('btn-replay-game');
      this.btnBackHome = document.getElementById('btn-back-home');
      this.exportCanvas = document.getElementById('export-canvas');
    }

    bindEvents() {
      this.btnStartGame.addEventListener('click', () => {
        this.sound.playClick();
        this.startLevel(0);
      });

      this.hud.soundBtn.addEventListener('click', () => {
        const on = this.sound.toggle();
        this.hud.soundIcon.textContent = on ? '🔊' : '🔇';
        if (on) this.sound.playClick();
      });

      const openInspect = () => {
        this.sound.playClick();
        this.showInspectModal();
      };
      this.hud.inspectBtn.addEventListener('click', openInspect);
      this.btnQuickZoom.addEventListener('click', openInspect);

      const closeInspect = () => {
        this.sound.playClick();
        this.modals.inspect.classList.remove('active');
      };
      this.btnCloseInspect.addEventListener('click', closeInspect);
      this.btnInspectGotIt.addEventListener('click', closeInspect);

      const tabs = document.querySelectorAll('.dock-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          this.sound.playClick();
          tabs.forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

          tab.classList.add('active');
          const panelId = `tab-${tab.dataset.tab}`;
          const targetPanel = document.getElementById(panelId);
          if (targetPanel) targetPanel.classList.add('active');
        });
      });

      this.sliderPosX.addEventListener('input', (e) => {
        this.state.posX = parseInt(e.target.value, 10);
        this.applyComposition();
      });

      this.sliderScale.addEventListener('input', (e) => {
        this.state.scale = parseInt(e.target.value, 10);
        this.applyComposition();
      });

      this.btnResetStage.addEventListener('click', () => {
        this.sound.playClick();
        this.resetCurrentLevelState();
      });

      this.btnFinishMakeover.addEventListener('click', () => {
        this.sound.playScore();
        this.evaluateLevel();
      });

      this.btnReadjust.addEventListener('click', () => {
        this.sound.playClick();
        this.modals.score.classList.remove('active');
      });

      this.btnNextLevel.addEventListener('click', () => {
        this.sound.playClick();
        this.modals.score.classList.remove('active');
        if (this.currentLevelIndex < LEVELS_DATA.length - 1) {
          this.startLevel(this.currentLevelIndex + 1);
        } else {
          this.showExhibitionScreen();
        }
      });

      this.btnDownloadCertificate.addEventListener('click', () => {
        this.sound.playClick();
        this.exportCertificatePNG();
      });

      this.btnReplayGame.addEventListener('click', () => {
        this.sound.playClick();
        this.levelResults = [];
        this.startLevel(0);
      });

      this.btnBackHome.addEventListener('click', () => {
        this.sound.playClick();
        this.showScreen('start');
      });

      const slotDoms = document.querySelectorAll('.prop-slot');
      slotDoms.forEach(slotEl => {
        slotEl.addEventListener('click', (e) => {
          e.stopPropagation();
          const slotType = slotEl.dataset.slot;

          if (this.selectedPropId) {
            this.equipProp(this.selectedPropId, slotType);
            this.clearSelection();
          } else if (this.state.equipped[slotType]) {
            this.sound.playUnequip();
            this.unequipSlot(slotType);
          }
        });
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.prop-card') && !e.target.closest('.prop-slot')) {
          this.clearSelection();
        }
      });

      this.bindDragDropEvents();
    }

    bindDragDropEvents() {
      const onPointerMove = (e) => {
        if (!this.draggingProp) return;
        e.preventDefault();

        this.dragGhost.style.left = `${e.clientX}px`;
        this.dragGhost.style.top = `${e.clientY}px`;

        const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        const slotElem = elemBelow ? elemBelow.closest('.prop-slot') : null;

        document.querySelectorAll('.prop-slot').forEach(s => s.classList.remove('drag-over'));
        if (slotElem) {
          slotElem.classList.add('drag-over');
        }
      };

      const onPointerUp = (e) => {
        if (!this.draggingProp) return;

        this.dragGhost.style.display = 'none';
        this.dragGhost.innerHTML = '';

        const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        const slotElem = elemBelow ? elemBelow.closest('.prop-slot') : null;

        document.querySelectorAll('.prop-slot').forEach(s => s.classList.remove('drag-over'));

        if (slotElem) {
          const targetSlot = slotElem.dataset.slot;
          this.equipProp(this.draggingProp.id, targetSlot);
        } else {
          this.sound.playClick();
        }

        this.draggingProp = null;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      };

      this.startPropDrag = (prop, e) => {
        this.draggingProp = prop;
        this.sound.resume();

        this.dragGhost.innerHTML = `<img src="${prop.svg}" alt="${prop.name}">`;
        this.dragGhost.style.display = 'block';
        this.dragGhost.style.left = `${e.clientX}px`;
        this.dragGhost.style.top = `${e.clientY}px`;

        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
      };
    }

    showScreen(name) {
      Object.keys(this.screens).forEach(key => {
        this.screens[key].classList.toggle('active', key === name);
      });
    }

    startLevel(index) {
      this.currentLevelIndex = index;
      const level = LEVELS_DATA[index];

      this.state = {
        equipped: {},
        pose: level.targetPose,
        expression: level.targetExpr,
        posX: 50,
        scale: 100,
        bg: level.defaultBg
      };

      this.hud.levelBadge.textContent = `第 ${level.number}／3 關`;
      this.hud.paintingTitle.textContent = `${level.title} ． ${level.paintingName}`;

      this.paintingImg.src = level.originalImg;
      this.paintingArtistTag.textContent = level.artistTag;
      this.placardTitle.textContent = level.paintingName;
      this.placardMuseum.textContent = level.museum;

      this.chibiBaseImg.src = level.chibiBaseImg;
      this.foregroundTable.style.display = level.hasTable ? 'block' : 'none';

      this.renderPropsShelf();
      this.renderPoseControls();
      this.renderCompControls();
      this.applyComposition();
      this.updateEquippedDisplay();

      this.showScreen('game');
    }

    resetCurrentLevelState() {
      const level = LEVELS_DATA[this.currentLevelIndex];
      this.state.equipped = {};
      this.state.pose = level.targetPose;
      this.state.expression = level.targetExpr;
      this.state.posX = 50;
      this.state.scale = 100;
      this.state.bg = level.defaultBg;

      this.sliderPosX.value = 50;
      this.sliderScale.value = 100;

      this.renderPropsShelf();
      this.renderPoseControls();
      this.renderCompControls();
      this.applyComposition();
      this.updateEquippedDisplay();
    }

    equipProp(propId, targetSlot) {
      const level = LEVELS_DATA[this.currentLevelIndex];
      const prop = level.propsPool.find(p => p.id === propId);
      if (!prop) return;

      const slot = targetSlot || prop.slot;

      Object.keys(this.state.equipped).forEach(s => {
        if (this.state.equipped[s] === propId) {
          delete this.state.equipped[s];
        }
      });

      this.state.equipped[slot] = propId;
      this.sound.playSnap();
      this.updateEquippedDisplay();
      this.renderPropsShelf();
    }

    unequipSlot(slot) {
      if (this.state.equipped[slot]) {
        delete this.state.equipped[slot];
        this.updateEquippedDisplay();
        this.renderPropsShelf();
      }
    }

    clearSelection() {
      this.selectedPropId = null;
      document.querySelectorAll('.prop-card').forEach(c => c.classList.remove('selected'));
    }

    updateEquippedDisplay() {
      const level = LEVELS_DATA[this.currentLevelIndex];

      Object.keys(this.slots).forEach(slotKey => {
        const slotEl = this.slots[slotKey];
        const propId = this.state.equipped[slotKey];
        const parentSlot = slotEl.parentElement;

        if (propId) {
          const prop = level.propsPool.find(p => p.id === propId);
          slotEl.innerHTML = prop ? `<img src="${prop.svg}" alt="${prop.name}" title="點擊卸除 ${prop.name}">` : '';
          parentSlot.classList.add('occupied');
        } else {
          slotEl.innerHTML = '';
          parentSlot.classList.remove('occupied');
        }
      });

      const count = Object.keys(this.state.equipped).length;
      this.equippedCountTag.textContent = `已搭配 ${count} 個道具`;
    }

    renderPropsShelf() {
      const level = LEVELS_DATA[this.currentLevelIndex];
      this.propsShelf.innerHTML = '';

      level.propsPool.forEach(prop => {
        const isEquipped = Object.values(this.state.equipped).includes(prop.id);
        const card = document.createElement('div');
        card.className = `prop-card ${isEquipped ? 'equipped' : ''}`;
        card.dataset.propId = prop.id;

        card.innerHTML = `
          <div class="prop-card-icon">
            <img src="${prop.svg}" alt="${prop.name}">
          </div>
          <div class="prop-card-name">${prop.name}</div>
          <div class="prop-card-tip">${prop.tip}</div>
        `;

        card.addEventListener('pointerdown', (e) => {
          if (isEquipped) {
            const slotToUnequip = Object.keys(this.state.equipped).find(s => this.state.equipped[s] === prop.id);
            if (slotToUnequip) {
              this.sound.playUnequip();
              this.unequipSlot(slotToUnequip);
              return;
            }
          }
          this.startPropDrag(prop, e);
        });

        card.addEventListener('click', (e) => {
          e.stopPropagation();
          this.sound.playClick();
          if (this.selectedPropId === prop.id) {
            this.clearSelection();
          } else {
            this.clearSelection();
            this.selectedPropId = prop.id;
            card.classList.add('selected');
          }
        });

        card.addEventListener('dblclick', () => {
          this.equipProp(prop.id);
          this.clearSelection();
        });

        this.propsShelf.appendChild(card);
      });
    }

    renderPoseControls() {
      const level = LEVELS_DATA[this.currentLevelIndex];

      this.poseButtons.innerHTML = '';
      level.poseOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = `opt-btn ${this.state.pose === opt.id ? 'active' : ''}`;
        btn.textContent = opt.name;
        btn.addEventListener('click', () => {
          this.sound.playClick();
          this.state.pose = opt.id;
          this.renderPoseControls();
        });
        this.poseButtons.appendChild(btn);
      });

      this.expressionButtons.innerHTML = '';
      level.exprOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = `opt-btn ${this.state.expression === opt.id ? 'active' : ''}`;
        btn.textContent = opt.name;
        btn.addEventListener('click', () => {
          this.sound.playClick();
          this.state.expression = opt.id;
          this.renderPoseControls();
        });
        this.expressionButtons.appendChild(btn);
      });
    }

    renderCompControls() {
      const level = LEVELS_DATA[this.currentLevelIndex];

      this.bgButtons.innerHTML = '';
      level.bgOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = `opt-btn ${this.state.bg === opt.id ? 'active' : ''}`;
        btn.textContent = opt.name;
        btn.addEventListener('click', () => {
          this.sound.playClick();
          this.state.bg = opt.id;
          this.applyComposition();
          this.renderCompControls();
        });
        this.bgButtons.appendChild(btn);
      });
    }

    applyComposition() {
      const x = this.state.posX;
      const s = this.state.scale / 100;
      this.characterActorGroup.style.left = `${x}%`;
      this.characterActorGroup.style.transform = `translateX(-50%) scale(${s})`;

      this.posXVal.textContent = x === 50 ? '置中 (50%)' : x < 50 ? `偏左 (${x}%)` : `偏右 (${x}%)`;
      this.scaleVal.textContent = `${this.state.scale}% (${s >= 1.05 ? '特寫' : s <= 0.95 ? '遠景' : '標準'})`;

      const level = LEVELS_DATA[this.currentLevelIndex];
      this.stageBgLayer.className = `stage-bg-layer ${this.state.bg || level.defaultBg}`;
      const bgMatch = level.bgOptions.find(b => b.id === this.state.bg);
      this.bgNameVal.textContent = bgMatch ? bgMatch.name.replace('[★推薦]', '').trim() : '經典背景';
    }

    showInspectModal() {
      const level = LEVELS_DATA[this.currentLevelIndex];
      const g = level.inspectGuide;

      document.getElementById('inspect-painting-title').textContent = `${level.paintingName} 細節觀察`;
      document.getElementById('inspect-painting-meta').textContent = `${level.artistTag} ｜ ${level.museum}`;
      document.getElementById('inspect-img').src = level.originalImg;

      document.getElementById('guide-clothes').textContent = g.clothes;
      document.getElementById('guide-pose').textContent = g.pose;
      document.getElementById('guide-props').textContent = g.props;
      document.getElementById('guide-composition').textContent = g.composition;
      document.getElementById('guide-life-tip').textContent = g.lifeTip;

      this.modals.inspect.classList.add('active');
    }

    evaluateLevel() {
      const level = LEVELS_DATA[this.currentLevelIndex];
      const equippedProps = Object.values(this.state.equipped);

      // 1. 道具搭配 (滿分 40 分)
      let propsScore = 0;
      const keyCount = level.keyProps.length;
      const pointsPerKey = 40 / keyCount;

      level.keyProps.forEach(keyId => {
        if (equippedProps.includes(keyId)) {
          propsScore += pointsPerKey;
        }
      });

      let distractorCount = 0;
      level.distractorProps.forEach(dId => {
        if (equippedProps.includes(dId)) {
          distractorCount++;
          propsScore = Math.max(0, propsScore - 5);
        }
      });
      propsScore = Math.round(propsScore);

      // 2. 姿勢模仿 (滿分 30 分)
      let poseScore = 0;
      if (this.state.pose === level.targetPose) {
        poseScore += 25;
      } else {
        poseScore += 12;
      }
      if (this.state.expression === level.targetExpr) {
        poseScore += 5;
      } else {
        poseScore += 2;
      }

      // 3. 構圖還原 (滿分 20 分)
      let compScore = 0;
      const deltaX = Math.abs(this.state.posX - level.targetComp.posX);
      const deltaScale = Math.abs(this.state.scale - level.targetComp.scale);

      if (deltaX <= 8) compScore += 10;
      else if (deltaX <= 18) compScore += 6;
      else compScore += 3;

      if (deltaScale <= 10) compScore += 5;
      else compScore += 3;

      if (this.state.bg === level.targetComp.bg) compScore += 5;
      else compScore += 2;

      // 4. 創意運用 (滿分 10 分)
      let creativeScore = 6;
      if (level.bonusProps.some(b => equippedProps.includes(b))) {
        creativeScore += 4;
      } else if (propsScore >= 35) {
        creativeScore += 3;
      }
      creativeScore = Math.min(10, creativeScore);

      const totalScore = Math.min(100, propsScore + poseScore + compScore + creativeScore);

      let grade = '';
      if (totalScore >= 90) grade = '傳說級變裝大師！';
      else if (totalScore >= 70) grade = '超有創意的模仿高手！';
      else if (totalScore >= 50) grade = '很棒的藝術挑戰者！';
      else grade = '再觀察一下，作品會更接近喔！';

      let feedback = '';
      const missingKeys = level.keyProps.filter(k => !equippedProps.includes(k));

      if (missingKeys.length === 0 && distractorCount === 0 && this.state.pose === level.targetPose) {
        feedback = `神還原！${level.clearPrompt}`;
      } else if (missingKeys.length > 0) {
        const missingNames = missingKeys.map(k => {
          const p = level.propsPool.find(x => x.id === k);
          return p ? p.name : '';
        }).filter(Boolean).join('、');
        feedback = `整體造型很有模有樣！如果再加上關鍵的「${missingNames}」，作品會更神似原畫喔！`;
      } else if (distractorCount > 0) {
        feedback = `很有創意的搭配！不過原畫的時代好像還沒有現代玩具／足球喔，試著卸下干擾物品看看！`;
      } else if (this.state.pose !== level.targetPose) {
        const targetPoseObj = level.poseOptions.find(o => o.isTarget);
        feedback = `服裝搭配非常到位！如果將人物面向調整為「${targetPoseObj.name.replace('[★推薦]', '').trim()}」，神韻就完美了！`;
      } else {
        feedback = `非常棒的藝術嘗試！微調一下人物左右位置或縮放比例，構圖就會跟原畫一模一樣！`;
      }

      this.levelResults[this.currentLevelIndex] = {
        levelNumber: level.number,
        paintingName: level.paintingName,
        totalScore,
        propsScore,
        poseScore,
        compScore,
        creativeScore,
        grade,
        feedback,
        equipped: { ...this.state.equipped },
        pose: this.state.pose,
        expression: this.state.expression,
        posX: this.state.posX,
        scale: this.state.scale,
        bg: this.state.bg
      };

      this.showScoreModal(this.levelResults[this.currentLevelIndex]);
    }

    showScoreModal(result) {
      const level = LEVELS_DATA[this.currentLevelIndex];

      document.getElementById('score-rank-title').textContent = result.grade;
      document.getElementById('score-level-name').textContent = `${level.title} ． 成果評分`;
      document.getElementById('score-original-thumb').src = level.originalImg;

      const previewBox = document.getElementById('score-player-preview');
      previewBox.innerHTML = '';
      const cloneStage = this.createStageSnapshotClone();
      previewBox.appendChild(cloneStage);

      document.getElementById('score-val-props').textContent = `${result.propsScore} 分`;
      document.getElementById('bar-props').style.width = `${(result.propsScore / 40) * 100}%`;

      document.getElementById('score-val-pose').textContent = `${result.poseScore} 分`;
      document.getElementById('bar-pose').style.width = `${(result.poseScore / 30) * 100}%`;

      document.getElementById('score-val-comp').textContent = `${result.compScore} 分`;
      document.getElementById('bar-comp').style.width = `${(result.compScore / 20) * 100}%`;

      document.getElementById('score-val-creative').textContent = `${result.creativeScore} 分`;
      document.getElementById('bar-creative').style.width = `${(result.creativeScore / 10) * 100}%`;

      document.getElementById('score-total-val').textContent = `${result.totalScore} 分`;
      document.getElementById('feedback-detail-text').textContent = result.feedback;
      document.getElementById('education-summary-text').textContent = level.eduFocus;

      const isLast = this.currentLevelIndex >= LEVELS_DATA.length - 1;
      document.getElementById('next-level-btn-text').textContent = isLast ? '🏆 進入作品成果展！ ➔' : '前往下一關 ➔';

      this.modals.score.classList.add('active');
    }

    createStageSnapshotClone() {
      const wrapper = document.createElement('div');
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.position = 'relative';
      wrapper.style.overflow = 'hidden';
      wrapper.className = `makeover-stage ${this.state.bg || 'bg-pearl-dark'}`;

      const actor = document.createElement('div');
      actor.className = 'character-actor-group';
      actor.style.left = `${this.state.posX}%`;
      actor.style.transform = `translateX(-50%) scale(${this.state.scale / 100 * 0.55})`;
      actor.style.bottom = '0px';

      const level = LEVELS_DATA[this.currentLevelIndex];
      actor.innerHTML = `
        <div class="chibi-character-container">
          <img src="${level.chibiBaseImg}" class="chibi-body-img">
        </div>
      `;

      const slotsLayer = document.createElement('div');
      slotsLayer.className = 'slots-overlay';
      Object.keys(this.state.equipped).forEach(slotKey => {
        const propId = this.state.equipped[slotKey];
        const prop = level.propsPool.find(p => p.id === propId);
        if (prop) {
          const slotDiv = document.createElement('div');
          slotDiv.className = `prop-slot slot-${slotKey} occupied`;
          slotDiv.innerHTML = `<img src="${prop.svg}">`;
          slotsLayer.appendChild(slotDiv);
        }
      });
      actor.appendChild(slotsLayer);

      if (level.hasTable) {
        const table = document.createElement('div');
        table.className = 'stage-foreground-table';
        const tablePropId = this.state.equipped.table;
        const prop = level.propsPool.find(p => p.id === tablePropId);
        table.innerHTML = `
          <div class="rustic-table">
            ${prop ? `<div class="prop-slot slot-table occupied"><img src="${prop.svg}"></div>` : ''}
          </div>
        `;
        actor.appendChild(table);
      }

      wrapper.appendChild(actor);
      return wrapper;
    }

    showExhibitionScreen() {
      this.sound.playFanfare();
      this.showScreen('exhibition');

      let grandTotal = 0;

      [0, 1, 2].forEach(idx => {
        const res = this.levelResults[idx] || {
          totalScore: 80,
          grade: '超有創意的模仿高手！'
        };
        grandTotal += res.totalScore;

        const container = document.getElementById(`exhibit-work-${idx + 1}`);
        container.innerHTML = '';

        const level = LEVELS_DATA[idx];
        const preview = document.createElement('div');
        preview.className = `makeover-stage ${res.bg || level.defaultBg}`;
        preview.style.width = '100%';
        preview.style.height = '100%';
        preview.style.position = 'relative';

        const actor = document.createElement('div');
        actor.className = 'character-actor-group';
        actor.style.left = `${res.posX || 50}%`;
        actor.style.transform = `translateX(-50%) scale(${(res.scale || 100) / 100 * 0.58})`;
        actor.style.bottom = '5px';
        actor.innerHTML = `
          <div class="chibi-character-container">
            <img src="${level.chibiBaseImg}" class="chibi-body-img">
          </div>
        `;

        if (res.equipped) {
          const slotsLayer = document.createElement('div');
          slotsLayer.className = 'slots-overlay';
          Object.keys(res.equipped).forEach(slotKey => {
            const pId = res.equipped[slotKey];
            const pObj = level.propsPool.find(p => p.id === pId);
            if (pObj) {
              const s = document.createElement('div');
              s.className = `prop-slot slot-${slotKey} occupied`;
              s.innerHTML = `<img src="${pObj.svg}">`;
              slotsLayer.appendChild(s);
            }
          });
          actor.appendChild(slotsLayer);

          if (level.hasTable) {
            const table = document.createElement('div');
            table.className = 'stage-foreground-table';
            const tablePropId = res.equipped.table;
            const pObj = level.propsPool.find(p => p.id === tablePropId);
            table.innerHTML = `
              <div class="rustic-table">
                ${pObj ? `<div class="prop-slot slot-table occupied"><img src="${pObj.svg}"></div>` : ''}
              </div>
            `;
            actor.appendChild(table);
          }
        }

        preview.appendChild(actor);
        container.appendChild(preview);

        document.getElementById(`exhibit-score-${idx + 1}`).textContent = `得分：${res.totalScore} 分`;
        document.getElementById(`exhibit-grade-${idx + 1}`).textContent = res.grade;
      });

      document.getElementById('exhibit-total-score').textContent = `總得分：${grandTotal}／300 分`;
      let grandTitle = '';
      if (grandTotal >= 270) grandTitle = '🌟 羅浮宮特聘 ． 傳說級名畫變裝大師 🌟';
      else if (grandTotal >= 210) grandTitle = '✨ 靈活運用生活道具 ． 天才藝術策展人 ✨';
      else grandTitle = '🎨 潛力無窮 ． 觀察神探變裝助手 🎨';
      document.getElementById('exhibit-grand-title').textContent = grandTitle;
    }

    exportCertificatePNG() {
      const canvas = this.exportCanvas;
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;

      const wallGrad = ctx.createRadialGradient(W / 2, H * 0.35, 100, W / 2, H * 0.4, W * 0.7);
      wallGrad.addColorStop(0, '#3E2F23');
      wallGrad.addColorStop(1, '#1A130E');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#261C15';
      ctx.fillRect(0, H - 70, W, 70);
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(0, H - 72, W, 2);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 24px ' + getComputedStyle(document.body).fontFamily;
      ctx.fillText('🏆 名畫變裝工作室 ． 官方成果證書 🏆', W / 2, 60);

      ctx.fillStyle = '#FEF3C7';
      ctx.font = '900 52px ' + getComputedStyle(document.body).fontFamily;
      ctx.fillText('《名畫變裝大師》結業成果展', W / 2, 120);

      ctx.fillStyle = '#E2D5C8';
      ctx.font = '22px ' + getComputedStyle(document.body).fontFamily;
      ctx.fillText('仔細觀察、發揮創意，生活中的毛巾、帽子與水壺也能成就藝術經典！', W / 2, 170);

      const cardWidth = 480;
      const cardHeight = 600;
      const startX = (W - (cardWidth * 3 + 60 * 2)) / 2;
      const startY = 220;

      let grandTotal = 0;

      [0, 1, 2].forEach(i => {
        const res = this.levelResults[i] || { totalScore: 90, grade: '超有創意的模仿高手！' };
        grandTotal += res.totalScore;
        const level = LEVELS_DATA[i];
        const cx = startX + i * (cardWidth + 60);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(cx + 8, startY + 8, cardWidth, cardHeight);

        const goldFrame = ctx.createLinearGradient(cx, startY, cx + cardWidth, startY + cardHeight);
        goldFrame.addColorStop(0, '#F5D77F');
        goldFrame.addColorStop(0.5, '#B8860B');
        goldFrame.addColorStop(1, '#DAA520');
        ctx.fillStyle = goldFrame;
        ctx.fillRect(cx, startY, cardWidth, cardHeight);

        ctx.fillStyle = '#1C1510';
        ctx.fillRect(cx + 14, startY + 14, cardWidth - 28, cardHeight - 28);

        const innerImg = new Image();
        innerImg.src = level.originalImg;
        if (innerImg.complete && innerImg.naturalWidth) {
          ctx.drawImage(innerImg, cx + 24, startY + 24, cardWidth - 48, 420);
        } else {
          ctx.fillStyle = '#33271E';
          ctx.fillRect(cx + 24, startY + 24, cardWidth - 48, 420);
          ctx.fillStyle = '#FEF3C7';
          ctx.font = 'bold 28px ' + getComputedStyle(document.body).fontFamily;
          ctx.fillText(level.paintingName, cx + cardWidth / 2, startY + 230);
        }

        ctx.fillStyle = '#FAF6ED';
        ctx.fillRect(cx + 30, startY + 460, cardWidth - 60, 105);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + 30, startY + 460, cardWidth - 60, 105);

        ctx.fillStyle = '#2F241E';
        ctx.font = 'bold 22px ' + getComputedStyle(document.body).fontFamily;
        ctx.fillText(level.paintingName + ' 仿作', cx + cardWidth / 2, startY + 490);

        ctx.fillStyle = '#B45309';
        ctx.font = '900 24px ' + getComputedStyle(document.body).fontFamily;
        ctx.fillText(`得分：${res.totalScore} 分 ． ${res.grade}`, cx + cardWidth / 2, startY + 530);
      });

      let grandTitle = '';
      if (grandTotal >= 270) grandTitle = '🌟 羅浮宮特聘 ． 傳說級名畫變裝大師 🌟';
      else if (grandTotal >= 210) grandTitle = '✨ 靈活運用生活道具 ． 天才藝術策展人 ✨';
      else grandTitle = '🎨 潛力無窮 ． 觀察神探變裝助手 🎨';

      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 28px ' + getComputedStyle(document.body).fontFamily;
      ctx.fillText(`總得分：${grandTotal}／300 分 ｜ 榮譽稱號：${grandTitle}`, W / 2, H - 120);

      const today = new Date();
      const dateStr = `${today.getFullYear()} 年 ${today.getMonth() + 1} 月 ${today.getDate()} 日`;
      ctx.fillStyle = '#A89587';
      ctx.font = '18px ' + getComputedStyle(document.body).fontFamily;
      ctx.fillText(`名畫變裝工作室 榮譽認證 ｜ 頒發日期：${dateStr}`, W / 2, H - 85);

      try {
        const link = document.createElement('a');
        link.download = `名畫變裝大師-我的作品展_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('匯出海報失敗：', err);
        alert('海報圖卡已產生，但瀏覽器阻擋了自動下載，請長按或右鍵存檔。');
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new MasterpieceMakeoverGame();
  });

})();
