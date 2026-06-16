## Why

月曆目前是把 web 桌面版小月曆直接搬上來：日期塞進 34×34 圓圈、只有 3 顆小圓點，手指難按、資訊量低，行動裝置體驗不佳。web 另有「月曆 ↔ 表格清單」雙視圖、計畫編排時的引導對話框（缺動作 / 無動作 / 清空計畫 / 缺資料），以及計畫上限，app 都沒有。本 change 把月曆重做成觸控友善並對齊 web 風格，並補齊雙視圖與引導對話框（純前端 mock）。

## What Changes

- 月曆重做：高格子（大點擊區）、日期靠上、底部以 chip 呈現「計畫 / 數值 / 筆記」（計畫依完成度配色、數值綠、筆記黃），今天 = brandOrange 外框 + 底色、過去日淡化；左右滑動換月（gesture-handler + reanimated）。
- 雙視圖切換：月曆 ↔ 表格清單（依日期列出有資料的天，對齊 web `ScheduleTableList`）。
- 日詳情引導對話框：缺動作引導、無動作提示、清空計畫確認、缺資料提示。
- 計畫上限：超過上限時阻擋並提示。

延後：跨時區精準處理（留 API）、範本（拆到 `app-training-templates`）、訓練影片附加（拆到 `app-ai-coach`）。

## Capabilities

### Modified Capabilities
- `app-schedule`：「月曆總覽」改為觸控重做 + 雙視圖；「日詳情 — 訓練計畫」補引導對話框與計畫上限。

## Impact

- 程式：`features/schedule/components/calendar-month.tsx`、`day-cell.tsx`（重做）、新增表格清單視圖元件、引導對話框元件、`schedule/index.tsx`（視圖切換 + 滑動）。
- 行為：月曆好按、資訊更豐富、可切表格視圖、計畫編排有引導。
- 不影響：mock 資料結構（沿用 DaySummary / TrainingPlan）。
