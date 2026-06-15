## ADDED Requirements

### Requirement: 範本建立

系統 SHALL 允許把當日訓練計畫另存為具名範本（名稱 + 動作組合）。資料由 React Query（mock）管理，串接點標 `// TODO: apiFetch`。

#### Scenario: 另存範本
- **WHEN** 使用者於有計畫的日詳情選「另存為範本」並輸入名稱
- **THEN** 建立範本並顯示成功 notify

#### Scenario: 名稱重複
- **WHEN** 範本名稱與既有重複
- **THEN** 提示名稱重複，不建立

### Requirement: 範本套用

系統 SHALL 允許選擇範本套用至某日；若該日已有計畫，套用前 SHALL 先確認覆蓋。

#### Scenario: 套用至空白日期
- **WHEN** 使用者於無計畫的日期套用範本
- **THEN** 該日計畫填入範本動作組合

#### Scenario: 套用至已有計畫的日期
- **WHEN** 使用者於已有計畫的日期套用範本
- **THEN** 先顯示覆蓋確認，確認後才覆蓋

#### Scenario: 範本含失效動作
- **WHEN** 範本內動作已被封存 / 刪除
- **THEN** 以名稱快取顯示並標記為失效

### Requirement: 範本管理

系統 SHALL 提供範本列表與刪除（刪除需確認）。

#### Scenario: 刪除範本
- **WHEN** 使用者於範本管理確認刪除
- **THEN** 範本自 mock 移除，列表更新
