// 任務 T2：已開戶，從「帳務 → 授信管理」再借一筆
export default {
  id: 'T2',
  title: '舊戶再借一筆',
  instruction: '你已經有股票借貸帳戶，想再借 5 萬元做資金周轉，請完成借款申請。',
  entry: 'account',          // 'account' = 帳務→授信管理；'lendingZone' = 股票借貸專區
  startPath: '/account',

  account: {
    opened: true,
    id: '9999-999999',
    name: '流川楓',
    payoutBank: { name: '凱基銀行', number: '12122323232' },

    // 擔保品：code 對應 mock/stocks.js
    collateral: [
      { code: '2330', qty: 2000 },
      { code: '0050', qty: 5000 },
    ],

    // 既有借款
    loans: [
      {
        id: 'L000123',
        amount: 1000000,
        balance: 1000000,
        purpose: '資金周轉',
        rate: 0.028,
        applyDate: '2026-05-12',
        startDate: '2026-05-12',
        dueDate: '2026-11-12',
        status: '借款中',
      },
    ],
    repayments: [],
  },
};
