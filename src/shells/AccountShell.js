// 入口一：證券主頁 → 帳務；預設停在「台股」頁籤（features/tw-stock，只供瀏覽），可切到「授信管理」
//   網址 /account?product=credit = 授信管理（從授信管理進流程 / 明細頁後返回，會回到授信管理）
//   已借款：摘要卡 + 更多服務
//   尚未借款（account.opened = false）：方案卡 + 認識並開立借貸戶
import { html, useRef, useEffect, useState } from '../lib/preact.js';
import { Icon, BottomNav, AccountPicker, TextTabs, SectionHeader, ServiceCardList } from '../components/index.js';
import { useStore, showToast } from '../store.js';
import { navigate } from '../router.js';
import { startFlow } from '../flows/flows.js';
import { dateTime } from '../lib/format.js';
import { COPY } from '../content/copy.js';
import { LendingSummaryCard } from '../features/hub/LendingSummaryCard.js';
import { MoreServices } from '../features/hub/MoreServices.js';
import { LoanIntroCard } from '../features/hub/LoanIntroCard.js';
import { DueSoonNotice } from '../features/hub/DueSoonNotice.js';
import { IntroSheet } from '../features/intro/IntroSheet.js';
import { TwStockTab } from '../features/tw-stock/TwStockTab.js';

const OPEN_TABS = ['授信管理', '台股'];
export const ACCOUNT_CREDIT = '/account?product=credit'; // 帳務 › 授信管理

export function AccountShell({ query }) {
  const account = useStore((s) => s.account);
  const t = COPY.account;
  const tabsRef = useRef();
  const product = query.product === 'credit' ? '授信管理' : '台股';
  const setProduct = (tab) => navigate(tab === '授信管理' ? ACCOUNT_CREDIT : '/account', { replace: true });
  const notAvailable = () => showToast(COPY.common.notAvailable);

  // 產品頁籤把選取的頁籤捲到中間（授信管理在最右邊 → 捲到底，同 Figma；台股 → 捲到最左）
  useEffect(() => {
    const el = tabsRef.current;
    const active = el?.querySelector('.product-tabs__item--active');
    if (!active) return;
    const offset = active.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft;
    el.scrollLeft = offset - (el.clientWidth - active.offsetWidth) / 2;
  }, [product]);

  return html`
    <div class="page account-page">
      <div>
        <header class="account-header">
          <p class="t-headline c-primary account-header__title">${t.title}</p>
          <button class="icon-btn" onClick=${notAvailable} aria-label="帳戶資訊"><${Icon} name="account-info.svg" /></button>
          <button class="icon-btn" onClick=${notAvailable} aria-label="客服"><${Icon} name="customer-service.svg" /></button>
        </header>

        <div class="product-tabs" ref=${tabsRef}>
          ${t.productTabs.map((tab) =>
            tab === product
              ? html`<span class="product-tabs__item product-tabs__item--active t-body-regular">${tab}</span>`
              : html`<button class="product-tabs__item t-body-regular" onClick=${OPEN_TABS.includes(tab) ? () => setProduct(tab) : notAvailable}>${tab}</button>`
          )}
        </div>
      </div>

      ${product === '台股'
        ? html`<${TwStockTab} />`
        : html`
      <main class="account-content">
        <div class="account-overview">
          <div class="account-overview__meta">
            <div class="account-overview__picker">
              <${AccountPicker} account=${account} onClick=${notAvailable} />
            </div>

            <${TextTabs}
              tabs=${t.creditTabs.map((label, i) => ({ key: i, label }))}
              active=${0}
              onChange=${notAvailable}
            />

            ${account.opened &&
            html`<p class="t-caption-regular c-secondary account-overview__time">${t.updatedAt} ${dateTime()}</p>`}
          </div>

          <div class="account-overview__card">
            ${account.opened ? html`<${LendingSummaryCard} />` : html`<${LoanIntroCard} />`}
          </div>

          ${account.opened && html`<div class="account-overview__card"><${DueSoonNotice} back=${ACCOUNT_CREDIT} /></div>`}
        </div>

        ${account.opened ? html`<${MoreServices} />` : html`<${IntroServices} />`}
      </main>
      `}

      <${BottomNav} active="account" />
    </div>
  `;
}

/** 尚未借款：認識並開立借貸戶 */
function IntroServices() {
  const t = COPY.hub;
  const [learn, borrow] = t.introServices;
  const [introOpen, setIntroOpen] = useState(false);
  return html`
    <section class="account-intro-services">
      <${SectionHeader} title=${t.introSection} />
      <${ServiceCardList}
        items=${[
          { icon: 'service-learn.png', ...learn, onClick: () => setIntroOpen(true) },
          { icon: 'service-borrow.png', ...borrow, onClick: () => startFlow('newAccountLoan') },
        ]}
      />
      <${IntroSheet}
        open=${introOpen}
        onClose=${() => setIntroOpen(false)}
        onSimulate=${() => { setIntroOpen(false); navigate('/lending-zone?tab=simulate'); }}
      />
    </section>
  `;
}
