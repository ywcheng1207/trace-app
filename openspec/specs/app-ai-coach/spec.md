# app-ai-coach Specification

## Purpose
TBD - created by archiving change app-ai-coach. Update Purpose after archive.
## Requirements
### Requirement: 動作 AI 建議

動作詳情 SHALL 提供 AI 建議：觸發後顯示 loading 再呈現建議（mock），且 SHALL 受每日額度限制。串接點標 `// TODO: apiFetch`。

#### Scenario: 取得建議
- **WHEN** 使用者於動作詳情點「AI 建議」且額度足夠
- **THEN** 顯示 loading 後呈現該動作的 AI 建議

#### Scenario: 超過每日額度
- **WHEN** 當日 AI 用量達上限
- **THEN** 入口停用並提示已達每日額度

### Requirement: 訓練影片分析

系統 SHALL 提供訓練影片分析的前端流程：選 / 拍片 → 前端預檢 → 送出（stub）→ 非同步任務狀態 → 完成顯示分析結果（mock）。

#### Scenario: 影片預檢
- **WHEN** 使用者選擇影片
- **THEN** 前端檢查時長 / 大小 / 格式，不符時提示且不送出

#### Scenario: 查看分析結果
- **WHEN** 分析任務完成
- **THEN** 顯示動作分解 / 建議結果（mock）

#### Scenario: 防止重複觸發
- **WHEN** 同一動作已有進行中的分析任務
- **THEN** 再次觸發被阻擋並提示處理中

### Requirement: 非同步任務與通知

分析任務 SHALL 以非同步狀態（PENDING / PROCESSING / DONE / FAILED）呈現，完成時 SHALL 推送通知（接 `app-notifications`）。任務狀態以 React Query 輪詢（mock）推進。

#### Scenario: 任務完成通知
- **WHEN** 分析任務由 PROCESSING 轉 DONE
- **THEN** 推送一則完成通知，點選可導向結果

### Requirement: 用量額度

系統 SHALL 顯示每日 AI 用量剩餘額度（mock 計數），達上限時阻擋建議 / 分析。

#### Scenario: 顯示剩餘額度
- **WHEN** 使用者進入 AI 功能入口
- **THEN** 顯示當日剩餘額度

