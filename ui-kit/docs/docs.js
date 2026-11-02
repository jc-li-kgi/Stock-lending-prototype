// One KGI UI Kit 元件文件頁（參考 shadcn/ui 的整理方式：左側目錄、右側每個元件的說明 / 適用平台 / 預覽 / 程式碼）
// 程式碼範例裡的 @{ 會在顯示時換成 ${（避免和這個檔案自己的樣板字串衝突）
import { html, render, useState, useEffect, useRef } from '../src/lib/preact.js';
import * as UI from '../src/components/index.js';
import { showToast } from '../src/kit.js';

const {
  Icon, Button, InfoLabel, DetailRow, DetailPanel, DetailCard, SummaryCard, FeeCard, AmountHero, AmountCell,
  StockName, SectionHeader, CollapsibleCard, ExpandToggle, IconAction, EmptyState, StatGroup, NoticeBar, NoticeCard,
  StatementCard, ExpandButton, DateTimeLines, StockPickCard, ServiceCardList, AccountPicker, CheckboxHeader, Accordion,
  Checkbox, FilterPill, Tag, SearchIcon, PickerField, AmountField, QtyStepper, SelectableItem, NumberField, RadioGroup,
  SearchField, FlowPage, PageHeader, StepBar, BottomNav, TextTabs, SegmentedTabs, ListTable, ListRow, Carousel,
  TotalBar, BottomActions, ResultPage, Sheet, Dialog, InfoDialog, SheetOptions, Toast, StickyFooter,
} = UI;

const toast = (msg) => () => showToast(msg);
const info = { title: '借款手續費', body: '每筆借款於撥款時收取手續費 TWD 2。' };

/* ---------- 適用平台 ---------- */
const PLATFORM = {
  both: { label: '手機＋網頁', cls: 'docs-badge--web', desc: '版面會依容器寬度伸縮，字級在畫面 > 768px 時自動換成網頁版' },
  mobile: { label: '手機版優先', cls: 'docs-badge--mobile', desc: '依 375px 手機設計（固定欄寬、橫向滑動、底部彈窗），網頁版建議另外設計或放在窄欄' },
  mobileOnly: { label: '僅限手機', cls: 'docs-badge--mobile-only', desc: '手機頁面框架（滿版頁面、固定在畫面底部），網頁版不適用' },
};

/* ==================== 共用小元件 ==================== */
function Code({ code }) {
  const text = code.trim().replaceAll('@{', '${');
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200); });
  return html`
    <div class="docs-code">
      <pre class="n-caption-regular"><code>${text}</code></pre>
      <button class="docs-code__copy t-caption-regular" onClick=${copy}>${copied ? '已複製' : '複製'}</button>
    </div>
  `;
}

function Badge({ platform }) {
  const p = PLATFORM[platform];
  return html`<span class=${'docs-badge t-caption-regular ' + p.cls} title=${p.desc}>${p.label}</span>`;
}

/** 手機預覽框（375px，套用手機版字級） */
function Mobile({ page = false, children }) {
  return html`<div class=${'mobile-frame' + (page ? ' mobile-frame--page' : '')}>${page ? children : html`<div class="mobile-frame__body">${children}</div>`}</div>`;
}

function Section({ id, title, platform, desc, children }) {
  return html`
    <section class="docs-section" id=${id}>
      <div class="docs-section__head">
        <div class="docs-section__title">
          <h2 class="t-title c-primary">${title}</h2>
          ${platform && html`<div class="docs-badges"><${Badge} platform=${platform} /></div>`}
        </div>
        ${desc && html`<p class="t-body-regular c-secondary">${desc}</p>`}
      </div>
      ${children}
    </section>
  `;
}

/** 元件：預覽（左）＋ 程式碼（右） */
function Demo({ page, code, children }) {
  return html`
    <div class="docs-demo">
      <${Mobile} page=${page}>${children}<//>
      <${Code} code=${code} />
    </div>
  `;
}

/* ==================== 開始使用 ==================== */
const HEAD_CODE = `
<!-- 1. 網頁字型：中文 思源黑體、英數 Montserrat -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" />

<!-- 2. One KGI Design Guideline token（順序不能換） -->
<link rel="stylesheet" href="One%20KGI%20Design%20Guideline/Color/colors.css" />
<link rel="stylesheet" href="One%20KGI%20Design%20Guideline/Spacing/spacing.css" />
<link rel="stylesheet" href="One%20KGI%20Design%20Guideline/Radius/radius-tokens.css" />
<link rel="stylesheet" href="One%20KGI%20Design%20Guideline/Shadow/shadow.css" />
<link rel="stylesheet" href="One%20KGI%20Design%20Guideline/Typography/kgi-typography-tokens.css" />
<link rel="stylesheet" href="styles/kgi-overrides.css" />   <!-- 手機版字級調整，不要就拿掉 -->

<!-- 3. 元件樣式 -->
<link rel="stylesheet" href="styles/tokens.css" />
<link rel="stylesheet" href="styles/typography.css" />
<link rel="stylesheet" href="styles/base.css" />
<link rel="stylesheet" href="styles/components.css" />
<!-- 你的頁面 css 放這裡 -->

<!-- 4. 工具 class（.c-* 文字顏色等）必須最後載入 -->
<link rel="stylesheet" href="styles/utilities.css" />
`;

const APP_CODE = `
<div id="app"></div>
<script type="module">
  import { html, render } from './src/lib/preact.js';
  import { PageHeader, Button, DetailRow, Toast } from './src/components/index.js';
  import { showToast } from './src/kit.js';

  function App() {
    return html\`
      <div class="page">
        <@{PageHeader} title="我的頁面" showShare=@{false} />
        <@{DetailRow} label="參考利率" value="2.8 %" />
        <@{Button} onClick=@{() => showToast('送出')}>確認送出<//>
        <@{Toast} />
      </div>
    \`;
  }
  render(html\`<@{App} />\`, document.getElementById('app'));
</script>
`;

const KIT_CODE = `
// src/kit.js：新專案依需要修改（元件本身不用改）
export const COPY = {
  common: {
    notAvailable: '此功能未開放於本次測試', // 底部導覽、頁首分享等未實作按鈕
    gotIt: '我知道了',                      // Dialog 預設按鈕
    expand: '展開明細',                     // ExpandButton
    collapse: '收闔明細',
  },
};
export function navigate(path) { location.hash = path; } // 換頁方式（有自己的路由就改這裡）
`;

const TYPO_LEVELS = [
  ['display-l', '大型數字展示'], ['display-m', '大型數字展示'], ['display-s', '大數字（確認頁金額）'],
  ['headline', '頁面主標'], ['title', '區塊標題、重點數字'], ['subtitle-bold', '卡片標題、頁首標題、主要按鈕'],
  ['subtitle-regular', '清單項目、輸入值'], ['body-bold', '欄位標題、重點'], ['body-regular', '內文、標籤、Tab'],
  ['caption-regular', '輔助說明、欄位下方提示'],
];

