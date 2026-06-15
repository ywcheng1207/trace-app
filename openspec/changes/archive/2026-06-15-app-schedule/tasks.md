## 1. UI Kit

- [x] 1.1 `Checkbox`（RHF 相容，用於組數完成）

## 2. 資料層（features/schedule）

- [x] 2.1 `api/schemas.ts`：PlanSet / PlanExercise / TrainingPlan / BodyMetric / DaySummary（Zod）
- [x] 2.2 `api/mock.ts`：in-memory store（依 `yyyy-MM-dd`）+ 種子今日資料 + month summaries / get / save
- [x] 2.3 `api/hooks.ts`：useScheduleMonth / useDayPlan / useBodyMetric / useDayNote + save mutations（標 `// TODO: apiFetch`）
- [x] 2.4 擴充 `QUERY_KEYS`（scheduleMonth / dayPlan / bodyMetric / dayNote）
- [x] 2.5 `lib/date.ts`：月曆網格計算（date-fns）

## 3. i18n

- [x] 3.1 `schedule` namespace（三語系，含 weekdays / metric.* / 區段標題）
- [x] 3.2 註冊 namespace

## 4. 畫面

- [x] 4.1 `(tabs)/schedule` 改資料夾：`_layout`（Stack）+ `index`（月曆）
- [x] 4.2 `CalendarMonth` + `DayCell`（標記 + 今天 + 月份切換）
- [x] 4.3 `schedule/[day]`：三區容器
- [x] 4.4 訓練計畫區：PlanExercise/PlanSet 編輯 + `ExercisePickerSheet` + 儲存
- [x] 4.5 身體數值區（RHF 表單）+ 儲存；筆記區（TextArea）+ 儲存

## 5. Verification

- [x] 5.1 `npx tsc --noEmit`
- [x] 5.2 `npx expo lint`
- [x] 5.3 Expo web preview：月曆切換、進日詳情、加動作/組數/勾選/儲存、身體數值、筆記、無 console error（截圖）
