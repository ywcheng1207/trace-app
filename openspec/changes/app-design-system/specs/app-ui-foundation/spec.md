## MODIFIED Requirements

### Requirement: 主題 Token

設計 token 集中於 `src/constants/theme.ts`，色彩經 `useTheme()` 取用，**禁止元件硬編碼 hex 或魔術圓角**。色票 SHALL 對齊 `trace` web 的 shadcn「zinc」調色盤與品牌色，並同時提供 light / dark 兩套等價值。圓角 SHALL 以 8px 為基準（`sm 4 / md 6 / lg 8 / xl 12 / full`），浮動大面（toast / sheet）用 16。

#### Scenario: 取用語意色

- **WHEN** 元件需要顏色
- **THEN** 透過 `useTheme()` 取語意 token（background / card / text / textSecondary / border / muted / primary / danger / success / warning / info / overlay），不出現硬編碼 hex

#### Scenario: 品牌色

- **WHEN** 需要強調（今天 / 連結 / accent 條）或選取高亮
- **THEN** 使用 `brandOrange` / `brandYellow` token，與 web 一致

#### Scenario: Light / Dark 一致

- **WHEN** 切換系統主題或 App 主題
- **THEN** 同一語意 token 解析到 light / dark 對應值，畫面在兩模式皆正確且對齊 web

#### Scenario: 圓角基準

- **WHEN** 元件設定圓角
- **THEN** 採 `Radius` scale（預設 `lg`=8px），不使用魔術數字
