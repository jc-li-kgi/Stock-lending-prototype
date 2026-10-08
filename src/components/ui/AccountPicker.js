// 帳號選擇（證 徽章 + 帳號 + 姓名）｜Figma：Controls / Dropdown（選 ID）
import { html } from '../../lib/preact.js';
import { Icon } from './Icon.js';

/**
 * <AccountPicker account=${account} onClick=${…} />
 */
export function AccountPicker({ account, onClick }) {
  return html`
    <button class="account-picker" onClick=${onClick}>
      <span class="account-picker__badge t-body-bold">證</span>
      <span class="account-picker__name t-body-bold">${account.id} ${account.name}</span>
      <${Icon} name="chevron-pull.svg" />
    </button>
  `;
}
