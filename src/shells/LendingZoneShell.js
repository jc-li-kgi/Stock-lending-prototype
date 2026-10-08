// 入口二：股票借貸專區（總覽）
// 證券主頁 → 股票借貸專區；或 帳務 › 授信管理 ›「前往專區」
import { html, useState } from '../lib/preact.js';
import { Icon, SegmentedTabs, Button } from '../components/index.js';
import { useStore, showToast } from '../store.js';
import { navigate } from '../router.js';
import { groupHoldings, importablePotential } from '../lib/calc.js';
import { twd, dateTime } from '../lib/format.js';
import { COPY } from '../content/copy.js';
import { LendingSummaryCard } from '../features/hub/LendingSummaryCard.js';
import { QuickActions } from '../features/hub/QuickActions.js';
import { HoldingsTable } from '../features/collateral/HoldingsTable.js';

export function LendingZoneShell() {
  const account = useStore((s) => s.account);
  const t = COPY.zone;
  const [tab, setTab] = useState('overview');
  const notAvailable = () => showToast(COPY.common.notAvailable);

  const switchTab = (key) => (key === 'overview' ? setTab(key) : notAvailable());

  return html`
    <div class="page zone-page">
      <header class="zone-header">
        <button class="icon-btn page-header__slot" onClick=${() => navigate('/account')} aria-label="返回">
          <${Icon} name="chevron-back.svg" />
        </button>
        <button class="icon-btn page-header__slot" onClick=${notAvailable} aria-label="產品說明">
          <${Icon} name="book.svg" width=${16} height=${18} />
        </button>
      </header>

      <div class="zone-content">
        <section class="zone-hero">
          <div class="zone-hero__text">
            <h1 class="t-title c-primary">${t.heroTitle}</h1>
            <p class="t-body-regular c-secondary">${t.heroDesc}</p>
          </div>
          <img class="zone-hero__image" src="assets/illustrations/lending-hero.png" width="80" height="80" alt="" />
        </section>

        <div class="zone-overview">
          <${SegmentedTabs} tabs=${t.tabs} active=${tab} onChange=${switchTab} />
          <p class="t-caption-regular c-secondary">${COPY.account.updatedAt} ${dateTime()}</p>
          <${LendingSummaryCard} variant="zone" />
        </div>

        <${QuickActions} />

        <section class="zone-importable">
          <div class="zone-importable__head">
            <div class="zone-importable__title">
              <p class="t-subtitle-bold c-primary">${t.importableTitle}</p>
              <${Button} variant="text" onClick=${() => navigate('/records?tab=collateral&sub=unpledged')}>${t.viewAll}<//>
            </div>
            <p class="t-body-regular c-secondary">
              ${t.importableHint} <span class="n-body-bold c-primary">${twd(importablePotential(account))}</span>
            </p>
          </div>
          <${HoldingsTable} holdings=${groupHoldings(account).eligible} limit=${4} />
        </section>
      </div>
    </div>
  `;
}
