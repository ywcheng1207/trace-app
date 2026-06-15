## ADDED Requirements

### Requirement: 月曆總覽
`(tabs)/schedule` SHALL 以月曆網格呈現整月，提供上 / 下月切換與「今天」標示。每個日期格子 SHALL 依當日摘要顯示標記（是否有計畫、完成度、是否有身體數值、是否有筆記）。資料由 React Query（mock）提供，串接點標 `// TODO: apiFetch`。

#### Scenario: 月份切換
- **WHEN** 使用者點上 / 下月
- **THEN** 網格更新為該月，並重新取得該月每日摘要

#### Scenario: 進入日詳情
- **WHEN** 使用者點某一日
- **THEN** 導向 `schedule/[day]` 顯示該日詳情

### Requirement: 日詳情 — 訓練計畫
`schedule/[day]` SHALL 提供當日訓練計畫編輯：從動作庫新增 PlanExercise、為每個動作新增 / 編輯 PlanSet（至少 weight / reps）、逐組勾選完成、移除動作或組數；整日計畫以單一儲存動作持久化（mock），並標 `// TODO: apiFetch`。

#### Scenario: 新增動作至計畫
- **WHEN** 使用者開啟動作挑選器並選擇一個動作
- **THEN** 該動作加入當日計畫並帶一組空白組數

#### Scenario: 勾選完成與儲存
- **WHEN** 使用者勾選組數完成並儲存
- **THEN** 計畫持久化，月曆該日完成度更新

#### Scenario: 空計畫
- **WHEN** 當日尚無計畫
- **THEN** 顯示空狀態與新增動作入口

### Requirement: 日詳情 — 身體數值
`schedule/[day]` SHALL 提供當日身體數值表單（weight / bodyFat / muscleMass / chest / waist / hips，皆選填），可儲存（mock）。每個日期一份數值。

#### Scenario: 部分欄位填寫
- **WHEN** 使用者只填部分欄位並儲存
- **THEN** 已填欄位被保存，其餘維持空值

### Requirement: 日詳情 — 訓練筆記
`schedule/[day]` SHALL 提供當日純文字訓練筆記，可儲存（mock）。

#### Scenario: 編輯筆記
- **WHEN** 使用者輸入筆記並儲存
- **THEN** 筆記持久化，月曆該日顯示筆記標記
