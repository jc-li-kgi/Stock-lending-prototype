// 任務清單：新增情境 = 複製一個檔案 + 在這裡加一行
import T2 from './T2-existing-borrow.js';
import T3 from './T3-import-collateral.js';

export const SCENARIOS = [T2, T3];

export const findScenario = (id) => SCENARIOS.find((s) => s.id === id);
