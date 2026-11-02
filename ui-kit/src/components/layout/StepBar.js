// 步驟條｜Figma：Progress Indicator
import { html } from '../../lib/preact.js';

/** 第 N 步 xxx ／ 共 M 步，index 從 0 開始 */
export function StepBar({ index, total, label }) {
  return html`
    <div class="step-bar">
      <div class="step-bar__text t-body-regular">
        <div class="step-bar__current">
          <span class="nowrap">第 ${index + 1} 步</span>
          <span>${label}</span>
        </div>
        <span class="step-bar__total nowrap">共 ${total} 步</span>
      </div>
      <div class="step-bar__track">
        ${Array.from({ length: total }, (_, i) =>
          html`<span class=${'step-bar__seg' + (i <= index ? ' step-bar__seg--on' : '')} />`
        )}
      </div>
    </div>
  `;
}
