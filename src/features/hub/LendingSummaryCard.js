// 股票借貸摘要卡：帳務頁、借貸專區共用
import { html } from '../../lib/preact.js';
import { Icon, Button } from '../../components/index.js';
import { useStore, showToast } from '../../store.js';
import { collateralValue, loanBalance, remainingCredit, maintenanceRatio } from '../../lib/calc.js';
import { twd, pct } from '../../lib/format.js';
import { startFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

export function LendingSummaryCard() {
  const account = useStore((s) => s.account);
  const t = COPY.hub;

  const rows = [
    [t.collateralValue, twd(collateralValue(account))],
    [t.borrowed, twd(loanBalance(account))],
    [t.remaining, twd(remainingCredit(account))],
  ];

  return html`
    <section class="card card--shadow summary-card">
      <div class="summary-card__head">
        <div>
          <p class="t-body-regular c-primary">${t.ratio}</p>
          <p class="n-title c-primary">${pct(maintenanceRatio(account)).replace(' ', '')}</p>
        </div>
        <button class="icon-btn" onClick=${() => showToast(COPY.common.notAvailable)} aria-label="維持率通知">
          <${Icon} name="notification.svg" />
        </button>
      </div>

      ${rows.map(
        ([label, value]) => html`
          <div class="detail-row">
            <span class="detail-row__label t-body-regular">${label}</span>
            <span class="detail-row__value n-body-regular">${value}</span>
          </div>
        `
      )}

      <div class="summary-card__actions">
        <${Button} variant="text" onClick=${() => showToast(COPY.common.notAvailable)}>${t.raiseLimit}<//>
        <${Button} variant="capsule" onClick=${() => startFlow('existingLoan')}>${t.borrowAgain}<//>
      </div>
    </section>
  `;
}
