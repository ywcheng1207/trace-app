## MODIFIED Requirements

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
