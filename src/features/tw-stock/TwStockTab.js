// 帳務 ›「台股」頁籤（庫存）｜Figma QJWIW4gG5Q0wfEOLpH1RTG 40006013:1205012「📱 帳務/台股庫存/light」
// 只供瀏覽：子頁籤、交易類別、搜尋、刷新、展開、排序、列表展開、下單、注意事項都顯示未開放
// 庫存 = 情境的持股＋擔保品（與「我的」台股庫存總市值一致）；成本均價依 TW_PROFIT_RATE 推算
import { html } from '../../lib/preact.js';
import { Icon, AccountPicker, TextTabs, FilterPill, SearchIcon, ListTable, ListRow, Tag, Button } from '../../components/index.js';
import { useStore, showToast } from '../../store.js';
import { stockOf, lotValue } from '../../lib/calc.js';
import { num, price, dateTime } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';
import { TW_PROFIT_RATE } from '../../mock/home.js';

const SHARES_PER_LOT = 1000;

/** 持股＋擔保品，同代碼合併成一列 */
function stockRows(account) {
  const lots = {};
  [...account.holdings, ...account.collateral].forEach((h) => (lots[h.code] = (lots[h.code] || 0) + h.lots));
  return Object.entries(lots).map(([code, n]) => {
    const value = n * lotValue(code);
    const cost = Math.round(value / (1 + TW_PROFIT_RATE));
    return { code, shares: n * SHARES_PER_LOT, price: stockOf(code).price, avgCost: stockOf(code).price / (1 + TW_PROFIT_RATE), value, cost };
  });
}

export function TwStockTab() {
  const account = useStore((s) => s.account);
  const t = COPY.twStock;
  const notAvailable = () => showToast(COPY.common.notAvailable);
  const rows = stockRows(account);
  const value = rows.reduce((s, r) => s + r.value, 0);
  const cost = rows.reduce((s, r) => s + r.cost, 0);
  const profit = value - cost;
  const up = profit >= 0;
  const rate = cost ? (profit / cost) * 100 : 0;
  const signed = (n) => `${n >= 0 ? '+' : '-'}${Math.abs(n).toFixed(2)}%`;

  return html`
    <div class="tw-stock">
      <div class="tw-stock__meta">
        <div class="tw-stock__pad"><${AccountPicker} account=${account} onClick=${notAvailable} /></div>
        <${TextTabs} tabs=${t.tabs.map((label, i) => ({ key: i, label }))} active=${0} onChange=${notAvailable} />
      </div>

      <section class="tw-stock__summary">
        <div class="tw-stock__toolbar tw-stock__pad">
          <${FilterPill} label=${t.tradeType} onClick=${notAvailable} />
          <button class="icon-btn" onClick=${notAvailable} aria-label="搜尋"><${SearchIcon} /></button>
        </div>
        <div class="tw-stock__time tw-stock__pad">
          <span class="t-caption-regular c-secondary">${COPY.account.updatedAt} ${dateTime()}</span>
          <button class="icon-btn" onClick=${notAvailable} aria-label="重新整理"><${Icon} name="refresh.svg" size=${20} /></button>
        </div>

        <div class="tw-stock__pad">
          <article class="card card--shadow tw-stock-card">
            <div class="tw-stock-card__top">
              <div class="tw-stock-card__value">
                <button class="tw-stock-card__label" onClick=${notAvailable}>
                  <img class="amount-hero__flag" src="assets/icons/flag-twd.png" width="16" height="16" alt="" />
                  <span class="t-body-regular c-secondary">${t.marketValue}</span>
                  <${Icon} name="chevron-pull.svg" size=${16} />
                </button>
                <p class="tw-stock-card__amount">
                  <span class="n-subtitle-regular c-primary">TWD</span>
                  <span class="n-headline c-primary">${num(value)}</span>
                </p>
              </div>
              <button class="tw-stock-card__expand" onClick=${notAvailable} aria-label="展開"><${Icon} name="expand-secondary.svg" size=${20} /></button>
            </div>
            <div class="tw-stock-card__rows">
              <p class="tw-stock-card__row">
                <span class="t-body-regular c-secondary">${t.cost}</span>
                <span class="n-body-regular c-primary">TWD ${num(cost)}</span>
              </p>
              <p class="tw-stock-card__row">
                <span class="t-body-regular c-secondary">${COPY.home.profit}</span>
                <span class=${'n-body-bold tw-stock-card__change ' + (up ? 'c-ascend' : 'c-descend')}>
                  <span class=${'finance-card__triangle' + (up ? '' : ' finance-card__triangle--down')}>
                    <${Icon} name="ascend-triangle.svg" size=${16} tint />
                  </span>
                  TWD ${num(Math.abs(profit))}
                  <span>${signed(rate)}</span>
                </span>
              </p>
            </div>
          </article>
        </div>
      </section>

      <section class="tw-stock__list">
        <${ListTable}
          columns=${[
            { label: html`${t.colName[0]}<br />${t.colName[1]}`, sortKey: 'code' },
            { label: html`${t.colShares[0]}<br />${t.colShares[1]}`, width: '68px', align: 'right' },
            { label: html`${t.colPrice[0]}<br />${t.colPrice[1]}`, width: '68px', align: 'right' },
            { label: html`${t.colProfit[0]}<br />${t.colProfit[1]}`, width: '68px', align: 'right', sortKey: 'profit' },
          ]}
          expandable
          onSort=${notAvailable}
        >
          ${rows.map((r) => {
            const p = r.value - r.cost;
            const tone = p >= 0 ? 'c-ascend' : 'c-descend';
            return html`
              <${ListRow}
                align=${['left', 'right', 'right', 'right']}
                cells=${[
                  html`<p class="t-body-regular c-primary">${stockOf(r.code).name}</p><p class="n-body-regular c-secondary">${r.code}</p>`,
                  html`<p class="n-body-regular c-primary">${num(r.shares)}</p><p class="n-body-regular c-primary">${num(r.shares)}</p>`,
                  html`<p class="n-body-regular c-primary">${price(r.price)}</p><p class="n-body-regular c-primary">${price(r.avgCost)}</p>`,
                  html`<p class=${'n-body-regular ' + tone}>${num(p)}</p><p class=${'n-body-regular ' + tone}>${signed(TW_PROFIT_RATE * 100)}</p>`,
                ]}
                onToggle=${notAvailable}
                footerAlign="between"
                footer=${html`
                  <${Tag} variant="highlight">${t.spot}<//>
                  <${Button} variant="capsule" class="btn-capsule--sm" onClick=${notAvailable}>${t.order}<//>
                `}
              />
            `;
          })}
        <//>
        <div class="tw-stock__notes">
          <${Button} variant="text" onClick=${notAvailable}>${t.notes}<//>
        </div>
      </section>
    </div>
  `;
}
