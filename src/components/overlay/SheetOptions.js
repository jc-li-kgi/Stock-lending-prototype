// 彈窗選項列表（選中項藍字 + ✓）｜放在 <Sheet> 裡使用
import { html } from '../../lib/preact.js';

/**
 * <Sheet open=${open} title="排序方式" onClose=${close}>
 *   <SheetOptions options=${[{ value, label, desc }]} value=${current} onSelect=${(v) => …} />
 * </Sheet>
 * options 也可以直接給字串陣列
 */
export function SheetOptions({ options, value, onSelect }) {
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return html`
    ${items.map(
      (o) => html`
        <button class=${'sheet__option' + (o.value === value ? ' sheet__option--selected' : '')} onClick=${() => onSelect(o.value)}>
          <span>
            <span class="t-subtitle-regular">${o.label}</span>
            ${o.desc && html`<span class="sheet__option-desc t-caption-regular c-secondary">${o.desc}</span>`}
          </span>
          ${o.value === value && html`<span>✓</span>`}
        </button>
      `
    )}
  `;
}
