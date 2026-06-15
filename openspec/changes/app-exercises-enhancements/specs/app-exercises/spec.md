## MODIFIED Requirements

### Requirement: 動作建立與編輯

系統 SHALL 提供建立 / 編輯動作的表單，欄位含名稱（≤255 字）、筆記、目標肌群、`category` / `force` / `kineticChain` / `mechanic`。目標肌群 SHALL 以**解剖圖選取器**（人體前 / 後視圖，點區塊選取並著色）選擇，且與既有肌群資料雙向相容。以 React Hook Form + Zod 驗證，提交後（mock）即時更新列表。

#### Scenario: 解剖圖選取肌群
- **WHEN** 使用者於解剖圖點某區塊
- **THEN** 該肌群被選取並著色，再點取消選取

#### Scenario: 前 / 後視圖切換
- **WHEN** 使用者切換前 / 後視圖
- **THEN** 顯示對應面的可選肌群區塊

#### Scenario: 舊資料相容
- **WHEN** 編輯既有（以 chip 建立）的動作
- **THEN** 其肌群在解剖圖上正確呈現為已選

### Requirement: 軟刪除封存與還原

系統 SHALL 以軟刪除封存動作；封存 / 永久刪除前 SHALL 查詢使用狀況（被哪些計畫引用）並提示後再確認。

#### Scenario: 刪除前使用狀況查詢
- **WHEN** 使用者要封存 / 刪除被計畫引用的動作
- **THEN** 顯示引用情況提示，確認後才執行

## ADDED Requirements

### Requirement: 示範影片

動作詳情 SHALL 可檢視示範影片並提供更換入口（實際上傳為 stub，標 `// TODO: apiFetch`）。

#### Scenario: 檢視示範影片
- **WHEN** 動作有示範影片
- **THEN** 詳情顯示播放器可播放

#### Scenario: 更換影片
- **WHEN** 使用者選「換影片」
- **THEN** 開啟選片入口（上傳行為先 stub）

### Requirement: 動作筆記

系統 SHALL 提供 `exercises/note/[id]` 編輯動作筆記，渲染走白名單格式，禁止 raw HTML 注入。

#### Scenario: 編輯筆記
- **WHEN** 使用者於 `note/[id]` 編輯並儲存
- **THEN** 詳情顯示更新後的筆記

### Requirement: 快速建立入門動作

動作庫為空時，系統 SHALL 提供一鍵建立常見入門動作（mock）。

#### Scenario: 新用戶引導
- **WHEN** 動作庫為空且使用者點「快速建立入門動作」
- **THEN** 批次建立一組常見動作並顯示於列表
