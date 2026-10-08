// 借款完成頁
import { html } from '../../lib/preact.js';
import { ResultPage } from '../../components/index.js';
import { exitFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

export function LoanResult() {
  const t = COPY.loan;
  return html`
    <${ResultPage}
      header=${t.title}
      title=${t.resultTitle}
      desc=${t.resultDesc}
      primary=${{ label: t.viewRecords, onClick: () => exitFlow('/records?tab=loans') }}
      secondary=${{ label: COPY.common.done, onClick: () => exitFlow() }}
    />
  `;
}
