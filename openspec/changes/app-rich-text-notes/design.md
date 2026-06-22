## Context

Web 端 `RichTextEditor.tsx`（已讀）用 `@tiptap/react` + `StarterKit`（heading 1–3、listItem 自訂）+ `Placeholder` + `Link`，`onUpdate` 以 `JSON.stringify(editor.getJSON())` 回傳，存進後端 `note` 欄位。工具列含：標題下拉、粗體、斜體、連結、無序 / 有序清單、引言、分隔線、emoji popover，外加 BubbleMenu。長度以 `getNoteLength`（從 JSON 抽純文字計長）計算。後端長度限制：`EXERCISE_NOTE 3000`、`TRAINING_NOTE 3000`、`TRAINING_NOTE_TITLE 50`、`PLAN_EXERCISE_NOTE 150`。

App 端現況：`exercises/note/[id].tsx`（已是獨立全螢幕編輯路由）、`schedule/[day].tsx`（訓練筆記為頁內 inline `TextArea`）、`exercises/[id].tsx`（筆記預覽為 `Text`）皆把 `note` 當純文字。

技術調查結論：
- **TipTap 不支援 RN 原生**（ProseMirror 依賴瀏覽器 DOM）。官方建議：WebView 嵌 TipTap。
- **`@10play/tentap-editor`（TenTap）**：WebView 內跑 TipTap + ProseMirror，專為手機設計（靈感來自 Notion / Google Docs），**因底層即 TipTap → 產出 / 讀取相同的 TipTap JSON**，是唯一能與 web round-trip 的 RN 方案。
- 其他方案：`react-native-pell-rich-editor`（產 HTML，不相容）、`react-native-enriched`（原生但自有格式，不相容）→ 皆不選。
- 現有依賴：`react-native-webview` 尚未安裝（TenTap 的 peer dep）。

UX 調查結論（行動端筆記 app 的編輯與閱讀設計）：
- **編輯**：長文編輯採**全螢幕專屬畫面**，把空間全留給內容（Apple Notes / Notion / Bear 皆然）；工具列鍵盤底部吸附、控制項放不下時可橫向捲動、觸控目標 ≥44pt；編輯區留 ~20px 內距避免工具列遮住內容。
- **閱讀**：行高 1.4–1.6×、段距 ≈ 字級、標題下方留白約 2× 標題字級、限制可讀寬度、清單適當縮排、連結可辨識配色；light/dark 對比達標。

## Goals / Non-Goals

**Goals**
- App 能讀寫與 web 互通的 TipTap JSON（同一筆記在 web / App 互看不走樣）。
- **編輯舒適**：富文本編輯在全螢幕專屬畫面進行；工具列鍵盤吸附、可橫向捲動、觸控目標 ≥44pt。
- **閱讀清楚**：編輯與唯讀渲染共用一套可讀排版（行高 / 段距 / 標題階層 / 清單縮排 / 連結 / 可讀寬度），並對齊 web 觀感。
- 唯讀渲染器：inline / 詳情頁顯示筆記不再出現 raw JSON。
- 舊純文字 / 空值優雅降級（包成單段 doc），儲存一律輸出 JSON。
- extension 清單與 web 對齊，JSON 雙向不掉節點。
- link 限 `http`/`https`；長度限制對齊 web。

**Non-Goals**
- 不做 emoji picker（手機鍵盤自帶）、不做標題下拉、不做 BubbleMenu（手機選取氣泡互動成本高）。
- 不做 web 版的「打字機動畫」（`isTyping` 效果）。
- 不把富文本編輯器塞進任何會捲動的頁面（inline 只放唯讀預覽）。
- 不改後端 `note` 欄位格式或 API 契約。
- 不處理 `noteTitle`（schedule 的 50 字標題）UI（維持現狀）。
- 不動 `app-layout-density` / `app-notifications-redesign` 範圍。

## Decisions

