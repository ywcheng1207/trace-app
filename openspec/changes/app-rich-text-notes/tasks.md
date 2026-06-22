## 1. 依賴與核心 lib

- [x] 1.1 安裝 `react-native-webview@13.16.1`（expo install）+ `@10play/tentap-editor@^1.0.1`
- [x] 1.2 新增 `src/constants/limits.ts`：`NoteLimits`（EXERCISE_NOTE 3000 / TRAINING_NOTE 3000 / TRAINING_NOTE_TITLE 50 / PLAN_EXERCISE_NOTE 150），對齊 web
- [x] 1.3 新增 `src/features/notes/lib/tiptap.ts`：`toDoc`（空→空 doc / 合法 JSON→直用 / 純文字→單段 doc）、`serialize`、`extractPlainText`、`getNoteLength`、`isNoteEmpty`（純函式）
- [x] 1.4 新增 `src/features/notes/lib/editor-theme.ts`：`buildContentCss`（內文 16/1.6、段距 ~1em、H1 24 / H2 20 / H3 17、清單縮排 1.25em、連結 accent+底線、placeholder）走 theme token；`buildNoteBridges` = web-compatible bridge 子集（Core/History/Bold/Italic/Heading[1-3]/BulletList/OrderedList/ListItem/Blockquote/Link/HardBreak/Placeholder）

## 2. 富文本元件

- [x] 2.1 新增 `rich-text-editor.tsx`：TenTap `useEditorBridge`（bridge 子集 + `toDoc` 初始 + `avoidIosKeyboard`），`useEditorContent(json)` → `onChange(serialize)`；鍵盤底部吸附 `Toolbar`（`DEFAULT_TOOLBAR_ITEMS` + `shouldHideDisabledToolbarItems` → 未載入的 bridge 對應項目自動隱藏，等效精簡為 bold/italic/heading/list/blockquote/link）；顯示 `length / maxLength`
- [x] 2.2 新增 `rich-text-viewer.tsx`：`editable=false` + `dynamicHeight` 自適應高度渲染 `toDoc(value)`；空值顯示 placeholder Text（不掛 WebView）
- [x] 2.3 全程 theme token + StyleSheet

## 3. 全螢幕編輯路由 + 接入

- [x] 3.1 `exercises/note/[id].tsx`：`TextArea` → 全螢幕 `RichTextEditor`（maxLength=EXERCISE_NOTE）+ header 儲存鈕，沿用 `useSetExerciseNote`（送 JSON）
- [x] 3.2 `exercises/[id].tsx`：筆記預覽 `Text` → `RichTextViewer`
- [x] 3.3 `[day].tsx` 轉資料夾路由（`git mv` → `[day]/index.tsx`），新增 `[day]/note.tsx` 全螢幕編輯（maxLength=TRAINING_NOTE，沿用 `useSaveDayNote`）
- [x] 3.4 `schedule/[day]/index.tsx`：inline 訓練筆記 → `RichTextViewer` 預覽 + 「編輯」入口 push `/schedule/[day]/note`，移除頁內儲存鈕

## 4. i18n

- [x] 4.1 `notify.json` 三語系新增 `note_too_long`；`schedule.json` 三語系新增 `edit_note`
- [x] 4.2 沿用既有 `note_placeholder` / `save_note` / `edit_note_title`（exercises）/ `note`

## 5. 互通與安全驗收

- [x] 5.1 `tsc --noEmit` 通過
- [x] 5.2 `expo lint` 本次檔案 0 error / 0 warning（其餘 4 個 warning 為既有 api hooks）
- [x] 5.3 `expo export --platform ios` 成功打包（含 react-native-webview；bundle 9.4MB→11MB）
- [ ] 5.4 [需模擬器] App 新增含粗體/清單/連結筆記 → 存 → web 顯示一致（round-trip）
- [ ] 5.5 [需模擬器] web 富文本筆記 → App 正確渲染、不顯示 raw JSON
- [ ] 5.6 [需模擬器] App 舊純文字筆記 → 降級顯示段落、可編輯、存回成 JSON
- [ ] 5.7 [需模擬器/待驗證] 連結 `javascript:` 被擋：目前依賴 TipTap Link 內建 protocol 處理（TenTap 內建 link bar），需實機確認；若未擋則於 apply 收尾補 `validate`/protocol 設定
- [ ] 5.8 [需模擬器] 超長阻擋儲存提示（邏輯已實作 `getNoteLength > max` → notify）

## 6. 編輯 / 閱讀體驗驗收

- [x] 6.1 編輯皆走全螢幕路由（exercises/note/[id]、schedule/[day]/note）；inline 只顯示唯讀預覽 + 編輯入口
- [ ] 6.2 [需模擬器] 鍵盤升起時工具列底部吸附、不被遮擋；項目橫向可捲動
- [ ] 6.3 [需模擬器] 唯讀預覽行高/段距/標題/清單符合 `editor-theme`，長筆記 `dynamicHeight` 不裁切
- [ ] 6.4 [需模擬器] light / dark 文字/連結/背景對比正確
- [ ] 6.5 [需模擬器] App 與 web 並排比對排版觀感

## 已知偏差（apply 收尾 / 後續）

- 工具列以「bridge 子集 + `shouldHideDisabledToolbarItems`」達成精簡，而非手刻 item 陣列（`ToolbarContext` 未由套件 export）；效果等同，但 heading 子選單仍顯示 H1–H6（H4–H6 因 levels=[1,2,3] 不作用）。
- 連結輸入用 TenTap 內建 link bar（非自製 Sheet+TextField），符合「不用 prompt」但與 spec 文字略異；protocol 安全見 5.7。
- web 的 `horizontalRule` 無對應 bridge → 若 web 筆記含分隔線，App 載入會略過該節點（其餘節點不受影響）。
