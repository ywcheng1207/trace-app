## MODIFIED Requirements

### Requirement: 動作筆記
`exercises/note/[id]` 編輯動作筆記，SHALL 使用 `RichTextEditor`（富文本，TipTap JSON）取代純文字 `TextArea`，長度上限對齊 `EXERCISE_NOTE`（3000）。儲存 SHALL 呼叫 PUT `/api/exercises/[id]/note`（apiFetch 加密），送出 TipTap JSON 字串。

#### Scenario: 編輯筆記
- **WHEN** 使用者於 note/[id] 以富文本編輯並儲存
- **THEN** PUT /api/exercises/[id]/note 送出 TipTap JSON，onSuccess invalidate exercise query

#### Scenario: 開啟 web 編輯過的筆記
- **WHEN** 使用者開啟一則 web 端富文本筆記
- **THEN** 富文本編輯器正確載入其結構，不顯示 raw JSON

### Requirement: 動作詳情
`exercises/[id]` SHALL 顯示動作完整資訊，資料透過 GET `/api/exercises/[id]`（`useExercise`）取得。詳情頁的筆記預覽 SHALL 以 `RichTextViewer` 唯讀渲染 TipTap JSON，不顯示 raw JSON。

#### Scenario: 檢視詳情
- **WHEN** 使用者點選列表中的動作
- **THEN** GET /api/exercises/[id] 回傳資料，呈現於詳情頁

#### Scenario: 找不到動作
- **WHEN** 路由 id 對應不到動作（後端回傳 404）
- **THEN** 顯示「找不到動作」狀態與返回入口

#### Scenario: 筆記預覽唯讀渲染
- **WHEN** 動作有富文本筆記
- **THEN** 詳情頁以 `RichTextViewer` 顯示格式化內容，而非 raw JSON 或純文字
