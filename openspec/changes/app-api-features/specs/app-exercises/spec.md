## MODIFIED Requirements

### Requirement: 動作列表與搜尋篩選
`(tabs)/exercises` SHALL 以 `FlatList` 呈現使用者的動作，並提供關鍵字搜尋與依屬性/肌群的 chip 篩選。資料 SHALL 透過 GET `/api/exercises`（帶 query params：`search`、`muscleGroup`、`category`）取得（`useExercises` → apiFetch + Zod schema，`staleTime: 1000 * 60 * 10`）。

#### Scenario: 關鍵字搜尋
- **WHEN** 使用者於搜尋框輸入關鍵字
- **THEN** 列表即時過濾出名稱符合的動作（client-side filter 或 query param）

#### Scenario: 屬性 / 肌群篩選
- **WHEN** 使用者點選某肌群或屬性 chip
- **THEN** 列表只顯示符合該條件的動作；可清除回到全部

#### Scenario: 空狀態
- **WHEN** 動作庫為空或搜尋無結果
- **THEN** 顯示對應的 EmptyState 文案

### Requirement: 動作建立與編輯
系統 SHALL 提供建立 / 編輯動作的表單，提交 SHALL 呼叫 POST `/api/exercises`（`useCreateExercise`）或 PUT `/api/exercises/[id]`（`useUpdateExercise`），apiFetch 加密。onSuccess SHALL invalidate exercises query。UI 含 SVG 解剖圖選取器（行為不變，僅 API 串接改真實）。

#### Scenario: 點擊解剖圖部位開啟 Sheet
- **WHEN** 使用者點擊解剖圖上某個大部位
- **THEN** 底部 Sheet 開啟，顯示該部位的細項肌群 chips

#### Scenario: 在 Sheet 中勾選細項
- **WHEN** 使用者於 Sheet 中點擊細項 chip
- **THEN** 該肌群切換選取狀態，解剖圖對應部位顏色更新

#### Scenario: 前 / 後視圖切換
- **WHEN** 使用者切換前 / 後視圖
- **THEN** 顯示對應面的 polygon，已選部位維持高亮

#### Scenario: 舊資料相容
- **WHEN** 編輯既有動作
- **THEN** 其肌群在解剖圖上正確呈現為已選

#### Scenario: 建立成功
- **WHEN** 表單通過驗證送出，後端回傳 200
- **THEN** onSuccess invalidate exercises query，列表更新

### Requirement: 動作詳情
`exercises/[id]` SHALL 顯示動作完整資訊，資料透過 GET `/api/exercises/[id]`（`useExercise`）取得。

#### Scenario: 檢視詳情
- **WHEN** 使用者點選列表中的動作
- **THEN** GET /api/exercises/[id] 回傳資料，呈現於詳情頁

#### Scenario: 找不到動作
- **WHEN** 路由 id 對應不到動作（後端回傳 404）
- **THEN** 顯示「找不到動作」狀態與返回入口

### Requirement: 軟刪除封存與還原
封存 SHALL 呼叫 DELETE `/api/exercises/[id]`（`useArchiveExercise`，apiFetch 加密）。封存前 SHALL 查詢使用狀況（GET `/api/exercises/[id]/usage`，`useExerciseUsage`）。

#### Scenario: 刪除前使用狀況查詢
- **WHEN** 使用者要封存動作
- **THEN** GET /api/exercises/[id]/usage 回傳引用情況，確認後才送出 DELETE

#### Scenario: 封存成功
- **WHEN** 使用者確認封存
- **THEN** DELETE /api/exercises/[id] 送出，onSuccess invalidate exercises query

### Requirement: 示範影片
動作詳情 SHALL 可檢視示範影片，更換入口維持 stub（`// TODO: implement file upload`）。

#### Scenario: 檢視示範影片
- **WHEN** 動作有示範影片
- **THEN** 詳情顯示播放器可播放

#### Scenario: 更換影片
- **WHEN** 使用者選「換影片」
- **THEN** 開啟選片入口（上傳行為 stub）

### Requirement: 動作筆記
`exercises/note/[id]` 編輯動作筆記，儲存 SHALL 呼叫 PUT `/api/exercises/[id]/note`（apiFetch 加密）。

#### Scenario: 編輯筆記
- **WHEN** 使用者於 note/[id] 編輯並儲存
- **THEN** PUT /api/exercises/[id]/note 送出，onSuccess invalidate exercise query

### Requirement: 快速建立入門動作
動作庫為空時，SHALL 提供一鍵建立常見入門動作，呼叫 POST `/api/exercises/bulk-create`（或迴圈呼叫 POST `/api/exercises`）。

#### Scenario: 新用戶引導
- **WHEN** 動作庫為空且使用者點「快速建立入門動作」
- **THEN** 批次建立入門動作，onSuccess invalidate exercises query，列表更新