### D1：選用 `@10play/tentap-editor`（TipTap-in-WebView）

**決策**：以 TenTap 作為 App 富文本編輯與渲染核心，新增 `@10play/tentap-editor` + `react-native-webview`。

**理由**：唯一能讀寫 TipTap JSON 的 RN 方案 → 直接解決與 web 的資料相容；專為手機 UX 設計，內建鍵盤吸附工具列。WebView 在 Expo Go 即可用（`react-native-webview` 為 Expo 支援套件）。

**取捨**：引入 WebView（bundle 變大、首次載入有啟動成本）；但這是 TipTap 互通的必要代價，且只在筆記編輯 / 顯示時掛載。

### D2：編輯介面採全螢幕專屬路由（不 inline）

**決策**：所有富文本**編輯**都在獨立全螢幕路由進行：
- `exercises` 沿用既有 `exercises/note/[id]`（已是全螢幕）。
- `schedule` **新增** `schedule/[day]/note` 全螢幕編輯路由。
頁內（`schedule/[day]`、`exercises/[id]`）只放**唯讀預覽**，點「編輯筆記」才 `router.push` 進編輯路由。

**理由**：
1. **編輯舒適**：行動端筆記 app 的通用做法是把整個畫面留給內容，鍵盤升起時有足夠空間。
2. **技術正確**：TenTap 是 WebView，塞進 `ScreenContainer scroll` 會造成「WebView 內捲動 vs 外層 ScrollView」巢狀捲動衝突、以及 WebView 高度難以隨內容自適應。全螢幕編輯讓 WebView 佔滿可用區、自帶捲動，徹底避開此問題。

**影響**：`schedule/[day].tsx` 的訓練筆記從「inline TextArea + 儲存鈕」改為「唯讀預覽卡 + 編輯入口」；儲存改在編輯路由內完成（沿用 `useSaveDayNote`）。

### D3：手機精簡且可捲動的吸附工具列

**決策**：自訂 TenTap `Toolbar`，只保留 bold / italic / bulletList / orderedList / heading（toggle，非下拉）/ link，鍵盤底部吸附；項目以可**橫向捲動**容器排列，觸控目標 ≥44pt。連結輸入用既有 `Sheet` + `TextField`（限 http/https），不用 `window.prompt`。

**理由**：web 的標題下拉 + emoji popover + bubble menu 在手機上太雜亂、觸控目標小。鍵盤自帶 emoji、heading 用 toggle 即可。可橫向捲動確保未來加項目也不擠壓。

### D4：固定且最小的 extension 白名單（對齊 web + 安全）

**決策**：在 `lib/tiptap.ts` 定義單一 `EXTENSIONS` 清單，對齊 web StarterKit 子集：heading（levels 1–3）、bold、italic、bulletList、orderedList、listItem、blockquote、horizontalRule、paragraph、text、link。Link 設定 `protocols: ['http','https']`、不允許其他 scheme（擋 `javascript:`）。編輯與渲染共用同一份清單。

**理由**：extension 清單必須與 web 一致，JSON 才能雙向 round-trip 不掉節點（呼應 security-conventions：`generateHTML` 的 extension 清單固定且最小化）；限制 link protocol 防 XSS。

### D5：唯讀渲染器 + 共用閱讀排版

**決策**：`RichTextViewer` 用 TenTap editor 以 `editable={false}` 渲染，吃同一份 `EXTENSIONS` 與同一套排版（D6）。詳情頁筆記預覽、`schedule/[day]` inline 顯示用此元件；空值顯示 placeholder。

**理由**：唯讀重用同一引擎，確保「閱讀」與「編輯」渲染一致；避免另寫一套 JSON→RN 渲染器（維護成本高、易與 web 不一致）。

### D6：閱讀排版規範（注入 WebView 的 CSS / theme）

