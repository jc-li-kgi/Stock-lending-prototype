// 流程定義：每個流程 = 依序的步驟 + 完成頁
// 調整步驟順序、或組合新流程（例如未開戶 = 開戶 + 匯入擔保品 + 借款），只改這裡
import { getState, setState } from '../store.js';
import { navigate } from '../router.js';

export const FLOWS = {
  existingLoan: {
    steps: [
      { path: '/loan/amount', label: '填寫借款金額' },
      { path: '/loan/confirm', label: '確認資料' },
    ],
    done: '/loan/result',
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

export function startFlow(flowId) {
  setState({ flow: flowId });
  navigate(FLOWS[flowId].steps[0].path);
}

function currentFlow() {
  return FLOWS[getState().flow] || FLOWS.existingLoan;
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
  navigate(index > 0 ? steps[index - 1].path : entryHome());
}

export function exitFlow(to = entryHome()) {
  setState({ flow: null });
  navigate(to);
}
