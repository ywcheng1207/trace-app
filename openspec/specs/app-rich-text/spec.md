# app-rich-text Specification

## Purpose
App 的富文本筆記能力：與 web 端 TipTap JSON 互通的編輯器、唯讀渲染器、手機精簡工具列與閱讀排版，套用於動作筆記與訓練筆記。

## Requirements

### Requirement: 富文本資料格式與互通
App 的筆記富文本 SHALL 以 **TipTap JSON 字串**讀寫，與 web 端 `note` 欄位格式一致，確保同一筆記在 web 與 App 之間雙向 round-trip 不走樣、不掉節點。編輯與渲染 SHALL 共用單一固定且最小化的 extension 白名單（heading 1–3、bold、italic、bulletList、orderedList、listItem、blockquote、horizontalRule、paragraph、text、link），對齊 web 的 StarterKit 子集。

#### Scenario: App → web round-trip
- **WHEN** 使用者在 App 建立含粗體 / 清單 / 連結的筆記並儲存
- **THEN** 後端存入 TipTap JSON，web 開啟時顯示相同結構與格式

#### Scenario: web → App 渲染
- **WHEN** 使用者開啟一則在 web 編輯過的富文本筆記
- **THEN** App 正確渲染其結構，不顯示 raw JSON 字串

#### Scenario: extension 對齊不掉節點
- **WHEN** 筆記含白名單內的節點（如 blockquote、orderedList）
- **THEN** App 編輯 / 渲染後再存回，這些節點不遺失

### Requirement: 富文本編輯器（手機精簡工具列）
App SHALL 提供 `RichTextEditor`，以 `@10play/tentap-editor`（WebView 內 TipTap）實作。工具列 SHALL 為手機精簡版、鍵盤底部吸附、項目可橫向捲動、觸控目標 ≥44pt，僅含：粗體、斜體、無序清單、有序清單、標題（toggle）、連結。SHALL 不提供 emoji picker 與標題下拉選單。連結輸入 SHALL 使用 App 內建 `Sheet` + `TextField`（限 http/https），不使用 `window.prompt`。編輯器 SHALL 顯示目前字數 / 上限，超過上限 SHALL 阻擋儲存。

#### Scenario: 精簡工具列
- **WHEN** 使用者聚焦富文本編輯器
- **THEN** 鍵盤底部出現吸附工具列，含粗體 / 斜體 / 清單 / 標題 / 連結，可橫向捲動、觸控目標好按，無 emoji picker 與標題下拉

#### Scenario: 工具列不被鍵盤遮擋
- **WHEN** 軟鍵盤升起
- **THEN** 工具列吸附於鍵盤上緣，編輯內容區留有內距不被工具列覆蓋

#### Scenario: 套用格式
- **WHEN** 使用者選取文字並點工具列的粗體 / 清單 / 標題
- **THEN** 選取內容套用對應格式，並反映在輸出的 TipTap JSON

#### Scenario: 超過長度上限
- **WHEN** 筆記純文字長度超過上限
- **THEN** 顯示超限提示並阻擋儲存

### Requirement: 連結安全
富文本的連結 SHALL 僅允許 `http` 與 `https` protocol，其他 scheme（如 `javascript:`）SHALL 被拒絕。WebView SHALL 僅承載受控的 TipTap JSON，不注入任意 HTML。

#### Scenario: 拒絕危險 protocol
- **WHEN** 使用者輸入 `javascript:` 開頭的連結
- **THEN** 連結被拒絕，不寫入內容

#### Scenario: 接受合法連結
- **WHEN** 使用者輸入 `https://` 連結
- **THEN** 連結正常套用

### Requirement: 唯讀渲染器
App SHALL 提供 `RichTextViewer`，以唯讀模式（`editable={false}`）渲染 TipTap JSON，吃與編輯器相同的 extension 白名單。空值 SHALL 顯示 placeholder。

#### Scenario: 唯讀渲染筆記
- **WHEN** 詳情頁需顯示一則富文本筆記
- **THEN** 以 `RichTextViewer` 唯讀渲染，格式與編輯時一致

#### Scenario: 空筆記
- **WHEN** 筆記為空
- **THEN** 顯示 placeholder（如「尚無筆記」），不顯示空白或 raw JSON

### Requirement: 舊純文字相容
`RichTextEditor` 與 `RichTextViewer` SHALL 容忍非 TipTap JSON 的舊值：空 / null 轉為空 doc；合法 JSON 直接使用；純文字包成單一段落 doc。儲存 SHALL 一律輸出 TipTap JSON 字串。

#### Scenario: 舊純文字筆記
- **WHEN** 開啟一則 App 舊版存的純文字筆記
- **THEN** 以段落形式正確顯示、可繼續編輯，存回後成為 TipTap JSON

#### Scenario: 空值
- **WHEN** 筆記值為空字串或 null
- **THEN** 編輯器顯示空白 doc，不報錯

### Requirement: 全螢幕編輯介面
富文本**編輯** SHALL 在獨立的全螢幕路由進行，不得內嵌於任何會捲動的頁面。頁內（詳情 / 日詳情）SHALL 僅顯示唯讀預覽與「編輯」入口，點擊後 `router.push` 進全螢幕編輯路由。

#### Scenario: 從預覽進入全螢幕編輯
- **WHEN** 使用者在頁內筆記預覽點「編輯」
- **THEN** 導向全螢幕筆記編輯畫面，整個畫面留給內容與吸附工具列

#### Scenario: 不在捲動頁面內嵌編輯器
- **WHEN** 任一頁面需要呈現可編輯筆記
- **THEN** 該頁僅放唯讀預覽，不在 `ScrollView` 內嵌 WebView 編輯器（避免巢狀捲動 / 高度問題）

### Requirement: 閱讀排版
`RichTextEditor` 與 `RichTextViewer` SHALL 共用同一套閱讀排版（集中於 `editor-theme`），並對齊 web 觀感：內文行高約 1.5–1.6×、段落間距約等於字級、標題分 H1/H2/H3 階層且上方留白、清單適當縮排、連結以 accent 色 + 底線標示、內容受可讀寬度與左右內距約束。色彩 SHALL 走 theme token，light 與 dark 各自達對比要求。唯讀 viewer 的 WebView 高度 SHALL 隨內容自適應，長筆記不被裁切。

#### Scenario: 可讀排版
- **WHEN** 顯示一則含標題 / 段落 / 清單的筆記
- **THEN** 行高、段距、標題階層、清單縮排符合排版規範，閱讀清楚不擁擠

#### Scenario: 長筆記不被裁切
- **WHEN** 唯讀預覽顯示較長的筆記
- **THEN** WebView 高度隨內容自適應，完整顯示不裁切、不留大片空白

#### Scenario: 深色模式對比
- **WHEN** 切換至 dark mode
- **THEN** 文字 / 連結 / 背景皆走 theme token 並維持足夠對比
