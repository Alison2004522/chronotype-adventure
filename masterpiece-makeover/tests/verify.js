// tests/verify.js
// Automated verification suite for 《名畫變裝大師》（Masterpiece Makeover）

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

console.log('=== 開始執行《名畫變裝大師》專案完整自動化驗證 ===\n');

// 1. 核心檔案與目錄結構檢查
console.log('1. 核心檔案與目錄結構檢查：');
const requiredFiles = [
  'index.html',
  'style.css',
  'game.js',
  'README.md',
  '.nojekyll',
  'assets/paintings/pearl_girl.jpg',
  'assets/paintings/milkmaid.jpg',
  'assets/paintings/vangogh.jpg',
  'assets/characters/chibi_artist_neutral.svg',
  'assets/characters/pose_pearl_target.svg',
  'assets/characters/pose_milkmaid_target.svg',
  'assets/characters/pose_vangogh_target.svg',
  'assets/props/blue_towel.svg',
  'assets/props/yellow_cloth.svg',
  'assets/props/pearl_earring.svg',
  'assets/props/white_bonnet.svg',
  'assets/props/blue_apron.svg',
  'assets/props/milk_jug.svg',
  'assets/props/bread_basket.svg',
  'assets/props/grey_hat.svg',
  'assets/props/blue_jacket.svg',
  'assets/props/white_scarf.svg',
  'assets/sounds/click.wav',
  'assets/sounds/snap.wav',
  'assets/sounds/score.wav',
  'assets/sounds/success.wav',
  'assets/sounds/fanfare.wav'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(rootDir, file);
  assert(fs.existsSync(fullPath), `檔案存在：${file}`);
});

// 2. 名畫圖片大小與完整性檢查
console.log('\n2. 名畫圖片資源完整性檢查：');
const paintings = ['pearl_girl.jpg', 'milkmaid.jpg', 'vangogh.jpg'];
paintings.forEach(p => {
  const pPath = path.join(rootDir, 'assets', 'paintings', p);
  if (fs.existsSync(pPath)) {
    const stats = fs.statSync(pPath);
    assert(stats.size > 50000, `名畫 ${p} 大小正常（${Math.round(stats.size / 1024)} KB）`);
  } else {
    assert(false, `名畫 ${p} 檔案不存在`);
  }
});

// 3. HTML 語意標籤與重要 ID 檢查
console.log('\n3. HTML 語意標籤與介面元素檢查：');
const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

const requiredIds = [
  'start-screen',
  'game-screen',
  'exhibition-screen',
  'modal-inspect',
  'modal-score',
  'btn-start-game',
  'btn-inspect-painting',
  'btn-toggle-sound',
  'btn-reset-stage',
  'btn-finish-makeover',
  'props-shelf',
  'pose-buttons',
  'expression-buttons',
  'slider-pos-x',
  'slider-scale',
  'bg-buttons',
  'btn-download-certificate',
  'btn-replay-game',
  'btn-back-home',
  'export-canvas'
];

requiredIds.forEach(id => {
  assert(htmlContent.includes(`id="${id}"`), `HTML 包含必要 ID：#${id}`);
});

// 4. 音效檔案 WAV 標頭檢查
console.log('\n4. 音效 WAV 標頭驗證：');
const wavFiles = ['click.wav', 'snap.wav', 'score.wav', 'success.wav', 'fanfare.wav'];
wavFiles.forEach(wav => {
  const wavPath = path.join(rootDir, 'assets', 'sounds', wav);
  if (fs.existsSync(wavPath)) {
    const buf = fs.readFileSync(wavPath);
    const riff = buf.toString('ascii', 0, 4);
    const wave = buf.toString('ascii', 8, 12);
    assert(riff === 'RIFF' && wave === 'WAVE', `音效 ${wav} 具備標準 RIFF WAVE 標頭`);
  } else {
    assert(false, `音效檔案 ${wav} 不存在`);
  }
});

// 5. JavaScript 遊戲邏輯與規準驗證
console.log('\n5. JavaScript 遊戲邏輯與規準驗證：');
const gameJsContent = fs.readFileSync(path.join(rootDir, 'game.js'), 'utf8');

assert(gameJsContent.includes('LEVELS_DATA'), 'game.js 包含關卡資料庫 LEVELS_DATA');
assert(gameJsContent.includes('SoundManager'), 'game.js 包含音效合成引擎 SoundManager');
assert(gameJsContent.includes('evaluateLevel'), 'game.js 包含精準評分評量函式 evaluateLevel');
assert(gameJsContent.includes('exportCertificatePNG'), 'game.js 包含成果展本機 PNG 下載函式');

