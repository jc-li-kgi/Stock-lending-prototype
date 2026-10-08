// 流程定義：每個流程 = 依序的步驟 + 完成頁
// 調整步驟順序、或組合新流程（例如未開戶 = 開戶 + 匯入擔保品 + 借款），只改這裡
import { getState, setState } from '../store.js';
import { navigate, parseHash } from '../router.js';

export const FLOWS = {
  existingLoan: {
    steps: [
      { path: '/loan/amount', label: '填寫借款金額' },
      { path: '/loan/confirm', label: '確認資料' },
    ],
    done: '/loan/result',
  },

  collateralIn: {
    steps: [
      { path: '/collateral-in/select', label: '匯入擔保品' },
      { path: '/collateral-in/confirm', label: '確認資料' },
    ],
    done: '/collateral-in/result',
  },

  // 之後新增，例如：
  // newAccountLoan: {
  //   steps: [
  //     { path: '/onboarding/sign', label: '簽署契約' },
  //     { path: '/collateral-in/select', label: '選擇擔保品' },
  //     { path: '/loan/amount', label: '填寫借款金額' },
  //     { path: '/loan/confirm', label: '確認資料' },
  //   ],
  //   done: '/loan/result',
  // },
};

/* 各入口的首頁（完成、返回時回到這裡） */
export const ENTRY_HOME = {
  account: '/account',
  lendingZone: '/lending-zone',
};

export function entryHome() {
  return ENTRY_HOME[getState().entry] || '/account';
}

/**
 * 開始流程；會記住從哪一頁進來，完成或在第 1 步返回時回到那一頁
 *   query     帶給第 1 步的參數，例如 startFlow('collateralIn', { query: { code: '2330' } })
 *   returnTo  指定結束後回到哪一頁（預設 = 目前頁面）
 */
export function startFlow(flowId, { query, returnTo } = {}) {
  const from = returnTo || location.hash.slice(1) || entryHome();
  setState({ flow: flowId, flowReturn: from });
  const qs = query ? '?' + new URLSearchParams(query) : '';
  navigate(FLOWS[flowId].steps[0].path + qs);
}

/** 流程結束後回去的頁面 */
export function flowReturnPath() {
  return getState().flowReturn || entryHome();
}

/** 目前流程；直接開網址時依路徑推斷 */
function currentFlow() {
  const flow = FLOWS[getState().flow];
  if (flow) return flow;
  const { path } = parseHash();
  return Object.values(FLOWS).find((f) => f.steps.some((s) => s.path === path) || f.done === path) || FLOWS.existingLoan;
}

/** 目前頁面在流程中的位置，給 StepBar 用 */
export function flowPosition(path) {
  const { steps } = currentFlow();
  const index = steps.findIndex((s) => s.path === path);
  return { index, total: steps.length, label: steps[index]?.label };
}

export function nextStep(path) {
  const { steps, done } = currentFlow();
  const index = steps.findIndex((s) => s.path === path);
  const next = steps[index + 1];
  // 進完成頁時用 replace，避免按返回又回到確認頁重複送出
  if (next) navigate(next.path);
  else navigate(done, { replace: true });
}

export function prevStep(path) {
  const { steps } = currentFlow();
  const index = steps.findIndex((s) => s.path === path);
  navigate(index > 0 ? steps[index - 1].path : flowReturnPath());
}

/** 結束流程；to 不給時回到進入流程前的頁面 */
export function exitFlow(to) {
  const target = to || flowReturnPath();
  setState({ flow: null, flowReturn: null });
  navigate(target);
}
