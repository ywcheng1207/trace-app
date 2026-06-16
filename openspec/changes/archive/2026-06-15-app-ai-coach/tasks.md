## 1. 資料層

- [x] 1.1 `features/ai-coach/api/schemas.ts`（aiAdvice / analysisTask + status 機 / aiUsage + 影片預檢常數）
- [x] 1.2 `mock.ts`（建議樣本 + task 狀態機 PENDING→PROCESSING→DONE（依 elapsed）+ 額度計數 + 防重複 active map）
- [x] 1.3 `hooks.ts`：useExerciseAdvice / useStartAnalysis / useAnalysisTask（refetchInterval 至 DONE/FAILED）/ useAiUsage（`// TODO: apiFetch`）
- [x] 1.4 `QUERY_KEYS` 擴充（aiUsage / analysisTask）

## 2. AI 建議

- [x] 2.1 動作詳情「AI 建議」→ AiCoachSheet 面板：觸發 → loading → 顯示建議點
- [x] 2.2 額度檢查（達上限 disabled + 提示）；建議消耗額度（5→4 驗證）

## 3. 影片分析

- [x] 3.1 影片選入口（expo-image-picker videos，上傳 stub）
- [x] 3.2 前端預檢（時長 > 60s 擋並提示）
- [x] 3.3 任務狀態 UI（pending / processing loading + 文案）
- [x] 3.4 分析結果畫面（動作分解 + 調整建議，mock）
- [x] 3.5 防重複觸發（同動作 active task → ANALYSIS_IN_PROGRESS 提示）

## 4. 通知整合

- [x] 4.1 任務 DONE 推通知（showNotification title + actionPath，接 app-notifications 佇列）

## 5. i18n / Verification

- [x] 5.1 新增 `ai-coach` namespace（三語系）+ i18n index 註冊
- [x] 5.2 `npx tsc --noEmit`（pass）　5.3 `npx expo lint`（pass）
- [x] 5.4 preview：AI 教練面板、額度 4/5、AI 建議 4 點、影片分析入口 + 預檢提示；無新 console error
