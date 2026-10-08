// 確認資料卡（流程申請 › 詳情概覽卡）｜Figma：detail content
import { html } from '../../lib/preact.js';

/**
 * <DetailCard>
 *   <AmountHero … />
 *   <DetailRow … />
 * </DetailCard>
 * 內距 24×24、資料列間距 20；不含左右外距，放在 .card-stack 裡
 */
export function DetailCard({ children }) {
  return html`<section class="card detail-card">${children}</section>`;
}