/** 字級表：直接量測畫面上的 class，手機（預覽框內）與網頁（預覽框外）各一份，數值永遠和樣式檔一致 */
function TypographyTable() {
  const mobileRef = useRef(null);
  const webRef = useRef(null);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const read = (root, cls) => {
      const el = root.querySelector('.' + cls);
      const s = getComputedStyle(el);
      return `${parseFloat(s.fontSize)}px / ${s.fontWeight} / ${(parseFloat(s.lineHeight) / parseFloat(s.fontSize)).toFixed(2)}`;
    };
    setRows(TYPO_LEVELS.map(([lv, use]) => ({
      lv, use,
      mT: read(mobileRef.current, 't-' + lv), mN: read(mobileRef.current, 'n-' + lv),
      wT: read(webRef.current, 't-' + lv), wN: read(webRef.current, 'n-' + lv),
    })));
  }, []);
  const probes = TYPO_LEVELS.map(([lv]) => html`<span class=${'t-' + lv}>字</span><span class=${'n-' + lv}>A</span>`);
  return html`
    <div aria-hidden="true" style="position:absolute;visibility:hidden;height:0;overflow:hidden">
      <div class="mobile-frame" ref=${mobileRef}>${probes}</div>
      <div ref=${webRef}>${probes}</div>
    </div>
    <table class="docs-table t-body-regular">
      <thead><tr><th>層級（class）</th><th>用途</th><th>範例（手機）</th><th>中文 .t-*（手機）</th><th>英數 .n-*（手機）</th><th>中文（網頁）</th><th>英數（網頁）</th></tr></thead>
      <tbody>
        ${rows.map((r) => html`
          <tr>
            <td><code>.t-${r.lv}</code><br /><code>.n-${r.lv}</code></td>
            <td>${r.use}</td>
            <td><div class="mobile-frame docs-typo-sample"><span class=${'t-' + r.lv}>字</span><span class=${'n-' + r.lv}>Aa 12</span></div></td>
            <td class="n-caption-regular">${r.mT}</td><td class="n-caption-regular">${r.mN}</td>
            <td class="n-caption-regular">${r.wT}</td><td class="n-caption-regular">${r.wN}</td>
          </tr>`)}
      </tbody>
    </table>
    <p class="t-caption-regular c-secondary">格式：字級 / 字重 / 行高（倍數）。數值由畫面即時量測，和樣式檔一致。</p>
  `;
}

function GettingStarted() {
  return html`
    <${Section} id="intro" title="介紹" desc="從「股票借貸 prototype」整理出來的凱基 One KGI 元件、樣式、icon 與設計規範。元件用 Preact + htm（不需要建置工具），樣式全部使用 One KGI Design Guideline 的 token。">
      <table class="docs-table t-body-regular">
        <thead><tr><th>資料夾 / 檔案</th><th>內容</th></tr></thead>
        <tbody>
          <tr><td><code>One KGI Design Guideline/</code></td><td>顏色、間距、圓角、陰影、字級 token（唯一來源）</td></tr>
          <tr><td><code>styles/</code></td><td>字級調整（kgi-overrides）、字級 class、元件樣式、文字顏色工具 class</td></tr>
          <tr><td><code>assets/icons/</code></td><td>所有 icon</td></tr>
          <tr><td><code>src/components/</code></td><td>元件（從 <code>index.js</code> 統一 import）</td></tr>
          <tr><td><code>src/kit.js</code></td><td>新專案要改的設定：預設文字、Toast、換頁</td></tr>
          <tr><td><code>設計規範.md</code></td><td>設計規則，貼進新專案的 CLAUDE.md</td></tr>
        </tbody>
      </table>
    <//>

    <${Section} id="install" title="安裝與設定" desc="把整個 ui-kit 資料夾複製到新專案，依序完成下面幾步。">
      <ol class="docs-list t-body-regular">
        <li>在 <code class="docs-inline-code">${'<head>'}</code> 依序載入字型與 CSS（順序很重要：Guideline → kgi-overrides → tokens → typography → base → components → 你的頁面 css → utilities）。</li>
        <li>用 <code class="docs-inline-code">type="module"</code> 的 script 從 <code class="docs-inline-code">src/components/index.js</code> import 元件。</li>
        <li>依需要修改 <code class="docs-inline-code">src/kit.js</code>。</li>
        <li>用本機伺服器開啟（例如 <code class="docs-inline-code">python3 -m http.server 8080</code>），直接點開 html 檔案 module 會無法載入。</li>
      </ol>
      <p class="t-body-bold c-primary">1. ${'<head>'} 載入</p>
      <${Code} code=${HEAD_CODE} />
      <p class="t-body-bold c-primary">2. 使用元件</p>
      <${Code} code=${APP_CODE} />
      <p class="t-body-bold c-primary">3. 設定（src/kit.js）</p>
      <${Code} code=${KIT_CODE} />
    <//>

    <${Section} id="typography" title="字體規範" desc="所有裝置都用網頁字型；字級全部用 class，不在 CSS 寫 font-size / font-weight。">
      <ul class="docs-list t-body-regular">
        <li><b>字型</b>：中文 思源黑體（Noto Sans TC）、英數 Montserrat，堆疊在 <code class="docs-inline-code">--font-base</code>：<code class="docs-inline-code">"Montserrat", "Noto Sans TC", sans-serif</code>。</li>
        <li><b>中文用 <code class="docs-inline-code">.t-*</code>，金額、百分比、日期、帳號用 <code class="docs-inline-code">.n-*</code></b>；中英混排（例如「可借款金額 TWD 10,000」）用 <code class="docs-inline-code">.t-*</code>。只要內容是中文就用 .t-*，即使 Figma 標成 EN 樣式。</li>
        <li><b>響應式</b>：畫面寬度 ≤ 768px 為手機版（mWeb）、${'>'} 768px 為網頁版（Web），class 會自動切換，不需要另外寫。</li>
        <li><b>手機版調整</b>（styles/kgi-overrides.css）：Body 16、Caption 14、Subtitle 18；Body-R、Subtitle-R 英數字重 500。新專案要照 Guideline 原值就不要載入這個檔案。</li>
        <li><b>顏色</b>用 <code class="docs-inline-code">.c-*</code>：c-primary、c-secondary、c-tertiary、c-active、c-negative、c-warning、c-ascend（漲）、c-descend（跌）、c-disabled。</li>
      </ul>
      <${TypographyTable} />
      <${Code} code=${`
<p class="t-headline c-primary">股票借貸，存股變現金</p>
<p class="t-body-regular c-secondary">免賣股、股息照領</p>
<p class="n-title c-primary">TWD 1,000,000</p>
<p class="t-body-regular">可借款金額 <span class="n-body-bold">TWD 10,000</span></p>

/* ✗ 不要這樣寫 */
.my-title { font-size: 18px; font-weight: 500; }
`} />
    <//>

    <${Section} id="icon-size" title="Icon 尺寸" desc="文字旁的 icon（文字按鈕、下拉選單、ⓘ、›）尺寸跟著文字層級，用 level 參數，不寫死 px。">
      <table class="docs-table t-body-regular">
        <thead><tr><th>文字層級</th><th>手機（≤ 768px）</th><th>網頁（${'>'} 768px）</th><th>文字與 icon 間距</th></tr></thead>
        <tbody>
          <tr><td>Caption</td><td>16</td><td>16</td><td>4</td></tr>
          <tr><td>Body</td><td>16</td><td>20</td><td>4</td></tr>
          <tr><td>Subtitle</td><td>20</td><td>24</td><td>前置 icon 8、後置 icon（› ▼）4</td></tr>
        </tbody>
      </table>
      <${Code} code=${`
<@{Icon} name="chevron-forward.svg" level="body" />      // 跟著文字層級
<span class="icon-text--body">文字<@{Icon} name="info.svg" level="body" /></span>
<@{Icon} name="add.svg" tint />                            // tint：顏色跟著文字色
`} />
    <//>

    <${Section} id="platform" title="適用平台說明" desc="每個元件標題旁的標籤：">
      <table class="docs-table t-body-regular">
        <tbody>
          ${Object.entries(PLATFORM).map(([k, p]) => html`<tr><td><${Badge} platform=${k} /></td><td>${p.desc}</td></tr>`)}
        </tbody>
      </table>
      <p class="t-caption-regular c-secondary">預覽框是 375px 手機寬度並套用手機版字級；對話框、底部彈窗會蓋在整個文件頁上方（實際在手機上是蓋滿畫面）。</p>
    <//>
  `;
}

