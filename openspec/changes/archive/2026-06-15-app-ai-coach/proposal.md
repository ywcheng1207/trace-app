## Why

web 有 AI Coach 能力：上傳訓練影片給 Gemini 做動作分析、非同步任務 + 完成通知、單一動作的 AI 建議、每日用量額度、前端影片預分析。app 完全沒有。本 change 補齊 AI Coach 的**前端**：所有畫面與互動以 UI + mock 完成，實際上傳 / Gemini 呼叫一律 stub（`// TODO: apiFetch`），不做任何後端。

## What Changes

- 動作 AI 建議：動作詳情的「AI 建議」入口（foundation 已留 placeholder）改為實際 UI —— 觸發 → loading → 顯示建議（mock），受每日額度限制。
- 訓練影片分析：選 / 拍影片 → 前端預檢（時長 / 大小 / 格式）→ 送出（stub）→ 以非同步任務呈現（pending）→ 完成後出現分析結果（動作分解 / 建議疊圖，mock）。
- 非同步任務 + 通知：分析進行中防重複觸發；完成以通知中心通知（接 `app-notifications`）。
- 每日額度：顯示剩餘額度，超過時阻擋並提示（mock 計數）。
- i18n：新增 `ai-coach` namespace（三語系）。

延後（後端）：實際上傳 / 壓縮 / Gemini 呼叫 / 任務佇列 —— 全 stub。

## Capabilities

### New Capabilities
- `app-ai-coach`：AI 動作建議、訓練影片分析（非同步任務 + 通知）、每日額度、前端預分析 —— 純前端 UI + mock，API-ready。

### Modified Capabilities
- `app-exercises`：「動作詳情」的 AI 建議入口由 placeholder 改為實際 UI（接 ai-coach）。

## Impact

- 程式：`features/ai-coach/*`（新：schemas / mock / hooks）、影片選取 + 預檢、分析結果畫面、AI 建議面板、額度顯示；動作詳情接線。
- 行為：可體驗完整 AI Coach 流程（mock 結果），上傳 / 分析為 stub。
- 不影響：真實後端（全 stub）。
