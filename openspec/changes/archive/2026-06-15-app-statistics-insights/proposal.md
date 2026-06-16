## Why

統計目前有 7/30/90 天預設區間 + 訓練摘要 + 訓練量 / 肌群 / 體重 / 體脂圖表，但缺 web 的兩項：①自訂日期區間（web `StatisticsDateRangePicker`）②Insights Engine（依訓練資料判定訓練取向，給出洞察）。空狀態（無有效訓練 / 區間內無身體數據）也只是部分處理。本 change 補齊（純前端 mock）。

## What Changes

- 自訂日期區間：除預設 7/30/90，加入自訂起迄日（DatePicker），重算統計。
- Insights Engine：依區間訓練資料（mock）計算洞察 —— 訓練取向判定（如肌力 / 增肌 / 耐力傾向）、肌群分佈均衡度等，以洞察卡呈現。
- 空狀態完善：無有效訓練、區間內無身體數據各自的 EmptyState。
- i18n：`statistics` 補洞察 / 區間 / 空狀態文案（三語系）。

延後：進階 Insights（推 / 拉平衡、動力鏈、動作模式覆蓋）—— 先做訓練取向 + 均衡度。

## Capabilities

### Modified Capabilities
- `app-statistics`：「日期區間選擇」加自訂區間；新增「Insights Engine」requirement；空狀態完善。

## Impact

- 程式：`features/statistics/api/*`（洞察計算 mock + 自訂區間參數）、新增 DatePicker UI、洞察卡元件、`statistics.tsx`、i18n。
- 行為：可自訂區間、看到訓練洞察與空狀態。
- 不影響：既有圖表元件（沿用）。
