// Figma：Atom_Primary Button_Mobile / Atom_Text Button_Mobile / .Atom/fullbutton-Mobile+Desktop
import { html } from '../../lib/preact.js';

const VARIANT_CLASS = {
  primary: 'btn-primary',   // 藍底白字滿版（下一步、確認）
  text: 'btn-text',         // 藍字無底（完成、提升可借總額）
  capsule: 'btn-capsule',   // 淺藍膠囊（再借一筆）
};

/**
 * <Button>下一步</Button>
 * <Button variant="text" block>完成</Button>
 * <Button variant="capsule" href="#/xxx">連結</Button>
 */
export function Button({ variant = 'primary', block = false, href, class: extra = '', children, ...rest }) {
  const cls = [VARIANT_CLASS[variant], block && 'btn--block', extra].filter(Boolean).join(' ');
  return href
    ? html`<a class=${cls} href=${href} ...${rest}>${children}</a>`
    : html`<button class=${cls} ...${rest}>${children}</button>`;
}
