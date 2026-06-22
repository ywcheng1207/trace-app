## 1. 依賴與核心 lib

- [ ] 1.1 `npx expo install react-native-webview` 並 `npm i @10play/tentap-editor`，確認對 Expo SDK 56 / RN 0.85 的相容版本（必要時鎖版）
- [ ] 1.2 新增 `src/constants/limits.ts`：`EXERCISE_NOTE 3000`、`TRAINING_NOTE 3000`、`TRAINING_NOTE_TITLE 50`、`PLAN_EXERCISE_NOTE 150`（對齊 web `trace/lib/constants/limits.ts`）
- [ ] 1.3 新增 `src/features/notes/lib/tiptap.ts`：
  - `EXTENSIONS` 固定白名單（heading 1–3 / bold / italic / bulletList / orderedList / listItem / blockquote / horizontalRule / paragraph / text / link，link `protocols: ['http','https']`），對齊 web
  - `toDoc(value)`：空→空 doc、合法 JSON→直用、純文字→包單段 doc
  - `serialize(json)`：`JSON.stringify`
  - `getNoteLength(value)`：從 JSON 抽純文字計長（對齊 web `extractPlainText`）
- [ ] 1.4 新增 `src/features/notes/lib/editor-theme.ts`：閱讀排版 CSS（內文 16/1.6、段距 ~1em、H1 24 / H2 20 / H3 17、清單縮排 ~1.25em、連結 accent+底線、可讀寬度 + 內距），色彩走 theme token，提供 light/dark 兩版，編輯器與 viewer 共用

## 2. 富文本元件

- [ ] 2.1 新增 `src/features/notes/components/rich-text-editor.tsx`：封裝 TenTap `useEditorBridge`（吃 `EXTENSIONS` + 初始 `toDoc(value)` + `editor-theme`），`onChange` 回傳 `serialize`；鍵盤底部吸附 `Toolbar`，項目橫向可捲動、觸控目標 ≥44pt，只含 bold / italic / bulletList / orderedList / heading(toggle) / link；顯示 `currentLength / maxLength` 超限阻擋；連結輸入用既有 `Sheet` + `TextField`（限 http/https，不用 prompt）
- [ ] 2.2 新增 `src/features/notes/components/rich-text-viewer.tsx`：`editable={false}` 渲染 `toDoc(value)`，吃同一 `EXTENSIONS` + `editor-theme`；WebView 隨內容回報高度自適應（避免裁切 / 空白）；空值顯示 placeholder
- [ ] 2.3 編輯器 / viewer 載入 WebView 時顯示既有 `Loading`；全程 theme token + StyleSheet

## 3. 全螢幕編輯路由 + 接入

- [ ] 3.1 `exercises/note/[id].tsx`：`TextArea` → 全螢幕 `RichTextEditor`（maxLength=EXERCISE_NOTE），儲存沿用 `useSetExerciseNote`（送 JSON 字串）
- [ ] 3.2 `exercises/[id].tsx`：筆記預覽 `Text` → `RichTextViewer`（不再顯示 raw JSON）；「編輯筆記」維持導向 `exercises/note/[id]`
- [ ] 3.3 新增 `src/app/(tabs)/schedule/[day]/note.tsx`：訓練筆記全螢幕編輯路由（`RichTextEditor`，maxLength=TRAINING_NOTE，儲存沿用 `useSaveDayNote`）；注意 `[day]` 目前是檔案，需轉為資料夾路由（`[day]/index.tsx` + `[day]/note.tsx`）
- [ ] 3.4 `schedule/[day]`（index）：inline 訓練筆記 `TextArea` → `RichTextViewer` 唯讀預覽 + 「編輯筆記」入口 `router.push` 進 `schedule/[day]/note`；移除頁內的儲存鈕（改在編輯路由內存）

## 4. i18n

- [ ] 4.1 `*/exercises.json`、`*/schedule.json` 三語系：工具列 / 連結輸入 / 長度提示 / 空筆記 placeholder key
- [ ] 4.2 確認既有 `note_placeholder` / `save_note` / `edit_note` 等 key 沿用

## 5. 互通與安全驗收

- [ ] 5.1 `tsc --noEmit` 通過
- [ ] 5.2 `expo lint` 無錯（無 `any`/`as`、util 純函式、無硬編碼色碼）
- [ ] 5.3 `expo export --platform ios` 成功打包（含 react-native-webview 原生模組）
- [ ] 5.4 [需模擬器] 在 App 新增含粗體 / 清單 / 連結的筆記 → 存檔 → web 開啟顯示一致（round-trip）
- [ ] 5.5 [需模擬器] web 端既有富文本筆記 → App 開啟正確渲染，**不顯示 raw JSON**
- [ ] 5.6 [需模擬器] App 舊純文字筆記 → 正確降級顯示為段落、可繼續編輯、存回變 JSON
- [ ] 5.7 [需模擬器] 連結輸入 `javascript:` 被擋；只接受 http/https
- [ ] 5.8 [需模擬器] 超過長度上限時阻擋儲存並提示；計長與 web 一致

## 6. 編輯 / 閱讀體驗驗收

- [ ] 6.1 [需模擬器] 訓練筆記與動作筆記皆在全螢幕路由編輯；inline 處只顯示唯讀預覽 + 編輯入口
- [ ] 6.2 [需模擬器] 鍵盤升起時工具列底部吸附、不被遮擋；工具列項目可橫向捲動、觸控目標好按（≥44pt）
- [ ] 6.3 [需模擬器] 唯讀預覽行高 / 段距 / 標題階層 / 清單縮排符合 `editor-theme`，long note 不被裁切（WebView 高度自適應）
- [ ] 6.4 [需模擬器] light / dark 兩模式文字 / 連結 / 背景對比正確
- [ ] 6.5 [需模擬器] App 與 web 並排比對同一筆記，排版觀感一致