**決策**：新增 `lib/editor-theme.ts`，把排版規格以 CSS 注入 TenTap WebView，編輯器與 viewer 共用，並對齊 web 觀感與 App theme token：

| 項目 | 規格 |
|------|------|
| 內文字級 / 行高 | 16px / 1.6（≈ 行動端可讀區間 1.4–1.6） |
| 段落間距 | margin-bottom ≈ 1em（≈ 字級） |
| 標題階層 | H1 24 / H2 20 / H3 17，標題上方留白 ~1.2em |
| 清單縮排 | bullet / ordered 縮排 ~1.25em，項目間距舒適 |
| 連結 | `accent` 色 + 底線，可點辨識 |
| 可讀寬度 | 受 `MaxContentWidth` 約束、左右留內距（≥16px） |
| 色彩 | 文字 / 背景 / 連結皆走 theme token，light/dark 各自達對比 |

**理由**：富文本「能用」與「好讀」的差距全在排版。把規格集中於單一 theme 檔，確保編輯 / 唯讀 / 三處接入點一致，且與 web 觀感對齊；走 token 確保 dark mode 正確。

### D7：舊純文字 / 空值相容

**決策**：`lib/tiptap.ts` 提供 `toDoc(value)`：空 / null → 空 doc；合法 TipTap JSON → 直接用；非 JSON（App 舊純文字）→ 包成單段 paragraph doc。儲存一律 `JSON.stringify(editor.getJSON())`。

**理由**：與 web 降級邏輯（`JSON.parse` 失敗 → `setContent(value)`）對稱，確保歷史純文字筆記不報錯、可被升級為 JSON。

### D8：長度限制對齊 web

**決策**：新增 `src/constants/limits.ts`（對齊 web 數值）。`lib/tiptap.ts` 提供 `getNoteLength(value)`（從 JSON 抽純文字計長，對齊 web `extractPlainText`）。編輯器顯示 `currentLength / maxLength`，超限阻擋儲存。

**理由**：前後端長度規則一致，避免存進超長內容被後端拒絕；計長方式與 web 相同確保體驗一致。

## Risks / Trade-offs

- **WebView 啟動成本**：首次掛載 TenTap 有 WebView 初始化延遲。緩解：編輯 / viewer 載入時顯示 `Loading`；全螢幕編輯讓延遲只發生在進入編輯頁那一次。
- **WebView 高度自適應（唯讀預覽）**：inline 唯讀 viewer 需要 WebView 隨內容回報高度（TenTap / postMessage 取得 contentHeight），否則內容會被裁切或留大片空白。列為 apply 重點與驗收項。
- **Expo Go 相容**：`react-native-webview` 為 Expo 支援套件；TenTap 對 Expo SDK 56 / RN 0.85 的相容版本 apply 時以 `expo install` 對版。
- **extension 不對齊風險**：App 與 web extension 清單不同會 round-trip 掉節點。緩解：D4 明確對齊，列為驗收項。
- **排版與 web 不一致**：兩端 CSS 若各寫一套會逐漸 drift。緩解：D6 集中於單一 theme 檔，並以 round-trip 視覺比對驗收。
- **bundle 體積**：新增 WebView + TenTap 資產，屬功能必要成本。

## Open Questions

- inline 唯讀預覽若內容很長，是否要「摺疊 + 展開 / 點進全螢幕閱讀」而非整段攤平 → 傾向：超過 N 行摺疊，點「編輯」進全螢幕同時也是完整閱讀場景。apply 時定 N。
- 唯讀預覽用 WebView 的效能（詳情頁單則可接受；若未來清單要大量摘要，再評估輕量「JSON→RN 元件」唯讀渲染器只支援白名單節點）。
- `schedule` 筆記的 `noteTitle`（web 有 50 字標題）是否在 App 補 UI → 本 change 預設不做。
- TenTap 對 RN 0.85 / Expo SDK 56 New Architecture 的支援度 → apply 前實機驗證。
