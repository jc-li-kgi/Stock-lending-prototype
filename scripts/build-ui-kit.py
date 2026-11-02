#!/usr/bin/env python3
"""
產生 ui-kit/：把這個 prototype 的設計規範、樣式、icon、元件整理成可以複製到其他專案的資料夾。

用法（在專案根目錄）：
    python3 scripts/build-ui-kit.py

每次執行都會重新產生 ui-kit/（舊的會被覆蓋），所以 ui-kit/ 裡不要手動修改，
要改元件或樣式請改原本的 src/、styles/，再重新執行這支程式。
新專案要調整的文字、Toast、換頁，改新專案裡的 ui-kit/src/kit.js。
"""
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'ui-kit'

# 要帶過去的樣式（元件與共用規則；各頁面專用的 css 不帶）
STYLES = ['kgi-overrides.css', 'tokens.css', 'typography.css', 'base.css', 'components.css', 'utilities.css']
# 元件會用到的底層程式
LIBS = ['preact.js', 'format.js']
# 元件裡依賴本專案的 import → 改成 ui-kit 自己的 kit.js
IMPORT_MAP = {
    "'../../content/copy.js'": "'../../kit.js'",
    "'../../store.js'": "'../../kit.js'",
    "'../../router.js'": "'../../kit.js'",
    "'../../lib/calc.js'": "'../../kit.js'",
}
# CLAUDE.md 裡要帶過去的段落（到「## 程式結構規則」之前）
RULES_START = '## 設計規範'
RULES_END = '## 程式結構規則'


def copy_tree(src, dst):
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns('.DS_Store'))


def mobile_frame_css():
    """
    文件頁是電腦寬度，手機預覽框（.mobile-frame）要套用手機版（≤ 768px）的字級與 icon 尺寸：
      - 字級：kgi-typography-tokens.css 裡 @media (max-width: 768px) 的 auto token
      - icon：tokens.css 的預設值是手機版，@media (min-width: 769px) 才換成電腦版
    """
    typo = (ROOT / 'One KGI Design Guideline' / 'Typography' / 'kgi-typography-tokens.css').read_text(encoding='utf-8')
    m = re.search(r'@media \(max-width: 768px\)\s*\{\s*:root\s*\{(.*?)\}\s*\}', typo, re.S)
    font_decls = m.group(1).strip() if m else ''
    tokens = (ROOT / 'styles' / 'tokens.css').read_text(encoding='utf-8')
    desktop = re.search(r'@media \(min-width: 769px\)\s*\{\s*:root\s*\{(.*?)\}\s*\}', tokens, re.S)
    icon_decls = []
    if desktop:
        base = tokens[: desktop.start()]
        for name in re.findall(r'(--[\w-]+)\s*:', desktop.group(1)):
            v = re.search(re.escape(name) + r'\s*:\s*([^;]+);', base)
            if v:
                icon_decls.append(f'  {name}: {v.group(1).strip()};')
    return (
        '/* 自動產生（scripts/build-ui-kit.py）：手機預覽框套用手機版字級與 icon 尺寸，不要手動修改 */\n'
        '.mobile-frame {\n  ' + font_decls + '\n' + '\n'.join(icon_decls) + '\n}\n'
    )


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()

    # 1. 設計規範 token、樣式、icon
    copy_tree(ROOT / 'One KGI Design Guideline', OUT / 'One KGI Design Guideline')
    (OUT / 'styles').mkdir()
    for name in STYLES:
        shutil.copy2(ROOT / 'styles' / name, OUT / 'styles' / name)
    (OUT / 'assets').mkdir()
    copy_tree(ROOT / 'assets' / 'icons', OUT / 'assets' / 'icons')

    # 2. 元件（import 改指向 kit.js）
    copy_tree(ROOT / 'src' / 'components', OUT / 'src' / 'components')
    for js in (OUT / 'src' / 'components').rglob('*.js'):
        text = js.read_text(encoding='utf-8')
        for old, new in IMPORT_MAP.items():
            text = text.replace(old, new)
        js.write_text(text, encoding='utf-8')
    (OUT / 'src' / 'lib').mkdir()
    for name in LIBS:
        shutil.copy2(ROOT / 'src' / 'lib' / name, OUT / 'src' / 'lib' / name)

    # 3. kit.js / 元件文件頁 / 說明（模板在 scripts/ui-kit-template/）
    tpl = ROOT / 'scripts' / 'ui-kit-template'
    shutil.copy2(tpl / 'kit.js', OUT / 'src' / 'kit.js')
    shutil.copy2(tpl / 'index.html', OUT / 'index.html')
    copy_tree(tpl / 'docs', OUT / 'docs')
    shutil.copy2(tpl / 'README.md', OUT / 'README.md')
    (OUT / 'docs' / 'mobile-frame.css').write_text(mobile_frame_css(), encoding='utf-8')

    # 4. 設計規則（從 CLAUDE.md 擷取）
    claude = (ROOT / 'CLAUDE.md').read_text(encoding='utf-8')
    start, end = claude.index(RULES_START), claude.index(RULES_END)
    rules = claude[start:end].rstrip() + '\n'
    rules = rules.replace('`One KGI Design Guideline/`', '`ui-kit/One KGI Design Guideline/`')
    (OUT / '設計規範.md').write_text(
        '# 設計規範（來自股票借貸 prototype 的 CLAUDE.md）\n\n'
        '> 把這份內容貼進新專案的 CLAUDE.md，新專案的 Claude 就會照同樣的規則做。\n'
        '> 專案專屬的規則（流程、任務、業務規則）沒有帶過來。\n\n' + rules,
        encoding='utf-8',
    )

    # 5. 檢查：元件不能再依賴本專案的檔案
    leftovers = []
    for js in (OUT / 'src').rglob('*.js'):
        # 只檢查真正的 import（略過 // 註解裡的範例）
        for m in re.finditer(r"^(?!\s*//).*?from '([^']+)'", js.read_text(encoding='utf-8'), re.M):
            target = (js.parent / m.group(1)).resolve()
            if m.group(1).startswith('.') and not target.exists():
                leftovers.append(f'{js.relative_to(OUT)} → {m.group(1)}')
    if leftovers:
        raise SystemExit('ui-kit 裡有找不到的 import：\n' + '\n'.join(leftovers))

    count = len(list((OUT / 'src' / 'components').rglob('*.js')))
    icons = len(list((OUT / 'assets' / 'icons').iterdir()))
    print(f'已產生 ui-kit/：元件 {count} 個檔案、icon {icons} 個')


if __name__ == '__main__':
    main()
