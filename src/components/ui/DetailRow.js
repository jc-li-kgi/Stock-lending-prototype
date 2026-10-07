// 資料列｜Figma：📱 Detail-Readonly、資料
import { html } from '../../lib/preact.js';
import { Icon } from '../ui/Icon.js';

/** 左標題、右數值；onInfo 有值時在標題旁顯示 (i)
 *  value 預設是英數樣式（金額、日期）；值是中文時傳 valueClass="t-body-regular" */
export function DetailRow({ label, value, onInfo, labelClass = 't-body-regular', valueClass = 'n-body-regular' }) {
  return html`
    <div class="detail-row">
      <div class=${'detail-row__label ' + labelClass}>
        <span>${label}</span>
        ${onInfo &&
        html`<button class="icon-btn" onClick=${onInfo} aria-label=${label + '說明'}>
          <${Icon} name="info.svg" size=${16} />
        </button>`}
      </div>
      <div class=${'detail-row__value ' + valueClass}>${value}</div>
    </div>
  `;
}
