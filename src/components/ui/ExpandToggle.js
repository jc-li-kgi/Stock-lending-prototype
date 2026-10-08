// 展開 / 收起箭頭（收起時朝下、展開時朝上，有旋轉動畫）
// 只負責圖示，點擊行為由外層按鈕處理
import { html } from '../../lib/preact.js';
import { Icon } from './Icon.js';

/**
 * <button onClick=${toggle}><ExpandToggle expanded=${open} /></button>
 */
export function ExpandToggle({ expanded }) {
  return html`
    <span class=${'expand-toggle' + (expanded ? ' expand-toggle--expanded' : '')} aria-hidden="true">
      <${Icon} name="chevron-up.svg" />
    </span>
  `;
}
