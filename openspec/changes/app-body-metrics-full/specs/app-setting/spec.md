## MODIFIED Requirements

### Requirement: 數值欄位偏好

設定頁 SHALL 提供身體數值欄位的顯示偏好開關，涵蓋基礎欄位與四肢圍度欄位（leftThigh / rightThigh / leftCalf / rightCalf / leftUpperArm / rightUpperArm / leftForearm / rightForearm）。偏好變更 SHALL 連動日詳情表單與統計圖表的可選欄位。四肢圍度預設隱藏。

#### Scenario: 開啟四肢圍度
- **WHEN** 使用者於設定開啟四肢圍度開關
- **THEN** 日詳情身體數值表單出現對應欄位、統計圖表可選該欄位

#### Scenario: 關閉欄位
- **WHEN** 使用者關閉某數值欄位
- **THEN** 該欄位自表單與圖表可選清單隱藏（既有資料保留）
