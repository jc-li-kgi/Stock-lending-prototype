// 股票借貸摘要卡：帳務頁、借貸專區共用
//   variant="account"  帳務頁：大字是整戶維持率
//   variant="zone"     借貸專區：大字是剩餘可借額度
import { html } from '../../lib/preact.js';
import { SummaryCard, Button } from '../../components/index.js';
import { useStore, showToast } from '../../store.js';
import { collateralValue, creditLimit, loanBalance, remainingCredit, maintenanceRatio } from '../../lib/calc.js';
import { twd, pct } from '../../lib/format.js';
import { startFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

export function LendingSummaryCard({ variant = 'account' }) {
  const account = useStore((s) => s.account);
  const t = COPY.hub;
  const z = COPY.zone;
  const ratio = pct(maintenanceRatio(account)).replace(' ', '');

  const head =
    variant === 'zone'
      ? { label: z.remaining, value: twd(remainingCredit(account)) }
      : { label: t.ratio, value: ratio };

  const rows =
    variant === 'zone'
      ? [
          [z.ratio, ratio],
          [z.borrowed, twd(loanBalance(account))],
          [z.limit, twd(creditLimit(account))],
        ]
      : [
          [t.collateralValue, twd(collateralValue(account))],
          [t.borrowed, twd(loanBalance(account))],
          [t.remaining, twd(remainingCredit(account))],
        ];

  return html`
    <${SummaryCard}
      label=${head.label}
      value=${head.value}
      rows=${rows}
      onBell=${() => showToast(COPY.common.notAvailable)}
      actions=${html`
        <${Button} variant="text" onClick=${() => startFlow('collateralIn')}>${t.raiseLimit}<//>
        <${Button} variant="capsule" onClick=${() => startFlow('existingLoan')}>${t.borrowAgain}<//>
      `}
    />
  `;
}
