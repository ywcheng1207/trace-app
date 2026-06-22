# app-schedule Specification

## Purpose
月曆總覽與日詳情（訓練計畫 / 訓練 Session / 身體數值 / 訓練筆記）能力。

## Requirements

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
`schedule/[day]` 的訓練筆記 SHALL 在頁內以 `RichTextViewer` 唯讀預覽呈現（不再用純文字 `TextArea`、不顯示 raw JSON），並提供「編輯筆記」入口導向全螢幕編輯路由 `schedule/[day]/note`。編輯路由以 `RichTextEditor`（富文本，TipTap JSON，長度上限對齊 `TRAINING_NOTE` 3000）編輯，儲存 SHALL 呼叫 PUT `/api/schedule/[day]/note`（apiFetch 加密）送出 TipTap JSON 字串，onSuccess invalidate month summary。

#### Scenario: 頁內唯讀預覽
- **WHEN** 使用者在 `schedule/[day]` 檢視訓練筆記
- **THEN** 以 `RichTextViewer` 顯示格式化內容；無筆記時顯示 placeholder

#### Scenario: 進入全螢幕編輯並儲存
- **WHEN** 使用者點「編輯筆記」並在全螢幕編輯後儲存
- **THEN** PUT /api/schedule/[day]/note 送出 TipTap JSON，onSuccess invalidate month summary，返回後預覽更新

#### Scenario: 開啟 web 編輯過的訓練筆記
- **WHEN** 使用者開啟一則 web 端富文本訓練筆記
- **THEN** 頁內預覽與全螢幕編輯皆正確載入其結構，不顯示 raw JSON
