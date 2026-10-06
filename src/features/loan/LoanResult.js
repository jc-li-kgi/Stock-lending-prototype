// 借款完成頁
import { html } from '../../lib/preact.js';
import { PageHeader, Button } from '../../components/index.js';
import { exitFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

export function LoanResult() {
  const t = COPY.loan;
  return html`
    <div class="page page--white result-page">
      <${PageHeader} title=${t.title} showShare=${false} />

      <div class="result-page__content">
        <div class="result-page__image">
          <img src="assets/icons/success.svg" width="111.648" height="105.419" alt="" />
        </div>
        <div class="result-page__text">
          <p class="t-headline c-primary">${t.resultTitle}</p>
          <p class="t-body-l c-secondary">${t.resultDesc}</p>
        </div>
      </div>

      <div class="bottom-actions result-page__actions">
        <${Button} onClick=${() => exitFlow('/records/loans')}>${t.viewRecords}<//>
        <${Button} variant="text" block onClick=${() => exitFlow()}>${COPY.common.done}<//>
      </div>
    </div>
  `;
}
