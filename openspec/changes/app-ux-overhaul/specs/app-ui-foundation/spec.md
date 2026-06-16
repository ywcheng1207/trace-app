## MODIFIED Requirements

### Requirement: 共用 UI Kit

App SHALL 提供一組以 RN `StyleSheet` + theme token 實作的共用元件：Button、TextField、Select、DatePicker、Checkbox、Switch、Card、Badge、Progress、Skeleton、Modal/Sheet、Tabs、Avatar、PageHeader、Loading、EmptyState、Toast。各 feature SHALL 重用這些元件，禁止重造。

`TextField` SHALL 在欄位下方固定保留 error 訊息的顯示高度（`minHeight: 18`），無論是否有 error，此高度 SHALL 始終佔位，使得 error 出現與消失不造成父容器的 layout shift。

#### Scenario: 重用共用元件

- **WHEN** 任一 feature 需要按鈕 / 輸入框 / 彈窗
- **THEN** 使用 UI kit 對應元件，並透過 props / variants 客製，不自行從頭實作

#### Scenario: 全域 Toast 回饋

- **WHEN** 任一處 dispatch `showNotification`
- **THEN** 全域 Toast 元件顯示對應 type 的訊息並可自動消失

#### Scenario: TextField 無 error 時不位移

- **WHEN** TextField 從「無 error」切換為「有 error 訊息」
- **THEN** error 文字出現在固定位置，其他表單元素不發生垂直位移

#### Scenario: TextField 有 error 時消失不位移

- **WHEN** 使用者修正輸入，TextField error 訊息消失
- **THEN** 欄位下方 error 區高度保持不變，其他表單元素不發生垂直位移
