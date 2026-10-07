// 借款 第 1 步：填寫借款金額
import { html, useState } from '../../lib/preact.js';
import { PageHeader, StepBar, DetailRow, InfoSheet, PickerField, AmountField, FeeCard, Button } from '../../components/index.js';
import { useStore, updateDraft } from '../../store.js';
import { flowPosition, nextStep, prevStep } from '../../flows/flows.js';
import {
  LOAN_RULES, LOAN_PURPOSES, loanBalance, remainingCredit, maintenanceRatio, loanRange, clampAmount, interestFor,
} from '../../lib/calc.js';
import { twd, pct, num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/loan/amount';
const DEFAULT_AMOUNT = 20000;

export function LoanAmount() {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.draft);
  const t = COPY.loan;
  const range = loanRange(account);

  const [amount, setAmount] = useState(clampAmount(draft.amount ?? DEFAULT_AMOUNT, range));
  const [purpose, setPurpose] = useState(draft.purpose ?? '');
  const [purposeError, setPurposeError] = useState(false);
  const [info, setInfo] = useState(null);

  const choosePurpose = (p) => {
    setPurpose(p);
    setPurposeError(false);
  };

  const submit = () => {
    if (!purpose) {
      setPurposeError(true);
      return;
    }
    updateDraft({ amount, purpose });
    nextStep(PATH);
  };

  return html`
    <div class="page loan-page">
      <div>
        <${PageHeader} title=${t.title} onBack=${() => prevStep(PATH)} />
        <${StepBar} ...${flowPosition(PATH)} />
      </div>

      <section class="card card--shadow loan-summary">
        <div class="detail-row">
          <span class="detail-row__label t-body-bold c-primary">${t.ratio}</span>
          <span class="detail-row__value n-title">${pct(maintenanceRatio(account))}</span>
        </div>
        <${DetailRow} label=${t.remaining} value=${twd(remainingCredit(account))} />
        <${DetailRow} label=${t.borrowed} value=${twd(loanBalance(account))} />
      </section>

      <div class="loan-body">
        <div class="loan-cards">
          <section class="card card--full loan-form">
            <${PickerField}
              label=${t.purpose}
              placeholder=${t.purposePlaceholder}
              value=${purpose}
              options=${LOAN_PURPOSES}
              onChange=${choosePurpose}
              error=${purposeError && t.purposeError}
            />

            <${AmountField}
              label=${t.amount}
              prefix="TWD"
              value=${amount}
              onChange=${setAmount}
              ...${range}
              action=${{ label: t.limitLink, onClick: () => setInfo(t.limitSheet) }}
              hints=${[t.rangeHint(num(range.min), num(range.max)), t.stepHint(num(range.step))]}
            />

            <${DetailRow}
              label=${t.ratioAfter}
              labelClass="t-body-bold c-primary"
              value=${pct(maintenanceRatio(account, amount))}
              valueClass="n-subtitle-bold"
              onInfo=${() => setInfo(t.ratioSheet)}
            />
          </section>

          <${FeeCard}
            full
            title=${t.feeTitle}
            rows=${[
              { label: t.refRate, value: `${+(LOAN_RULES.rate * 100).toFixed(2)}%` },
              { label: t.halfYearInterest, value: twd(interestFor(amount)) },
              { label: t.fee, value: twd(LOAN_RULES.fee), info: t.feeSheet },
            ]}
            note=${t.feeNote}
          />
        </div>

        <div class="bottom-actions">
          <${Button} onClick=${submit}>${COPY.common.next}<//>
        </div>
      </div>

      <${InfoSheet} info=${info} onClose=${() => setInfo(null)} />
    </div>
  `;
}
