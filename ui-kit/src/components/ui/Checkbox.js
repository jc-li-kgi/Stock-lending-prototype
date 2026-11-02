// 勾選框｜Figma：Atom_Check box_Mobile（Selected / Unselected / Unselected-Disable）
import { html } from '../../lib/preact.js';

/**
 * <Checkbox checked=${true} onChange=${(v) => …} label="全選" />
 * 外框 24×24（含 3px 點擊留白），方框 18px
 */
export function Checkbox({ checked = false, disabled = false, onChange, label }) {
  const cls = 'checkbox' + (checked ? ' checkbox--checked' : '') + (disabled ? ' checkbox--disabled' : '');
  return html`
    <button
      type="button"
      role="checkbox"
      aria-checked=${checked}
      aria-label=${label}
      disabled=${disabled}
      class=${cls}
      onClick=${() => !disabled && onChange?.(!checked)}
    >
      <span class="checkbox__box">
        ${checked && html`<img class="checkbox__check" src="assets/icons/check.svg" width="16" height="16" alt="" />`}
      </span>
    </button>
  `;
}
