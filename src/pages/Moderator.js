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

/** 切換字型平台：需重新載入頁面，platform.js 才會載入對應字型 */
function switchPlatform(value) {
  location.href = location.pathname + '?platform=' + value + '#/moderator';
}

export function Moderator() {
  const taskId = useStore((s) => s.taskId);
  const base = location.origin + location.pathname;
  const platform = document.documentElement.dataset.platform;

  return html`
    <div class="page moderator-page">
      <h1 class="t-headline">測試任務</h1>
      <p class="t-caption c-secondary">目前任務：${taskId || '無'}</p>

      ${SCENARIOS.map(
        (s) => html`
          <div class="card moderator-task">
            <p class="t-subtitle-b">${s.id}｜${s.title}</p>
            <p class="t-body c-secondary">${s.instruction}</p>
            <p class="t-caption c-tertiary moderator-task__url">${base}#/start?task=${s.id}</p>
            <${Button} variant="capsule" class="moderator-task__go" href=${`#/start?task=${s.id}`}>開始任務<//>
          </div>
        `
      )}

      <div class="card moderator-task">
        <p class="t-subtitle-b">字型平台：${platform}</p>
        <p class="t-body c-secondary">中文 / 英數字型會依平台切換。這裡可強制切換，方便在電腦上預覽。</p>
        <div class="moderator-platforms">
          ${PLATFORMS.map(
            ([value, label]) => html`<${Button} variant="capsule" onClick=${() => switchPlatform(value)}>${label}<//>`
          )}
        </div>
        <p class="t-body">中文字 English 1,234,567.89</p>
      </div>

      <${Button} variant="text" onClick=${resetAll}>清除所有測試資料<//>
    </div>
  `;
}
