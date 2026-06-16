## MODIFIED Requirements

### Requirement: 日期區間選取

統計頁 SHALL 提供 7 / 30 / 90 天快速預設 Chip，以及一個 calendar icon button 作為自訂區間的入口。自訂區間 SHALL NOT 以 Chip 元件呈現「自訂」選項。

#### Scenario: 快速預設 Chip

- **WHEN** 使用者點擊 7 / 30 / 90 Chip
- **THEN** 日期區間更新，統計資料重新計算

#### Scenario: 點擊 calendar icon button

- **WHEN** 使用者點擊 Header 或 Chip 列右側的 calendar icon button
- **THEN** 開啟日期區間 DatePicker（起迄日 Picker），供使用者輸入自訂區間

#### Scenario: 自訂區間確認後更新

- **WHEN** 使用者選定自訂起迄日並確認
- **THEN** Chip 列不顯示任何 Chip 為選取狀態（或顯示「自訂」tag），統計以新區間計算

### Requirement: 身體數值欄位偏好入口

統計頁 SHALL 在 Header 右側提供一個 `sliders-horizontal` icon button，點擊後開啟 `MetricPreferencesSheet`（Bottom Sheet），讓使用者選擇在身體數值圖表區段要顯示哪些欄位。偏好資料 SHALL 仍存於 `profile.hiddenMetrics`（與現有實作一致），只是入口改至此頁。

#### Scenario: 開啟欄位偏好 Sheet

- **WHEN** 使用者點擊統計頁 Header 的 sliders icon button
- **THEN** MetricPreferencesSheet 從底部滑入，顯示各身體數值欄位的 Switch 列表

#### Scenario: 切換欄位顯示

- **WHEN** 使用者在 Sheet 中切換某欄位的 Switch
- **THEN** 即時更新 `hiddenMetrics`，身體數值圖表區段依新設定顯示或隱藏對應欄位

### Requirement: 圖表 UX

統計頁的訓練量趨勢與肌群分佈圖表 SHALL 具備以下設計：

- Y 軸標籤（數值）顯示於圖表左側
- 水平網格線（`rulesType="solid"`，淡色）
- Bar 圓角（`barBorderRadius: 4`）
- 按壓時顯示 tooltip（date + 數值）
- 統一的 chart title（`text-sm fontWeight 600`）與 chart subtitle（`text-xs textSecondary`）
- 各 section（洞察 / 訓練 / 身體）以 `text-base fontWeight 700` 的 section header 明確區隔

#### Scenario: 圖表有資料時顯示 Y 軸與網格線

- **WHEN** 統計頁載入成功且有訓練資料
- **THEN** 訓練量趨勢圖與肌群分佈圖均顯示 Y 軸標籤與水平網格線

#### Scenario: 按壓 bar 顯示 tooltip

- **WHEN** 使用者在圖表上按壓某個 bar
- **THEN** 顯示包含日期與數值的 tooltip overlay

#### Scenario: 無資料顯示 EmptyState

- **WHEN** 選定區間內無訓練資料
- **THEN** 圖表區域以 EmptyState 元件取代（不顯示空白圖表）
