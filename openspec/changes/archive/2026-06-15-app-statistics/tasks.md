## 1. 資料層（features/statistics）

- [x] 1.1 `api/schemas.ts`：StatsSummary（summary + volumeTrend / muscleDistribution / weightTrend / bodyFatTrend）
- [x] 1.2 `api/mock.ts`：依 rangeDays 產生彙總（mock），標 `// TODO: apiFetch('/api/stats/all')`
- [x] 1.3 `api/hooks.ts`：`useStats(rangeDays)`（React Query）+ 擴充 `QUERY_KEYS`

## 2. i18n

- [x] 2.1 `statistics` namespace（三語系）
- [x] 2.2 註冊 namespace

## 3. 畫面

- [x] 3.1 `(tabs)/statistics/index`：區間 preset chips + 摘要卡 + 圖表區（ScrollView）
- [x] 3.2 訓練量趨勢（LineChart）、肌群分佈（BarChart）
- [x] 3.3 身體數據：體重 / 體脂趨勢（LineChart）；各區無資料顯示空狀態
- [x] 3.4 摘要卡元件 `StatSummaryCard`

## 4. Verification

- [x] 4.1 `npx tsc --noEmit`
- [x] 4.2 `npx expo lint`
- [x] 4.3 Expo web preview：區間切換、摘要、圖表渲染（或記錄 web 相容性）、無 console error（截圖）
