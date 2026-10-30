// 股票名稱 + 代碼
import { html } from '../../lib/preact.js';

/**
 * <StockName name="台積電" code="2330" />          上下兩行（列表用）：名稱粗體、代碼次要色
 * <StockName name="台積電" code="2330" inline />   同一行（勾選項目標題用）
 */
export function StockName({ name, code, inline = false }) {
  if (inline) return html`<p class="stock-name t-body-bold">${name} ${code}</p>`;
  return html`
    <div class="stock-name">
      <p class="t-body-bold c-primary">${name}</p>
      <p class="n-body-regular c-secondary">${code}</p>
    </div>
  `;
}
