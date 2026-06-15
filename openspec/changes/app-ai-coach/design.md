## Context

web `ai-coach`：影片上傳 Gemini、動作分析（重複分析防護 / 查看結果）、非同步任務 + 通知（防重複觸發）、動作 AI 建議、用量額度、前端預分析（影片預檢）。app 為純 client，本 change 只做**前端 + mock**，上傳 / Gemini / 任務全 stub。

## Goals / Non-Goals

- Goals：AI Coach 完整前端流程（UI + mock）：建議 / 影片分析 / 任務狀態 / 通知 / 額度 / 預檢。
- Non-Goals：真實上傳 / 壓縮 / Gemini / 後端任務佇列（stub）。

## 資料模型（Zod）

- `aiAdviceSchema`：exerciseId / advice（結構化建議）/ createdAt。
- `analysisTaskSchema`：id / exerciseId / status（`PENDING` | `PROCESSING` | `DONE` | `FAILED`）/ result? / createdAt。
- `aiUsageSchema`：dailyUsed / dailyLimit。

## 流程

- AI 建議：詳情點「AI 建議」→ `useExerciseAdvice`（mock 延遲回傳）→ 顯示；先檢查額度。
- 影片分析：選 / 拍片（expo-image-picker，stub 上傳）→ 前端預檢（時長 / 大小 / 格式）→ 建立 task（mock `PENDING`→`PROCESSING`→`DONE`，以 React Query 輪詢模擬）→ 完成推通知（`app-notifications`）。
- 防重複：同動作有進行中 task 時，再次觸發被擋。
- 額度：`useAiUsage` 顯示剩餘；達上限時建議 / 分析入口 disabled + 提示。

## Decisions

- 任務狀態以 React Query 輪詢 mock 推進，未來換真實 polling/任務 API，UI 不動。
- 完成通知走 `app-notifications` 通知中心（依賴該 change；若未先做，先以 toast 暫代）。
- 上傳一律 stub：`// TODO: apiFetch('/api/upload/authorize')` + Gemini，符合「不做後端」。

## Risks

- 影片元件 / picker 跨平台（web preview）差異 → 預檢與結果畫面以可在 web 呈現的 UI 為主，播放器在 native 驗證。
