## Context

沿用 foundation/exercises 架構。Schedule 是最複雜的 feature：月曆 + 三區日詳情。本階段純前端 mock。

## Goals / Non-Goals

**Goals:** 月曆總覽（含每日標記）、日詳情三區（訓練計畫含組數與完成、身體數值、筆記），mock 且 API-ready；補 `Checkbox` UI。

**Non-Goals:** 訓練範本、四肢圍度 L/R 與顯示偏好、影片、TDEE、趨勢圖、計畫/組數上限強制、雙視圖（list view）。

## Decisions

- **月曆用 date-fns 計算**（startOfMonth/endOfMonth/eachDayOfInterval + 週對齊），自繪 6 週網格；不引入第三方 calendar 套件。
- **日期 key 用 `yyyy-MM-dd`**（本地日期字串），作為 plan / metric / note 的 mock store key 與路由參數。
- **訓練計畫採「本地工作副本 + 單一儲存」**：日詳情載入計畫進 local state，新增/編輯/勾選/移除都改 local，按「儲存」以一個 mutation 持久化整份當日計畫。比逐組 mutation 簡單且交互一致。
- **身體數值用 RHF**（數字欄位以 numeric keyboard 的 TextField），筆記用 TextArea。
- **動作挑選器**重用 `useExercises`（exercises feature），選取後以 `exercise.name` 作為 `cachedName` 加入計畫。

## Risks / Trade-offs

- mock in-memory 於 reload 後重置（種子資料：今天）→ 可接受（純前端原型）。
- 整份計畫儲存 vs 逐組即時儲存：本地副本若未儲存即離開會遺失編輯 → 以明確「儲存」按鈕與（後續）離開提醒緩解。

## Open Questions
- 完成度定義（已完成組數 / 總組數）先以比例呈現；最終 UI 呈現待產品確認。
