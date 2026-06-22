## MODIFIED Requirements

### Requirement: 日詳情 — 訓練計畫
`schedule/[day]` 的訓練計畫 SHALL：
- 取得當日計畫：GET `/api/training-plans?date=yyyy-MM-dd`（`useTrainingPlansForDay`）
- 建立計畫：POST `/api/training-plans`（`useCreateTrainingPlan`）
- 更新計畫：PUT `/api/training-plans/[id]`（`useUpdateTrainingPlan`）
- 刪除計畫：DELETE `/api/training-plans/[id]`（`useDeleteTrainingPlan`）
- 新增動作至計畫：POST `/api/training-plans/[id]/exercises`（`useAddExerciseToPlan`）
- 更新計畫動作：PUT `/api/training-plans/[id]/exercises/[exerciseId]`（`useUpdatePlanExercise`）
- 刪除計畫動作：DELETE `/api/training-plans/[id]/exercises/[exerciseId]`（`useRemovePlanExercise`）
- 重排順序：PUT `/api/training-plans/[id]/exercises/reorder`（`useReorderPlanExercises`）

所有 mutation onSuccess SHALL invalidate schedule 相關 query（當日計畫 + 月摘要）。

訓練計畫區的動作 SHALL 遵循動作層級規範：「儲存計畫」為唯一 primary；「新增動作」與「套用範本」為同一列 secondary；「清空計畫」與「另存範本」SHALL 收進區段標題的 overflow `ActionSheet`。「訓練計畫 / 身體數值 / 訓練筆記」三區段 SHALL 各以 `SectionHeader` 起頭，維持一致垂直節奏。

#### Scenario: 缺動作引導
- **WHEN** 使用者要新增計畫但動作庫為空
- **THEN** 顯示引導對話框，導向 Exercises 新增動作

#### Scenario: 清空計畫確認
- **WHEN** 使用者從訓練計畫區的 overflow `ActionSheet` 點「清空計畫」
- **THEN** 先關閉 ActionSheet，再顯示確認對話框，確認後清空，行為與原本一致

#### Scenario: 計畫上限
- **WHEN** 當日計畫動作數達上限（後端回傳 4xx）
- **THEN** ApiError 觸發 onError，顯示「已達上限」notify

#### Scenario: 動作層級正確
- **WHEN** 進入有計畫的 `schedule/[day]`
- **THEN** 訓練計畫區僅「儲存計畫」為 primary filled，清空 / 另存範本只能從 overflow 進入
