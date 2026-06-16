## 1. 資料層

- [x] 1.1 `features/training-templates/api/schemas.ts`（trainingTemplate + templateExercise 動作組合）
- [x] 1.2 `mock.ts`（in-memory CRUD + 2 筆樣本，名稱重複擲 TEMPLATE_NAME_TAKEN）
- [x] 1.3 `hooks.ts`：useTrainingTemplates / useCreateTemplate / useDeleteTemplate（`// TODO: apiFetch`）；套用邏輯在日詳情（plan-utils createPlanExerciseFromTemplate / toTemplateExercises）
- [x] 1.4 `QUERY_KEYS` 擴充（trainingTemplates）

## 2. Schedule 整合

- [x] 2.1 「另存為範本」SaveTemplateSheet：輸入名稱（重複 → inline error）→ create
- [x] 2.2 「套用範本」ApplyTemplateSheet：選範本 → 已有計畫 ConfirmDialog 覆蓋確認 → 寫入當日 exercises
- [x] 2.3 範本管理：列表 + 刪除（ConfirmDialog 確認）
- [x] 2.4 套用 / 列表時失效動作以 cachedName 顯示並標記「已失效」（比對 library id）

## 3. i18n

- [x] 3.1 範本相關文案（schedule namespace，三語系）

## 4. Verification

- [x] 4.1 `npx tsc --noEmit`（pass）　4.2 `npx expo lint`（pass）
- [x] 4.3 preview：套用範本 Sheet 列出範本 + 失效動作標記、日詳情範本按鈕、刪除/覆蓋走 ConfirmDialog
