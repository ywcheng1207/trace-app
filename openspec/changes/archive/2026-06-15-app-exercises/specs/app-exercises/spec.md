## ADDED Requirements

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
系統 SHALL 提供建立 / 編輯動作的彈窗表單，欄位含名稱（≤255 字）、筆記、目標肌群（多選 chip）、`category` / `force` / `kineticChain` / `mechanic`（Select）。以 React Hook Form + Zod 驗證；提交後（mock）即時更新列表（React Query invalidate）。

#### Scenario: 建立動作
- **WHEN** 使用者填妥名稱與肌群並提交
- **THEN** 新動作出現在列表頂部，顯示成功 notify

#### Scenario: 名稱驗證
- **WHEN** 名稱為空或超過 255 字
- **THEN** 顯示對應欄位錯誤，不提交

#### Scenario: 編輯動作
- **WHEN** 使用者開啟既有動作的編輯彈窗並儲存
- **THEN** 列表中該動作更新為新內容

### Requirement: 動作詳情
`exercises/[id]` SHALL 顯示動作的基本資訊、分類屬性、目標肌群與筆記，並提供編輯入口與 AI 建議入口（placeholder）。

#### Scenario: 檢視詳情
- **WHEN** 使用者點選列表中的動作
- **THEN** 進入詳情頁顯示該動作完整資訊

#### Scenario: 找不到動作
- **WHEN** 路由 id 對應不到動作
- **THEN** 顯示「找不到動作」狀態與返回入口

### Requirement: 軟刪除封存與還原
系統 SHALL 以軟刪除封存動作；封存的動作移入 `exercises/archived`，可還原回主列表或永久刪除（皆需確認）。

#### Scenario: 封存動作
- **WHEN** 使用者封存某動作
- **THEN** 該動作自主列表移除並出現在封存頁

#### Scenario: 還原動作
- **WHEN** 使用者於封存頁還原
- **THEN** 動作回到主列表

#### Scenario: 永久刪除
- **WHEN** 使用者於封存頁確認永久刪除
- **THEN** 動作自 mock 資料移除，不可復原
