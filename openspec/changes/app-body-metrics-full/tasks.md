## 1. Schema / 欄位

- [ ] 1.1 `BODY_METRIC_FIELDS` 擴充 8 個四肢圍度欄位
- [ ] 1.2 `BodyMetric` schema 加對應 `number | null` 欄位
- [ ] 1.3 mock 樣本補（部分填值示範）

## 2. 表單 / 偏好

- [ ] 2.1 `body-metrics-form.tsx` 分組（基礎 / 圍度）顯示，依偏好過濾
- [ ] 2.2 `setting.tsx` 數值欄位偏好加入四肢圍度開關（預設隱藏）

## 3. 統計

- [ ] 3.1 統計身體數據圖表納入新欄位（沿用隱藏欄位機制）

## 4. i18n / Verification

- [ ] 4.1 `schedule` / `setting` 補新欄位標籤（三語系）
- [ ] 4.2 `npx tsc --noEmit`　4.3 `npx expo lint`
- [ ] 4.4 preview：開關四肢圍度 → 表單 / 圖表連動、light-dark
