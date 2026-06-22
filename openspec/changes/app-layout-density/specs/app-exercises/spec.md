## MODIFIED Requirements

### Requirement: 動作詳情
`exercises/[id]` SHALL 顯示動作完整資訊，資料透過 GET `/api/exercises/[id]`（`useExercise`）取得。

詳情頁的動作 SHALL 遵循動作層級規範：「編輯」為唯一 primary；「AI 建議」為 secondary；破壞性的「封存」SHALL 收進返回列右側的 overflow `ActionSheet`，不以全寬 `danger` block 呈現。「查看影片」入口 SHALL 整合進影片區段，不以獨立全寬按鈕呈現。動作筆記區 SHALL 以 `SectionHeader`（含「編輯筆記」action）起頭。

#### Scenario: 檢視詳情
- **WHEN** 使用者點選列表中的動作
- **THEN** GET /api/exercises/[id] 回傳資料，呈現於詳情頁

#### Scenario: 找不到動作
- **WHEN** 路由 id 對應不到動作（後端回傳 404）
- **THEN** 顯示「找不到動作」狀態與返回入口

#### Scenario: 封存經 overflow 進入
- **WHEN** 使用者點返回列右側的 overflow `ActionSheet` 並選「封存」
- **THEN** 先關閉 ActionSheet，再顯示封存確認對話框（含使用狀況），確認後 DELETE，行為與原本一致

#### Scenario: 動作層級正確
- **WHEN** 進入 `exercises/[id]` 詳情頁
- **THEN** 僅「編輯」為 primary filled，「AI 建議」為 secondary，封存只能從 overflow 進入
