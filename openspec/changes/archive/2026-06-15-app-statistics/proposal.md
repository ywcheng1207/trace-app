## Why

Statistics 把訓練與身體數據視覺化，是使用者檢視進步的地方。foundation/exercises/schedule 已就緒，接著把 web 的 `/statistics` 以 RN 重做（純前端 mock），用 `react-native-gifted-charts` 渲染圖表。

## What Changes

- `(tabs)/statistics` 由 placeholder 改為實際分析頁：
  - **日期區間**選擇（近 7 / 30 / 90 天 preset chip），切換即重算。
  - **訓練摘要卡**：總訓練量、總組數、訓練次數。
  - **訓練量趨勢**折線圖、**肌群分佈**長條圖（gifted-charts）。
  - **身體數據**：體重趨勢、體脂趨勢折線圖。
- mock + Zod + React Query 彙總資料層（單一 `useStats(range)`），串接點標 `// TODO: apiFetch('/api/stats/all')`。
- 依賴：`react-native-gifted-charts`（已裝）+ `react-native-linear-gradient` peer。
- i18n：`statistics` namespace（三語系）。

延後：Insights Engine 的深度洞察（推拉平衡 / 動力鍊 / 動作取向）、自訂區間、欄位顯示偏好、tabs 切換。

## Capabilities

### New Capabilities
- `app-statistics`: 區間選擇 + 訓練/身體數據彙總視覺化（圖表），純前端 mock，API-ready。

### Modified Capabilities
<!-- 無：沿用既有能力 -->

## Impact

- 程式：`src/app/(tabs)/statistics/*`、`src/features/statistics/*`（新）、i18n locales。
- 依賴：gifted-charts + linear-gradient（圖表）。
- 行為：Statistics 分頁可看區間圖表（mock）；其餘分頁不受影響。
- 尚未影響：真實後端、深度 Insights（延後）。
