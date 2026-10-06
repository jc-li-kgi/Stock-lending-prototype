// 更多服務清單：查看借還款紀錄 / 管理擔保品 / 查看對帳單
import { html } from '../../lib/preact.js';
import { Icon, Button } from '../../components/index.js';
import { showToast } from '../../store.js';
import { navigate } from '../../router.js';
import { COPY } from '../../content/copy.js';

// 對應 COPY.hub.services 的順序；null = 尚未實作
const TARGETS = ['/records/loans', null, null];

export function MoreServices({ showZoneLink = true }) {
  const t = COPY.hub;
  const go = (path) => (path ? navigate(path) : showToast(COPY.common.notAvailable));

  return html`
    <section class="more-services">
      <div class="more-services__head">
        <p class="t-subtitle-bold c-primary">${t.moreServices}</p>
        ${showZoneLink &&
        html`<${Button} variant="text" typo="n-body-regular" onClick=${() => showToast(COPY.common.notAvailable)}>${t.goZone}<//>`}
      </div>
      <div class="card more-services__list">
        ${t.services.map(
          (label, i) => html`
            <button class="more-services__item" onClick=${() => go(TARGETS[i])}>
              <span class="t-subtitle-regular c-primary">${label}</span>
              <${Icon} name="chevron-forward.svg" size=${16} />
            </button>
          `
        )}
      </div>
    </section>
  `;
}
