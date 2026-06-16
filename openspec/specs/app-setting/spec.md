# app-setting Specification

## Purpose
TBD - created by archiving change app-setting. Update Purpose after archive.
## Requirements
### Requirement: 個人資料編輯

設定頁 SHALL 允許編輯個人資料：顯示名稱、頭像、生日、時區與既有欄位。頭像更換提供選圖 UI（實際上傳 stub，標 `// TODO: apiFetch`）；生日以 DatePicker 選擇；時區以 Select 選擇。變更後（mock）即時反映。

#### Scenario: 更換頭像
- **WHEN** 使用者選新圖片並儲存
- **THEN** 個人資料頭像更新為預覽圖（上傳行為先 stub）

#### Scenario: 設定生日
- **WHEN** 使用者以 DatePicker 選生日並儲存
- **THEN** 個人資料顯示該生日

#### Scenario: 設定時區
- **WHEN** 使用者選時區並儲存
- **THEN** 個人資料記錄該時區

### Requirement: 語系切換
設定頁 SHALL 允許切換介面語系（en / zh-Hant / zh-Hans），選定後即時套用（`i18n.changeLanguage`）並持久化偏好。

#### Scenario: 切換語系
- **WHEN** 使用者選擇另一語系
- **THEN** 介面文字即時切換為該語系

### Requirement: 密碼變更
設定頁 SHALL 提供密碼變更表單（舊密碼、新密碼、確認新密碼），以 Zod 驗證（新密碼長度、兩次一致），提交為 mock。

#### Scenario: 新密碼不一致
- **WHEN** 新密碼與確認不一致
- **THEN** 顯示一致性錯誤，不提交

#### Scenario: 變更成功（mock）
- **WHEN** 通過驗證並提交
- **THEN** 顯示成功 notify 並關閉表單

