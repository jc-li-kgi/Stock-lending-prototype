// 假資料庫：所有功能都透過這裡讀寫，功能之間不互相 import
// 存在 localStorage，受測者重新整理不會遺失進度
import { useReducer, useEffect } from './lib/preact.js';
import { LOAN_RULES, addMonths, today } from './lib/calc.js';

const KEY = 'lending-proto-state-v1';
const listeners = new Set();

let state = load();

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || emptyState();
  } catch {
    return emptyState();
  }
}

function emptyState() {
  return { taskId: null, entry: null, flow: null, account: null, draft: {}, toast: null };
}

function save() {
  try {
    const { toast, ...persist } = state;
    localStorage.setItem(KEY, JSON.stringify(persist));
  } catch { /* 私密瀏覽模式時忽略 */ }
}

export function getState() {
  return state;
}

export function setState(patch) {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  save();
  listeners.forEach((fn) => fn());
}

export function useStore(selector = (s) => s) {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    listeners.add(force);
    return () => listeners.delete(force);
  }, []);
  return selector(state);
}

/* ---------- 情境 ---------- */

export function loadScenario(scenario) {
  state = {
    ...emptyState(),
    taskId: scenario.id,
    entry: scenario.entry,
    startPath: scenario.startPath,
    account: structuredClone(scenario.account),
  };
  save();
  listeners.forEach((fn) => fn());
}

export function resetAll() {
  state = emptyState();
  save();
  listeners.forEach((fn) => fn());
}

/* ---------- 共用 UI ---------- */

let toastTimer;
export function showToast(message) {
  clearTimeout(toastTimer);
  setState({ toast: message });
  toastTimer = setTimeout(() => setState({ toast: null }), 1800);
}

/* ---------- 借款草稿 ---------- */

export function updateDraft(patch) {
  setState((s) => ({ draft: { ...s.draft, ...patch } }));
}

export function clearDraft() {
  setState({ draft: {} });
}

/* ---------- 業務動作 ---------- */

export function borrow({ amount, purpose }) {
  const date = today();
  const loan = {
    id: 'L' + Date.now().toString().slice(-6),
    amount,
    balance: amount,
    purpose,
    rate: LOAN_RULES.rate,
    applyDate: date,
    startDate: date,
    dueDate: addMonths(date, LOAN_RULES.termMonths),
    status: '撥款中',
  };
  setState((s) => ({
    account: { ...s.account, loans: [loan, ...s.account.loans] },
    draft: {},
  }));
  return loan;
}
