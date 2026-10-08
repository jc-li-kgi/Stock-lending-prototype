// 匯入擔保品 第 2 步：確認資料
import { html, useEffect } from '../../lib/preact.js';
import { PageHeader, StepBar, DetailRow, Button, AmountHero, CollapsibleCard } from '../../components/index.js';
import { useStore, pledgeCollateral } from '../../store.js';
import { navigate } from '../../router.js';
import { flowPosition, nextStep, prevStep } from '../../flows/flows.js';
import { stockOf, loanableOf, marketValueOf, today } from '../../lib/calc.js';
import { twd, date } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/collateral-in/confirm';

export function CollateralConfirm() {
  const draft = useStore((s) => s.collateralDraft);
  const t = COPY.collateral;
  const items = Object.entries(draft.selected || {}).map(([code, lots]) => ({ code, lots }));

  // 沒有草稿（例如直接開網址）就回第 1 步
  useEffect(() => {
    if (!items.length) navigate('/collateral-in/select', { replace: true });
  }, []);
  if (!items.length) return null;

  const submit = () => {
    pledgeCollateral(items);
    nextStep(PATH);
  };

  return html`
    <div class="page loan-page">
      <div>
        <${PageHeader} title=${t.title} onBack=${() => prevStep(PATH)} />
        <${StepBar} ...${flowPosition(PATH)} />
      </div>

      <div class="loan-body loan-body--confirm">
        <div class="confirm-stack">
          <section class="card confirm-card">
            <${AmountHero} label=${t.total} amount=${loanableOf(items)} />
            <${DetailRow} label=${t.marketValue} value=${twd(marketValueOf(items))} />
            <${DetailRow} label=${t.importDate} value=${date(today())} />
            <${DetailRow} label=${t.channel} value=${t.channelValue} />
          </section>

          <${CollapsibleCard} title=${t.detailTitle}>
            ${items.map(
              (i) => html`
                <${DetailRow}
                  label=${`${stockOf(i.code).name} ${i.code}`}
                  value=${`${i.lots} ${t.lotUnit}`}
                  valueClass="t-body-regular"
                />
              `
            )}
          <//>
        </div>

        <div class="bottom-actions">
          <${Button} onClick=${submit}>${t.submit}<//>
        </div>
      </div>
    </div>
  `;
}
