## Context

web 通知分兩類：①即時操作回饋（toast，`NotificationStack`，redux 佇列，自動消失）②系統通知（通知中心 + 輪詢，如 AI 分析完成）。app 目前只有 ①的簡化單則版。

## Goals / Non-Goals

- Goals：toast 對齊 web 並支援佇列；新增系統通知中心 + 輪詢（mock）。
- Non-Goals：真實推播 / WebSocket / 後端佇列。

## Toast

- 結構：左圖示（lucide：CheckCircle2 / XCircle / AlertTriangle / Info，依型別著色 success/danger/warning/info）→ 中（title 粗體 + message）→ 右 brandOrange accent 直條 + OK 關閉鈕。
- 容器：`card` 底、`border`、圓角 16（`Radius.sheet`），`SafeAreaView` top，最多堆疊數則（`gap`）。
- 動畫：Reanimated `entering` 由右滑入 + 淡入；自動消失 3.5s，觸控時暫停計時。
- 佇列：`ui-slice.notifications: Notification[]`，`showNotification` push（含 id）、`dismissNotification(id)` 移除。

## 通知中心 + 輪詢

- `features/notifications/api`：`notificationSchema`（id / type / title / body / read / createdAt / actionPath?）、mock 列表、`useNotifications`（React Query，`refetchInterval` 模擬輪詢）、`useMarkRead`。
- UI：bell 圖示（含未讀紅點）→ Sheet/頁面列表；點項目 markRead + 導向 `actionPath`。

## Decisions

- toast（即時回饋）與通知中心（持久系統通知）分離：前者 redux 短暫、後者 React Query server state（符合 state-management 規範）。
- 輪詢用 React Query `refetchInterval`，未來換 `apiFetch` 即真實輪詢，UI 不動。

## Risks

- 佇列上限避免洗版 → 同時顯示上限（如 3 則），其餘排隊。
