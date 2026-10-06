// 費用卡（借款費用、還款費用…）｜Figma：每月投入金額（借款費用區塊）
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
 */
export function FeeCard({ title, rows, note }) {
  const [info, setInfo] = useState(null);

  return html`
    <section class="card fee-card">
      ${title && html`<p class="t-body-b c-primary">${title}</p>`}
      ${rows.map(
        (r) => html`<${DetailRow} label=${r.label} value=${r.value} onInfo=${r.info && (() => setInfo(r.info))} />`
      )}
      ${note && html`<p class="t-body c-secondary">${note}</p>`}
      <${InfoSheet} info=${info} onClose=${() => setInfo(null)} />
    </section>
  `;
}
