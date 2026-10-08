// 膠囊型頁籤（整排平分）｜Figma：總覽 / 試算、借款 / 還款、已擔保 / 未擔保 / 歷史紀錄
import { html } from '../../lib/preact.js';

/**
 * <SegmentedTabs tabs=${[{ key: 'a', label: '總覽' }, …]} active="a" onChange=${setTab} />
 */
export function SegmentedTabs({ tabs, active, onChange }) {
  return html`
    <div class="segmented" role="tablist">
      ${tabs.map(
        (t) => html`
          <button
            role="tab"
            aria-selected=${t.key === active}
            class=${'segmented__item ' + (t.key === active ? 'segmented__item--active t-body-bold' : 't-body-regular')}
            onClick=${() => onChange(t.key)}
          >${t.label}</button>
        `
      )}
    </div>
  `;
}
