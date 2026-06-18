# app-schedule Specification

## Purpose
TBD - created by archiving change app-schedule. Update Purpose after archive.
## Requirements
### Requirement: 月曆總覽

`(tabs)/schedule` SHALL 以**觸控友善**的月曆呈現當月，並對齊 web 視覺：高格子（整格為點擊區）、日期靠上、底部以 chip 呈現當日「計畫 / 數值 / 筆記」狀態，今天以品牌橘外框 + 底色標示、過去日淡化。月曆 SHALL **不以 Card 外框包裹**，內容延展至容器水平邊緣。視圖切換 SHALL 以兩顆 icon button（CalendarDays / List）呈現於 Header 右側，SHALL NOT 使用 SegmentedControl。月份切換 SHALL 以**月曆下方的兩顆大型按鈕**（高度 ≥ 44pt、各約半寬）與水平滑動手勢操作；月曆頂部保留月份標題但不含左右切換按鈕。

#### Scenario: 觸控點選日期
- **WHEN** 使用者點某一天（整格皆可點）
- **THEN** 進入該日 `schedule/[day]` 詳情

#### Scenario: 當日狀態 chip
- **WHEN** 某天有計畫 / 身體數值 / 筆記
- **THEN** 該格底部顯示對應 chip（計畫依完成度配色、數值綠、筆記黃）

#### Scenario: 月曆全寬無框
- **WHEN** 使用者進入月曆頁
- **THEN** 月曆格子橫向佔滿可用寬度，無外框 Card 包裹

#### Scenario: 下方按鈕換月
- **WHEN** 使用者點擊月曆下方的「上個月」或「下個月」大按鈕
- **THEN** 月曆切換至對應月份（過場動畫）

#### Scenario: 滑動換月
- **WHEN** 使用者於月曆左右滑動
- **THEN** 切換到上 / 下一個月（過場動畫），與下方按鈕同效

#### Scenario: icon button 切換視圖
- **WHEN** 使用者點擊 Header 的 CalendarDays / List icon button
- **THEN** 切換月曆 / 清單視圖，被選取的 icon 以品牌色高亮

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

### Requirement: 日詳情 — 身體數值

`schedule/[day]` 的身體數值表單 SHALL 支援基礎欄位（weight / bodyFat / muscleMass / chest / waist / hips）與四肢圍度欄位（leftThigh / rightThigh / leftCalf / rightCalf / leftUpperArm / rightUpperArm / leftForearm / rightForearm），對齊 web。欄位顯示 SHALL 依使用者的欄位偏好過濾，提交後（mock）即時更新。

#### Scenario: 記錄四肢圍度
- **WHEN** 使用者開啟四肢圍度欄位並填值儲存
- **THEN** 該日身體數值含四肢圍度，圖表可呈現

#### Scenario: 部分欄位填寫
- **WHEN** 使用者只填部分欄位
- **THEN** 未填欄位存為 null，不影響其他欄位

#### Scenario: 依偏好顯示
- **WHEN** 使用者未開啟四肢圍度
- **THEN** 表單不顯示四肢圍度欄位

### Requirement: 日詳情 — 訓練筆記
`schedule/[day]` SHALL 提供當日純文字訓練筆記，可儲存（mock）。

#### Scenario: 編輯筆記
- **WHEN** 使用者輸入筆記並儲存
- **THEN** 筆記持久化，月曆該日顯示筆記標記

