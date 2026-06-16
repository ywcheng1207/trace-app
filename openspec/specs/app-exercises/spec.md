# app-exercises Specification

## Purpose
TBD - created by archiving change app-exercises. Update Purpose after archive.
## Requirements
### Requirement: 動作列表與搜尋篩選
`(tabs)/exercises` SHALL 以 `FlatList` 呈現使用者的動作（卡片含名稱、肌群、屬性標籤），並提供關鍵字搜尋與依屬性/肌群的 chip 篩選。資料由 React Query（mock）提供，串接點標 `// TODO: apiFetch`。

#### Scenario: 關鍵字搜尋
- **WHEN** 使用者於搜尋框輸入關鍵字
- **THEN** 列表即時過濾出名稱符合的動作

#### Scenario: 屬性 / 肌群篩選
- **WHEN** 使用者點選某肌群或屬性 chip
- **THEN** 列表只顯示符合該條件的動作；可清除回到全部

#### Scenario: 空狀態
- **WHEN** 動作庫為空或搜尋無結果
- **THEN** 顯示對應的 EmptyState 文案

### Requirement: 動作建立與編輯

系統 SHALL 提供建立 / 編輯動作的表單，欄位含名稱（≤255 字）、筆記、目標肌群、`category` / `force` / `kineticChain` / `mechanic`。目標肌群 SHALL 以 **SVG polygon 解剖圖選取器**（與 web 同款精確人體 silhouette，以 `react-native-svg` 渲染前 / 後視圖）選擇：點擊大部位 polygon SHALL 開啟底部 Sheet 顯示該部位的細項肌群 chips 供勾選，SHALL NOT 在圖下方平鋪列出所有細項。polygon 顏色 SHALL 反映選取狀態（未選 muted / 部分 primary 半透明 / 全選 primary），且與既有肌群資料雙向相容。以 React Hook Form + Zod 驗證，提交後（mock）即時更新列表。

#### Scenario: 點擊解剖圖部位開啟 Sheet
- **WHEN** 使用者點擊解剖圖上某個大部位（如胸部）
- **THEN** 底部 Sheet 開啟，顯示該部位的細項肌群 chips

#### Scenario: 在 Sheet 中勾選細項
- **WHEN** 使用者於 Sheet 中點擊細項 chip
- **THEN** 該肌群切換選取狀態，解剖圖對應部位顏色依選取比例更新

#### Scenario: 前 / 後視圖切換
- **WHEN** 使用者切換前 / 後視圖
- **THEN** 顯示對應面的 polygon，已選部位維持高亮

#### Scenario: 舊資料相容
- **WHEN** 編輯既有（以 chip 建立）的動作
- **THEN** 其肌群在解剖圖上正確呈現為已選

### Requirement: 動作詳情
`exercises/[id]` SHALL 顯示動作的基本資訊、分類屬性、目標肌群與筆記，並提供編輯入口與 AI 建議入口（placeholder）。

#### Scenario: 檢視詳情
- **WHEN** 使用者點選列表中的動作
- **THEN** 進入詳情頁顯示該動作完整資訊

#### Scenario: 找不到動作
- **WHEN** 路由 id 對應不到動作
- **THEN** 顯示「找不到動作」狀態與返回入口

### Requirement: 軟刪除封存與還原

系統 SHALL 以軟刪除封存動作；封存 / 永久刪除前 SHALL 查詢使用狀況（被哪些計畫引用）並提示後再確認。

#### Scenario: 刪除前使用狀況查詢
- **WHEN** 使用者要封存 / 刪除被計畫引用的動作
- **THEN** 顯示引用情況提示，確認後才執行

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

