## MODIFIED Requirements

### Requirement: 日期區間選擇

統計頁 SHALL 支援預設區間（7 / 30 / 90 天）與**自訂起迄日**。區間變更 SHALL 重算所有統計與圖表。

#### Scenario: 切換預設區間
- **WHEN** 使用者點 7 / 30 / 90 天
- **THEN** 統計與圖表依該區間重算

#### Scenario: 自訂區間
- **WHEN** 使用者選「自訂」並指定起迄日
- **THEN** 統計與圖表依自訂區間重算

## ADDED Requirements

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
