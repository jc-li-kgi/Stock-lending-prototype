// 借款 第 2 步：確認資料
import { html, useEffect } from '../../lib/preact.js';
import { PageHeader, StepBar, DetailRow, Button, AmountHero } from '../../components/index.js';
import { useStore, borrow } from '../../store.js';
import { navigate } from '../../router.js';
import { flowPosition, nextStep, prevStep } from '../../flows/flows.js';
import { LOAN_RULES, interestFor, today, addMonths } from '../../lib/calc.js';
import { twd, rate, date } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/loan/confirm';

export function LoanConfirm() {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.draft);
  const t = COPY.loan;

  // 沒有草稿（例如直接開網址）就回第 1 步
  useEffect(() => {
    if (!draft.amount) navigate('/loan/amount', { replace: true });
  }, []);
  if (!draft.amount) return null;

  const start = today();
  const bank = account.payoutBank;

  const submit = () => {
    borrow(draft);
    nextStep(PATH);
  };

  return html`
    <div class="page loan-page">
      <div>
        <${PageHeader} title=${t.title} onBack=${() => prevStep(PATH)} />
        <${StepBar} ...${flowPosition(PATH)} />
      </div>

      <div class="loan-body loan-body--confirm">
        <section class="card confirm-card">
          <${AmountHero} label=${t.amount} amount=${draft.amount} />

          <${DetailRow} label=${t.refRate} value=${rate(LOAN_RULES.rate)} />
          <${DetailRow} label=${t.estInterest} value=${twd(interestFor(draft.amount))} />
          <${DetailRow} label=${t.fee} value=${twd(LOAN_RULES.fee)} />
          <${DetailRow} label=${t.startDate} value=${date(start)} />
          <${DetailRow} label=${t.dueDate} value=${date(addMonths(start, LOAN_RULES.termMonths))} />
          <${DetailRow} label=${t.applyDate} value=${date(start)} />
          <${DetailRow} label=${t.purpose} value=${draft.purpose} valueClass="t-body-regular" />
          <${DetailRow} label=${t.payout} value=${html`<p class="t-body-regular">${bank.name}</p><p class="n-body-regular">${bank.number}</p>`} />
        </section>

        <div class="bottom-actions confirm-actions">
          <${Button} class="confirm-actions__btn" onClick=${submit}>${COPY.common.confirm}<//>
        </div>
      </div>
    </div>
  `;
}
