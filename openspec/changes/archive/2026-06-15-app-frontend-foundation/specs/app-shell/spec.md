## ADDED Requirements

### Requirement: 登入狀態分流（Auth Gate）
App root layout SHALL 依登入狀態決定可進入的 route group：未登入時僅可進入 `(auth)`，已登入時進入 `(tabs)`。登入狀態以 `expo-secure-store` 是否存在有效 token 與 Redux `isAuthenticated` 為準，啟動時先還原狀態。

#### Scenario: 未登入啟動
- **WHEN** App 啟動且 secure-store 無 token
- **THEN** 導向 `(auth)/login`，無法進入 `(tabs)` 任一分頁

#### Scenario: 已登入啟動
- **WHEN** App 啟動且 secure-store 有有效 token
- **THEN** 進入 `(tabs)` 並顯示預設分頁

#### Scenario: 登出
- **WHEN** 使用者於 Setting 觸發登出
- **THEN** 清除 secure-store token 與 React Query 快取，導回 `(auth)/login`

### Requirement: 底部分頁導覽
`(tabs)` SHALL 提供四個底部分頁：Schedule、Exercises、Statistics、Setting，各分頁有 icon 與 i18n 文字標籤，並可獨立維持各自的 Stack 導覽堆疊。

#### Scenario: 切換分頁
- **WHEN** 使用者點選底部任一分頁
- **THEN** 顯示該分頁畫面並標示為 active 狀態

#### Scenario: 分頁內深層導覽
- **WHEN** 使用者在某分頁內進入子畫面（如 `schedule/[day]`）後切到其他分頁再切回
- **THEN** 該分頁保留其導覽堆疊位置
