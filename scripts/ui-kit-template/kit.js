// ui-kit 設定：元件需要的文字、Toast、換頁、金額規則
// 新專案依需要修改這個檔案就好，元件本身不用改
import { useReducer, useEffect } from './lib/preact.js';

/* ---------- 元件預設文字 ---------- */
export const COPY = {
  common: {
    notAvailable: '此功能未開放於本次測試', // 未實作的按鈕（底部導覽、頁首分享）
    gotIt: '我知道了',                      // Dialog 預設按鈕
    expand: '展開明細',                     // ExpandButton
    collapse: '收闔明細',
  },
};

/* ---------- Toast：showToast('訊息') 顯示 1.8 秒；頁面要放一個 <Toast /> ---------- */
let toast = null;
let timer;
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());

export function showToast(message) {
  clearTimeout(timer);
  toast = message;
  emit();
  timer = setTimeout(() => {
    toast = null;
    emit();
  }, 1800);
}

/** 給 <Toast /> 讀目前訊息用 */
export function useStore(selector) {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    listeners.add(force);
    return () => listeners.delete(force);
  }, []);
  return selector({ toast });
}

/* ---------- 換頁：預設用網址 hash（#/path）；新專案有自己的路由就改這裡 ---------- */
export function navigate(path, { replace = false } = {}) {
  if (replace) location.replace('#' + path);
  else location.hash = path;
}

/* ---------- 金額輸入（AmountField）：依級距取整並限制在範圍內 ---------- */
export function clampAmount(value, range) {
  const n = Number(value) || 0;
  const stepped = Math.round(n / range.step) * range.step;
  return Math.min(range.max, Math.max(range.min, stepped));
}
