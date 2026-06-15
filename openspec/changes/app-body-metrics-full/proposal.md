## Why

web 的身體數值含四肢圍度（大腿 / 小腿 / 上臂 / 前臂 × 左右，共 8 欄）並可在設定開關顯示；app 目前只有 6 欄（weight / bodyFat / muscleMass / chest / waist / hips），缺四肢圍度與其偏好開關。對重訓使用者而言四肢圍度是重要追蹤指標。本 change 補齊欄位與偏好，並讓統計圖表涵蓋新欄位（純前端 mock）。

## What Changes

- 身體數值欄位擴充：新增 8 個四肢圍度欄位（leftThigh / rightThigh / leftCalf / rightCalf / leftUpperArm / rightUpperArm / leftForearm / rightForearm），對齊 web。
- 日詳情身體數值表單依「欄位偏好」顯示 / 隱藏（含新欄位）。
- 設定的「數值欄位偏好」加入四肢圍度開關。
- 統計身體數據圖表涵蓋新欄位（沿用既有隱藏欄位機制）。
- i18n：`schedule` / `setting` 補新欄位標籤（三語系）。

## Capabilities

### Modified Capabilities
- `app-schedule`：「日詳情 — 身體數值」欄位擴充含四肢圍度。
- `app-setting`：「數值欄位偏好」加入四肢圍度開關。

## Impact

- 程式：`features/schedule/api/schemas.ts`（`BODY_METRIC_FIELDS` + schema 擴充）、`body-metrics-form.tsx`、`setting.tsx`、統計圖表（自動涵蓋）、i18n。
- 行為：可記錄 / 顯示四肢圍度並納入趨勢圖。
- 不影響：既有 6 欄資料（新欄位選填、預設可隱藏）。
