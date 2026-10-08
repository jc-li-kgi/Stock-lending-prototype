// 尚可匯入擔保品列表（商品 / 剩餘可匯入張數 / 預估可借總額 / 匯入）
// 用在：股票借貸專區總覽、股票借貸明細 › 擔保品 › 未擔保
import { html, useState } from '../../lib/preact.js';
import { Icon, Button, DetailRow, InfoSheet } from '../../components/index.js';
import { stockOf, perLotLoan } from '../../lib/calc.js';
import { twd, num } from '../../lib/format.js';
import { startFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

const SORTS = {
  code: (a, b) => a.code.localeCompare(b.code),
  lots: (a, b) => b.lots - a.lots,
};

/**
 * <HoldingsTable holdings=${eligibleHoldings} limit=${4} />
 */
export function HoldingsTable({ holdings, limit, emptyText = COPY.holdings.empty }) {
  const t = COPY.holdings;
  const tc = COPY.collateral;
  const [sort, setSort] = useState(null);
  const [open, setOpen] = useState(null);
  const [info, setInfo] = useState(null);

  let rows = sort ? [...holdings].sort(SORTS[sort]) : holdings;
  if (limit) rows = rows.slice(0, limit);

  const sortHead = (key, children) => html`
    <button class="sort-head" onClick=${() => setSort(sort === key ? null : key)} aria-pressed=${sort === key}>
      <span>${children}</span>
      <img src="assets/icons/sort.svg" width="6" height="11" alt="" />
    </button>
  `;

  return html`
    <div class="holdings">
      <div class="holdings__head t-caption-regular c-secondary">
        ${sortHead('code', html`${t.colName[0]}<br />${t.colName[1]}`)}
        <span class="holdings__col-lots">${sortHead('lots', t.colLots)}</span>
        <span class="holdings__col-amount">
          ${t.colAmount}
          <button class="icon-btn" onClick=${() => setInfo(t.amountSheet)} aria-label="預估可借總額說明">
            <${Icon} name="info.svg" size=${16} />
          </button>
        </span>
      </div>

      ${rows.length === 0 && html`<p class="holdings__empty t-body-regular c-secondary">${emptyText}</p>`}

      ${rows.map(
        (h) => html`
          <div class="holdings__row">
            <div class="holdings__main">
              <div>
                <p class="t-body-bold c-primary">${stockOf(h.code).name}</p>
                <p class="n-body-regular c-secondary">${h.code}</p>
              </div>
              <p class="holdings__col-lots n-body-regular c-primary">${num(h.lots)}</p>
              <div class="holdings__col-amount n-body-regular c-primary">
                <p>TWD</p>
                <p>${num(h.lots * perLotLoan(h.code))}</p>
              </div>
              <button
                class=${'icon-btn holdings__chevron' + (open === h.code ? ' holdings__chevron--open' : '')}
                onClick=${() => setOpen(open === h.code ? null : h.code)}
                aria-label="展開明細"
                aria-expanded=${open === h.code}
              >
                <${Icon} name="chevron-up.svg" />
              </button>
            </div>

            ${open === h.code &&
            html`
              <div class="holdings__detail">
                <${DetailRow} label=${tc.perLot} value=${num(perLotLoan(h.code))} />
                <${DetailRow} label=${tc.ratio} value=${`${Math.round(stockOf(h.code).ratio * 100)}%`} />
              </div>
            `}

            <div class="holdings__actions">
              <${Button} variant="capsule" class="btn-capsule--sm" onClick=${() => startFlow('collateralIn', { query: { code: h.code } })}>
                ${t.importBtn}
              <//>
            </div>
          </div>
        `
      )}

      <${InfoSheet} info=${info} onClose=${() => setInfo(null)} />
    </div>
  `;
}
