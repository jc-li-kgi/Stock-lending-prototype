// 列表金額欄：幣別一行、金額一行，靠右
import { html } from '../../lib/preact.js';
import { num } from '../../lib/format.js';

/**
 * <AmountCell amount=${6000000} />
 */
export function AmountCell({ amount, currency = 'TWD' }) {
  return html`
    <div class="amount-cell n-body-regular c-primary">
      <p>${currency}</p>
      <p>${num(amount)}</p>
    </div>
  `;
}
