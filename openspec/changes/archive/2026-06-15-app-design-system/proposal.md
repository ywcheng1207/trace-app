## Why

目前 `src/constants/theme.ts` 的色票是自創的（藍 `#208AEF` + 橘 `#F97316`），**完全沒對齊 web 版**。web 用的是 shadcn「zinc」灰階調色盤（primary≈近黑/近白）＋品牌橘 `#ff7d23` ＋招牌黃 `#f8d24e`（選取高亮），圓角以 `--radius: 0.5rem`（8px）為基準。app 現況色值錯、語意色對不上、圓角 scale 亂定（sm6/md10/lg14/xl20），導致整體視覺與 web 不一致、dark/light 也未校正。本 change 把設計 token 對齊 web，作為其餘收尾 / 功能 change 的視覺基礎。

## What Changes

- `Colors` 全量重映射到 web zinc 調色盤（light + dark 精準對應）：background / card / text / textSecondary / border / muted / primary / primaryForeground / danger / success / warning / info / overlay。
- 新增品牌 token：`brandOrange`（今天 / accent / 連結）、`brandYellow`（選取高亮）、`brandBeige`、`brandDark`。
- `Radius` 改 8px 基準：`sm 4 / md 6 / lg 8 / xl 12`，浮動大面（toast / sheet）用 16；`full 999` 保留。
- 掃描所有既有元件，把錯用 / 硬編碼的 token 改正，確認 light / dark 兩模式皆正確。
- （選配）以 `expo-font` 載入 Geist 字型對齊 web；未載入時 fallback 至 system。

延後：完整 typography scale 規範化、動畫 token。

## Capabilities

### Modified Capabilities
- `app-ui-foundation`：「主題 Token」requirement 由自創色票改為對齊 web 的 zinc + 品牌色與 8px 圓角基準。

## Impact

- 程式：`src/constants/theme.ts`（重寫 token）、`src/hooks/use-theme.ts`（如需擴充 key）、所有引用色 / 圓角的元件（校正）。
- 行為：全 App 視覺對齊 web；primary 鈕由藍色變為近黑（與 web 一致），品牌橘改作強調色。
- 不影響：資料層、路由、API 串接點。
