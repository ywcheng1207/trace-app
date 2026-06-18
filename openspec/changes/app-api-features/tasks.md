## 1. 準備（依賴 app-api-foundation 完成）

- [ ] 1.1 確認 `apiFetch`（app-api-foundation T10）已完整實作且可呼叫
- [ ] 1.2 新增 `src/lib/api/query-keys.ts`（若尚未建立）：集中所有 feature 的 `QUERY_KEYS` 常量

## 2. Profile Hooks（src/features/profile/api/）

- [ ] 2.1 對齊 Zod schema（`schemas.ts`）與後端 GET /api/user/me 實際回傳欄位（snake_case vs camelCase 確認後定案）
- [ ] 2.2 重寫 `useProfile`：`apiFetch('/api/user/me', { schema: profileSchema })`，`staleTime: 300000`
- [ ] 2.3 重寫 `useUpdateProfile`：mutation → apiFetch PUT `/api/user/me`（加密），onSuccess invalidate profile
- [ ] 2.4 重寫 `useSetHiddenMetrics`：mutation → apiFetch PUT `/api/user/hidden-metrics`，onSuccess invalidate profile
- [ ] 2.5 重寫 `useUpdateLanguage`：mutation → apiFetch PUT `/api/user/language`，onSuccess invalidate profile
- [ ] 2.6 刪除 `src/features/profile/api/mock.ts`

## 3. Exercises Hooks（src/features/exercises/api/）

- [ ] 3.1 對齊 exercises Zod schema 與後端 response 欄位（含 muscleGroups、category 等 union types）
- [ ] 3.2 重寫 `useExercises`：apiFetch GET `/api/exercises`（帶 search/filter query params），`staleTime: 600000`
- [ ] 3.3 重寫 `useExercise`：apiFetch GET `/api/exercises/[id]`
- [ ] 3.4 重寫 `useCreateExercise`：mutation → apiFetch POST `/api/exercises`（加密），onSuccess invalidate exercises list
- [ ] 3.5 重寫 `useUpdateExercise`：mutation → apiFetch PUT `/api/exercises/[id]`（加密），onSuccess invalidate exercises
- [ ] 3.6 重寫 `useArchiveExercise`：mutation → apiFetch DELETE `/api/exercises/[id]`（加密），onSuccess invalidate exercises
- [ ] 3.7 重寫 `useExerciseUsage`：apiFetch GET `/api/exercises/[id]/usage`
- [ ] 3.8 新增 `useUpdateExerciseNote`：mutation → apiFetch PUT `/api/exercises/[id]/note`（加密）
- [ ] 3.9 useSetExerciseVideo：維持 stub，標 `// TODO: implement file upload`
- [ ] 3.10 刪除 `src/features/exercises/api/mock.ts`

## 4. Schedule Hooks — Training Plans（src/features/schedule/api/）

- [ ] 4.1 對齊 training plan Zod schema 與後端回傳
- [ ] 4.2 重寫 `useTrainingPlansForDay`（或 `useTrainingPlans`）：apiFetch GET `/api/training-plans?date=`
- [ ] 4.3 重寫 `useCreateTrainingPlan`：mutation → apiFetch POST `/api/training-plans`，onSuccess invalidate plans + month summary
- [ ] 4.4 重寫 `useUpdateTrainingPlan`：mutation → apiFetch PUT `/api/training-plans/[id]`，onSuccess invalidate
- [ ] 4.5 重寫 `useDeleteTrainingPlan`：mutation → apiFetch DELETE `/api/training-plans/[id]`，onSuccess invalidate
- [ ] 4.6 重寫 `useAddExerciseToPlan`：mutation → apiFetch POST `/api/training-plans/[id]/exercises`，onSuccess invalidate
- [ ] 4.7 重寫 `useUpdatePlanExercise`：mutation → apiFetch PUT `/api/training-plans/[id]/exercises/[exerciseId]`
- [ ] 4.8 重寫 `useRemovePlanExercise`：mutation → apiFetch DELETE `/api/training-plans/[id]/exercises/[exerciseId]`
- [ ] 4.9 重寫 `useReorderPlanExercises`：mutation → apiFetch PUT `/api/training-plans/[id]/exercises/reorder`

## 5. Schedule Hooks — Sessions（src/features/schedule/api/）

