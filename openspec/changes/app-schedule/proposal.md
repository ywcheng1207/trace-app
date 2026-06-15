## Why

Schedule 是 Trace 的操作中樞——使用者在月曆上規劃每日訓練、記錄身體數值與筆記。foundation + exercises 已就緒，接著把 web 的 `/schedule` 與 `/schedule/[day]` 以 RN 重做（純前端 mock）。

## What Changes

- `(tabs)/schedule` 由 placeholder 改為**月曆總覽**：月份切換、每日格子標記（有計畫 / 完成度 / 身體數值 / 筆記）。
- 日詳情 `schedule/[day]` 整合三區：
  - **訓練計畫**：PlanExercise（含 cachedName）+ PlanSet（weight/reps/distance/heartRate/rpe/time + isCompleted）；新增動作（從動作庫挑選）、新增/編輯組數、勾選完成、移除；整日計畫一次儲存。
  - **身體數值**：weight / bodyFat / muscleMass / chest / waist / hips 表單，儲存。
  - **訓練筆記**：純文字筆記，儲存。
- 新增 UI kit：`Checkbox`。
- mock + Zod + React Query 資料層（in-memory，依日期 key），串接點標 `// TODO: apiFetch`。
- i18n：`schedule` namespace（三語系）。

延後：訓練範本（儲存/套用）、四肢圍度 L/R 與顯示偏好、示範影片、TDEE、趨勢圖、計畫上限強制。

## Capabilities

### New Capabilities
- `app-schedule`: 月曆總覽與日詳情（訓練計畫 / 身體數值 / 筆記）的純前端 mock，API-ready。

### Modified Capabilities
<!-- 無：沿用 foundation 與 exercises 能力 -->

## Impact

- 程式：`src/app/(tabs)/schedule/*`（改資料夾 + Stack）、`src/features/schedule/*`（新）、`src/components/ui/checkbox.tsx`（新）、i18n locales。
- 依賴：使用既有 `date-fns` 計算月曆。
- 行為：Schedule 分頁可實際操作（mock）；可從日詳情挑選 exercises 庫的動作組計畫。
- 尚未影響：真實後端（全 mock）、範本/影片/圖表（延後）。
