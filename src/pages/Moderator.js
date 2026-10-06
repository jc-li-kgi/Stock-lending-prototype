// 主持人頁：任務列表、目前狀態、重置
// 進入方式：網址 #/moderator，或在帳務頁長按「帳務」標題 1.5 秒
import { html } from '../lib/preact.js';
import { useStore, resetAll } from '../store.js';
import { SCENARIOS } from '../scenarios/index.js';
import { Button } from '../components/index.js';

const PLATFORMS = [
  ['auto', '自動偵測'],
  ['ios', 'iOS'],
  ['android', 'Android'],
  ['web', '網頁'],
];

const TEXT_SCALES = [
  ['standard', '標準字級'],
  ['large', '加大字級'],
];

/** 切換平台 / 字級：需重新載入頁面，platform.js 才會套用 */
function reloadWith(param, value) {
  location.href = location.pathname + '?' + param + '=' + value + '#/moderator';
}

export function Moderator() {
  const taskId = useStore((s) => s.taskId);
  const base = location.origin + location.pathname;
  const platform = document.documentElement.dataset.platform;
  const textScale = document.documentElement.dataset.kgiTextScale || 'standard';
  const forced = (() => { try { return localStorage.getItem('proto-platform') || 'auto'; } catch { return 'auto'; } })();

  return html`
    <div class="page moderator-page">
      <h1 class="t-headline">測試任務</h1>
      <p class="t-caption-regular c-secondary">目前任務：${taskId || '無'}</p>

      ${SCENARIOS.map(
        (s) => html`
          <div class="card moderator-task">
            <p class="t-subtitle-bold">${s.id}｜${s.title}</p>
            <p class="t-body-regular c-secondary">${s.instruction}</p>
            <p class="t-caption-regular c-tertiary moderator-task__url">${base}#/start?task=${s.id}</p>
            <${Button} variant="capsule" class="moderator-task__go" href=${`#/start?task=${s.id}`}>開始任務<//>
          </div>
        `
      )}

      <div class="card moderator-task">
        <p class="t-subtitle-bold">字型平台：${platform}</p>
        <p class="t-body-regular c-secondary">中文 / 英數字型會依平台切換。這裡可強制切換，方便在電腦上預覽。</p>
        <div class="moderator-options">
          ${PLATFORMS.map(
            ([value, label]) => html`<${Button} variant="capsule" aria-pressed=${value === forced} onClick=${() => reloadWith('platform', value)}>${label}<//>`
          )}
        </div>
        <p class="t-body-regular">中文字 English 1,234,567.89</p>
      </div>

      <div class="card moderator-task">
        <p class="t-subtitle-bold">字級：${textScale === 'large' ? '加大字級' : '標準字級'}</p>
        <p class="t-body-regular c-secondary">依 One KGI Design Guideline 的加大字級規範，測試長輩或視力需求情境時切換。</p>
        <div class="moderator-options">
          ${TEXT_SCALES.map(
            ([value, label]) => html`<${Button} variant="capsule" aria-pressed=${value === textScale} onClick=${() => reloadWith('textScale', value)}>${label}<//>`
          )}
        </div>
      </div>

      <${Button} variant="text" onClick=${resetAll}>清除所有測試資料<//>
    </div>
  `;
}
