// 已擔保的股票列表（股票借貸明細 › 擔保品 › 已擔保）
// Figma 尚無此頁，沿用「尚可匯入擔保品」列表版型（暫用）
import { html } from '../../lib/preact.js';
import { stockOf, perLotLoan } from '../../lib/calc.js';
import { num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

export function PledgedList({ collateral }) {
  const t = COPY.holdings;
  const r = COPY.records;
  return html`
    <div class="holdings">
      <div class="holdings__head holdings__head--plain t-caption-regular c-secondary">
        <span>${t.colName[0]}<br />${t.colName[1]}</span>
        <span class="holdings__col-lots">${r.colPledgedLots}</span>
        <span class="holdings__col-amount">${r.colPledgedLoan}</span>
      </div>

      ${collateral.length === 0 && html`<p class="holdings__empty t-body-regular c-secondary">${r.emptyPledged}</p>`}

      ${collateral.map(
        (c) => html`
          <div class="holdings__row">
            <div class="holdings__main holdings__main--plain">
              <div>
                <p class="t-body-bold c-primary">${stockOf(c.code).name}</p>
                <p class="n-body-regular c-secondary">${c.code}</p>
              </div>
              <p class="holdings__col-lots n-body-regular c-primary">${num(c.lots)}</p>
              <div class="holdings__col-amount n-body-regular c-primary">
                <p>TWD</p>
                <p>${num(c.lots * perLotLoan(c.code))}</p>
              </div>
            </div>
          </div>
        `
      )}
    </div>
  `;
}