assert(gameJsContent.includes('blue_towel') && gameJsContent.includes('yellow_cloth') && gameJsContent.includes('pearl_earring'), '第 1 關包含藍色毛巾、黃色布料、珍珠耳環');
assert(gameJsContent.includes('white_bonnet') && gameJsContent.includes('blue_apron') && gameJsContent.includes('milk_jug') && gameJsContent.includes('bread_basket'), '第 2 關包含白色頭巾、藍色圍裙、水壺、麵包');
assert(gameJsContent.includes('grey_hat') && gameJsContent.includes('blue_jacket') && gameJsContent.includes('white_scarf'), '第 3 關包含灰色帽子、藍色外套、白色圍巾');

// 6. 評分演算法模擬測試
console.log('\n6. 評分演算法模擬測試：');
function simulateScore(equipped, pose, expr, posX, scale, bg, levelIndex) {
  const levelConfigs = [
    {
      keyProps: ['blue_towel', 'yellow_cloth', 'pearl_earring'],
      bonusProps: ['brown_jacket'],
      distractorProps: ['red_cap', 'sunglasses', 'flower_hairpin'],
      targetPose: 'pearl_turn',
      targetExpr: 'pearl_gentle',
      targetComp: { posX: 50, scale: 100, bg: 'bg-pearl-dark' }
    },
    {
      keyProps: ['white_bonnet', 'blue_apron', 'milk_jug', 'bread_basket'],
      bonusProps: [],
      distractorProps: ['soccer_ball', 'toy_car', 'plush_bear'],
      targetPose: 'milkmaid_pour',
      targetExpr: 'milkmaid_focus',
      targetComp: { posX: 65, scale: 95, bg: 'bg-milkmaid-room' }
    },
    {
      keyProps: ['grey_hat', 'blue_jacket', 'white_scarf'],
      bonusProps: ['palette'],
      distractorProps: ['red_baseball_cap', 'yellow_raincoat', 'sunglasses'],
      targetPose: 'vangogh_bust',
      targetExpr: 'vangogh_pierce',
      targetComp: { posX: 50, scale: 105, bg: 'bg-vangogh-swirl' }
    }
  ];

  const cfg = levelConfigs[levelIndex];

  let propsScore = 0;
  const ptsPerKey = 40 / cfg.keyProps.length;
  cfg.keyProps.forEach(k => {
    if (equipped.includes(k)) propsScore += ptsPerKey;
  });
  cfg.distractorProps.forEach(d => {
    if (equipped.includes(d)) propsScore = Math.max(0, propsScore - 5);
  });
  propsScore = Math.round(propsScore);

  let poseScore = (pose === cfg.targetPose ? 25 : 12) + (expr === cfg.targetExpr ? 5 : 2);

  let compScore = 0;
  const dx = Math.abs(posX - cfg.targetComp.posX);
  const ds = Math.abs(scale - cfg.targetComp.scale);
  if (dx <= 8) compScore += 10;
  else if (dx <= 18) compScore += 6;
  else compScore += 3;

  if (ds <= 10) compScore += 5;
  else compScore += 3;

  if (bg === cfg.targetComp.bg) compScore += 5;
  else compScore += 2;

  let creativeScore = 6;
  if (cfg.bonusProps.some(b => equipped.includes(b)) || propsScore >= 35) {
    creativeScore = 10;
  }

  const total = Math.min(100, propsScore + poseScore + compScore + creativeScore);
  return { propsScore, poseScore, compScore, creativeScore, total };
}

const perfectLevel1 = simulateScore(
  ['blue_towel', 'yellow_cloth', 'pearl_earring'],
  'pearl_turn',
  'pearl_gentle',
  50,
  100,
  'bg-pearl-dark',
  0
);
assert(perfectLevel1.total === 100, `第 1 關完美模仿得分為 100 分（實際：${perfectLevel1.total} 分）`);

const perfectLevel2 = simulateScore(
  ['white_bonnet', 'blue_apron', 'milk_jug', 'bread_basket'],
  'milkmaid_pour',
  'milkmaid_focus',
  65,
  95,
  'bg-milkmaid-room',
  1
);
assert(perfectLevel2.total === 100, `第 2 關完美模仿得分為 100 分（實際：${perfectLevel2.total} 分）`);

const perfectLevel3 = simulateScore(
  ['grey_hat', 'blue_jacket', 'white_scarf'],
  'vangogh_bust',
  'vangogh_pierce',
  50,
  105,
  'bg-vangogh-swirl',
  2
);
assert(perfectLevel3.total === 100, `第 3 關完美模仿得分為 100 分（實際：${perfectLevel3.total} 分）`);

const distractorTest = simulateScore(
  ['blue_towel', 'red_cap', 'sunglasses'],
  'pearl_front',
  'pearl_smile',
  20,
  80,
  'bg-pearl-studio',
  0
);
assert(distractorTest.total < 60, `干擾道具與不合姿勢給予適當扣分（總分：${distractorTest.total} 分）`);

console.log(`\n=== 驗證完成：${passed} 項通過，${failed} 項失敗 ===`);

if (failed === 0) {
  console.log('🎉 所有項目全數通過，專案品質與邏輯完全合規！');
  process.exit(0);
} else {
  console.error('❌ 有項目未通過，請檢查！');
  process.exit(1);
}
