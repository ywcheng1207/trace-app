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

### Requirement: 數值欄位偏好

設定頁 SHALL 提供身體數值欄位的顯示偏好開關，涵蓋基礎欄位與四肢圍度欄位（leftThigh / rightThigh / leftCalf / rightCalf / leftUpperArm / rightUpperArm / leftForearm / rightForearm）。偏好變更 SHALL 連動日詳情表單與統計圖表的可選欄位。四肢圍度預設隱藏。

#### Scenario: 開啟四肢圍度
- **WHEN** 使用者於設定開啟四肢圍度開關
- **THEN** 日詳情身體數值表單出現對應欄位、統計圖表可選該欄位

#### Scenario: 關閉欄位
- **WHEN** 使用者關閉某數值欄位
- **THEN** 該欄位自表單與圖表可選清單隱藏（既有資料保留）

### Requirement: 密碼變更
設定頁 SHALL 提供密碼變更表單（舊密碼、新密碼、確認新密碼），以 Zod 驗證（新密碼長度、兩次一致），提交為 mock。

#### Scenario: 新密碼不一致
- **WHEN** 新密碼與確認不一致
- **THEN** 顯示一致性錯誤，不提交

#### Scenario: 變更成功（mock）
- **WHEN** 通過驗證並提交
- **THEN** 顯示成功 notify 並關閉表單

