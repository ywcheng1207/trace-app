## Context

app `BODY_METRIC_FIELDS = [weight, bodyFat, muscleMass, chest, waist, hips]`；`body-metrics-form.tsx` 依 `profile.hiddenMetrics` 過濾欄位；setting 以 Switch 控制偏好。web 另有 8 個四肢圍度欄位。

## Goals / Non-Goals

- Goals：補齊四肢圍度欄位 + 偏好 + 圖表涵蓋。
- Non-Goals：不改數值儲存 / 驗證的整體架構（沿用 parseNumber / Zod）。

## Decisions

- `BODY_METRIC_FIELDS` 擴充為 14 欄；`BodyMetric` schema 加 8 個 `number | null` 欄位。
- 四肢圍度預設**隱藏**（加入 `hiddenMetrics` 預設或以分組呈現），避免表單一次太長 → 對齊 web「開啟四肢圍度」語意。
- 表單以分組呈現（基礎 / 圍度），圍度區可整組開關。
- 統計圖表沿用既有「隱藏欄位」邏輯，新欄位自動納入可選清單。

## Risks

- 表單變長 → 分組 + 偏好控制顯示；只顯示使用者開啟的欄位。
