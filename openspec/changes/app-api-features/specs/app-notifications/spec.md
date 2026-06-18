## MODIFIED Requirements

### Requirement: 通知列表與已讀管理
通知 SHALL 透過 GET `/api/notifications`（`useNotifications`，apiFetch，`staleTime: 1000 * 60`）取得。標記已讀 SHALL 呼叫 PUT `/api/notifications/[id]/read`（`useMarkRead`）。全部已讀 SHALL 呼叫 PUT `/api/notifications/read-all`（`useMarkAllRead`）。mutation onSuccess SHALL invalidate notifications query。

#### Scenario: 取得通知列表
- **WHEN** 使用者開啟通知列表
- **THEN** GET /api/notifications 回傳通知，顯示於列表

#### Scenario: 標記單則已讀
- **WHEN** 使用者點選單則通知
- **THEN** PUT /api/notifications/[id]/read 送出，onSuccess invalidate queries，未讀數更新

#### Scenario: 全部標記已讀
- **WHEN** 使用者點「全部已讀」
- **THEN** PUT /api/notifications/read-all 送出，onSuccess invalidate queries，未讀數歸零
