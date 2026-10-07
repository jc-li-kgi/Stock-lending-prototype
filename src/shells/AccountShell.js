// 入口一：證券主頁 → 帳務 →「授信管理」頁籤
import { html, useRef, useEffect } from '../lib/preact.js';
import { Icon, BottomNav } from '../components/index.js';
import { useStore, showToast } from '../store.js';
import { navigate } from '../router.js';
import { dateTime } from '../lib/format.js';
import { COPY } from '../content/copy.js';
import { LendingSummaryCard } from '../features/hub/LendingSummaryCard.js';
import { MoreServices } from '../features/hub/MoreServices.js';

/** 長按標題 1.5 秒 → 主持人頁（受測者不會誤觸） */
function useLongPress(onLongPress, ms = 1500) {
  const timer = useRef();
  const start = () => (timer.current = setTimeout(onLongPress, ms));
  const cancel = () => clearTimeout(timer.current);
  return { onTouchStart: start, onTouchEnd: cancel, onTouchMove: cancel, onMouseDown: start, onMouseUp: cancel, onMouseLeave: cancel };
}

export function AccountShell() {
  const account = useStore((s) => s.account);
  const t = COPY.account;
  const tabsRef = useRef();
  const longPress = useLongPress(() => navigate('/moderator'));
  const notAvailable = () => showToast(COPY.common.notAvailable);

  // 產品頁籤捲到最右邊，讓「授信管理」露出（同 Figma）
  useEffect(() => {
    const el = tabsRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return html`
    <div class="page account-page">
      <div>
        <header class="account-header">
          <p class="t-headline c-primary account-header__title" ...${longPress}>${t.title}</p>
          <button class="icon-btn" onClick=${notAvailable} aria-label="帳戶資訊"><${Icon} name="account-info.svg" /></button>
          <button class="icon-btn" onClick=${notAvailable} aria-label="客服"><${Icon} name="customer-service.svg" /></button>
        </header>

        <div class="product-tabs" ref=${tabsRef}>
          ${t.productTabs.map((tab) =>
            tab === '授信管理'
              ? html`<span class="product-tabs__item product-tabs__item--active t-body-regular">${tab}</span>`
              : html`<button class="product-tabs__item t-body-regular" onClick=${notAvailable}>${tab}</button>`
          )}
        </div>
      </div>

      <main class="account-content">
        <div class="account-overview">
          <div class="account-overview__meta">
            <button class="account-picker" onClick=${notAvailable}>
              <span class="account-picker__badge t-body-bold">證</span>
              <span class="account-picker__name t-body-bold">${account.id} ${account.name}</span>
              <${Icon} name="chevron-pull.svg" />
            </button>

            <div class="text-tabs">
              ${t.creditTabs.map((tab, i) =>
                i === 0
                  ? html`<span class="text-tabs__item text-tabs__item--active t-body-regular">${tab}<i /></span>`
                  : html`<button class="text-tabs__item t-body-regular" onClick=${notAvailable}>${tab}</button>`
              )}
            </div>

            <p class="t-caption-regular c-secondary account-overview__time">${t.updatedAt} ${dateTime()}</p>
          </div>

          <div class="account-overview__card">
            <${LendingSummaryCard} />
          </div>
        </div>

        <${MoreServices} />
      </main>

      <${BottomNav} active="account" />
    </div>
  `;
}
