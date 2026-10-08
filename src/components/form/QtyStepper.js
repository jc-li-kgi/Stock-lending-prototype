// 數量加減框（有外框，− 數量 單位 ＋）｜Figma：Amount Input
import { html, useState } from '../../lib/preact.js';
import { Icon } from '../ui/Icon.js';

/**
 * <QtyStepper value=${2} min=${1} max=${15} unit="張" onChange=${setLots} />
 * 直接輸入時，離開欄位會自動修正到 min～max
 */
export function QtyStepper({ value, min = 1, max = Infinity, step = 1, unit, onChange, label = '數量' }) {
  const [text, setText] = useState(null);
  const clamp = (n) => Math.min(max, Math.max(min, Math.round((Number(n) || 0) / step) * step));
  const commit = () => {
    if (text !== null) onChange(clamp(text.replace(/\D/g, '')));
    setText(null);
  };

  return html`
    <div class="qty-stepper">
      <button class="icon-btn qty-stepper__btn" onClick=${() => onChange(clamp(value - step))} disabled=${value <= min} aria-label="減少">
        <${Icon} name="minus.svg" width=${16.25} height=${1.25} tint />
      </button>
      <span class="qty-stepper__divider" />
      <input
        class="qty-stepper__input n-subtitle-regular"
        inputmode="numeric"
        aria-label=${label}
        value=${text ?? String(value)}
        onFocus=${() => setText(String(value))}
        onInput=${(e) => setText(e.currentTarget.value)}
        onBlur=${commit}
        onKeyDown=${(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
      ${unit && html`<span class="qty-stepper__unit t-subtitle-regular">${unit}</span>`}
      <span class="qty-stepper__divider" />
      <button class="icon-btn qty-stepper__btn" onClick=${() => onChange(clamp(value + step))} disabled=${value >= max} aria-label="增加">
        <${Icon} name="add.svg" width=${16.25} height=${16.25} tint />
      </button>
    </div>
  `;
}
