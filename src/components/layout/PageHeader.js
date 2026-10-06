// 子頁標題列｜Figma：📱 Header-greeting / .header
import { html } from '../../lib/preact.js';
import { Icon } from '../ui/Icon.js';
import { showToast } from '../../store.js';
import { COPY } from '../../content/copy.js';

/**
 * 子頁標題列：返回 / 標題 / 分享
 * onBack 不傳就不顯示返回鍵；showShare 控制右側 icon
 */
export function PageHeader({ title, onBack, showShare = true }) {
  return html`
    <header class="page-header">
      ${onBack
        ? html`<button class="icon-btn page-header__slot" onClick=${onBack} aria-label="返回">
            <${Icon} name="chevron-back.svg" />
          </button>`
        : html`<span class="page-header__slot" />`}
      <p class="page-header__title t-subtitle-bold c-primary">${title}</p>
      ${showShare
        ? html`<button class="icon-btn page-header__slot" onClick=${() => showToast(COPY.common.notAvailable)} aria-label="分享">
            <${Icon} name="share.svg" />
          </button>`
        : html`<span class="page-header__slot" />`}
    </header>
  `;
}
