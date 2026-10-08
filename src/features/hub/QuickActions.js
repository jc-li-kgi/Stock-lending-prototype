// 專區快捷功能（還款 / 查看借還款紀錄 / 管理擔保品 / 更多）
// icon 由 Figma 渲染圖裁切（assets/icons/action-*.png），用 tint 跟著文字色
import { html } from '../../lib/preact.js';
import { Icon } from '../../components/index.js';
import { showToast } from '../../store.js';
import { navigate } from '../../router.js';
import { COPY } from '../../content/copy.js';

// 對應 COPY.zone.actions 的順序；null = 尚未實作
const ACTIONS = [
  { icon: 'action-repay.png', to: null },
  { icon: 'action-records.png', to: '/records?tab=loans' },
  { icon: 'action-collateral.png', to: '/records?tab=collateral' },
  { icon: 'action-more.png', to: null },
];

export function QuickActions() {
  return html`
    <nav class="quick-actions">
      ${ACTIONS.map(
        (a, i) => html`
          <button class="quick-actions__item" onClick=${() => (a.to ? navigate(a.to) : showToast(COPY.common.notAvailable))}>
            <span class="quick-actions__circle"><${Icon} name=${a.icon} tint /></span>
            <span class="t-body-regular c-primary">${COPY.zone.actions[i]}</span>
          </button>
        `
      )}
    </nav>
  `;
}
