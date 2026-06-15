## ADDED Requirements

### Requirement: 日期區間選擇
`(tabs)/statistics` SHALL 提供日期區間選擇（近 7 / 30 / 90 天 preset），所有統計以所選區間為範圍；變更區間即重新取數（React Query），串接點標 `// TODO: apiFetch`。

#### Scenario: 切換區間
- **WHEN** 使用者切換區間 preset
- **THEN** 摘要與各圖表以新區間重新計算並更新

### Requirement: 訓練統計視覺化
系統 SHALL 呈現所選區間的訓練摘要（總訓練量 / 總組數 / 訓練次數）與圖表：訓練量趨勢（折線）、肌群分佈（長條），以 `react-native-gifted-charts` 渲染。

#### Scenario: 有資料
- **WHEN** 區間內有訓練資料
- **THEN** 顯示摘要卡與訓練量 / 肌群分佈圖表

#### Scenario: 無資料
- **WHEN** 區間內無訓練資料
- **THEN** 顯示「此區間無訓練資料」空狀態

### Requirement: 身體數據視覺化
系統 SHALL 呈現所選區間的身體數據趨勢（體重、體脂折線圖）。

#### Scenario: 區間內無身體數據
- **WHEN** 區間內無身體數值
- **THEN** 顯示「此區間無身體數據」空狀態
