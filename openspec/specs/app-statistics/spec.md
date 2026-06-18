## MODIFIED Requirements

### Requirement: 統計概覽
`(tabs)/statistics` SHALL 顯示訓練統計資料。資料 SHALL 透過 GET `/api/statistics?range=<period>`（`useStats`，apiFetch，`staleTime: 1000 * 60 * 5`）取得，支援時間範圍參數（週 / 月 / 年 / 全部）。

#### Scenario: 載入統計資料
- **WHEN** 使用者進入統計頁
- **THEN** GET /api/statistics 回傳統計資料，顯示於各卡片

#### Scenario: 切換時間範圍
- **WHEN** 使用者切換時間範圍（週 / 月 / 年）
- **THEN** query key 含 range 參數，React Query 以新 range 重新 fetch

#### Scenario: 無資料空狀態
- **WHEN** 選定範圍內無訓練紀錄
- **THEN** 顯示空狀態提示
