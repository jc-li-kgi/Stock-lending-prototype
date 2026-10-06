// 任務清單：新增情境 = 複製一個檔案 + 在這裡加一行
import T2 from './T2-existing-borrow.js';

export const SCENARIOS = [T2];

export const findScenario = (id) => SCENARIOS.find((s) => s.id === id);
