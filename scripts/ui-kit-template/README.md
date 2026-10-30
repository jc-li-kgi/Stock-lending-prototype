# ui-kit（凱基 One KGI 元件與樣式）

從「股票借貸 prototype」整理出來的元件、樣式、icon、字體與設計規範，可以直接複製到其他專案使用。

> 這個資料夾是程式自動產生的（`python3 scripts/build-ui-kit.py`），**不要在股票借貸專案裡直接改 ui-kit/**，
> 要改請改原本的元件或樣式，再重新產生。

## 內容

| 資料夾 / 檔案 | 內容 |
|---|---|
| `One KGI Design Guideline/` | 顏色、間距、圓角、陰影、字級 token（唯一來源） |
| `styles/` | 字級調整、元件樣式、文字顏色等工具 class |
| `assets/icons/` | 所有 icon |
| `src/components/` | 元件（`index.js` 統一 import） |
| `src/lib/` | Preact + htm、金額 / 日期格式、長按 |
| `src/kit.js` | **新專案要改的設定**：元件預設文字、Toast、換頁、金額規則 |
| `index.html`、`docs/` | 元件文件頁（網頁版，參考 shadcn/ui）：安裝與設定、字體規範、Icon 尺寸、每個元件的適用平台 / 手機預覽 / 程式碼。新專案不需要這兩個 |
| `設計規範.md` | 設計規則（token、字級、icon 尺寸、底部按鈕、間距），貼進新專案的 CLAUDE.md |

## 在新專案使用

1. 把整個 `ui-kit/` 的內容複製到新專案根目錄（或保留成 `ui-kit/` 子資料夾，路徑跟著調整）。
2. 照文件頁「安裝與設定」的 `<head>` 載入字型和 CSS（順序很重要：Guideline → kgi-overrides → tokens → typography → base → components → 你的頁面 css → utilities）。
3. 元件從 `src/components/index.js` import，例如：
   ```js
   import { html, render } from './src/lib/preact.js';
   import { Button, DetailRow } from './src/components/index.js';
   ```
4. 依新專案需要修改 `src/kit.js`（例如「此功能未開放」的文字、換頁方式）。
5. 把 `設計規範.md` 的內容貼進新專案的 `CLAUDE.md`。

> 看文件：在 ui-kit 資料夾執行 `python3 -m http.server 8080`，開啟 http://localhost:8080/
6. 用本機伺服器開啟（例如 `python3 -m http.server 8080`），直接點開 html 檔案 ES module 會無法載入。

## 要注意

- 底部導覽 `BottomNav` 預設是證券 App 的 6 個項目，新專案請傳入自己的 `items`；長按「更多」的行為用 `onMoreLongPress` 設定（傳 `null` 關閉）。
- 股票借貸專案更新元件後，這裡不會自動同步；需要時在股票借貸專案重新產生，再複製一次。
