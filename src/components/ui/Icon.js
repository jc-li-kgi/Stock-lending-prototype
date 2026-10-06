import { html } from '../../lib/preact.js';

/** Figma 匯出的 icon，放在 assets/icons/ */
export function Icon({ name, size = 24, width, height, alt = '' }) {
  return html`<img src=${`assets/icons/${name}`} width=${width ?? size} height=${height ?? size} alt=${alt} />`;
}
