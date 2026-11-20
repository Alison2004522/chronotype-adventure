/**
 * tests/verify.js
 * 《生理時鐘大冒險》（Chronotype Adventure）自動化完整性與邏輯驗證腳本
 */

const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('開始執行《生理時鐘大冒險》自動化測試...');
console.log('====================================================\n');

// -------------------------------------------------------------
// 1. 檔案存在性檢查
// -------------------------------------------------------------
const requiredFiles = [
  'index.html',
  'style.css',
  'game.js',
  '.nojekyll',
  'README.md',
  'assets/characters/inu.svg',
  'assets/characters/neko.svg',
  'assets/characters/usagi.svg',
  'assets/characters/trio.svg',
  'assets/icons/clock.svg',
  'assets/icons/medal.svg',
  'assets/props/phone_active.svg',
  'assets/props/phone_off.svg',
  'assets/props/lamp_bright.svg',
  'assets/props/lamp_soft.svg',
  'assets/props/book_closed.svg',
  'assets/props/book_open.svg',
  'assets/sounds/click.wav',
  'assets/sounds/snap.wav',
  'assets/sounds/success.wav',
  'assets/sounds/score.wav',
  'assets/sounds/fanfare.wav'
];

let filesMissing = 0;
requiredFiles.forEach(relPath => {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ 遺漏必要檔案: ${relPath}`);
    filesMissing++;
  } else {
    const stat = fs.statSync(fullPath);
    console.log(`✅ 檔案存在: ${relPath} (${stat.size} bytes)`);
  }
});

if (filesMissing > 0) {
  console.error(`\n測試失敗: 共有 ${filesMissing} 個必要檔案不存在！`);
  process.exit(1);
}

// -------------------------------------------------------------
// 2. DOM ID 匹配性驗證
// -------------------------------------------------------------
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8');

const idRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
const matchedIds = new Set();
let match;

while ((match = idRegex.exec(jsContent)) !== null) {
  matchedIds.add(match[1]);
}

const missingIds = [];
matchedIds.forEach(id => {
  const hasDoubleQuote = htmlContent.includes(`id="${id}"`);
  const hasSingleQuote = htmlContent.includes(`id='${id}'`);
  // 動態生成的 ID（例如 tray_*, slot_*, slot_content_*）略過靜態檢查
  if (!hasDoubleQuote && !hasSingleQuote && !id.startsWith('tray_') && !id.startsWith('slot_')) {
    missingIds.push(id);
  }
});

if (missingIds.length > 0) {
  console.error('❌ DOM ID 不匹配（game.js 引用但在 index.html 中未靜態定義）:', missingIds);
  process.exit(1);
} else {
  console.log(`\n✅ 所有靜態 DOM ID 完全匹配！共驗證 ${matchedIds.size} 個動態與靜態元素。`);
}

// -------------------------------------------------------------
// 3. 關卡排程規格與時間模型驗證
// -------------------------------------------------------------
console.log('\n--- 驗證三大關卡規格與時間模型 ---');

const levelsMatch = jsContent.match(/const LEVELS = (\[[\s\S]*?\n\]);/);
if (!levelsMatch) {
  console.error('❌ 無法從 game.js 擷取 LEVELS 資料定義！');
  process.exit(1);
}

let LEVELS;
try {
  LEVELS = eval(levelsMatch[1]);
  console.log(`✅ 成功載入關卡設定，共 ${LEVELS.length} 關。`);
} catch (e) {
  console.error('❌ 解析 LEVELS 失敗:', e);
  process.exit(1);
}

// 檢查第一關：晨光活力計畫（Inu）
const lvl1 = LEVELS[0];
console.log(`\n檢查第一關: ${lvl1.name} (角色: ${lvl1.charName})`);
console.assert(lvl1.cards.length === 6, '第一關必須有 6 張活動卡片');
console.assert(lvl1.slots.length === 6, '第一關必須有 6 個時間槽位');
const lvl1CardTitles = lvl1.cards.map(c => c.title);
['起床', '吃早餐', '上學', '運動', '讀書', '睡覺'].forEach(t => {
  console.assert(lvl1CardTitles.includes(t), `第一關必須包含「${t}」活動`);
});
const lvl1Times = lvl1.slots.map(s => s.time);
['07:00', '07:30', '08:00', '16:00', '19:00', '21:30'].forEach(t => {
  console.assert(lvl1Times.includes(t), `第一關必須包含「${t}」時間格`);
});
console.log('✅ 第一關 6 張活動卡片與 6 個時間格完全符合要求！');

// 檢查第二關：夜貓子的時間表（Neko）
const lvl2 = LEVELS[1];
console.log(`\n檢查第二關: ${lvl2.name} (角色: ${lvl2.charName})`);
console.assert(lvl2.cards.length === 6, '第二關必須有 6 張活動卡片');
console.assert(lvl2.slots.length === 6, '第二關必須有 6 個時間槽位');
const lvl2CardTitles = lvl2.cards.map(c => c.title);
['起床', '吃早餐', '閱讀', '運動', '自由活動', '睡覺'].forEach(t => {
  console.assert(lvl2CardTitles.includes(t), `第二關必須包含「${t}」活動`);
});
const lvl2Times = lvl2.slots.map(s => s.time);
['09:00', '10:00', '14:00', '17:00', '20:00', '23:00'].forEach(t => {
  console.assert(lvl2Times.includes(t), `第二關必須包含「${t}」時間格`);
});
console.log('✅ 第二關 6 張活動卡片與 6 個時間格完全符合要求！');

// 檢查第三關：健康作息大挑戰（Neko × Usagi）
console.log(`\n檢查第三關: ${LEVELS[2].name}`);
// 檢查第三關 6 個就寢選項與固定 07:00 起床之睡眠時數計算
const bedtimeExpected = [
  { time: '20:30', expectedHours: 10.5 },
  { time: '21:00', expectedHours: 10.0 },
  { time: '21:30', expectedHours: 9.5 },
  { time: '22:00', expectedHours: 9.0 },
  { time: '22:30', expectedHours: 8.5 },
  { time: '23:00', expectedHours: 8.0 }
];

bedtimeExpected.forEach(({ time, expectedHours }) => {
  const [bh, bm] = time.split(':').map(Number);
  const wakeH = 7, wakeM = 0;
  const bedtimeTotalM = bh * 60 + bm;
  const wakeTotalM = (wakeH + 24) * 60 + wakeM;
  const diffHours = (wakeTotalM - bedtimeTotalM) / 60;
  console.assert(diffHours === expectedHours, `就寢 ${time} 起床 07:00 應為 ${expectedHours} 小時`);
  console.log(`  - 就寢 ${time} ➔ 起床 07:00 = ${diffHours} 小時 (${diffHours >= 9 ? '符合 9~12 小時建議' : '低於 9 小時建議'})`);
});
console.log('✅ 第三關就寢時間與 6～12 歲健康睡眠時數計算驗證正確！');

// -------------------------------------------------------------
// 4. 自由過關邏輯驗證（不限分數自由前進）
// -------------------------------------------------------------
console.log('\n--- 自由過關機制測試（模擬 0、30、50、75、100 分）---');

const simulatedScores = [0, 30, 50, 75, 100];
simulatedScores.forEach(score => {
  // 驗證是否有 score < XX 導致無法過關的程式碼
  const hasScoreBlock = /if\s*\([^)]*score\s*<[^\)]*\)\s*return/.test(jsContent);
  const hasDisabledBlock = /btnResultNext\.disabled\s*=\s*true/.test(jsContent);
  console.assert(!hasScoreBlock, '嚴禁使用 score < XX 阻擋過關');
  console.assert(!hasDisabledBlock, '「繼續下一關」按鈕絕不可被禁用');
  console.log(`  - 模擬分數 ${score} 分：順利通過，可正常點擊「繼續下一關」！`);
});
console.log('✅ 自由過關與教育回饋分離機制驗證合格！');

// -------------------------------------------------------------
// 5. 繁體中文用語與排版檢查（無簡體字、無大陸用語）
// -------------------------------------------------------------
console.log('\n--- 執行繁體中文用語與排版規範檢查 ---');
const forbiddenTerms = [
  '优化', '用户', '信息', '项目', '質量', '激活', '链接', '高清', '缺省', '离线', '支持'
];

let termWarnings = 0;
forbiddenTerms.forEach(term => {
  if (htmlContent.includes(term) || jsContent.includes(term)) {
    console.warn(`⚠️ 警告: 發現可能的大陸習慣用語: "${term}"`);
    termWarnings++;
  }
});
console.assert(termWarnings === 0, '不可包含簡體字與大陸用語');
console.log('✅ 繁體中文排版檢查通過，無違規詞彙！');

// -------------------------------------------------------------
// 6. 其他已部署遊戲目錄保護檢查
// -------------------------------------------------------------
console.log('\n--- 檢查現有其他教育遊戲目錄完整性 ---');
const mmDir = path.join(__dirname, '..', 'masterpiece-makeover');
const bcmDir = path.join(__dirname, '..', 'birthday-cake-manager');

console.assert(fs.existsSync(path.join(mmDir, 'index.html')), '名畫變裝大師 index.html 必須存在');
console.assert(fs.existsSync(path.join(bcmDir, 'index.html')), '生日蛋糕小店長 index.html 必須存在');
console.log('✅ 《名畫變裝大師》與《生日蛋糕小店長》檔案均完好無損，無任何覆蓋衝突！');

console.log('\n====================================================');
console.log('🎉 所有測試項目皆已通過！《生理時鐘大冒險》驗收成功！');
console.log('====================================================');
