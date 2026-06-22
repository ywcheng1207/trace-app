## MODIFIED Requirements

### Requirement: 日詳情 — 訓練筆記
`schedule/[day]` 的訓練筆記 SHALL 在頁內以 `RichTextViewer` 唯讀預覽呈現（不再用純文字 `TextArea`、不顯示 raw JSON），並提供「編輯筆記」入口導向全螢幕編輯路由 `schedule/[day]/note`。編輯路由以 `RichTextEditor`（富文本，TipTap JSON，長度上限對齊 `TRAINING_NOTE` 3000）編輯，儲存 SHALL 呼叫 PUT `/api/schedule/[day]/note`（apiFetch 加密）送出 TipTap JSON 字串，onSuccess invalidate month summary。

#### Scenario: 頁內唯讀預覽
- **WHEN** 使用者在 `schedule/[day]` 檢視訓練筆記
- **THEN** 以 `RichTextViewer` 顯示格式化內容；無筆記時顯示 placeholder

#### Scenario: 進入全螢幕編輯並儲存
- **WHEN** 使用者點「編輯筆記」並在全螢幕編輯後儲存
- **THEN** PUT /api/schedule/[day]/note 送出 TipTap JSON，onSuccess invalidate month summary，返回後預覽更新

#### Scenario: 開啟 web 編輯過的訓練筆記
- **WHEN** 使用者開啟一則 web 端富文本訓練筆記
- **THEN** 頁內預覽與全螢幕編輯皆正確載入其結構，不顯示 raw JSON
