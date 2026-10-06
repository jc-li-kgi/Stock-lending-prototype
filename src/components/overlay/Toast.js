import { html } from '../../lib/preact.js';
import { useStore } from '../../store.js';

export function Toast() {
  const message = useStore((s) => s.toast);
  return message ? html`<div class="toast t-body-regular" role="status">${message}</div>` : null;
}
