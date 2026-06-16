# app-statistics Specification

## Purpose
TBD - created by archiving change app-statistics. Update Purpose after archive.
## Requirements
### Requirement: 日期區間選擇

統計頁 SHALL 支援預設區間（7 / 30 / 90 天，以 Chip 呈現）與**自訂起迄日**。自訂區間入口 SHALL 為 calendar icon button（CalendarRange），SHALL NOT 以 Chip 呈現「自訂」選項。區間變更 SHALL 重算所有統計與圖表。

#### Scenario: 切換預設區間
- **WHEN** 使用者點 7 / 30 / 90 天 Chip
- **THEN** 統計與圖表依該區間重算

#### Scenario: 自訂區間
- **WHEN** 使用者點 calendar icon button 並指定起迄日（DatePicker）
- **THEN** 統計與圖表依自訂區間重算

### Requirement: 身體數值欄位偏好入口

統計頁 SHALL 在 Header 右側提供 `sliders-horizontal` icon button，點擊後開啟 `MetricPreferencesSheet`，讓使用者選擇身體數值圖表區段要顯示的欄位。偏好資料 SHALL 仍存於 `profile.hiddenMetrics`（與既有實作一致），入口位置改至此頁。

#### Scenario: 開啟欄位偏好 Sheet
- **WHEN** 使用者點擊統計頁 Header 的 sliders icon button
- **THEN** MetricPreferencesSheet 從底部滑入，顯示各身體數值欄位的 Switch 列表

#### Scenario: 切換欄位顯示即時反映
- **WHEN** 使用者在 Sheet 中切換某欄位的 Switch
- **THEN** 即時更新 `hiddenMetrics`，身體數值圖表區段依新設定顯示或隱藏對應欄位

### Requirement: 訓練統計視覺化
系統 SHALL 呈現所選區間的訓練摘要（總訓練量 / 總組數 / 訓練次數）與圖表：訓練量趨勢（長條）、肌群分佈（長條），以 `react-native-gifted-charts` 渲染。圖表 SHALL 具備 Y 軸標籤、水平網格線（solid）、bar 圓角，並於按壓時顯示含數值的 tooltip。chart title / subtitle 與各 section header SHALL 有清楚的字型層級。

#### Scenario: 有資料
- **WHEN** 區間內有訓練資料
- **THEN** 顯示摘要卡與訓練量 / 肌群分佈圖表

#### Scenario: 圖表具 Y 軸與網格線
- **WHEN** 圖表有資料
- **THEN** 顯示 Y 軸標籤與水平網格線，bar 為圓角

#### Scenario: 按壓 bar 顯示 tooltip
- **WHEN** 使用者按壓圖表某個 bar
- **THEN** 顯示含數值（與單位）的 tooltip

#### Scenario: 無資料
- **WHEN** 區間內無訓練資料
- **THEN** 顯示「此區間無訓練資料」空狀態

### Requirement: 身體數據視覺化
系統 SHALL 呈現所選區間的身體數據趨勢（體重、體脂折線圖）。

#### Scenario: 區間內無身體數據
- **WHEN** 區間內無身體數值
- **THEN** 顯示「此區間無身體數據」空狀態

### Requirement: Insights Engine

統計頁 SHALL 依區間訓練資料（mock）計算並呈現洞察：訓練取向判定與肌群分佈均衡度。計算 SHALL 為純函式，串接點標 `// TODO: apiFetch`。

#### Scenario: 訓練取向判定
- **WHEN** 區間內有足夠訓練資料
- **THEN** 顯示訓練取向洞察（如肌力 / 增肌 / 耐力 傾向）與佐證數據

#### Scenario: 肌群均衡度
- **WHEN** 區間內有訓練資料
- **THEN** 顯示各肌群訓練量占比，標出偏重 / 不足

#### Scenario: 無有效訓練
- **WHEN** 區間內無有效訓練資料
- **THEN** 顯示對應 EmptyState，不顯示洞察卡

