// Figma：Atom_Primary Button_Mobile / Atom_Text Button_Mobile / .Atom/fullbutton-Mobile+Desktop
import { html } from '../../lib/preact.js';

const VARIANT_CLASS = {
  primary: 'btn-primary',   // 藍底白字滿版（下一步、確認）
  text: 'btn-text',         // 藍字無底（完成、提升可借總額）
  capsule: 'btn-capsule',   // 淺藍膠囊（再借一筆）
};

// 各樣式預設文字層級（Guideline › Typography）；要改用 typo 參數覆寫
const VARIANT_TYPO = {
  primary: 't-subtitle-bold',
  text: 't-body-regular',
  capsule: 't-body-regular',
};

/**
 * <Button>下一步</Button>
 * <Button variant="text" block>完成</Button>
 * <Button variant="capsule" href="#/xxx">連結</Button>
 * <Button variant="text" typo="n-body-regular">額度限制</Button>   ← 換文字層級
 */
export function Button({ variant = 'primary', typo, block = false, href, class: extra = '', children, ...rest }) {
  const cls = [VARIANT_CLASS[variant], typo ?? VARIANT_TYPO[variant], block && 'btn--block', extra].filter(Boolean).join(' ');
  return href
    ? html`<a class=${cls} href=${href} ...${rest}>${children}</a>`
    : html`<button class=${cls} ...${rest}>${children}</button>`;
}
