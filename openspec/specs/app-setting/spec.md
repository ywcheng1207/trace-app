# app-setting Specification

## Purpose
TBD - created by archiving change app-setting. Update Purpose after archive.
## Requirements
### Requirement: 個人資料編輯
`(tabs)/setting` SHALL 提供個人資料編輯（顯示名稱、性別、身高），以 React Hook Form + Zod 驗證，提交後（mock）更新並反映於設定頁，串接點標 `// TODO: apiFetch`。

#### Scenario: 更新資料
- **WHEN** 使用者編輯顯示名稱並儲存
- **THEN** 設定頁顯示更新後的資料並出現成功 notify

#### Scenario: 顯示名稱驗證
- **WHEN** 顯示名稱為空或過長
- **THEN** 顯示欄位錯誤，不提交

### Requirement: 語系切換
設定頁 SHALL 允許切換介面語系（en / zh-Hant / zh-Hans），選定後即時套用（`i18n.changeLanguage`）並持久化偏好。

#### Scenario: 切換語系
- **WHEN** 使用者選擇另一語系
- **THEN** 介面文字即時切換為該語系

### Requirement: 數值欄位偏好
設定頁 SHALL 提供身體數值欄位的顯示開關（Switch）；隱藏的欄位 SHALL 不出現在 Schedule 的身體數值表單。

#### Scenario: 隱藏欄位
- **WHEN** 使用者關閉某數值欄位
- **THEN** 該欄位不再出現在日詳情的身體數值表單

### Requirement: 密碼變更
設定頁 SHALL 提供密碼變更表單（舊密碼、新密碼、確認新密碼），以 Zod 驗證（新密碼長度、兩次一致），提交為 mock。

#### Scenario: 新密碼不一致
- **WHEN** 新密碼與確認不一致
- **THEN** 顯示一致性錯誤，不提交

#### Scenario: 變更成功（mock）
- **WHEN** 通過驗證並提交
- **THEN** 顯示成功 notify 並關閉表單

