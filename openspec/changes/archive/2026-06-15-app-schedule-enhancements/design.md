## Context

web `ScheduleCalendarGrid`：高格子 `min-h-[12dvh]`、日期靠上、底部 plan/metric/note chip（plan 依完成度配色、metric 綠、note 黃）、今天 brandOrange 外框+底色、過去日淡化、`rounded-[8px]`。另有 `ScheduleTableList` 表格清單視圖與多個引導 Dialog。app 已裝 gesture-handler + reanimated。

## Goals / Non-Goals

- Goals：觸控友善月曆、對齊 web 視覺、雙視圖、引導對話框、計畫上限。
- Non-Goals：不換月曆函式庫（保留 date-fns 自製 grid，精準對齊 web）；不做跨時區後端邏輯。

## 月曆重做

- 自製（保留 `buildMonthGrid`）。`DayCell` 改高格子：上方日期數字（今天 brandOrange、過去 muted），下方 chip 區（plan / metric / note，依 `DaySummary`）。
- 點擊區擴大至整格（最小高度足夠手指）；今天 brandOrange 外框 + 淡底。
- 換月：`react-native-gesture-handler` 水平 swipe + reanimated 過場；保留左右箭頭。
- 評估過 [Flash Calendar](https://github.com/MarceloPrado/flash-calendar)（Expo 出品、FlashList 高效）為備選，但 web 月曆高度客製（完成度 chip / 今天框），自製對齊成本最低，故沿用自製。

## 雙視圖

- header 加 Segmented（月曆 / 清單）。清單視圖：依日期列出有 plan/metric/note 的天，對齊 web `ScheduleTableList`，點列進日詳情。

## 引導對話框（日詳情）

- 缺動作引導：動作庫為空時，導向 Exercises 新增。
- 無動作提示 / 清空計畫確認 / 缺資料提示：以 `Sheet` / Alert 呈現，對齊 web Dialog 行為。

## 計畫上限

- 每日計畫動作數上限（常數），達上限時新增鈕 disabled + 提示。

## Risks

- swipe 與內層 ScrollView 手勢衝突 → 用 gesture-handler 的 `Gesture.Pan` 限定水平、設定 activeOffsetX。
