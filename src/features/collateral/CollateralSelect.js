// 匯入擔保品 第 1 步：從庫存選擇要匯入的股票與張數
// 網址可帶 ?code=2330，預先勾選該檔（專區、明細頁的「匯入」按鈕會帶）
import { html, useState } from '../../lib/preact.js';
import {
  PageHeader, StepBar, AccountPicker, FilterPill, SearchIcon, Checkbox, DetailRow, QtyStepper,
  Button, StickyFooter, Sheet, InfoSheet, Icon,
} from '../../components/index.js';
import { useStore, updateCollateralDraft, showToast } from '../../store.js';
import { flowPosition, nextStep, prevStep } from '../../flows/flows.js';
import { stockOf, perLotLoan, loanableOf, groupHoldings, HOLDING_SORTS } from '../../lib/calc.js';
import { twd, num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/collateral-in/select';

function initialSelection(draft, query, eligible) {
  if (draft.selected) return draft.selected;
  const h = eligible.find((x) => x.code === query.code);
  return h ? { [h.code]: 1 } : {};
}

export function CollateralSelect({ query }) {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.collateralDraft);
  const t = COPY.collateral;
  const groups = groupHoldings(account);

  const [sort, setSort] = useState(draft.sort ?? HOLDING_SORTS[0].value);
  const [selected, setSelected] = useState(() => initialSelection(draft, query, groups.eligible));
  const [sortOpen, setSortOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [info, setInfo] = useState(null);

  const sortDef = HOLDING_SORTS.find((s) => s.value === sort);
  const eligible = [...groups.eligible].sort(sortDef.fn);
  const items = Object.entries(selected).map(([code, lots]) => ({ code, lots }));
  const total = loanableOf(items);
  const allChecked = eligible.length > 0 && eligible.every((h) => selected[h.code]);
  const notAvailable = () => showToast(COPY.common.notAvailable);

  const toggle = (code, on) =>
    setSelected((s) => {
      const next = { ...s };
      if (on) next[code] = 1;
      else delete next[code];
      return next;
    });
  const toggleAll = (on) =>
    setSelected(on ? Object.fromEntries(eligible.map((h) => [h.code, selected[h.code] || 1])) : {});
  const setLots = (code, lots) => setSelected((s) => ({ ...s, [code]: lots }));

  const submit = () => {
    updateCollateralDraft({ selected, sort });
    nextStep(PATH);
  };

  const groupHead = (key, count, checkbox) => html`
    <div class="coll-group__head">
      <div class="coll-group__title">
        ${checkbox}
        <p class="t-subtitle-bold c-primary">${t.groups[key].title} (${count})</p>
      </div>
      ${t.groups[key].desc && html`<p class="t-caption-regular c-secondary">${t.groups[key].desc}</p>`}
    </div>
  `;

  return html`
    <div class="page coll-page">
      <div>
        <${PageHeader} title=${t.title} onBack=${() => prevStep(PATH)} />
        <${StepBar} ...${flowPosition(PATH)} />
      </div>

      <div class="coll-list">
        <div class="coll-toolbar">
          <${AccountPicker} account=${account} onClick=${notAvailable} />
          <div class="coll-toolbar__filters">
            <${FilterPill} label=${sortDef.label} onClick=${() => setSortOpen(true)} />
            <button class="icon-btn" onClick=${notAvailable} aria-label="搜尋"><${SearchIcon} /></button>
          </div>
        </div>

        <div class="coll-groups">
          <!-- 可借貸 -->
          <section class="coll-group">
            ${groupHead('eligible', eligible.length, html`
              <${Checkbox} checked=${allChecked} disabled=${!eligible.length} onChange=${toggleAll} label="全選可借貸" />
            `)}
            <div class="card card--full coll-card">
              ${eligible.map(
                (h) => html`
                  <div class="holding-item">
                    <${Checkbox} checked=${!!selected[h.code]} onChange=${(on) => toggle(h.code, on)} label=${stockOf(h.code).name} />
                    <div class="holding-item__body">
                      <p class="t-body-bold c-primary">${stockOf(h.code).name} ${h.code}</p>
                      <div class="holding-item__rows">
                        <${DetailRow} label=${t.availableLots} value=${num(h.lots)} />
                        <${DetailRow} label=${t.perLot} value=${num(perLotLoan(h.code))} />
                        <${DetailRow} label=${t.ratio} value=${`${Math.round(stockOf(h.code).ratio * 100)}%`} />
                        ${selected[h.code] &&
                        html`
                          <div class="holding-item__qty">
                            <span class="t-body-regular c-secondary nowrap">${t.importLots}</span>
                            <${QtyStepper}
                              value=${selected[h.code]}
                              min=${1}
                              max=${h.lots}
                              unit=${t.lotUnit}
                              label=${t.importLots}
                              onChange=${(n) => setLots(h.code, n)}
                            />
                          </div>
                        `}
                      </div>
                    </div>
                  </div>
                `
              )}
            </div>
          </section>

          <!-- 僅可用於提升維持率 -->
          ${groups.ratioOnly.length > 0 &&
          html`
            <section class="coll-group">
              ${groupHead('ratioOnly', groups.ratioOnly.length)}
              <div class="card card--full coll-card coll-card--disabled">
                ${groups.ratioOnly.map(
                  (h) => html`
                    <div class="holding-item holding-item--disabled">
                      <${Checkbox} disabled label=${stockOf(h.code).name} />
                      <div class="holding-item__body">
                        <p class="t-body-bold">${stockOf(h.code).name} ${h.code}</p>
                        <${DetailRow} label=${t.availableLots} value=${num(h.lots)} />
                      </div>
                    </div>
                  `
                )}
              </div>
            </section>
          `}

          <!-- 無法作為擔保品 -->
          ${groups.ineligible.length > 0 &&
          html`
            <section class="coll-group">
              ${groupHead('ineligible', groups.ineligible.length)}
              <div class="card card--full coll-card coll-card--disabled">
                ${groups.ineligible.map(
                  (h) => html`
                    <div class="holding-item holding-item--disabled">
                      <${Checkbox} disabled label=${stockOf(h.code).name} />
                      <div class="holding-item__body">
                        <p class="t-body-bold">${stockOf(h.code).name} ${h.code}</p>
                        <p class="t-body-regular">${t.reason}${stockOf(h.code).reason}</p>
                      </div>
                    </div>
                  `
                )}
              </div>
            </section>
          `}

          <${Button} variant="text" onClick=${() => setInfo(t.notesSheet)}>${t.notes}<//>
        </div>
      </div>

      <${StickyFooter}>
        <div class="coll-total">
          <button class="coll-total__label" onClick=${() => setInfo(t.totalSheet)}>
            <span class="t-body-regular c-secondary">${t.total}</span>
            <${Icon} name="info.svg" size=${16} />
          </button>
          <button class="coll-total__value" onClick=${() => setBreakdownOpen(true)} aria-label="查看匯入明細">
            <span class="n-subtitle-bold c-primary">${twd(total)}</span>
            <${Icon} name="chevron-up.svg" />
          </button>
        </div>
        <${Button} disabled=${items.length === 0} onClick=${submit}>${COPY.common.next}<//>
      <//>

      <${Sheet} open=${sortOpen} title=${t.sortTitle} onClose=${() => setSortOpen(false)}>
        ${HOLDING_SORTS.map(
          (s) => html`
            <button
              class=${'sheet__option' + (s.value === sort ? ' sheet__option--selected' : '')}
              onClick=${() => { setSort(s.value); setSortOpen(false); }}
            >
              <span class="t-subtitle-regular">${s.label}</span>
              ${s.value === sort && html`<span>✓</span>`}
            </button>
          `
        )}
      <//>

      <${Sheet} open=${breakdownOpen} title=${t.breakdownTitle} onClose=${() => setBreakdownOpen(false)}>
        ${items.length === 0
          ? html`<p class="t-body-regular c-secondary sheet__body">${t.noneSelected}</p>`
          : html`
              <div class="coll-breakdown">
                ${items.map(
                  (i) => html`
                    <${DetailRow}
                      label=${`${stockOf(i.code).name} ${i.code} × ${i.lots} ${t.lotUnit}`}
                      value=${twd(i.lots * perLotLoan(i.code))}
                    />
                  `
                )}
                <${DetailRow} label=${t.total} labelClass="t-body-bold c-primary" value=${twd(total)} valueClass="n-subtitle-bold" />
              </div>
            `}
      <//>

      <${InfoSheet} info=${info} onClose=${() => setInfo(null)} />
    </div>
  `;
}
