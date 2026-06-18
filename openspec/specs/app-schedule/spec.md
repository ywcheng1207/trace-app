## MODIFIED Requirements

### Requirement: 月曆總覽
`(tabs)/schedule` SHALL 以月曆呈現當月。月份摘要資料（每日是否有計畫/數值/筆記）SHALL 透過 GET `/api/schedule/month-summary?year=&month=`（`useMonthSummaries`，apiFetch，`staleTime: 1000 * 60 * 2`）取得。月曆 UI 行為（全寬無框、下方按鈕換月、滑動換月、視圖切換）不變。

#### Scenario: 觸控點選日期
- **WHEN** 使用者點某一天
- **THEN** 進入該日 schedule/[day] 詳情

#### Scenario: 當日狀態 chip
- **WHEN** 某天有計畫 / 身體數值 / 筆記（來自後端）
- **THEN** 該格底部顯示對應 chip

#### Scenario: 月曆全寬無框
- **WHEN** 使用者進入月曆頁
- **THEN** 月曆格子橫向佔滿可用寬度

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

#### Scenario: 缺動作引導
- **WHEN** 使用者要新增計畫但動作庫為空
- **THEN** 顯示引導對話框，導向 Exercises 新增動作

#### Scenario: 清空計畫確認
- **WHEN** 使用者清空當日計畫
- **THEN** 顯示確認對話框，確認後呼叫 DELETE，onSuccess invalidate queries

#### Scenario: 計畫上限
- **WHEN** 當日計畫動作數達上限（後端回傳 4xx）
- **THEN** ApiError 觸發 onError，顯示「已達上限」notify

### Requirement: 日詳情 — 訓練 Session
訓練 session（實際訓練紀錄）SHALL：
- 取得當日 sessions：GET `/api/sessions?date=yyyy-MM-dd`（`useSessionsForDay`）
- 開始訓練：POST `/api/sessions`（`useStartSession`）
- 完成訓練：PUT `/api/sessions/[id]/complete`（`useCompleteSession`）
- 更新組數進度：PUT `/api/sessions/[id]/sets/[setId]`（`useUpdateSetProgress`）
- 新增組數：POST `/api/sessions/[id]/sets`（`useAddSetToSession`）
- 刪除組數：DELETE `/api/sessions/[id]/sets/[setId]`（`useRemoveSetFromSession`）

#### Scenario: 開始訓練
- **WHEN** 使用者點「開始訓練」
- **THEN** POST /api/sessions，回傳 session 物件，UI 進入訓練紀錄模式

#### Scenario: 完成訓練
- **WHEN** 使用者點「完成」
- **THEN** PUT /api/sessions/[id]/complete，onSuccess invalidate sessions + month summary

### Requirement: 日詳情 — 身體數值
身體數值表單 SHALL：
- 讀取：GET `/api/body-metrics?date=yyyy-MM-dd`（`useBodyMetricsForDay`）
- 儲存：POST 或 PUT `/api/body-metrics`（upsert）（`useSaveBodyMetrics`）

onSuccess SHALL invalidate body metrics query + month summary query。

#### Scenario: 記錄四肢圍度
- **WHEN** 使用者填入四肢圍度並儲存
- **THEN** POST/PUT /api/body-metrics 送出，onSuccess invalidate queries

#### Scenario: 部分欄位填寫
- **WHEN** 使用者只填部分欄位
- **THEN** 未填欄位以 null 送出，後端 upsert 僅更新已填欄位

#### Scenario: 依偏好顯示
- **WHEN** 使用者未開啟四肢圍度
- **THEN** 表單不顯示四肢圍度欄位（由 profile metric_preferences 控制）

### Requirement: 日詳情 — 訓練筆記
`schedule/[day]` 的訓練筆記 SHALL 呼叫 PUT `/api/schedule/[day]/note`（apiFetch 加密）儲存。

#### Scenario: 編輯筆記
- **WHEN** 使用者輸入筆記並儲存
- **THEN** PUT /api/schedule/[day]/note 送出，onSuccess invalidate month summary
