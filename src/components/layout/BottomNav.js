// 底部導覽｜Figma：B_Navi
import { html } from '../../lib/preact.js';
import { Icon } from '../ui/Icon.js';
import { showToast } from '../../store.js';
import { COPY } from '../../content/copy.js';

const FundIcon = () => html`
  <span class="nav-fund">
    <span class="nav-fund__bar" style="left:2.7px;top:10.8px;height:5.53px" />
    <span class="nav-fund__bar" style="left:7.79px;top:8.1px;height:8.756px" />
    <span class="nav-fund__bar" style="left:12.69px;top:10px;height:6.452px" />
    <img class="nav-fund__line" src="assets/icons/nav-fund-line.svg" width="15.4293" height="6.15369" alt="" />
  </span>
`;

const ITEMS = [
  { key: 'mine', label: '我的', icon: html`<${Icon} name="nav-rate.svg" size=${20} />` },
  { key: 'pick', label: '選股', icon: html`<${FundIcon} />` },
  { key: 'watch', label: '自選', icon: html`<${Icon} name="nav-watchlist.svg" width=${13.334} height=${16.666} />` },
  { key: 'order', label: '下單', icon: html`<${Icon} name="nav-transfer.svg" size=${20} />` },
  { key: 'account', label: '帳務', icon: html`<${Icon} name="nav-account.svg" width=${14.5839} height=${14.5834} />` },
  { key: 'more', label: '更多', icon: html`<${Icon} name="nav-menu.svg" width=${16.6667} height=${11.25} />` },
];

export function BottomNav({ active = 'account' }) {
  return html`
    <nav class="bottom-nav">
      ${ITEMS.map(
        (item) => html`
          <button
            class=${'bottom-nav__item t-body' + (item.key === active ? ' bottom-nav__item--active' : '')}
            onClick=${() => item.key !== active && showToast(COPY.common.notAvailable)}
          >
            <span class="bottom-nav__icon">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `
      )}
    </nav>
  `;
}
