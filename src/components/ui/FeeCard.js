// 費用卡（借款費用、還款費用…）｜Figma：每月投入金額（借款費用區塊）
// Guideline：標題→內容 12、詳情條列 20、流程申請卡片內距 24×24
import { html, useState } from '../../lib/preact.js';
import { DetailRow } from './DetailRow.js';
import { InfoSheet } from '../overlay/Sheet.js';

/**
 * <FeeCard
 *   title="借款費用"
 *   rows=${[
 *     { label: '參考利率', value: '2.8%' },
 *     { label: '借款手續費', value: 'TWD 2', info: { title: '借款手續費', body: '…' } },
 *   ]}
 *   note="費用僅供參考…"
 * />
 * row 有 info 時，標題旁會出現 ⓘ，點了開說明彈窗
 * full：滿版（貼齊畫面左右、無圓角）
 */
export function FeeCard({ title, rows, note, full = false }) {
  const [info, setInfo] = useState(null);

  return html`
    <section class=${'card fee-card' + (full ? ' card--full' : '')}>
      ${title && html`<p class="t-body-bold c-primary">${title}</p>`}
      <div class="fee-card__rows">
        ${rows.map(
          (r) => html`<${DetailRow} label=${r.label} value=${r.value} onInfo=${r.info && (() => setInfo(r.info))} />`
        )}
        ${note && html`<p class="t-body-regular c-secondary">${note}</p>`}
      </div>
      <${InfoSheet} info=${info} onClose=${() => setInfo(null)} />
    </section>
  `;
}
