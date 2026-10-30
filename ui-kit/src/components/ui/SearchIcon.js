// 搜尋 icon（圓圈 + 握把，Figma 為組合圖層）｜Figma：.Atom/Search Icon、Basic/search
import { html } from '../../lib/preact.js';

export function SearchIcon({ size = 24 }) {
  return html`
    <span class="search-icon" style=${`width:${size}px;height:${size}px`} aria-hidden="true">
      <img src="assets/icons/search-circle.svg" width="17.52" height="17.52" alt="" />
      <i />
    </span>
  `;
}
