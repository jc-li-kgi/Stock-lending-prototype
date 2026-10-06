import { html } from '../../lib/preact.js';

/**
 * Figma 匯出的 icon，放在 assets/icons/
 * <Icon name="info.svg" size=${16} />
 * <Icon name="add.svg" tint />   ← 顏色跟著文字色（currentColor），可用 token 換色、停用變灰
 */
export function Icon({ name, size = 24, width, height, alt = '', tint = false }) {
  const w = width ?? size;
  const h = height ?? size;
  const src = `assets/icons/${name}`;
  if (tint) {
    // CSS 變數裡的相對路徑會以 CSS 檔位置解析，所以先轉成完整網址
    const url = new URL(src, document.baseURI).href;
    return html`<span class="icon-tint" role=${alt ? 'img' : undefined} aria-label=${alt || undefined}
      style=${`width:${w}px;height:${h}px;--icon:url('${url}')`} />`;
  }
  return html`<img src=${src} width=${w} height=${h} alt=${alt} />`;
}
