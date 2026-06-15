## Context

app 統計以預設區間（7/30/90）查 mock 摘要 + 圖表。web 有自訂區間 picker 與 Insights Engine（訓練取向判定）。專案無 DatePicker（foundation 延後），需補。

## Goals / Non-Goals

- Goals：自訂區間、Insights（訓練取向 + 均衡度）、空狀態。
- Non-Goals：進階 Insights（推拉平衡 / 動力鏈 / 動作模式覆蓋）先延後。

## 自訂區間

- 區間選擇器：預設 chips（7/30/90）+「自訂」→ DatePicker 選起迄。
- DatePicker：以 `@react-native-community/datetimepicker` 或自製月曆選擇（沿用 schedule 月曆元件思路），輸出 ISO 起迄，餵入 query key 重算。

## Insights Engine（mock）

- `computeInsights(range)`：純函式，依 mock 訓練資料算：
  - 訓練取向：依組數 / 重量 / 次數分布判定（肌力 / 增肌 / 耐力 傾向）。
  - 肌群分佈均衡度：各肌群訓練量占比，標出偏重 / 不足。
- UI：洞察卡（標題 + 結論 + 佐證數據），對齊統計頁風格。

## Decisions

- Insights 計算放純函式（utils），無副作用、可測；資料來源仍 mock，串接點不變。
- 自訂區間以 query key 帶起迄日，React Query 自動重抓。

## Risks

- DatePicker 跨平台差異 → 優先自製（與 schedule 月曆一致），避免原生 picker web 不一致。
