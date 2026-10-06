import { html } from '../../lib/preact.js';

/** 底部彈窗：說明文字或選單都用這個 */
export function Sheet({ open, title, onClose, children }) {
  if (!open) return null;
  return html`
    <div class="sheet-mask" onClick=${onClose}>
      <div class="sheet" onClick=${(e) => e.stopPropagation()} role="dialog" aria-label=${title}>
        <div class="sheet__handle" />
        ${title && html`<p class="sheet__title t-subtitle-b c-primary">${title}</p>`}
        ${children}
      </div>
    </div>
  `;
}

/** 說明型彈窗 */
export function InfoSheet({ info, onClose }) {
  return html`
    <${Sheet} open=${!!info} title=${info?.title} onClose=${onClose}>
      <p class="sheet__body t-body">${info?.body}</p>
    <//>
  `;
}
