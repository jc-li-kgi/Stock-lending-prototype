// 借還款紀錄（股票借貸明細 › 借還款紀錄）
import { html, useState } from '../../lib/preact.js';
import { SegmentedTabs, FilterPill, Tag, Button, DetailRow, ListTable, ListRow, EmptyState } from '../../components/index.js';
import { showToast } from '../../store.js';
import { daysUntil, DUE_SOON_DAYS } from '../../lib/calc.js';
import { twd, date, rate } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

export function LoanRecordList({ loans = [], repayments = [] }) {
  const t = COPY.records;
  const [sub, setSub] = useState('borrow');
  const [open, setOpen] = useState(null);
  const notAvailable = () => showToast(COPY.common.notAvailable);

  // 依到期日排序，最近到期的在最上面
  const rows = [...loans].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return html`
    <div class="records-section">
      <div class="records-section__controls">
        <${SegmentedTabs} tabs=${t.loanTabs} active=${sub} onChange=${setSub} />
        ${sub === 'borrow' &&
        html`
          <div class="records-filters">
            <${FilterPill} label=${t.periodFilter} onClick=${notAvailable} />
            <${FilterPill} label=${t.statusFilter} onClick=${notAvailable} />
          </div>
        `}
      </div>

      ${sub === 'repay' && repayments.length === 0 && html`<${EmptyState} text=${t.emptyRepay} />`}

      ${sub === 'borrow' &&
      html`
        <${ListTable}
          columns=${[
            { label: html`${t.colBalance[0]}<br />${t.colBalance[1]}` },
            { label: t.colDue, width: 'auto', align: 'right' },
          ]}
          expandable
          headAlign="end"
          empty=${t.empty}
        >
          ${rows.map((l) => {
            const days = daysUntil(l.dueDate);
            const dueSoon = days >= 0 && days <= DUE_SOON_DAYS;
            return html`
              <${ListRow}
                align=${['left', 'right']}
                cells=${[
                  html`
                    <p class="n-body-regular c-primary">${twd(l.balance)}</p>
                    <p class="t-body-regular c-secondary">${l.status}</p>
                  `,
                  html`<p class="n-body-regular c-primary">${date(l.dueDate)}</p>`,
                ]}
                expanded=${open === l.id}
                onToggle=${() => setOpen(open === l.id ? null : l.id)}
                detail=${html`
                  <${DetailRow} label="借款金額" value=${twd(l.amount)} />
                  <${DetailRow} label="借款日" value=${date(l.startDate)} />
                  <${DetailRow} label="參考利率" value=${rate(l.rate)} />
                  <${DetailRow} label="借款目的" value=${l.purpose} valueClass="t-body-regular" />
                `}
                footerAlign="between"
                footer=${dueSoon &&
                html`
                  <${Tag} variant="warning">${t.dueSoon}<//>
                  <div class="records-row-buttons">
                    <${Button} variant="capsule" class="btn-capsule--sm" onClick=${notAvailable}>${t.extend}<//>
                    <${Button} variant="capsule" class="btn-capsule--sm" onClick=${notAvailable}>${t.repay}<//>
                  </div>
                `}
              />
            `;
          })}
        <//>
      `}
    </div>
  `;
}
