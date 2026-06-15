## 1. 資料層

- [ ] 1.1 `features/ai-coach/api/schemas.ts`（advice / analysisTask / usage）
- [ ] 1.2 `mock.ts`（建議樣本 + task 狀態機 + 額度計數）
- [ ] 1.3 `hooks.ts`：useExerciseAdvice / useStartAnalysis / useAnalysisTask（輪詢）/ useAiUsage（`// TODO: apiFetch`）
- [ ] 1.4 `QUERY_KEYS` 擴充

## 2. AI 建議

- [ ] 2.1 動作詳情「AI 建議」面板：觸發 → loading → 顯示建議
- [ ] 2.2 額度檢查 + 達上限提示

## 3. 影片分析

- [ ] 3.1 影片選 / 拍入口（picker，上傳 stub）
- [ ] 3.2 前端預檢（時長 / 大小 / 格式）
- [ ] 3.3 任務狀態 UI（pending / processing / done / failed）
- [ ] 3.4 分析結果畫面（動作分解 / 建議，mock）
- [ ] 3.5 防重複觸發（進行中擋）

## 4. 通知整合

- [ ] 4.1 任務完成推通知（接 app-notifications；未就緒則 toast 暫代）

## 5. i18n / Verification

- [ ] 5.1 新增 `ai-coach` namespace（三語系）+ 註冊
- [ ] 5.2 `npx tsc --noEmit`　5.3 `npx expo lint`
- [ ] 5.4 preview：建議 / 影片預檢 / 任務狀態 / 結果 / 額度 / light-dark
