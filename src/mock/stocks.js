// 假股價與擔保規則：所有情境共用
//   price    收盤價（每股）；1 張 = 1,000 股
//   ratio    可借貸成數（可借貸股票一律 60%：用戶最多可借市值的 60%，初始維持率 166%）
//   type     eligible  可借貸
//            ratioOnly 僅可用於提升維持率（無法借款）
//            ineligible 無法作為擔保品（reason 為原因）
export const LOT_SIZE = 1000;

// 全站標的；資料來源：專案根目錄「產品資料.md」，更新時兩邊一起改
export const STOCKS = {
  '0050': { name: '元大台灣50', price: 106.9, ratio: 0.6, type: 'eligible' },
  '0056': { name: '元大高股息', price: 56.3, ratio: 0.6, type: 'eligible' },
  '00915': { name: '凱基優選高股息30', price: 24, ratio: 0.6, type: 'eligible' }, // 收盤價待確認
  '009816': { name: '凱基台灣TOP50', price: 15.93, ratio: 0.6, type: 'eligible' },
  '2883': { name: '凱基金', price: 37.75, ratio: 0.6, type: 'eligible' },
  '2882': { name: '國泰金', price: 60, ratio: 0, type: 'ratioOnly' },                              // 收盤價待確認
  '3481': { name: '群創', price: 18, ratio: 0, type: 'ineligible', reason: '目前被列為處置股' },        // 收盤價待確認

  // 試算用：不在任何任務的庫存裡，只會出現在「可借貸額度試算」的選股清單（收盤價待確認）
  '2330': { name: '台積電', price: 1080, ratio: 0.6, type: 'eligible' },
  '2317': { name: '鴻海', price: 220, ratio: 0.6, type: 'eligible' },
  '2454': { name: '聯發科', price: 1350, ratio: 0.6, type: 'eligible' },
  '2412': { name: '中華電', price: 130, ratio: 0.6, type: 'eligible' },
  '2881': { name: '富邦金', price: 90, ratio: 0.6, type: 'eligible' },
  '006208': { name: '富邦台50', price: 120, ratio: 0.6, type: 'eligible' },
  '00878': { name: '國泰永續高股息', price: 22, ratio: 0.6, type: 'eligible' },
};
