// 匯入擔保品完成頁
import { html } from '../../lib/preact.js';
import { ResultPage } from '../../components/index.js';
import { exitFlow, startFlow, flowReturnPath } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

export function CollateralResult() {
  const t = COPY.collateral;
  return html`
    <${ResultPage}
      header=${t.title}
      title=${t.resultTitle}
      desc=${t.resultDesc}
      primary=${{ label: t.borrowNow, onClick: () => startFlow('existingLoan', { returnTo: flowReturnPath() }) }}
      secondary=${{ label: t.viewCollateral, onClick: () => exitFlow('/records?tab=collateral') }}
    />
  `;
}
