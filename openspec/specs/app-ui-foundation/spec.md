# app-ui-foundation Specification

## Purpose
TBD - created by archiving change app-frontend-foundation. Update Purpose after archive.
## Requirements
### Requirement: 主題 Token
App SHALL 以 `src/constants/theme.ts` 的 `Colors`（light + dark）、`Fonts`、`Spacing` 作為唯一樣式來源，並擴充語意色（primary / accent / danger / success / border / muted 等），每個顏色同時提供 light 與 dark 值。元件取色 SHALL 透過 `useTheme()`，禁止硬編碼色碼。

#### Scenario: 深淺模式取色
- **WHEN** 系統色彩模式在 light / dark 間切換
- **THEN** 使用 `useTheme()` 的元件自動套用對應色，無需手動分支

### Requirement: 共用 UI Kit
App SHALL 提供一組以 RN `StyleSheet` + theme token 實作的共用元件：Button、Field/Input、Select、DatePicker、Checkbox、Switch、Card、Badge、Progress、Skeleton、Modal/Sheet、Tabs、Avatar、PageHeader、Loading、EmptyState、Toast。各 feature SHALL 重用這些元件，禁止重造。

#### Scenario: 重用共用元件
- **WHEN** 任一 feature 需要按鈕 / 輸入框 / 彈窗
- **THEN** 使用 UI kit 對應元件，並透過 props / variants 客製，不自行從頭實作

#### Scenario: 全域 Toast 回饋
- **WHEN** 任一處 dispatch `showNotification`
- **THEN** 全域 Toast 元件顯示對應 type 的訊息並可自動消失

