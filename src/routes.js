// 路由表：網址 → 頁面
import { AccountShell } from './shells/AccountShell.js';
import { LoanAmount } from './features/loan/LoanAmount.js';
import { LoanConfirm } from './features/loan/LoanConfirm.js';
import { LoanResult } from './features/loan/LoanResult.js';
import { LoanRecords } from './features/records/LoanRecords.js';
import { TaskStart } from './pages/TaskStart.js';
import { Moderator } from './pages/Moderator.js';

export const ROUTES = {
  '/start': TaskStart,
  '/moderator': Moderator,

  // 入口
  '/account': AccountShell,

  // 借款
  '/loan/amount': LoanAmount,
  '/loan/confirm': LoanConfirm,
  '/loan/result': LoanResult,

  // 紀錄
  '/records/loans': LoanRecords,
};

// 不需要情境資料就能開的頁面
export const PUBLIC_ROUTES = ['/start', '/moderator'];
