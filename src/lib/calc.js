// 所有計算公式集中在這裡（借款、試算共用）
import { STOCKS } from '../mock/stocks.js';

/* 借款規則：調整利率、上下限只改這裡 */
export const LOAN_RULES = {
  min: 10000,          // 單筆最低
  step: 1000,          // 累加金額
  singleMax: 1000000,  // 單筆上限
  rate: 0.028,         // 參考年利率
  fee: 2,              // 借款手續費（每筆）
  termMonths: 6,       // 借款期間
};

/* 借款目的選項 */
export const LOAN_PURPOSES = ['資金周轉', '投資理財', '個人消費', '其他'];

/* ---------- 擔保品 ---------- */

function stockOf(code) {
  return STOCKS[code] || { price: 0, ratio: 0, name: code };
}

/** 擔保品市值 */
export function collateralValue(account) {
  return account.collateral.reduce((sum, c) => sum + c.qty * stockOf(c.code).price, 0);
}

/** 可借總額 = Σ 市值 × 成數 */
export function creditLimit(account) {
  return Math.floor(
    account.collateral.reduce((sum, c) => sum + c.qty * stockOf(c.code).price * stockOf(c.code).ratio, 0)
  );
}

/* ---------- 借款 ---------- */

/** 已借款金額（未還餘額） */
export function loanBalance(account) {
  return account.loans.reduce((sum, l) => sum + l.balance, 0);
}

/** 剩餘可借額度（以累加金額為單位無條件捨去） */
export function remainingCredit(account) {
  const raw = Math.max(0, creditLimit(account) - loanBalance(account));
  return Math.floor(raw / LOAN_RULES.step) * LOAN_RULES.step;
}

/** 整戶維持率（%），沒有借款時回傳 null */
export function maintenanceRatio(account, extraLoan = 0) {
  const balance = loanBalance(account) + extraLoan;
  if (balance <= 0) return null;
  return Math.floor((collateralValue(account) / balance) * 100);
}

/** 本次可借範圍 */
export function loanRange(account) {
  return {
    min: LOAN_RULES.min,
    max: Math.min(LOAN_RULES.singleMax, remainingCredit(account)),
    step: LOAN_RULES.step,
  };
}

/** 把輸入金額修正到合法範圍與級距 */
export function clampAmount(value, range) {
  const n = Number(value) || 0;
  const stepped = Math.round(n / range.step) * range.step;
  return Math.min(range.max, Math.max(range.min, stepped));
}

/** 借款期間利息（預設半年） */
export function interestFor(amount, months = LOAN_RULES.termMonths) {
  return Math.round((amount * LOAN_RULES.rate * months) / 12);
}

/* ---------- 日期 ---------- */

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function addMonths(isoDate, months) {
  const d = new Date(isoDate);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}
