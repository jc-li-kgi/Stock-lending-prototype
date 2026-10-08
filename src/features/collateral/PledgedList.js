// 已擔保的股票列表（股票借貸明細 › 擔保品 › 已擔保）
// Figma 尚無此頁，沿用「尚可匯入擔保品」列表版型（暫用）
import { html } from '../../lib/preact.js';
import { ListTable, ListRow, StockName, AmountCell } from '../../components/index.js';
import { stockOf, perLotLoan } from '../../lib/calc.js';
import { num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const ALIGN = ['left', 'center', 'right'];

export function PledgedList({ collateral, emptyText = COPY.records.emptyPledged }) {
  const t = COPY.holdings;
  const r = COPY.records;
  return html`
    <${ListTable}
      columns=${[
        { label: html`${t.colName[0]}<br />${t.colName[1]}` },
        { label: r.colPledgedLots, width: '108px', align: 'center' },
        { label: r.colPledgedLoan, width: '104px', align: 'right' },
      ]}
      empty=${emptyText}
    >
      ${collateral.map(
        (c) => html`
          <${ListRow}
            align=${ALIGN}
            cells=${[
              html`<${StockName} name=${stockOf(c.code).name} code=${c.code} />`,
              html`<p class="n-body-regular c-primary">${num(c.lots)}</p>`,
              html`<${AmountCell} amount=${c.lots * perLotLoan(c.code)} />`,
            ]}
          />
        `
      )}
    <//>
  `;
}
