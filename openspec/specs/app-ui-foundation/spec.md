# app-ui-foundation Specification

## Purpose
TBD - created by archiving change app-frontend-foundation. Update Purpose after archive.
## Requirements
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

### Requirement: 共用 UI Kit
App SHALL 提供一組以 RN `StyleSheet` + theme token 實作的共用元件：Button、TextField、Select、DatePicker、Checkbox、Switch、Card、Badge、Progress、Skeleton、Modal/Sheet、Tabs、Avatar、PageHeader、IconButton、BrandLabel、Loading、EmptyState、Toast。各 feature SHALL 重用這些元件，禁止重造。

`TextField` SHALL 在欄位下方固定保留 error 訊息的顯示高度（`minHeight: 18`），無論是否有 error，此高度 SHALL 始終佔位，使得 error 出現與消失不造成父容器的 layout shift。

#### Scenario: 重用共用元件
- **WHEN** 任一 feature 需要按鈕 / 輸入框 / 彈窗
- **THEN** 使用 UI kit 對應元件，並透過 props / variants 客製，不自行從頭實作

#### Scenario: 全域 Toast 回饋
- **WHEN** 任一處 dispatch `showNotification`
- **THEN** 全域 Toast 元件顯示對應 type 的訊息並可自動消失

#### Scenario: TextField 無 error 時不位移
- **WHEN** TextField 從「無 error」切換為「有 error 訊息」
- **THEN** error 文字出現在固定位置，其他表單元素不發生垂直位移

#### Scenario: TextField 有 error 時消失不位移
- **WHEN** 使用者修正輸入，TextField error 訊息消失
- **THEN** 欄位下方 error 區高度保持不變，其他表單元素不發生垂直位移

