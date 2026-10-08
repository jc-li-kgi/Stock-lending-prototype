// 置底總計列（標題 ⓘ ／ 金額 ^）｜Figma：置底下單 › Predict
// 通常放在 <StickyFooter> 裡、按鈕上方
import { html } from '../../lib/preact.js';
import { InfoLabel } from '../ui/InfoLabel.js';
import { Icon } from '../ui/Icon.js';

/**
 * <TotalBar label="可借額度總計" info=${{ title, body }} value="TWD 800,000" onExpand=${openBreakdown} />
 * onExpand 不給就不顯示 ^
 */
export function TotalBar({ label, info, value, onExpand }) {
  return html`
    <div class="total-bar">
      <${InfoLabel} class="c-secondary" label=${label} info=${info} />
      <button class="total-bar__value" onClick=${onExpand} disabled=${!onExpand} aria-label=${label + '明細'}>
        <span class="n-subtitle-bold c-primary">${value}</span>
        ${onExpand && html`<${Icon} name="chevron-up.svg" />`}
      </button>
    </div>
  `;
}