- [ ] 5.1 對齊 training session Zod schema 與後端 response（session status、sets 結構）
- [ ] 5.2 重寫 `useSessionsForDay`：apiFetch GET `/api/sessions?date=yyyy-MM-dd`，`staleTime: 120000`
- [ ] 5.3 重寫 `useStartSession`：mutation → apiFetch POST `/api/sessions`，onSuccess invalidate sessions
- [ ] 5.4 重寫 `useCompleteSession`：mutation → apiFetch PUT `/api/sessions/[id]/complete`，onSuccess invalidate sessions + month summary
- [ ] 5.5 重寫 `useUpdateSetProgress`：mutation → apiFetch PUT `/api/sessions/[id]/sets/[setId]`，onSuccess invalidate sessions
- [ ] 5.6 重寫 `useAddSetToSession`：mutation → apiFetch POST `/api/sessions/[id]/sets`，onSuccess invalidate sessions
- [ ] 5.7 重寫 `useRemoveSetFromSession`：mutation → apiFetch DELETE `/api/sessions/[id]/sets/[setId]`，onSuccess invalidate sessions

## 6. Schedule Hooks — Body Metrics & Note（src/features/schedule/api/）

- [ ] 6.1 對齊 body metrics Zod schema 與後端回傳欄位
- [ ] 6.2 重寫 `useBodyMetricsForDay`：apiFetch GET `/api/body-metrics?date=yyyy-MM-dd`
- [ ] 6.3 重寫 `useSaveBodyMetrics`：mutation → apiFetch POST/PUT `/api/body-metrics`（upsert），onSuccess invalidate metrics + month summary
- [ ] 6.4 重寫 `useSaveScheduleNote`（或等同 hook）：mutation → apiFetch PUT `/api/schedule/[day]/note`，onSuccess invalidate month summary
- [ ] 6.5 重寫 `useMonthSummaries`：apiFetch GET `/api/schedule/month-summary?year=&month=`，`staleTime: 120000`
- [ ] 6.6 刪除 schedule 相關 `api/mock.ts`

## 7. Statistics Hooks（src/features/statistics/api/）

- [ ] 7.1 對齊 statistics Zod schema 與後端 response 結構（各 metric 的 key 名稱、型別）
- [ ] 7.2 重寫 `useStats`：apiFetch GET `/api/statistics?range=`，`staleTime: 300000`；query key 含 range
- [ ] 7.3 刪除 `src/features/statistics/api/mock.ts`

## 8. AI Coach Hooks（src/features/ai-coach/api/）

- [ ] 8.1 對齊 AI coach response Zod schema
- [ ] 8.2 重寫 `useAiCoach`：mutation → apiFetch POST `/api/ai-coach`（加密），onError 顯示額度不足文案
- [ ] 8.3 重寫 `useAiAdvice`：mutation → apiFetch POST `/api/exercises/[id]/ai-advice`（加密）
- [ ] 8.4 新增 i18n key：`ai_coach.daily_limit_reached`（zh-Hant / zh-Hans / en）
- [ ] 8.5 刪除 `src/features/ai-coach/api/mock.ts`

## 9. Notifications Hooks（src/features/notifications/api/）

- [ ] 9.1 對齊 notification Zod schema 與後端 response
- [ ] 9.2 重寫 `useNotifications`：apiFetch GET `/api/notifications`，`staleTime: 60000`
- [ ] 9.3 重寫 `useMarkRead`：mutation → apiFetch PUT `/api/notifications/[id]/read`，onSuccess invalidate notifications
- [ ] 9.4 重寫 `useMarkAllRead`：mutation → apiFetch PUT `/api/notifications/read-all`，onSuccess invalidate notifications
- [ ] 9.5 刪除 `src/features/notifications/api/mock.ts`

## 10. Training Templates Hooks（src/features/training-templates/api/）

- [ ] 10.1 對齊 training template Zod schema
- [ ] 10.2 重寫 `useTrainingTemplates`：apiFetch GET `/api/training-templates`，`staleTime: 600000`
- [ ] 10.3 重寫 `useCreateFromTemplate`：mutation → apiFetch POST `/api/training-plans/from-template`（加密，body: templateId + date），onSuccess invalidate plans + month summary
- [ ] 10.4 刪除 `src/features/training-templates/api/mock.ts`

## 11. 驗證

- [ ] 11.1 Profile：取得、編輯顯示名稱、切換語系 E2E 驗證
- [ ] 11.2 Exercises：列表、建立、搜尋、封存 E2E 驗證
- [ ] 11.3 Schedule：建立計畫 → 開始訓練 → 完成訓練 → 月摘要更新 E2E 驗證
- [ ] 11.4 Body Metrics：填寫儲存 → 月摘要更新 E2E 驗證
- [ ] 11.5 Statistics：切換時間範圍，資料正確顯示
- [ ] 11.6 Notifications：列表、單則已讀、全部已讀 E2E 驗證
