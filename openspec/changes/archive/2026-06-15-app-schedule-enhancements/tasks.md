## 1. 月曆重做

- [x] 1.1 `day-cell.tsx` 改高格子：日期靠上 + chip 區（plan/metric/note）
- [x] 1.2 plan chip 依完成度配色（完成 success / 部分 warning / 未開始 primary）、metric 綠、note 黃；今天 brandOrange 外框+底、過去日淡化
- [x] 1.3 整格為點擊區（minHeight 58）、圓角 8（Radius.lg）
- [x] 1.4 `calendar-month.tsx` 加水平 swipe 換月（gesture-handler Pan + reanimated 淡入過場 + runOnJS），保留箭頭

## 2. 雙視圖

- [x] 2.1 header Segmented（新增可重用 `SegmentedControl`，月曆 / 清單）
- [x] 2.2 `ScheduleListView`：依日期列出有資料的天（plan/metric/note badge），點列進日詳情

## 3. 引導對話框

- [x] 3.1 缺動作引導（動作庫為空 → ConfirmDialog → 導向 Exercises）
- [x] 3.2 清空計畫確認（新增可重用 `ConfirmDialog`，destructive）

## 4. 計畫上限

- [x] 4.1 上限常數 `MAX_PLAN_EXERCISES` + 達上限新增鈕 disabled + 提示文案

## 5. i18n

- [x] 5.1 `schedule` 補視圖切換 / 對話框 / 上限文案（三語系）

## 6. Verification

- [x] 6.1 `npx tsc --noEmit`（pass）　6.2 `npx expo lint`（pass）
- [x] 6.3 preview：月曆高格子 + today 橘框 + 完成度 chip + 過去淡化、雙視圖切換、清單 badge、清空計畫 ConfirmDialog、無 console error
