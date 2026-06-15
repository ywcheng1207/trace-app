## 1. 資料層

- [ ] 1.1 `features/training-templates/api/schemas.ts`（範本 + 動作組合）
- [ ] 1.2 `mock.ts`（in-memory CRUD + 樣本）
- [ ] 1.3 `hooks.ts`：useTemplates / useCreateTemplate / useApplyTemplate / useDeleteTemplate（`// TODO: apiFetch`）
- [ ] 1.4 `QUERY_KEYS` 擴充

## 2. Schedule 整合

- [ ] 2.1 「另存為範本」：輸入名稱（重複提示）→ create
- [ ] 2.2 「套用範本」：選範本 → 已有計畫 confirm 覆蓋 → 寫入當日
- [ ] 2.3 範本管理：列表 + 刪除（confirm）
- [ ] 2.4 套用時失效動作以名稱快取顯示並標記

## 3. i18n

- [ ] 3.1 範本相關文案（三語系）

## 4. Verification

- [ ] 4.1 `npx tsc --noEmit`　4.2 `npx expo lint`
- [ ] 4.3 preview：另存 / 套用（覆蓋確認）/ 刪除 / 名稱重複
