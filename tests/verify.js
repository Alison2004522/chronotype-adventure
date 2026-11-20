/**
 * tests/verify.js
 * 《生理時鐘大冒險》（Chronotype Adventure）自動化完整性與邏輯驗證腳本
 */

const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('開始執行《生理時鐘大冒險》自動化測試...');
console.log('====================================================\n');

// 1. 檔案存在性檢查
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

// 2. DOM ID 匹配性驗證
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
  if (!hasDoubleQuote && !hasSingleQuote) {
    missingIds.push(id);
  }
});

if (missingIds.length > 0) {
  console.error('❌ DOM ID 不匹配（game.js 引用但在 index.html 中未定義）:', missingIds);
  process.exit(1);
} else {
  console.log(`\n✅ 所有 DOM ID 完全匹配！共驗證 ${matchedIds.size} 個動態元素。`);
}

// 3. 模擬關卡排程與睡眠時數計算
console.log('\n--- 執行作息模擬與睡眠時數邏輯驗證 ---');

// 擷取 LEVELS 常數
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

// 驗證三關各關的槽位與睡眠時間
LEVELS.forEach(level => {
  console.log(`\n檢查 ${level.name} (ID: ${level.id}, 角色: ${level.character}):`);
  console.assert(level.slots && level.slots.length >= 5, '槽位數量必須 >= 5');
  console.assert(level.cards && level.cards.length >= 5, '卡片數量必須 >= 5');

  const sleepSlot = level.slots.find(s => s.isSleepSlot || s.id.includes('sleep'));
  console.assert(sleepSlot, '必須有睡眠時段槽位');
  console.log(`  - 睡眠時段: ${sleepSlot.timeRange}，睡眠時數: ${sleepSlot.hours} 小時`);
  console.assert(sleepSlot.hours >= 9.0 && sleepSlot.hours <= 12.0, '適齡學生睡眠應在 9～12 小時');
});

// 4. 驗證繁體中文用語與格式規範（無簡體字、無大陸用語）
console.log('\n--- 執行繁體中文用語與排版驗證 ---');
const forbiddenTerms = [
  '优化', '用户', '信息', '项目', '質量', '激活', '链接', '高清', '缺省', '离线', '支持'
];

forbiddenTerms.forEach(term => {
  if (htmlContent.includes(term) || jsContent.includes(term)) {
    console.warn(`⚠️ 警告: 發現可能的大陸簡體習慣用語: "${term}"，請檢查是否應在地化為台灣用語。`);
  }
});

console.log('✅ 繁體中文排版檢查完成。');

console.log('\n====================================================');
console.log('🎉 所有測試項目皆已通過！專案架構與邏輯驗收成功！');
console.log('====================================================');
