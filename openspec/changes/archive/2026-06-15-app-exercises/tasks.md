## 1. UI Kit 補齊

- [x] 1.1 `Chip`（可選取/可點按，用於肌群多選與篩選）
- [x] 1.2 `TextArea`（多行輸入，RHF 相容）
- [x] 1.3 `Modal`/`Sheet`（底部彈窗，承載建立/編輯表單）
- [x] 1.4 `Select`（Modal 清單選單，泛型 + RHF 相容）

## 2. 資料層（features/exercises）

- [x] 2.1 `api/schemas.ts`：Exercise + enum Union（category/force/kineticChain/mechanic）+ muscle 常數
- [x] 2.2 `api/mock.ts`：sample 動作 + in-memory CRUD（list/create/update/archive/restore/purge/archived）
- [x] 2.3 `api/hooks.ts`：useExercises / useArchivedExercises / useCreate / useUpdate / useArchive / useRestore / usePurge（標 `// TODO: apiFetch`）
- [x] 2.4 擴充 `QUERY_KEYS`（exercises list / archived / detail）

## 3. i18n

- [x] 3.1 `exercises` namespace（三語系）
- [x] 3.2 精簡 `muscle` namespace（region + 主要肌群，三語系）
- [x] 3.3 註冊 namespace

## 4. 畫面（expo-router）

- [x] 4.1 `(tabs)/exercises` 改資料夾：`_layout`（Stack）+ `index`
- [x] 4.2 `index`：搜尋框 + 篩選 chips + FlatList 動作卡 + 新增按鈕 → 開建立彈窗
- [x] 4.3 `ExerciseFormSheet`（建立/編輯，RHF + Zod，含肌群多選與 Select 屬性）
- [x] 4.4 `exercises/[id]`：詳情（基本資訊/屬性/肌群/筆記 + 編輯/封存 + AI 建議 placeholder）
- [x] 4.5 `exercises/archived`：封存列表 + 還原 / 永久刪除（Alert 確認）

## 5. Verification

- [x] 5.1 `npx tsc --noEmit` 通過
- [x] 5.2 `npx expo lint` 通過
- [x] 5.3 Expo web preview：列表/搜尋/篩選、建立彈窗、詳情、無 console error（截圖）
