## Why

Web 版 Trace 的訓練筆記 / 動作筆記是**富文本**：用 TipTap 編輯，並以 **TipTap JSON 字串**存進 `note` 欄位（`JSON.stringify(editor.getJSON())`）。App 端目前把 `note` 當**純文字**用 `TextArea` 編輯與顯示（`exercises/note/[id]`、`schedule/[day]` 訓練筆記、`exercises/[id]` 筆記預覽）。

這造成兩個問題：

1. **資料不相容**：使用者在 web 編輯過的筆記（TipTap JSON），在 App 會顯示成一坨 raw JSON；App 存的純文字回 web 會丟失結構。
2. **手機編輯 / 閱讀體驗**：富文本若只是「功能塞進手機」，很容易因版面狹窄而**難編輯、難閱讀**。重點不只是能用，而是要參考行動端筆記 app（Apple Notes / Notion / Bear）的做法，把**編輯舒適度**與**閱讀排版**一起設計進去。

## What Changes

- 導入 `@10play/tentap-editor`（WebView 內跑 TipTap / ProseMirror），是 App 唯一能讀寫 **TipTap JSON** 並與 web 互通的方案。
- **編輯介面採全螢幕專屬路由**（行動端筆記 app 通用做法）：把整個畫面留給內容，避免把 WebView 編輯器塞進會捲動的頁面（巢狀捲動 / 鍵盤 / 高度都會出問題）。inline 處只放**唯讀預覽**，點「編輯」才進全螢幕編輯。
- **手機精簡工具列**：鍵盤底部吸附、可橫向捲動、觸控目標 ≥44pt，僅含粗體 / 斜體 / 無序清單 / 有序清單 / 標題（toggle）/ 連結。**捨棄** emoji picker（鍵盤自帶）與標題下拉。
- **閱讀排版規範**：行高 1.5–1.6×、段距 ≈ 字級、標題下方留白、清單縮排、連結配色、限制可讀寬度，編輯與唯讀渲染共用同一套排版、並對齊 web 觀感；light/dark 皆達對比要求。
- **唯讀渲染器** `RichTextViewer`：詳情頁 / inline 以唯讀方式渲染 TipTap JSON，不再顯示 raw JSON。
- **舊資料相容**：非合法 TipTap JSON（App 舊純文字 / 空值）包成單段 doc；儲存一律輸出 JSON。
- **extension 對齊 web**（heading 1–3 / bold / italic / bulletList / orderedList / blockquote / horizontalRule / link），確保 JSON 雙向 round-trip 不掉節點。
- **安全**：link 只允許 `http`/`https`；WebView 僅承載受控的 TipTap JSON，不注入任意 HTML。
- **長度限制對齊 web**：EXERCISE_NOTE / TRAINING_NOTE = 3000、TRAINING_NOTE_TITLE = 50，以 JSON 抽純文字長度計算。

## Capabilities

### New Capabilities
- `app-rich-text`：富文本編輯器（全螢幕、手機精簡工具列）、唯讀渲染器、閱讀排版規範，讀寫與 web 互通的 TipTap JSON

### Modified Capabilities
- `app-exercises`：`動作筆記` 全螢幕編輯改用富文本；詳情頁筆記預覽改用唯讀渲染器
- `app-schedule`：`日詳情 — 訓練筆記` inline 改為唯讀預覽，編輯改為進全螢幕筆記編輯路由

## Impact

- `package.json`（新增 `@10play/tentap-editor`、`react-native-webview`）
- `src/features/notes/components/rich-text-editor.tsx`（新增：tentap 編輯器 + 手機精簡吸附工具列）
- `src/features/notes/components/rich-text-viewer.tsx`（新增：唯讀渲染，套用閱讀排版）
- `src/features/notes/lib/tiptap.ts`（新增：JSON parse / 純文字長度 / 舊純文字相容 / 固定 extension 清單）
- `src/features/notes/lib/editor-theme.ts`（新增：注入 WebView 的閱讀排版 CSS / theme，對齊 token 與 web 觀感）
- `src/app/(tabs)/exercises/note/[id].tsx`（修改：`TextArea` → 全螢幕 `RichTextEditor`）
- `src/app/(tabs)/exercises/[id].tsx`（修改：筆記預覽 → `RichTextViewer`）
- `src/app/(tabs)/schedule/[day]/note.tsx`（新增：訓練筆記全螢幕編輯路由）
- `src/app/(tabs)/schedule/[day].tsx`（修改：inline 訓練筆記 `TextArea` → `RichTextViewer` 預覽 + 進編輯路由的入口）
- `src/lib/i18n/locales/*/exercises.json`、`*/schedule.json`（三語系：工具列 / 連結 / 長度提示 / 空筆記 placeholder key）
- `src/constants/limits.ts`（新增：對齊 web 的 note 長度常量）
