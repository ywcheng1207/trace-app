## Why

trace-app 的所有功能皆以 web 版 Trace 為對標，但目前實作有多處設計偏差：元件互動行為與 web 不一致（文案、圖示、選取器架構）、基礎表單體驗有 layout shift 缺陷、月曆操作不符合手機使用習慣、肌群選取器與 web 的精確解剖圖相去甚遠、統計頁排版雜亂且欄位偏好設定位置錯誤。本 change 全面對齊 web 設計意圖，並針對手機互動模式做出適當的 mobile-first 調整。

## What Changes

- **TextField**：修正 error 訊息出現/消失造成的 layout shift，改為固定保留 error 行高度
- **Login/Register**：移除「歡迎回來」大標題；加入 mascot gif（squat.gif）與 BrandLabel；將 Register 整合進 Login 畫面（animated tab 切換，移除獨立 register screen）；文案對齊 web `entry` i18n namespace
- **Calendar 月曆**：月曆/清單切換由 SegmentedControl 改為兩顆 icon button（CalendarDays / List）；移除 Card 外框使月曆內容延展至螢幕邊緣；月份切換按鈕移至月曆下方並放大為易按的觸控區
- **Exercises 肌群選取器**：解剖圖從自製幾何形（rect/ellipse）改成 SVG polygon 精確人體圖（對齊 web ANTERIOR/POSTERIOR_POLYGONS 資料）；移除平鋪列出全部肌群的設計；改為「點擊大區域 → 底部 Sheet 顯示該區域細項 chips」的下鑽流程
- **Statistics 統計**：「自訂」日期按鈕改為 calendar icon button；身體數值欄位偏好從 Setting 移至 Statistics 頁（以 icon button 開啟 Sheet 選取）；圖表加入 Y 軸標籤、網格線、press tooltip、bar 圓角；section / chart / data label 字型層級全面整理；Setting 中移除 metric preferences 區塊

## Capabilities

### New Capabilities
- `app-mascot-assets`：將 web 的 mascot gif/png 圖資移植到 app assets，供 auth 及 loading 畫面使用

### Modified Capabilities
- `app-ui-foundation`：TextField 固定 error 區高度，Button 互動狀態對齊 web
- `app-auth`：Login/Register 合併為單一畫面（animated tab），文案 namespace 更新
- `app-schedule`：月曆 layout 無框化、視圖切換改 icon button、月份操作按鈕移下方
- `app-exercises`：MuscleSelector 改 polygon SVG + 下鑽 Sheet 架構
- `app-statistics`：統計頁圖表 UX 升級、身體數值偏好入口移入此頁
- `app-setting`：移除 metric preferences 區塊（已移至 statistics）

## Impact

- `src/components/ui/text-field.tsx` — 修正 layout
- `src/app/(auth)/login.tsx`、`src/app/(auth)/register.tsx` — 合併架構，更新文案
- `src/lib/i18n/locales/*/auth.json`（或 entry.json）— 對齊 web 文案
- `assets/` — 新增 squat.gif、BrandLabel 相關圖資
- `src/features/schedule/components/calendar-month.tsx` — layout 重設計
- `src/app/(tabs)/schedule/index.tsx` — 切換方式改 icon button
- `src/features/exercises/components/muscle-selector.tsx`、`muscle-anatomy.tsx` — 全面重寫
- `src/lib/constants/bodyMap.ts`（新增）— 移植 web 的 polygon 常數
- `src/app/(tabs)/statistics.tsx` — 統計頁重設計，引入 metric preferences sheet
- `src/features/statistics/components/` — 圖表元件升級
- `src/app/(tabs)/setting.tsx` — 移除 metric preferences 區塊
