// 可勾選項目（勾選框 + 內容，可停用）｜Figma：選擇擔保品 / 借入擔保品內容
import { html } from '../../lib/preact.js';
import { Checkbox } from '../ui/Checkbox.js';

/**
 * <SelectableItem checked=${…} onChange=${…} label="台積電">
 *   …內容（標題、資料列、輸入框）…
 * </SelectableItem>
 * disabled 時整個項目（含資料列）變成停用色
 */
export function SelectableItem({ checked = false, disabled = false, onChange, label, children }) {
  return html`
    <div class=${'selectable-item' + (disabled ? ' selectable-item--disabled' : '')}>
      <${Checkbox} checked=${checked} disabled=${disabled} onChange=${onChange} label=${label} />
      <div class="selectable-item__body">${children}</div>
    </div>
  `;
}
