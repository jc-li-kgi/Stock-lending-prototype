// 顯示格式
export const num = (n) => Number(n).toLocaleString('en-US');

export const twd = (n) => `TWD ${num(n)}`;

export const pct = (n) => (n == null ? '--' : `${num(n)} %`);

export const rate = (r) => `${+(r * 100).toFixed(2)} %`;

/** 2025-12-28 → 2025/12/28 */
export const date = (iso) => iso.replaceAll('-', '/');

export function dateTime(d = new Date()) {
  const p = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
