## Context

沿用既有架構。Statistics 引入第一個圖表庫 `react-native-gifted-charts`。純前端 mock 彙總。

## Goals / Non-Goals

**Goals:** 區間選擇 + 訓練摘要/趨勢/分佈圖 + 身體趨勢圖，mock 且 API-ready。

**Non-Goals:** 深度 Insights Engine（推拉/動力鍊/取向）、自訂日期區間、欄位顯示偏好、tabs 切換、與 schedule mock 串接（本階段獨立 mock）。

## Decisions

- **圖表庫 `react-native-gifted-charts`** + peer `react-native-linear-gradient`。LineChart / BarChart 為主，避免一次引入過多圖型。
- **單一彙總 hook `useStats(rangeDays)`**：對齊 web 的 `/api/stats/all` 單請求設計，避免瀑布。mock 依 range 產生 summary + 各序列。
- **區間以天數 preset（7/30/90）**：rangeDays 作為 query key 與 mock 參數；先不做自訂日期，降低 UI 複雜度。
- **獨立 mock**：statistics 自帶 mock 彙總產生器，不讀 schedule 私有 store；串接真實 API 後由後端彙總。

## Risks / Trade-offs

- gifted-charts 的 `react-native-linear-gradient` 在 web preview 的相容性 → 安裝後以 web preview 驗證；若 web 無法 bundle，圖表在原生（iOS/Android dev build）仍可運作，web 預覽改顯示替代或標註。
- mock 與 schedule 資料不連動 → 數字為展示用途，接 API 後一致。

## Open Questions
- 是否需自訂日期區間與欄位偏好 → 後續迭代。
