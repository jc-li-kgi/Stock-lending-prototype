// 借還款紀錄（暫用版面，等 Figma 設計稿再替換）
import { html } from '../../lib/preact.js';
import { PageHeader } from '../../components/index.js';
import { useStore } from '../../store.js';
import { navigate } from '../../router.js';
import { entryHome } from '../../flows/flows.js';
import { twd, date } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

export function LoanRecords() {
  const loans = useStore((s) => s.account.loans);
  const t = COPY.records;

  return html`
    <div class="page records-page">
      <${PageHeader} title=${t.title} onBack=${() => navigate(entryHome())} showShare=${false} />
      <div class="records-list">
        ${loans.length === 0 && html`<p class="t-body c-secondary">${t.empty}</p>`}
        ${loans.map(
          (l) => html`
            <div class="card records-item">
              <div class="records-item__head">
                <span class="t-body c-secondary">${date(l.applyDate)}</span>
                <span class="records-item__status t-caption">${l.status}</span>
              </div>
              <p class="n-title c-primary">${twd(l.amount)}</p>
              <p class="t-caption c-secondary">${l.purpose}・到期日 ${date(l.dueDate)}</p>
            </div>
          `
        )}
      </div>
    </div>
  `;
}
