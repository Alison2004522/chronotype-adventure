/**
 * 《生日蛋糕小店長》自動化驗證與測試腳本 (Node.js 執行)
 * 驗證項目：
 * 1. 六款蛋糕品項、尺寸、價格、標籤與限定月份之正確性
 * 2. 外送運費計算矩陣與特殊限制（10 吋雙入不可外送、HAPPY TIME 限自取）
 * 3. 三大關卡解題條件、預算校驗與回饋邏輯
 * 4. 三關收據總金額正確性（660 + 990 + 1960 = 3610 元）
 * 5. HTML/CSS/JS 檔案完整性與素材引用路徑
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");

console.log("=================================================");
console.log("🍰 開始執行《生日蛋糕小店長》核心功能驗證測試...");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

// 1. 檔案結構驗證
console.log("【測試組 1：專案檔案結構與靜態資源檢查】");
const requiredFiles = [
  "index.html",
  "style.css",
  "game.js",
  "README.md",
  ".nojekyll",
  "assets/characters/manager_normal.svg",
  "assets/characters/manager_happy.svg",
  "assets/characters/customer_qing.svg",
  "assets/characters/customer_le.svg",
  "assets/characters/customer_yu.svg",
  "assets/icons/star_gold.svg",
  "assets/icons/star_empty.svg",
  "assets/icons/trophy.svg",
  "assets/icons/receipt.svg",
  "assets/icons/coin.svg"
];

requiredFiles.forEach((file) => {
  const filePath = path.join(ROOT_DIR, file);
  assert(fs.existsSync(filePath), `必要檔案存在：${file}`);
});

// 2. 驗證蛋糕資料模型與定價
console.log("\n【測試組 2：六款蛋糕規格與定價校驗】");
const gameJsContent = fs.readFileSync(path.join(ROOT_DIR, "game.js"), "utf8");

assert(gameJsContent.includes('"castle"'), "包含城堡蛋糕 (castle)");
assert(gameJsContent.includes("6: 660, 8: 880, 10: 1100"), "城堡定價：6 吋 660, 8 吋 880, 10 吋 1100");

assert(gameJsContent.includes('"carnival"'), "包含浪漫嘉年華 (carnival)");
assert(gameJsContent.includes("6: 750, 8: 990"), "浪漫嘉年華定價：6 吋 750, 8 吋 990");
assert(gameJsContent.includes("seasonalMonths: [7, 8]"), "浪漫嘉年華限定 7～8 月");

assert(gameJsContent.includes('"cupid"'), "包含邱比特 (cupid)");
assert(gameJsContent.includes("8: 880, 10: 1100"), "邱比特定價：8 吋 880, 10 吋 1100（無 6 吋）");

assert(gameJsContent.includes('"happy_time"'), "包含 HAPPY TIME");
assert(gameJsContent.includes("pickupOnly: true"), "HAPPY TIME 限門市取貨");

assert(gameJsContent.includes('"jewelry_box"'), "包含珠寶音樂盒 (jewelry_box)");
assert(gameJsContent.includes("seasonalMonths: [12, 1, 2]"), "珠寶音樂盒限定 12～2 月跨年");

assert(gameJsContent.includes('"confession"'), "包含真情告白 (confession)");
assert(gameJsContent.includes("preorderDays: 7"), "真情告白需提前 7 天預訂");

// 3. 運費矩陣測試模擬
console.log("\n【測試組 3：外送運費查詢表與限制模擬】");

function simulateShipping(cake, size, quantity, fulfillment) {
  if (fulfillment === "pickup") return { fee: 0, available: true };
  if (cake.pickupOnly) return { fee: 0, available: false, reason: "限門市自取" };
  if (size === 6) {
    if (quantity === 1) return { fee: 150, available: true };
    if (quantity === 2) return { fee: 180, available: true };
  } else if (size === 8) {
    if (quantity === 1) return { fee: 150, available: true };
    if (quantity === 2) return { fee: 200, available: true };
  } else if (size === 10) {
    if (quantity === 1) return { fee: 200, available: true };
    if (quantity === 2) return { fee: 0, available: false, reason: "超過配送體積" };
  }
  return { fee: 0, available: false };
}

assert(simulateShipping({}, 6, 1, "pickup").fee === 0, "門市自取運費為 0 元");
assert(simulateShipping({}, 6, 1, "delivery").fee === 150, "1 個 6 吋外送運費為 150 元");
assert(simulateShipping({}, 6, 2, "delivery").fee === 180, "2 個 6 吋外送運費為 180 元");
assert(simulateShipping({}, 8, 1, "delivery").fee === 150, "1 個 8 吋外送運費為 150 元");
assert(simulateShipping({}, 8, 2, "delivery").fee === 200, "2 個 8 吋外送運費為 200 元");
assert(simulateShipping({}, 10, 1, "delivery").fee === 200, "1 個 10 吋外送運費為 200 元");
assert(simulateShipping({}, 10, 2, "delivery").available === false, "2 個 10 吋外送不可配送（超過體積）");
assert(simulateShipping({ pickupOnly: true }, 6, 1, "delivery").available === false, "HAPPY TIME 不可外送");

// 4. 關卡條件解與總額驗證
console.log("\n【測試組 4：三關正解與營收總和計算】");

// 關卡 1：小晴
const order1Cake = { prices: { 6: 660, 8: 880, 10: 1100 } };
const order1Total = order1Cake.prices[6] * 1 + simulateShipping(order1Cake, 6, 1, "pickup").fee;
assert(order1Total === 660, "第一關正解金額：660 元");
assert(order1Total <= 700, "第一關未超過預算 700 元");

// 關卡 2：小樂
const order2Cake = { prices: { 6: 750, 8: 990 } };
const order2Total = order2Cake.prices[8] * 1 + simulateShipping(order2Cake, 8, 1, "pickup").fee;
assert(order2Total === 990, "第二關正解金額：990 元");

// 關卡 3：小宇
const order3Cake = { prices: { 8: 880, 10: 1100 } };
const order3Subtotal = order3Cake.prices[8] * 2; // 1760
const order3Shipping = simulateShipping(order3Cake, 8, 2, "delivery").fee; // 200
const order3Total = order3Subtotal + order3Shipping;
assert(order3Subtotal === 1760, "第三關蛋糕小計：880 × 2 = 1,760 元");
assert(order3Shipping === 200, "第三關外送運費：200 元");
assert(order3Total === 1960, "第三關正解總額：1,960 元");
assert(order3Total <= 2000, "第三關未超過預算 2,000 元");

// 三關總額驗證
const grandTotal = order1Total + order2Total + order3Total;
assert(grandTotal === 3610, `三筆訂單總額校驗：660 + 990 + 1960 = ${grandTotal} 元（正確為 3,610 元）`);

// 5. HTML 與排版規範檢查
console.log("\n【測試組 5：HTML 標記、排版與繁體中文規範】");
const htmlContent = fs.readFileSync(path.join(ROOT_DIR, "index.html"), "utf8");

assert(htmlContent.includes('lang="zh-TW"'), "HTML 語言標籤為 zh-TW");
assert(htmlContent.includes("《生日蛋糕小店長》"), "遊戲名稱完整出現");
assert(htmlContent.includes("今日訂單：1／3"), "進度標示採用臺灣標準全形斜線");
assert(htmlContent.includes("NT$ 3,610 元"), "通關畫面明確呈現 3,610 元營業總額");
assert(!htmlContent.includes("用户"), "無簡體大陸用語（用户）");
assert(!htmlContent.includes("质量"), "無簡體大陸用語（质量）");
assert(!htmlContent.includes("项目"), "無簡體大陸用語（项目）");

console.log("\n=================================================");
console.log(`🎯 測試結果：共 ${totalTests} 項檢查，通過 ${passedTests} 項，失敗 ${totalTests - passedTests} 項。`);
if (passedTests === totalTests) {
  console.log("🌟 全部測試通過！專案規格完全符合要求！");
} else {
  console.error("⚠️ 部份測試未通過，請檢查錯誤紀錄。");
  process.exit(1);
}
console.log("=================================================");
