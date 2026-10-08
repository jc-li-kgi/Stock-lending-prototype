// 尚可匯入擔保品列表（商品 / 剩餘可匯入張數 / 預估可借總額 / 匯入）
// 用在：股票借貸專區總覽、股票借貸明細 › 擔保品 › 未擔保
import { html, useState } from '../../lib/preact.js';
import { ListTable, ListRow, StockName, AmountCell, DetailRow, Button } from '../../components/index.js';
import { stockOf, perLotLoan } from '../../lib/calc.js';
import { num } from '../../lib/format.js';
import { startFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

const SORTS = {
  code: (a, b) => a.code.localeCompare(b.code),
  lots: (a, b) => b.lots - a.lots,
};

const ALIGN = ['left', 'center', 'right'];

/**
 * <HoldingsTable holdings=${eligibleHoldings} limit=${4} />
 */
export function HoldingsTable({ holdings, limit, emptyText = COPY.holdings.empty }) {
  const t = COPY.holdings;
  const tc = COPY.collateral;
  const [sort, setSort] = useState(null);
  const [open, setOpen] = useState(null);

  let rows = sort ? [...holdings].sort(SORTS[sort]) : holdings;
  if (limit) rows = rows.slice(0, limit);

  return html`
    <${ListTable}
      columns=${[
        { label: html`${t.colName[0]}<br />${t.colName[1]}`, sortKey: 'code' },
        { label: t.colLots, width: '108px', align: 'center', sortKey: 'lots' },
        { label: t.colAmount, width: '104px', align: 'right', info: t.amountSheet },
      ]}
      expandable
      sort=${sort}
      onSort=${setSort}
      empty=${emptyText}
    >
      ${rows.map(
        (h) => html`
          <${ListRow}
            align=${ALIGN}
            cells=${[
              html`<${StockName} name=${stockOf(h.code).name} code=${h.code} />`,
              html`<p class="n-body-regular c-primary">${num(h.lots)}</p>`,
              html`<${AmountCell} amount=${h.lots * perLotLoan(h.code)} />`,
            ]}
            expanded=${open === h.code}
            onToggle=${() => setOpen(open === h.code ? null : h.code)}
            detail=${html`
              <${DetailRow} label=${tc.perLot} value=${num(perLotLoan(h.code))} />
              <${DetailRow} label=${tc.ratio} value=${`${Math.round(stockOf(h.code).ratio * 100)}%`} />
            `}
            footer=${html`
              <${Button} variant="capsule" class="btn-capsule--sm" onClick=${() => startFlow('collateralIn', { query: { code: h.code } })}>
                ${t.importBtn}
              <//>
            `}
          />
        `
      )}
    <//>
  `;
}
