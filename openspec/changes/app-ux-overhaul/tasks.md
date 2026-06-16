## 1. 圖資與共用元件基礎

- [x] 1.1 複製 web `assets/squat.gif`、`assets/logo/logo-small-human.png`、`public/assets/mascot1.png` 到 `assets/images/mascot/`
- [x] 1.2 新增 `src/components/ui/brand-label.tsx`（BrandLabel 元件，對齊 web `BrandLabel.tsx` 字型與樣式）
- [x] 1.3 修正 `src/components/ui/text-field.tsx`：error 區改為固定 `minHeight: 18`，無 error 時以 `opacity: 0` 佔位，杜絕 layout shift
- [x] 1.4 移植 web 的 polygon body-map 資料到 `src/lib/constants/body-map.ts`（ANTERIOR_POLYGONS、POSTERIOR_POLYGONS、region 對應、MUSCLE_TO_REGION 映射）

## 2. Auth 進入點重設計

- [x] 2.1 重寫 `src/app/(auth)/login.tsx`：移除「歡迎回來」大標題，頂部加入 mascot（expo-image GIF 或備援 PNG）+ BrandLabel
- [x] 2.2 在 login.tsx 實作 animated tab bar（Login / Register 底部滑動線），含 Animated.Value 控制 indicator 位移
- [x] 2.3 將 register 表單內容移進 login.tsx 的 RegisterTab 子元件（表單欄位、Zod schema、RHF 同現有 register.tsx）
- [x] 2.4 `src/app/(auth)/register.tsx` 改為 redirect 至 `/(auth)/login`（帶 `?tab=register` query 或直接用 router.replace）
- [x] 2.5 更新 `src/lib/i18n/locales/*/auth.json` 三語系：對齊 web entry 文案（移除「歡迎回來」標題與頁尾連結，tab label 用 loginButton / registerButton）

## 3. Calendar 月曆重設計

- [x] 3.1 修改 `src/app/(tabs)/schedule/index.tsx`：移除 `<SegmentedControl>`，Header 右側改為兩顆 icon button（`CalendarDays` / `List`，來自 lucide-react-native）
- [x] 3.2 移除月曆區域的 `<Card>` 包裹，讓 `<CalendarMonth>` 直接在 ScrollView content 中渲染（水平 padding 由 ScreenContainer 提供）
- [x] 3.3 修改 `src/features/schedule/components/calendar-month.tsx`：移除頂部 ChevronLeft / ChevronRight icon button
- [x] 3.4 在 `calendar-month.tsx` 底部加入月份切換按鈕列（兩顆 Pressable，各 `height: 44`、半寬、含「‹ 上個月」/ 「下個月 ›」文字）
- [x] 3.5 更新 `src/lib/i18n/locales/*/schedule.json` 三語系：加入月份切換按鈕的 i18n key

## 4. Exercises 肌群選取器重寫

- [x] 4.1 新增 `src/features/exercises/components/muscle-polygon-anatomy.tsx`：用 `react-native-svg` 的 `<Polygon>` 渲染 body-map.ts 的 polygon 資料（正面/背面切換，region 顏色三態：muted / primary/60 / primary）
- [x] 4.2 新增 `src/features/exercises/components/muscle-drill-sheet.tsx`：接收 `regionKey`，顯示該 region 細項肌群 chips（選取 / 取消），確認按鈕關閉 Sheet
- [x] 4.3 重寫 `src/features/exercises/components/muscle-selector.tsx`：整合 `MusclePolygonAnatomy` + 點擊 region → 開啟 `MuscleDrillSheet`，移除舊的平鋪 chips 設計
- [x] 4.4 更新 i18n 三語系：polygon 對應 app 既有 6 大區（chest/back/shoulders/arms/legs/core），exercises.json 補 selected/clear/select_all_region/select_region_hint key

## 5. Statistics 統計頁重設計

- [x] 5.1 修改 `src/app/(tabs)/statistics.tsx`：移除「自訂」Chip，加入 calendar icon button（`CalendarRange` icon）作為自訂日期入口
- [x] 5.2 在 statistics.tsx 加入 `sliders-horizontal` icon button 於 Header 右側，點擊開啟 MetricPreferencesSheet
- [x] 5.3 新增 `src/features/statistics/components/metric-preferences-sheet.tsx`：Bottom Sheet，內含 BODY_METRIC_GROUPS 的 Switch 列表（邏輯移植自 `setting.tsx`，呼叫 `useSetHiddenMetrics`）
- [x] 5.4 升級 `src/features/statistics/components/bar-chart-view.tsx`：加入 Y 軸標籤、`rulesType` 網格線、`barBorderTopRadius` 圓角、`focusBarOnPress` + `renderTooltip` 按壓提示
- [x] 5.5 新增 `src/features/statistics/components/chart-card.tsx`：統一 chart title / subtitle 排版的 wrapper Card 元件（MetricTrendCard 一併改用）
- [x] 5.6 重整 statistics.tsx 的 section 排版：section header 字型層級統一（`fontSize: 17, fontWeight: '700'`），移除雜亂的 inline style
- [x] 5.7 更新 `src/lib/i18n/locales/*/statistics.json` 三語系：加入 metric preferences sheet 標題、圖表副標題等新 key

## 6. Setting 清理

- [x] 6.1 修改 `src/app/(tabs)/setting.tsx`：移除 `metric_preferences` section（section header、hint、BODY_METRIC_GROUPS 迭代、所有 Switch 元件）
- [x] 6.2 移除 setting.tsx 中 `useSetHiddenMetrics`、`Switch`、`BODY_METRIC_GROUPS` import 與孤立 styles

## 7. 收尾與驗收

- [ ] 7.1 全局搜尋「歡迎回來」確認無殘留硬編碼文案
- [ ] 7.2 在 login、register 表單手動觸發 error，確認所有 TextField 無 layout shift
- [ ] 7.3 確認月曆頁在 iPhone SE（小螢幕）上月份切換按鈕觸控區足夠
- [ ] 7.4 在 exercise 表單確認肌群選取器正面/背面 polygon 顯示正確，Sheet 下鑽流程順暢
- [ ] 7.5 統計頁確認 bar chart 有 Y 軸標籤、網格線、按壓 tooltip 顯示
- [ ] 7.6 統計頁確認 MetricPreferencesSheet 開啟後修改設定，身體數值圖表即時反映
- [ ] 7.7 Setting 頁確認 metric preferences 區塊已移除
