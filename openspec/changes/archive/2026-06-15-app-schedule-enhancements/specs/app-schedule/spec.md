## MODIFIED Requirements

### Requirement: 月曆總覽

`(tabs)/schedule` SHALL 以**觸控友善**的月曆呈現當月，並對齊 web 視覺：高格子（整格為點擊區）、日期靠上、底部以 chip 呈現當日「計畫 / 數值 / 筆記」狀態，今天以品牌橘外框 + 底色標示、過去日淡化。月份切換 SHALL 同時支援左右箭頭與水平滑動手勢。月曆 SHALL 提供「月曆 ↔ 清單」雙視圖切換。

#### Scenario: 觸控點選日期
- **WHEN** 使用者點某一天（整格皆可點）
- **THEN** 進入該日 `schedule/[day]` 詳情

#### Scenario: 當日狀態 chip
- **WHEN** 某天有計畫 / 身體數值 / 筆記
- **THEN** 該格底部顯示對應 chip（計畫依完成度配色、數值綠、筆記黃）

#### Scenario: 滑動換月
- **WHEN** 使用者於月曆左右滑動
- **THEN** 切換到上 / 下一個月（過場動畫），箭頭亦可達同效果

#### Scenario: 雙視圖切換
- **WHEN** 使用者切到「清單」視圖
- **THEN** 改以日期清單列出有資料的天，點列進日詳情

### Requirement: 日詳情 — 訓練計畫

`schedule/[day]` 的訓練計畫編排 SHALL 提供完成度勾選與引導對話框，且每日計畫動作數 SHALL 受上限約束。

#### Scenario: 缺動作引導
- **WHEN** 使用者要新增計畫但動作庫為空
- **THEN** 顯示引導對話框，導向 Exercises 新增動作

#### Scenario: 清空計畫確認
- **WHEN** 使用者清空當日計畫
- **THEN** 先顯示確認對話框，確認後才清空

#### Scenario: 計畫上限
- **WHEN** 當日計畫動作數達上限
- **THEN** 新增鈕停用並提示已達上限
