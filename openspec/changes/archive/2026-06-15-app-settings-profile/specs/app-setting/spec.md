## MODIFIED Requirements

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