/* ==================== 元件 ==================== */
// 每個元件：id、名稱、分組、適用平台、說明、預覽（函式元件）、程式碼
const COMPONENTS = [
  /* ---------- 基礎 ---------- */
  {
    id: 'button', name: 'Button', group: '基礎', platform: 'both',
    desc: '主要按鈕（藍底滿版）、膠囊按鈕、文字按鈕。文字按鈕用 tone 換色（negative = 紅，例如移除）；停用一律灰。',
    Preview: () => html`
      <div class="docs-pad" style="display:flex;flex-direction:column;gap:var(--spacing-16)">
        <${Button} onClick=${toast('下一步')}>下一步<//>
        <${Button} disabled>停用<//>
      </div>
      <div class="docs-row">
        <${Button} variant="capsule">再借一筆<//>
        <${Button} variant="capsule" class="btn-capsule--sm">小膠囊<//>
        <${Button} variant="text">文字按鈕<//>
        <${Button} variant="text">前往申請<${Icon} name="forward-16.svg" level="body" /><//>
        <${Button} variant="text" tone="negative">移除<//>
      </div>`,
    code: `
<@{Button} onClick=@{submit}>下一步<//>
<@{Button} disabled>停用<//>
<@{Button} variant="capsule">再借一筆<//>
<@{Button} variant="capsule" class="btn-capsule--sm">小膠囊<//>
<@{Button} variant="text">文字按鈕<//>
<@{Button} variant="text">前往申請<@{Icon} name="forward-16.svg" level="body" /><//>
<@{Button} variant="text" tone="negative">移除<//>
<@{Button} variant="text" block>完成<//>          // 滿版文字按鈕`,
  },
  {
    id: 'icon', name: 'Icon / SearchIcon', group: '基礎', platform: 'both',
    desc: 'icon 檔放在 assets/icons/。tint = 顏色跟著文字色；level = 跟著文字層級的尺寸。',
    Preview: () => html`<div class="docs-row">
      <${Icon} name="info.svg" /><${Icon} name="notification.svg" /><${Icon} name="announce.svg" />
      <span class="c-active"><${Icon} name="add.svg" tint /></span>
      <span class="icon-text--body t-body-regular">文字＋icon<${Icon} name="chevron-forward.svg" level="body" /></span>
      <${SearchIcon} />
    </div>`,
    code: `
<@{Icon} name="info.svg" />                     // 預設 24px
<@{Icon} name="add.svg" tint />                 // 顏色跟著文字色
<@{Icon} name="chevron-forward.svg" level="body" />
<@{SearchIcon} />`,
  },
  {
    id: 'tag', name: 'Tag', group: '基礎', platform: 'both',
    desc: '狀態標籤：default（淺藍底）、warning（橘框）、info（淺藍框）、highlight（藍框，對帳單類型）。',
    Preview: () => html`<div class="docs-row"><${Tag}>撥款中<//><${Tag} variant="warning">即將到期<//><${Tag} variant="info">經驗一<//><${Tag} variant="highlight">借款<//></div>`,
    code: `
<@{Tag}>撥款中<//>
<@{Tag} variant="warning">即將到期<//>
<@{Tag} variant="info">經驗一<//>
<@{Tag} variant="highlight">借款<//>`,
  },
  {
    id: 'infolabel', name: 'InfoLabel', group: '基礎', platform: 'both',
    desc: '文字＋ⓘ，點 ⓘ 開說明對話框（info = { title, body }）。',
    Preview: () => html`<div class="docs-pad"><${InfoLabel} label="可借額度總計" info=${info} /></div>`,
    code: `<@{InfoLabel} label="可借額度總計" info=@{{ title: '借款手續費', body: '…' }} />`,
  },
  {
    id: 'filterpill', name: 'FilterPill', group: '基礎', platform: 'both',
    desc: '篩選 / 排序膠囊鈕（文字＋▼），點了通常開底部彈窗選項。',
    Preview: () => html`<div class="docs-row"><${FilterPill} label="近一年" onClick=${toast('篩選')} /><${FilterPill} label="全部類別" /></div>`,
    code: `<@{FilterPill} label="近一年" onClick=@{() => setSheet('period')} />`,
  },
  {
    id: 'checkbox', name: 'Checkbox', group: '基礎', platform: 'both',
    desc: '勾選框（外框 24、方框 18）。標題＋勾選框請用 CheckboxHeader / SelectableItem。',
    Preview: () => { const [v, setV] = useState(true); return html`<div class="docs-row"><${Checkbox} checked=${v} onChange=${setV} label="勾選" /><${Checkbox} disabled label="停用" /></div>`; },
    code: `<@{Checkbox} checked=@{on} onChange=@{setOn} label="全選" />`,
  },

  /* ---------- 資料顯示 ---------- */
  {
    id: 'detailrow', name: 'DetailRow / DateTimeLines', group: '資料顯示', platform: 'both',
    desc: '左標題、右數值的資料列。值預設英數樣式，中文值傳 valueClass="t-body-regular"；日期＋時間兩行用 DateTimeLines。',
    Preview: () => html`<div class="card docs-white" style="margin:0 var(--spacing-16)">
      <${DetailRow} label="參考利率" value="2.8 %" />
      <${DetailRow} label="借款手續費" value="TWD 2" info=${info} />
      <${DetailRow} label="借款目的" value="資金周轉" valueClass="t-body-regular" />
      <${DetailRow} label="申請日" value=${html`<${DateTimeLines} value="2026-10-28T11:45:11" />`} />
    </div>`,
    code: `
<@{DetailRow} label="參考利率" value="2.8 %" />
<@{DetailRow} label="借款手續費" value="TWD 2" info=@{{ title, body }} />
<@{DetailRow} label="借款目的" value="資金周轉" valueClass="t-body-regular" />
<@{DetailRow} label="申請日" value=@{html\`<@{DateTimeLines} value=@{iso} />\`} />`,
  },
  {
    id: 'detailcard', name: 'DetailCard / AmountHero', group: '資料顯示', platform: 'both',
    desc: '確認資料卡（內距 24、資料列間距 20），大金額用 AmountHero。放在 .card-stack 裡。',
    Preview: () => html`<div class="card-stack"><${DetailCard}><${AmountHero} label="借款金額" amount=${400000} /><${DetailRow} label="利率" value="2.8 %" /><${DetailRow} label="到期日" value="2027/04/28" /><//></div>`,
    code: `
<div class="card-stack">
  <@{DetailCard}>
    <@{AmountHero} label="借款金額" amount=@{400000} />
    <@{DetailRow} label="利率" value="2.8 %" />
  <//>
</div>`,
  },
  {
    id: 'detailpanel', name: 'DetailPanel', group: '資料顯示', platform: 'both',
    desc: '列表展開明細卡（內距 16、資料列 12）。放在白卡裡加 tone="blue" 改淡藍底。',
    Preview: () => html`<div class="docs-pad" style="display:flex;flex-direction:column;gap:var(--spacing-16)">
      <${DetailPanel}><${DetailRow} label="還款本金" value="TWD 20,000" /><${DetailRow} label="利息" value="TWD 120" /><//>
      <div class="card docs-white"><${DetailPanel} tone="blue"><${DetailRow} label="累積利息" value="TWD 2,731" /><//></div>
    </div>`,
    code: `
<@{DetailPanel}>…資料列…<//>
<@{DetailPanel} tone="blue">…資料列…<//>   // 放在白色卡片裡`,
  },
  {
    id: 'summarycard', name: 'SummaryCard', group: '資料顯示', platform: 'both',
    desc: '摘要卡。overview（大數字在標題下、內距 16）／ flow（大數字同一行、內距 24）。rows 第 3 個值 warning = 整列橘字。',
    Preview: () => html`<div class="docs-pad" style="display:flex;flex-direction:column;gap:var(--spacing-16)">
      <${SummaryCard} label="整戶維持率" value="405%" rows=${[['擔保品市值', 'TWD 1,621,300'], ['即將到期金額', 'TWD 240,000', 'warning']]}
        actions=${html`<${Button} variant="text">提升可借總額<//><${Button} variant="capsule">再借一筆<//>`} onBell=${toast('通知')} />
      <${SummaryCard} variant="flow" label="當前參考利率" value="2.8 %" />
    </div>`,
    code: `
<@{SummaryCard}
  label="整戶維持率" value="405%"
  rows=@{[['擔保品市值', 'TWD 1,621,300'], ['即將到期金額', 'TWD 240,000', 'warning']]}
  actions=@{html\`<@{Button} variant="capsule">再借一筆<//>\`}
  onBell=@{openBell}
/>
<@{SummaryCard} variant="flow" label="當前參考利率" value="2.8 %" />`,
  },
  {
    id: 'feecard', name: 'FeeCard', group: '資料顯示', platform: 'both',
    desc: '費用卡（標題＋資料列＋備註），row 有 info 時標題旁出現 ⓘ。full = 滿版無圓角。',
    Preview: () => html`<div class="docs-pad"><${FeeCard} title="借款費用" rows=${[{ label: '參考利率', value: '2.8%' }, { label: '借款手續費', value: 'TWD 2', info }]} note="費用僅供參考，實際收費依還款當下計算為準" /></div>`,
    code: `<@{FeeCard} title="借款費用" rows=@{[{ label: '參考利率', value: '2.8%' }, { label: '借款手續費', value: 'TWD 2', info }]} note="費用僅供參考" />`,
  },
  {
    id: 'statementcard', name: 'StatementCard', group: '資料顯示', platform: 'both',
    desc: '對帳單卡片：標題＋類型標籤＋資料列，可展開淡藍明細（沒給 detail 就沒有展開按鈕）。',
    Preview: () => html`<div class="docs-pad"><${StatementCard} title="TWD 240,000" tag="借款"
      rows=${[['起息日', '2026/06/09'], ['到期日', '2026/12/09']]} detail=${[['利率', '2.8 %'], ['借款手續費', 'TWD 2']]} /></div>`,
    code: `
<@{StatementCard}
  title="TWD 240,000" tag="借款"
  rows=@{[['起息日', '2026/06/09'], ['到期日', '2026/12/09']]}
  detail=@{[['利率', '2.8 %'], ['借款手續費', 'TWD 2']]}
/>`,
  },
  {
    id: 'collapsiblecard', name: 'CollapsibleCard', group: '資料顯示', platform: 'both',
    desc: '可收合卡片。variant：flow（內距 24）／ overview（內距 16）。',
    Preview: () => html`<div class="docs-pad" style="display:flex;flex-direction:column;gap:var(--spacing-16)">
      <${CollapsibleCard} title="擔保品匯入明細"><${DetailRow} label="元大台灣50 0050" value="5 張" valueClass="t-body-regular" /><//>
      <${CollapsibleCard} title="追繳風險評估" variant="overview" defaultOpen=${false}><p class="t-body-regular">內容</p><//>
    </div>`,
    code: `<@{CollapsibleCard} title="擔保品匯入明細" defaultOpen variant="flow">…內容…<//>`,
  },
  {
    id: 'expand', name: 'ExpandButton / ExpandToggle', group: '資料顯示', platform: 'both',
    desc: 'ExpandButton：「展開明細 ⌄ / 收闔明細 ⌃」文字按鈕。ExpandToggle：只有箭頭（列表右側）。',
    Preview: () => { const [a, setA] = useState(false); const [b, setB] = useState(false); return html`<div class="docs-row">
      <${ExpandButton} expanded=${a} onClick=${() => setA(!a)} />
      <button onClick=${() => setB(!b)} aria-label="展開"><${ExpandToggle} expanded=${b} /></button></div>`; },
    code: `
<@{ExpandButton} expanded=@{open} onClick=@{() => setOpen(!open)} />
<button onClick=@{toggle}><@{ExpandToggle} expanded=@{open} /></button>`,
  },
  {
    id: 'notice', name: 'NoticeCard / NoticeBar', group: '資料顯示', platform: 'both',
    desc: 'NoticeCard：公告通知條（整張可點，icon 一律 24）。NoticeBar：淡黃提示條。',
    Preview: () => html`<div class="docs-pad" style="display:flex;flex-direction:column;gap:var(--spacing-16)">
      <${NoticeCard} text="有 2 筆借款，即將到期" onClick=${toast('點了通知')} />
      <${NoticeBar}>動用不受限，最快 1 小時撥款，隨借隨還<//></div>`,
    code: `
<@{NoticeCard} text="有 2 筆借款，即將到期" onClick=@{goRecords} />
<@{NoticeBar}>動用不受限，最快 1 小時撥款<//>`,
  },
  {
    id: 'emptystate', name: 'EmptyState', group: '資料顯示', platform: 'both',
    desc: '列表沒有資料時的提示。',
    Preview: () => html`<${EmptyState} text="目前沒有還款紀錄" />`,
    code: `<@{EmptyState} text="目前沒有還款紀錄" />`,
  },
  {
    id: 'stockname', name: 'StockName / AmountCell', group: '資料顯示', platform: 'both',
    desc: 'StockName：股票名稱＋代碼（兩行或 inline 一行）。AmountCell：列表裡的「TWD／金額」兩行。',
    Preview: () => html`<div class="docs-row"><${StockName} name="元大台灣50" code="0050" /><${StockName} inline name="凱基金" code="2883" /><${AmountCell} amount=${128280} /></div>`,
    code: `
<@{StockName} name="元大台灣50" code="0050" />
<@{StockName} inline name="凱基金" code="2883" />
<@{AmountCell} amount=@{128280} />`,
  },
  {
    id: 'statgroup', name: 'StatGroup', group: '資料顯示', platform: 'both',
    desc: '並排的大數字，highlight = 橘色強調；單位中文 / 英文自動判斷字級。',
    Preview: () => html`<div class="docs-pad"><${StatGroup} items=${[{ label: '預估庫存可借貸', value: '106', unit: '萬', highlight: true }, { label: '預估每日利息', value: '82', unit: 'TWD' }]} /></div>`,
    code: `<@{StatGroup} items=@{[{ label: '預估庫存可借貸', value: '106', unit: '萬', highlight: true }, { label: '預估每日利息', value: '82', unit: 'TWD' }]} />`,
  },
  {
    id: 'sectionheader', name: 'SectionHeader / CheckboxHeader', group: '資料顯示', platform: 'both',
    desc: 'SectionHeader：區塊標題＋右側連結＋說明。標題左邊要放全選勾選框時用 CheckboxHeader。',
    Preview: () => { const [v, setV] = useState(false); return html`<div class="docs-pad" style="display:flex;flex-direction:column;gap:var(--spacing-24)">
      <${SectionHeader} title="尚可匯入擔保品" action=${{ label: '查看全部', onClick: toast('查看全部') }} desc="匯入後，可借總額提升 TWD 1,000,000" />
      <${CheckboxHeader} title="可借貸 (2)" desc="勾選要匯入的擔保品" checked=${v} onChange=${setV} /></div>`; },
    code: `
<@{SectionHeader} title="尚可匯入擔保品" action=@{{ label: '查看全部', onClick }} desc="匯入後…" />
<@{CheckboxHeader} title="可借貸 (2)" desc="…" checked=@{all} onChange=@{setAll} />`,
  },
  {
    id: 'accordion', name: 'Accordion', group: '資料顯示', platform: 'both',
    desc: '收合問答（FAQ），一次只展開一題。',
    Preview: () => html`<div class="card card--full docs-white"><${Accordion} defaultOpen=${0} items=${[{ q: '誰可以開股票借貸戶？', a: '年滿 20 歲、開戶滿 3 個月即可開戶。' }, { q: '單筆最低可以借多少？', a: '單筆最低 TWD 10,000。' }]} /></div>`,
    code: `<@{Accordion} defaultOpen=@{0} items=@{[{ q: '誰可以開戶？', a: '年滿 20 歲…' }]} />`,
  },
  {
    id: 'servicecardlist', name: 'ServiceCardList / AccountPicker', group: '資料顯示', platform: 'both',
    desc: 'ServiceCardList：插圖＋標題＋說明的服務清單。AccountPicker：帳號選單。',
    Preview: () => html`<div class="docs-pad" style="display:flex;flex-direction:column;gap:var(--spacing-16)">
      <${AccountPicker} account=${{ id: '9999-999999', name: '流川楓' }} onClick=${toast('切換帳號')} />
      <${ServiceCardList} items=${[{ icon: 'service-learn.png', title: '認識股票借貸', desc: '瀏覽實際案例、試算以及常見問題', onClick: toast('認識') }, { icon: 'service-borrow.png', title: '馬上借貸一筆', desc: '匯入擔保品與借款一次完成', onClick: toast('借款') }]} /></div>`,
    code: `
<@{AccountPicker} account=@{{ id: '9999-999999', name: '流川楓' }} onClick=@{open} />
<@{ServiceCardList} items=@{[{ icon: 'service-learn.png', title: '認識股票借貸', desc: '…', onClick }]} />`,
  },
  {
    id: 'stockpickcard', name: 'StockPickCard / Carousel', group: '資料顯示', platform: 'mobile',
    desc: '精選卡片＋橫向滑動輪播（卡寬 280，左右露出相鄰卡片）。網頁版建議改成並排卡片。',
    Preview: () => html`<${Carousel} label="精選擔保品">
      <${StockPickCard} name="元大台灣50" code="0050" stats=${[{ label: '庫存可借款', value: '32', unit: '萬', highlight: true }, { label: '預估每日利息', value: '25', unit: 'TWD' }]} onClick=${toast('點了卡片')} />
      <${StockPickCard} name="凱基金" code="2883" stats=${[{ label: '庫存可借款', value: '33', unit: '萬', highlight: true }, { label: '預估每日利息', value: '26', unit: 'TWD' }]} />
    <//>`,
    code: `
<@{Carousel} label="精選擔保品">
  <@{StockPickCard} name="元大台灣50" code="0050" stats=@{[…]} onClick=@{go} />
  <@{StockPickCard} name="凱基金" code="2883" stats=@{[…]} />
<//>`,
  },
  {
    id: 'iconaction', name: 'IconAction', group: '資料顯示', platform: 'mobile',
    desc: '圓形圖示捷徑（快捷功能列），依手機一排 4 個設計。',
    Preview: () => html`<div class="docs-row">
      <${IconAction} icon="action-repay.png" label="還款" onClick=${toast('還款')} /><${IconAction} icon="action-records.png" label="查看借還款紀錄" />
      <${IconAction} icon="action-collateral.png" label="管理擔保品" /><${IconAction} icon="action-more.png" label="更多" /></div>`,
    code: `<@{IconAction} icon="action-repay.png" label="還款" onClick=@{openRepay} />`,
  },

  /* ---------- 表單 ---------- */
  {
    id: 'pickerfield', name: 'PickerField', group: '表單', platform: 'both',
    desc: '下拉選擇欄位（點了開底部選單）。自訂選擇畫面時不給 options，改給 displayValue + onOpen。',
    Preview: () => { const [v, setV] = useState(null); return html`<div class="card card--full docs-white"><${PickerField} label="借款目的" value=${v} options=${['資金周轉', '投資理財', '其他']} onChange=${setV} /></div>`; },
    code: `
<@{PickerField} label="借款目的" value=@{v} options=@{['資金周轉', '其他']} onChange=@{setV} />
<@{PickerField} displayValue="元大高股息 0056" placeholder="選擇擔保標的" onOpen=@{openSheet} hint="收盤價 56.30" />`,
  },
  {
    id: 'amountfield', name: 'AmountField', group: '表單', platform: 'both',
    desc: '金額輸入（＋ − 與直接輸入，離開時自動修正到範圍並對齊級距）。value = null 顯示 placeholder。',
    Preview: () => { const [v, setV] = useState(null); return html`<div class="card card--full docs-white"><${AmountField} label="借款金額" prefix="TWD" value=${v} onChange=${setV} min=${10000} max=${600000} step=${1000} placeholder="請輸入借款金額" hints=${['可借款金額 TWD 10,000～TWD 600,000']} action=${{ label: '額度限制', onClick: toast('額度限制') }} /></div>`; },
    code: `
<@{AmountField}
  label="借款金額" prefix="TWD" value=@{amount} onChange=@{setAmount}
  min=@{10000} max=@{600000} step=@{1000}
  placeholder="請輸入借款金額" hints=@{['可借款金額 TWD 10,000～TWD 600,000']}
  action=@{{ label: '額度限制', onClick }}
/>`,
  },
  {
    id: 'numberfield', name: 'NumberField / QtyStepper', group: '表單', platform: 'both',
    desc: 'NumberField：整數輸入＋單位。QtyStepper：＋ − 數量選擇。',
    Preview: () => { const [n, setN] = useState(null); const [q, setQ] = useState(2); return html`<div class="card card--full docs-white">
      <${NumberField} label="擔保張數" value=${n} onChange=${setN} placeholder="請輸入數字" suffix="張" max=${9999} />
      <${QtyStepper} value=${q} min=${1} max=${5} unit="張" onChange=${setQ} /></div>`; },
    code: `
<@{NumberField} label="擔保張數" value=@{n} onChange=@{setN} placeholder="請輸入數字" suffix="張" max=@{9999} />
<@{QtyStepper} value=@{lots} min=@{1} max=@{5} unit="張" onChange=@{setLots} />`,
  },
  {
    id: 'radiogroup', name: 'RadioGroup', group: '表單', platform: 'both',
    desc: '單選（橫排平分）。',
    Preview: () => { const [v, setV] = useState('partial'); return html`<div class="card card--full docs-white"><${RadioGroup} label="還款額度" options=${[{ value: 'partial', label: '部分' }, { value: 'full', label: '全部' }]} value=${v} onChange=${setV} /></div>`; },
    code: `<@{RadioGroup} label="還款額度" options=@{[{ value: 'partial', label: '部分' }, { value: 'full', label: '全部' }]} value=@{mode} onChange=@{setMode} />`,
  },
  {
    id: 'selectableitem', name: 'SelectableItem', group: '表單', platform: 'both',
    desc: '勾選項目（勾選框＋內容），disabled 時整個項目變停用色。',
    Preview: () => { const [v, setV] = useState(true); return html`<div class="card card--full docs-white">
      <${SelectableItem} checked=${v} onChange=${setV} label="元大台灣50"><${StockName} inline name="元大台灣50" code="0050" /><${DetailRow} label="可擔保張數" value="5" /><//>
      <${SelectableItem} disabled label="群創"><${StockName} inline name="群創" code="3481" /><p class="t-body-regular">原因：目前被列為處置股</p><//></div>`; },
    code: `
<@{SelectableItem} checked=@{on} onChange=@{setOn} label="元大台灣50">
  <@{StockName} inline name="元大台灣50" code="0050" />
  <@{DetailRow} label="可擔保張數" value="5" />
<//>`,
  },
  {
    id: 'searchfield', name: 'SearchField', group: '表單', platform: 'both',
    desc: '搜尋框（膠囊）。預設淡藍底放白底上；放在藍底頁面上加 onSurface 改白底。',
    Preview: () => { const [v, setV] = useState(''); return html`<div class="docs-pad"><${SearchField} value=${v} onChange=${setV} placeholder="搜尋產品關鍵字或代碼" onSurface /></div>`; },
    code: `<@{SearchField} value=@{keyword} onChange=@{setKeyword} placeholder="搜尋產品關鍵字或代碼" onSurface />`,
  },

  /* ---------- 版面 ---------- */
  {
    id: 'pageheader', name: 'PageHeader', group: '版面', platform: 'mobile',
    desc: '子頁標題列：返回／標題／分享（showShare 控制右側 icon）。依 App 頁首設計。',
    Preview: () => html`<${PageHeader} title="股票借貸明細" onBack=${toast('返回')} showShare=${false} />`,
    code: `<@{PageHeader} title="股票借貸明細" onBack=@{goBack} showShare=@{false} />`,
  },
  {
    id: 'tabs', name: 'TextTabs / SegmentedTabs', group: '版面', platform: 'both',
    desc: 'TextTabs：文字頁籤（底線）。SegmentedTabs：膠囊分段頁籤，選項數量依 tabs 自動平分（2 個、3 個都用它）。',
    Preview: () => { const [a, setA] = useState('a'); const [b, setB] = useState('a'); const [c, setC] = useState('a'); return html`
      <${TextTabs} tabs=${[{ key: 'a', label: '借還款紀錄' }, { key: 'b', label: '擔保品' }, { key: 'c', label: '對帳單' }]} active=${a} onChange=${setA} />
      <div class="docs-pad"><${SegmentedTabs} tabs=${[{ key: 'a', label: '借款' }, { key: 'b', label: '還款' }]} active=${b} onChange=${setB} /></div>
      <div class="docs-pad"><${SegmentedTabs} tabs=${[{ key: 'a', label: '已擔保' }, { key: 'b', label: '未擔保' }, { key: 'c', label: '歷史紀錄' }]} active=${c} onChange=${setC} /></div>`; },
    code: `
<@{TextTabs} tabs=@{[{ key: 'loans', label: '借還款紀錄' }, …]} active=@{tab} onChange=@{setTab} />
<@{SegmentedTabs} tabs=@{[{ key: 'a', label: '借款' }, { key: 'b', label: '還款' }]} active=@{sub} onChange=@{setSub} />`,
  },
  {
    id: 'stepbar', name: 'StepBar', group: '版面', platform: 'both',
    desc: '流程步驟條（第 N 步／共 M 步），index 從 0 開始。FlowPage 已內建。',
    Preview: () => html`<${StepBar} index=${0} total=${3} label="匯入擔保品" />`,
    code: `<@{StepBar} index=@{0} total=@{3} label="匯入擔保品" />`,
  },
  {
    id: 'listtable', name: 'ListTable / ListRow', group: '版面', platform: 'mobile',
    desc: '列表（表頭＋排序＋分隔線＋可展開列）。欄寬依手機設計，網頁版建議改用表格或卡片。欄位文字最多 2 行，超出顯示「…」。',
    Preview: () => { const [open, setOpen] = useState(null); const [sort, setSort] = useState(null); return html`
      <${ListTable} columns=${[{ label: html`商品名稱<br />代碼`, width: 'minmax(0, 91px)', sortKey: 'code' }, { label: '已匯入張數', width: '96px', align: 'right' }, { label: '可借總金額', width: '102px', align: 'right', info }]} expandable sort=${sort} onSort=${setSort}>
        ${[['元大台灣50', '0050', 2, 128280], ['元大高股息', '0056', 25, 844500]].map(([n, c, l, a]) => html`
          <${ListRow} align=${['left', 'right', 'right']}
            cells=${[html`<${StockName} name=${n} code=${c} />`, html`<p class="n-body-regular c-primary">${l}</p>`, html`<${AmountCell} amount=${a} />`]}
            expanded=${open === c} onToggle=${() => setOpen(open === c ? null : c)}
            footer=${html`<${Button} variant="capsule" class="btn-capsule--sm">賣股還款<//>`}
            detail=${html`<${DetailRow} label="商品名稱" value=${n} valueClass="t-body-regular" />`} />`)}
      <//>`; },
    code: `
<@{ListTable}
  columns=@{[
    { label: html\`商品名稱<br/>代碼\`, width: 'minmax(0, 91px)', sortKey: 'code' },
    { label: '已匯入張數', width: '96px', align: 'right' },
    { label: '可借總金額', width: '102px', align: 'right', info },
  ]}
  expandable sort=@{sort} onSort=@{setSort} empty="目前沒有資料"
>
  @{rows.map((r) => html\`
    <@{ListRow}
      align=@{['left', 'right', 'right']}
      cells=@{[…]}
      expanded=@{open === r.id} onToggle=@{() => toggle(r.id)}
      footer=@{html\`<@{Button} variant="capsule" class="btn-capsule--sm">賣股還款<//>\`}
      detail=@{html\`<@{DetailRow} … />\`}
    />\`)}
<//>`,
  },
  {
    id: 'bottomactions', name: 'BottomActions', group: '版面', platform: 'mobile',
    desc: '頁面底部按鈕區（不固定）：距內容至少 32、內容不滿一屏時置底、距畫面底部 48；多顆直排間距 16。',
    Preview: () => html`<${BottomActions}><${Button}>查看借款紀錄<//><${Button} variant="text" block>完成<//><//>`,
    code: `
<@{BottomActions}>
  <@{Button}>查看借款紀錄<//>
  <@{Button} variant="text" block>完成<//>
<//>`,
  },
  {
    id: 'totalbar', name: 'TotalBar / StickyFooter', group: '版面', platform: 'mobileOnly',
    desc: '固定在畫面底部的總計列＋按鈕。TotalBar 可在置底區內向上展開明細（最高 90%）。',
    page: true,
    Preview: () => { const [open, setOpen] = useState(false); return html`<div class="page">
      <div class="docs-pad" style="padding-top:var(--spacing-16)"><p class="t-body-regular c-secondary">頁面內容…</p></div>
      <${StickyFooter}>
        <${TotalBar} label="可借額度總計" note="(已選取 1 筆)" info=${info} value="TWD 320,700" expanded=${open} onToggle=${() => setOpen(!open)}>
          <p class="t-body-bold c-primary">匯入明細</p><${DetailRow} label="元大台灣50 0050" value="5 張" valueClass="t-body-regular" />
        <//>
        <${Button}>下一步<//>
      <//></div>`; },
    code: `
<@{StickyFooter}>
  <@{TotalBar} label="可借額度總計" note="(已選取 1 筆)" value="TWD 320,700"
    expanded=@{open} onToggle=@{() => setOpen(!open)}>
    …展開的明細…
  <//>
  <@{Button}>下一步<//>
<//>`,
  },
  {
    id: 'flowpage', name: 'FlowPage', group: '版面', platform: 'mobileOnly',
    desc: '流程頁框架：頁首＋步驟條＋內容＋底部按鈕（actions）或固定置底區（sticky）。',
    page: true,
    Preview: () => html`<${FlowPage} title="申請借款" step=${{ index: 1, total: 3, label: '填寫借款金額' }} onBack=${toast('返回')} actions=${html`<${Button}>下一步<//>`}>
      <div class="card-stack"><${DetailCard}><${DetailRow} label="借款金額" value="TWD 400,000" /><${DetailRow} label="利率" value="2.8 %" /><//></div>
    <//>`,
    code: `
<@{FlowPage}
  title="申請借款"
  step=@{{ index: 1, total: 3, label: '填寫借款金額' }}
  onBack=@{prev}
  actions=@{html\`<@{Button}>下一步<//>\`}     // 或 sticky=@{…} 固定置底
>
  …內容…
<//>`,
  },
  {
    id: 'resultpage', name: 'ResultPage', group: '版面', platform: 'mobileOnly',
    desc: '完成頁（成功圖示＋標題＋說明＋主要 / 次要按鈕）。',
    page: true,
    Preview: () => html`<${ResultPage} header="申請借款" title="成功送出申請" desc="我們將在營業日內完成撥款" primary=${{ label: '查看借款紀錄', onClick: toast('查看') }} secondary=${{ label: '完成', onClick: toast('完成') }} />`,
    code: `
<@{ResultPage}
  header="申請借款" title="成功送出申請" desc="我們將在營業日內完成撥款"
  primary=@{{ label: '查看借款紀錄', onClick }}
  secondary=@{{ label: '完成', onClick }}
/>`,
  },
  {
    id: 'bottomnav', name: 'BottomNav', group: '版面', platform: 'mobileOnly',
    desc: 'App 底部導覽（固定在畫面底部）。新專案傳入自己的 items；長按「更多」2 秒的行為用 onMoreLongPress 設定（null 關閉）。',
    page: true,
    Preview: () => html`<div class="page"><div class="docs-pad" style="padding-top:var(--spacing-16)"><p class="t-body-regular c-secondary">頁面內容…</p></div>
      <${BottomNav} active="mine" onMoreLongPress=${() => showToast('長按「更多」')} /></div>`,
    code: `
<@{BottomNav}
  active="mine"
  items=@{[{ key: 'mine', label: '我的', to: '/home', icon: html\`<@{Icon} name="nav-rate.svg" size=@{20} tint />\` }, …]}
  onMoreLongPress=@{null}
/>`,
  },

  /* ---------- 彈出層 ---------- */
  {
    id: 'dialog', name: 'Dialog / InfoDialog', group: '彈出層', platform: 'both',
    desc: '置中對話框。說明（一顆「我知道了」）、確認（兩顆按鈕，左次要右主要）。InfoDialog：info 物件有值就開啟。',
    Preview: () => { const [d, setD] = useState(null); const [i, setI] = useState(null); return html`<div class="docs-row">
      <${Button} variant="capsule" onClick=${() => setD('info')}>說明<//><${Button} variant="capsule" onClick=${() => setD('confirm')}>確認<//><${Button} variant="capsule" onClick=${() => setI(info)}>InfoDialog<//>
      <${Dialog} open=${d === 'info'} title="借款手續費規則" body="首次還款或展延時收取借款手續費。" onClose=${() => setD(null)} />
      <${Dialog} open=${d === 'confirm'} title="即將前往匯入擔保品" body="匯入完成後才能借款，確定要前往嗎？" bodyAlign="center" onClose=${() => setD(null)} actions=${[{ label: '返回', secondary: true }, { label: '確認前往', onClick: () => { setD(null); showToast('確認前往'); } }]} />
      <${InfoDialog} info=${i} onClose=${() => setI(null)} /></div>`; },
    code: `
<@{Dialog} open=@{open} title="借款手續費規則" body="首次還款或展延時收取…" onClose=@{close} />
<@{Dialog} open=@{open} title="即將前往匯入擔保品" body="…" bodyAlign="center" onClose=@{close}
  actions=@{[{ label: '返回', secondary: true }, { label: '確認前往', onClick: go }]} />
<@{InfoDialog} info=@{info} onClose=@{() => setInfo(null)} />`,
  },
  {
    id: 'sheet', name: 'Sheet / SheetOptions', group: '彈出層', platform: 'mobile',
    desc: '底部彈窗（Action Sheet）：選單（選中項淡藍底）、前往型選單（chevron，右側 ›）、一般內容（包 .sheet__content）。搜尋類加 fullHeight 固定 90% 高。網頁版建議改用 Dialog 或下拉選單。',
    Preview: () => { const [s, setS] = useState(null); const [v, setV] = useState('a'); return html`<div class="docs-row">
      <${Button} variant="capsule" onClick=${() => setS('opt')}>選單<//><${Button} variant="capsule" onClick=${() => setS('nav')}>前往型選單<//><${Button} variant="capsule" onClick=${() => setS('content')}>內容<//>
      <${Sheet} open=${s === 'opt'} title="選擇排序方式" onClose=${() => setS(null)}><${SheetOptions} options=${[{ value: 'a', label: '每張可借金額高至低' }, { value: 'b', label: '每張可借金額低至高' }]} value=${v} onSelect=${(x) => { setV(x); setS(null); }} /><//>
      <${Sheet} open=${s === 'nav'} title="選擇還款方式" onClose=${() => setS(null)}><${SheetOptions} chevron options=${[{ value: 'cash', label: '現金還款', desc: '以現金償還借款金額' }, { value: 'sell', label: '賣股還款', desc: '賣出擔保的股票進行還款' }]} onSelect=${(x) => { setS(null); showToast(x); }} /><//>
      <${Sheet} open=${s === 'content'} title="匯入明細" onClose=${() => setS(null)}><div class="sheet__content"><${DetailRow} label="元大台灣50 0050" value="5 張" valueClass="t-body-regular" /></div><//></div>`; },
    code: `
<@{Sheet} open=@{open} title="選擇排序方式" onClose=@{close}>
  <@{SheetOptions} options=@{[{ value: 'a', label: '高至低' }, …]} value=@{v} onSelect=@{choose} />
<//>
<@{Sheet} open=@{open} title="選擇還款方式" onClose=@{close}>
  <@{SheetOptions} chevron options=@{[{ value: 'cash', label: '現金還款', desc: '…' }]} onSelect=@{go} />
<//>
<@{Sheet} open=@{open} title="匯入明細" fullHeight onClose=@{close}>
  <div class="sheet__content">…</div>
<//>`,
  },
  {
    id: 'toast', name: 'Toast', group: '彈出層', platform: 'both',
    desc: '短暫提示（1.8 秒）。頁面放一個 <Toast />，用 kit.js 的 showToast(訊息) 顯示。',
    Preview: () => html`<div class="docs-row"><${Button} variant="capsule" onClick=${toast('此功能未開放於本次測試')}>顯示 Toast<//></div>`,
    code: `
import { showToast } from './src/kit.js';
<@{Toast} />                       // 頁面放一個
showToast('此功能未開放於本次測試');`,
  },
];

const GROUPS = ['基礎', '資料顯示', '表單', '版面', '彈出層'];
const START = [['intro', '介紹'], ['install', '安裝與設定'], ['typography', '字體規範'], ['icon-size', 'Icon 尺寸'], ['platform', '適用平台說明']];

function Nav() {
  return html`
    <nav class="docs-nav">
      <div class="docs-nav__brand">
        <p class="t-subtitle-bold c-primary">One KGI UI Kit</p>
        <p class="t-caption-regular c-tertiary">元件 ${COMPONENTS.length} 組・Preact + htm</p>
      </div>
      <div class="docs-nav__group">
        <p class="docs-nav__group-title t-caption-regular c-tertiary">開始使用</p>
        ${START.map(([id, label]) => html`<a class="t-body-regular" href=${'#' + id}>${label}</a>`)}
      </div>
      ${GROUPS.map((g) => html`
        <div class="docs-nav__group">
          <p class="docs-nav__group-title t-caption-regular c-tertiary">${g}</p>
          ${COMPONENTS.filter((c) => c.group === g).map((c) => html`<a class="t-body-regular" href=${'#' + c.id}>${c.name}</a>`)}
        </div>`)}
    </nav>
  `;
}

function App() {
  return html`
    <div class="docs">
      <${Nav} />
      <main class="docs-main">
        <${GettingStarted} />
        ${GROUPS.map((g) => html`
          <h2 class="docs-group-title t-headline c-primary">${g}</h2>
          ${COMPONENTS.filter((c) => c.group === g).map((c) => html`
            <${Section} id=${c.id} title=${c.name} platform=${c.platform} desc=${c.desc}>
              <${Demo} page=${c.page} code=${c.code}><${c.Preview} /><//>
            <//>`)}`)}
      </main>
      <${Toast} />
    </div>
  `;
}

render(html`<${App} />`, document.getElementById('app'));
