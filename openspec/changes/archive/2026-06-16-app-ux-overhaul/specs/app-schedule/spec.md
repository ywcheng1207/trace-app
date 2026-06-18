## MODIFIED Requirements

### Requirement: 月曆視圖切換

月曆頁面 SHALL 提供「月曆視圖」與「清單視圖」兩種模式，切換控制件 SHALL 為兩顆 icon button（CalendarDays icon / List icon），置於頁面 Header 右側。切換控制件 SHALL NOT 使用 SegmentedControl 或任何帶外框的 tab bar 元件。

#### Scenario: 切換至清單視圖

- **WHEN** 使用者點擊 List icon button
- **THEN** 月曆格子隱藏，改顯示時間軸清單，icon button 顯示為已選取狀態（品牌色高亮）

#### Scenario: 切換回月曆視圖

- **WHEN** 使用者點擊 CalendarDays icon button
- **THEN** 清單隱藏，月曆格子重新顯示

### Requirement: 月曆佈局

月曆格子 SHALL NOT 以 `Card` 元件包裹（無外框、無背景色塊），月曆內容 SHALL 延展至螢幕左右邊緣（padding 僅來自 ScreenContainer 的水平邊距）。整體設計以「紙面延展」為原則，格子之間的分隔以細 border-bottom 或無分隔呈現。

#### Scenario: 月曆全寬顯示

- **WHEN** 使用者進入月曆頁
- **THEN** 月曆格子橫向佔滿可用寬度，無外框 Card 包裹

### Requirement: 月份切換操作

月份切換 SHALL 以置於月曆 **下方** 的兩顆大型 Pressable 按鈕實現（「‹ 上個月」和「下個月 ›」），每顆按鈕高度 SHALL 不低於 44pt（符合 Apple HIG 最小觸控目標），寬度各佔約半寬。月曆頂部的月份標題仍保留，但 SHALL NOT 包含左右切換按鈕。

#### Scenario: 按壓下方「上個月」按鈕

- **WHEN** 使用者點擊月曆下方左側按鈕
- **THEN** 月曆切換至上一個月，動畫同現有 swipe 行為

#### Scenario: 按壓下方「下個月」按鈕

- **WHEN** 使用者點擊月曆下方右側按鈕
- **THEN** 月曆切換至下一個月

#### Scenario: 橫向 swipe 仍有效

- **WHEN** 使用者在月曆格子上左右滑動
- **THEN** 月份切換行為與點擊按鈕相同（保留現有 gesture handler）
