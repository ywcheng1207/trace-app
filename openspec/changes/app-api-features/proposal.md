## Why

`app-api-foundation` change 建立了加密通訊層（crypto、session、apiFetch），但所有 feature hooks 仍回傳 mock 資料。本 change 將全部 feature hooks 切換為真實 apiFetch，app 從此能以真實後端資料運作。

## What Changes

- **Profile hooks**（`src/features/profile/api/hooks.ts`）：useProfile、useUpdateProfile、useSetHiddenMetrics、useUpdateLanguage 改為真實 API
- **Exercises hooks**（`src/features/exercises/api/hooks.ts`）：useExercises、useExercise、useCreateExercise、useUpdateExercise、useArchiveExercise、useExerciseUsage 改為真實 API；useSetExerciseVideo stub（後端 API 已存在，暫不實作 file upload）
- **Schedule hooks**（`src/features/schedule/api/hooks.ts`）：training plans CRUD、sessions（start/complete/set progress）、body metrics（daily read/upsert）改為真實 API
- **Statistics hooks**（`src/features/statistics/api/hooks.ts`）：useStats 改為真實 API
- **AI Coach hooks**（`src/features/ai-coach/api/hooks.ts`）：useAiCoach、useAiAdvice 改為真實 API
- **Notifications hooks**（`src/features/notifications/api/hooks.ts`）：useNotifications、useMarkRead、useMarkAllRead 改為真實 API
- **Training Templates hooks**（`src/features/training-templates/api/hooks.ts`）：useTrainingTemplates、useCreateFromTemplate 改為真實 API
- **刪除所有 feature mock 檔案**（`api/mock.ts`）
- **Zod schema 對齊**：各 feature 的 schema 根據後端實際 response 結構對齊或修正

## Capabilities

### Modified Capabilities

- `app-exercises`: exercises hooks 從 mock 改為真實加密 API；Zod schema 對齊後端回傳結構
- `app-schedule`: training plans、sessions、body metrics hooks 全部改為真實 API；session 進行中狀態由後端驅動
- `app-statistics`: stats query 改為真實 API，支援時間範圍參數
- `app-ai-coach`: AI coach 與 exercise AI advice 改為真實 API，需注意每日限額（後端已有 rate limiting）
- `app-notifications`: notifications CRUD 改為真實 API
- `app-training-templates`: templates query 與 createFromTemplate 改為真實 API
- `app-setting`: profile edit（GET/PUT /api/user/me）、語系更新改為真實 API；密碼變更已在 app-auth 處理

## Impact

- **依賴 app-api-foundation**：本 change 需 foundation 的 apiFetch + crypto 層已就位才能實作
- **mock 檔案移除**：各 feature 的 `api/mock.ts` 刪除（涉及多個 feature 目錄）
- **Zod schema 可能需要調整**：後端實際回傳欄位名稱（camelCase/snakeCase）、欄位是否可 null，需對齊實際 response
- **query key 不變**：`QUERY_KEYS` 維持現有命名，避免快取失效問題
- **file upload（頭像、exercise video）**：維持 stub，標 `// TODO: implement file upload`，不在本 change 範圍
