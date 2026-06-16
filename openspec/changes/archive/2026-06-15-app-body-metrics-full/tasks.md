## 1. Schema / 欄位

- [x] 1.1 `BODY_METRIC_FIELDS` 擴充為 14 欄（+8 四肢圍度），加 `BODY_METRIC_GROUPS`（basic/circumference）
- [x] 1.2 `BodyMetric` schema 加 8 個 `number | null` 欄位
- [x] 1.3 schedule mock 樣本補四肢圍度（部分填值示範）

## 2. 表單 / 偏好

- [x] 2.1 `body-metrics-form.tsx` 分組（基礎 / 四肢圍度）顯示，依 hiddenMetrics 偏好過濾
- [x] 2.2 `setting.tsx` 數值欄位偏好分組開關；profile mock 四肢圍度預設隱藏

## 3. 統計

- [x] 3.1 stats 改 `bodyMetricTrends`（per-field），統計頁依可見欄位渲染 MetricTrendCard（沿用隱藏欄位機制）

## 4. i18n / Verification

- [x] 4.1 `schedule` 補 8 新欄位標籤 + group 標題（三語系）
- [x] 4.2 `npx tsc --noEmit`（pass）　4.3 `npx expo lint`（pass）
- [x] 4.4 preview：設定分組開關（四肢圍度預設 off）、統計身體圖表 per 可見欄位、無 console error
