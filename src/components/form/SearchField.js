// 搜尋框（膠囊、白底、放大鏡）｜Figma：搜尋產品關鍵字或代碼
import { html } from '../../lib/preact.js';
import { SearchIcon } from '../ui/SearchIcon.js';

/**
 * <SearchField value=${keyword} onChange=${setKeyword} placeholder="搜尋產品關鍵字或代碼" />
 */
export function SearchField({ value, onChange, placeholder }) {
  return html`
    <label class="search-field">
      <${SearchIcon} />
      <input
        class="t-body-regular"
        type="search"
        placeholder=${placeholder}
        value=${value}
        onInput=${(e) => onChange(e.currentTarget.value.trim())}
      />
    </label>
  `;
}
