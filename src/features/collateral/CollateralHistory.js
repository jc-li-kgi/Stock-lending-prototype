// 擔保品匯入 / 取回紀錄（股票借貸明細 › 擔保品 › 歷史紀錄）
// Figma 尚無此頁（暫用版面）
import { html } from '../../lib/preact.js';
import { Tag, EmptyState } from '../../components/index.js';
import { stockOf } from '../../lib/calc.js';
import { date } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

export function CollateralHistory({ records = [] }) {
  const t = COPY.records;
  const lot = COPY.collateral.lotUnit;
  if (!records.length) return html`<${EmptyState} text=${t.emptyHistory} />`;

  return html`
    <div class="history-list">
      ${records.map(
        (r) => html`
          <div class="history-item">
            <div class="history-item__head">
              <span class="t-body-bold c-primary">${r.type}擔保品</span>
              <${Tag}>${r.status}<//>
            </div>
            <p class="n-body-regular c-secondary">${date(r.date)}</p>
            <p class="t-body-regular c-primary">${r.items.map((i) => `${stockOf(i.code).name} ${i.lots} ${lot}`).join('、')}</p>
          </div>
        `
      )}
    </div>
  `;
}
