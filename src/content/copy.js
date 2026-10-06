// 所有文案集中管理：改字只改這裡
export const COPY = {
  common: {
    notAvailable: '此功能未開放於本次測試',
    next: '下一步',
    confirm: '確認',
    done: '完成',
  },

  account: {
    title: '帳務',
    productTabs: ['總覽', '台股', '海外', '財富管理', '期權', '外期權', '授信管理'],
    creditTabs: ['股票借貸', '雙向借券', '融資融券'],
    updatedAt: '更新時間',
  },

  hub: {
    ratio: '整戶維持率',
    collateralValue: '擔保品市值',
    borrowed: '已借款金額',
    remaining: '剩餘可借額度',
    raiseLimit: '提升可借總額',
    borrowAgain: '再借一筆',
    moreServices: '更多服務',
    goZone: '前往專區',
    services: ['查看借還款紀錄', '管理擔保品', '查看對帳單'],
  },

  loan: {
    title: '申請借款',
    ratio: '整戶維持率',
    remaining: '剩餘可借金額',
    borrowed: '已借款金額',
    purpose: '借款目的',
    purposePlaceholder: '請選擇',
    purposeError: '請選擇借款目的',
    amount: '借款金額',
    limitLink: '額度限制',
    rangeHint: (min, max) => `可借款金額 TWD ${min}～TWD ${max}`,
    stepHint: (step) => `累加金額 TWD ${step}`,
    ratioAfter: '借款後整戶維持率',
    feeTitle: '借款費用',
    refRate: '參考利率',
    halfYearInterest: '半年利息',
    estInterest: '預估利息',
    fee: '借款手續費',
    feeNote: '費用僅供參考，實際收費依還款當下計算為準',
    currency: '臺幣',
    startDate: '起息日',
    dueDate: '到期日',
    applyDate: '申請日',
    payout: '款項匯入帳號',

    // 說明彈窗
    limitSheet: {
      title: '額度限制',
      body: '單筆借款最低 TWD 10,000，最高不超過剩餘可借金額，且單筆上限 TWD 1,000,000，金額須以 TWD 1,000 為單位。',
    },
    ratioSheet: {
      title: '借款後整戶維持率',
      body: '整戶維持率 = 擔保品市值 ÷ 借款總額 × 100%。維持率低於 130% 時，需補繳擔保品或還款。',
    },
    feeSheet: {
      title: '借款手續費',
      body: '每筆借款於撥款時收取手續費 TWD 2。',
    },

    resultTitle: '成功送出申請',
    resultDesc: '我們將在 1 小時內完成撥款，敬請留意款項是否已匯入您的帳戶',
    viewRecords: '查看借款紀錄',
  },

  records: {
    title: '借還款紀錄',
    empty: '目前沒有借款紀錄',
  },
};
