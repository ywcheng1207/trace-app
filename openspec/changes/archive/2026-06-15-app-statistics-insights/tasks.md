## 1. 自訂區間

- [x] 1.1 區間選擇器加「自訂」chip → 起迄 DatePicker（沿用 app-settings-profile 新增的 DatePicker）
- [x] 1.2 DatePicker UI（自製月曆 Sheet，輸出 ISO 起迄，maxDate=今天）
- [x] 1.3 `StatsRange`（preset|custom）descriptor + serializeStatsRange，query key 帶區間，mock 依起迄算天數重抓

## 2. Insights Engine

- [x] 2.1 `computeInsights` 純函式（insights.ts）：訓練取向（setRepBuckets 主導區間）+ 肌群均衡度（muscleDistribution max/min）
- [x] 2.2 `InsightCard` 元件（lightbulb + 標題 + 結論 + 佐證）
- [x] 2.3 統計頁渲染洞察區（無訓練時 computeInsights 回 null，不顯示）

## 3. 空狀態

- [x] 3.1 無有效訓練（totalSets=0）→ training EmptyState（隱藏洞察與訓練圖表）
- [x] 3.2 區間內無身體數據 → body EmptyState；mock 對歷史/無效區間回 EMPTY_STATS

## 4. i18n / Verification

- [x] 4.1 `statistics` 補洞察 / 區間 / 空狀態文案（三語系）
- [x] 4.2 `npx tsc --noEmit`（pass）　4.3 `npx expo lint`（pass）
- [x] 4.4 preview：洞察卡（訓練取向 增肌 55% / 肌群均衡度 腿部·核心）、自訂區間 chip + 起迄 DatePicker（DOM 驗證）、無 console error
