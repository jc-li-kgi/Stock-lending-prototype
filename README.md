# 股票借貸 易用性測試 Prototype

免建置的靜態網站（Preact + htm），直接放 GitHub Pages 即可用手機測試。

## 本機預覽

```bash
python3 -m http.server 8080
```

開啟 http://localhost:8080/#/moderator

## 測試任務網址

| 任務 | 網址 |
|---|---|
| T2 舊戶再借一筆 | `#/start?task=T2` |

- 開啟任務網址會**重置資料**並跳到起始頁
- 主持人頁：`#/moderator`，或在帳務頁**長按「帳務」標題 1.5 秒**
- 未實作的按鈕會跳「此功能未開放於本次測試」提示

## 設計規範：One KGI Design Guideline

`One KGI Design Guideline/` 是顏色、間距、圓角、陰影、字級的**唯一來源**，由 `index.html` 直接載入：

| 類別 | Token 檔 | 用法範例 |
|---|---|---|
| 顏色 | `Color/colors.css` | `var(--color-content-general-primary)` |
| 間距 | `Spacing/spacing.css` | `var(--spacing-16)` |
| 圓角 | `Radius/radius-tokens.css` | `var(--radius-medium)`（卡片） |
| 陰影 | `Shadow/shadow.css` | `var(--shadow-basic)`（藍底上的卡片） |
| 字級 | `Typography/kgi-typography-tokens.css` | 用 `styles/typography.css` 的 class |

文字樣式 class（`styles/typography.css`）：`.t-*` 中文、`.n-*` 英數，層級名稱同 Guideline：
`display-l/m/s`、`headline`、`title`、`subtitle-bold`、`subtitle-regular`、`body-bold`、`body-regular`、`caption-regular`。
例：`<p class="t-body-regular">`、`<span class="n-title">`。

規則：
- `styles/` 裡**不寫死**顏色、間距、圓角、陰影數值，一律用 Guideline token
- Guideline 沒有的（互動狀態色、字型堆疊、版面寬度）才放 `styles/tokens.css`
- Guideline 更新時，直接覆蓋 `One KGI Design Guideline/` 資料夾即可
- 加大字級：主持人頁切換，或網址加 `?textScale=large`
- 與 Guideline 不同的調整集中在 `styles/kgi-overrides.css`（目前：Web / iOS / Android 字級放大；Body/Subtitle-R 英數改 Medium 只限 Web）

## 字型

依裝置自動切換（`src/boot/platform.js` 偵測，`styles/tokens.css` 設定）：

| 平台 | 中文 | 英文 / 數字 | 來源 |
|---|---|---|---|
| 網頁 | 思源黑體 Noto Sans TC | Montserrat | Google Fonts |
| iOS | 蘋方 PingFang TC | SF Pro | 系統內建 |
| Android | 思源黑體 Noto Sans TC | Roboto | Google Fonts |

在電腦上預覽其他平台：主持人頁的「字型平台」切換，或網址加 `?platform=ios`（`auto` 恢復自動）。

## 常見修改對照

| 想改什麼 | 改這裡 |
|---|---|
| 任務初始資料（借款、擔保品、帳號） | `src/scenarios/*.js` |
| 新增任務 | 複製一個 scenario 檔，並在 `src/scenarios/index.js` 加一行 |
| 文案 | `src/content/copy.js` |
| 步驟順序 / 組新流程 | `src/flows/flows.js` |
| 利率、上下限、手續費、公式 | `src/lib/calc.js` |
| 股價、成數 | `src/mock/stocks.js` |
| 顏色、間距、圓角、陰影、字級 | `One KGI Design Guideline/`（App 補充在 `styles/tokens.css`） |
| 字型 | `styles/tokens.css`（偵測在 `src/boot/platform.js`） |
| 共用元件長相（按鈕、輸入框、費用卡…） | `styles/components.css`，元件用法寫在各元件檔開頭 |

## 結構

```
index.html
One KGI Design Guideline/   ★ 設計規範 token（顏色/間距/圓角/陰影/字級）
styles/          tokens / typography / base / components / 各頁樣式
assets/icons/    Figma 匯出的 icon
src/
  app.js         進入點
  routes.js      網址 → 頁面
  store.js       假資料庫 + 業務動作（borrow…）
  scenarios/     ★ 測試情境
  flows/         ★ 流程定義
  content/       ★ 文案
  lib/           calc（公式）、format（格式）
  mock/          股價
  components/    共用元件（統一從 components/index.js import）
    ui/          Button、Icon、DetailRow、FeeCard
    form/        PickerField（下拉）、AmountField（金額/數量輸入）
    layout/      PageHeader、StepBar、BottomNav
    overlay/     Sheet、InfoSheet、Toast
  shells/        入口外框（帳務頁；之後加借貸專區）
  features/      功能模組：hub、loan、records…
  pages/         TaskStart、Moderator
```

## 部署到 GitHub Pages

1. 將整個資料夾推到 GitHub repo
2. Settings → Pages → Source 選 `Deploy from a branch`，Branch 選 `main` / `root`
3. 網址為 `https://<帳號>.github.io/<repo>/#/start?task=T2`
