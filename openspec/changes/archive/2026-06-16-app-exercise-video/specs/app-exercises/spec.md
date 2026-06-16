## MODIFIED Requirements

### Requirement: 動作詳情

`exercises/[id]` SHALL 顯示動作的基本資訊、分類屬性、目標肌群與筆記，並提供編輯入口與 AI 建議入口。詳情頁 SHALL 額外提供「查看影片」按鈕（或 section），點擊後導向 `exercises/video/[id]` 頁面。

#### Scenario: 檢視詳情

- **WHEN** 使用者點選列表中的動作
- **THEN** 進入詳情頁顯示該動作完整資訊

#### Scenario: 找不到動作

- **WHEN** 路由 id 對應不到動作
- **THEN** 顯示「找不到動作」狀態與返回入口

#### Scenario: 點擊查看影片進入影片頁

- **WHEN** 使用者點擊詳情頁的「查看影片」按鈕
- **THEN** 導向 `exercises/video/[id]`，顯示該動作的影片清單與播放器
