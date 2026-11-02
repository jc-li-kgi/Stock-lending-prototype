// 資料列｜Figma：📱 Detail-Readonly、資料
import { html } from '../../lib/preact.js';
import { InfoLabel } from './InfoLabel.js';

/**
 * 左標題、右數值
 * <DetailRow label="參考利率" value="2.8%" />
 * <DetailRow label="借款手續費" value="TWD 2" info=${{ title, body }} />   ← 標題旁 ⓘ
 * value 預設是英數樣式（金額、日期）；值是中文時傳 valueClass="t-body-regular"
 */
export function DetailRow({ label, value, info, onInfo, labelClass = 't-body-regular', valueClass = 'n-body-regular' }) {
  return html`
    <div class="detail-row">
      <${InfoLabel} class="detail-row__label" label=${label} labelClass=${labelClass} info=${info} onInfo=${onInfo} />
      <div class=${'detail-row__value ' + valueClass}>${value}</div>
    </div>
  `;
}
