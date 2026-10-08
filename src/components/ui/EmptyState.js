// 無資料提示（置中次要色文字）
import { html } from '../../lib/preact.js';

/**
 * <EmptyState text="目前沒有還款紀錄" />
 */
export function EmptyState({ text }) {
  return html`<p class="empty-state t-body-regular c-secondary">${text}</p>`;
}
