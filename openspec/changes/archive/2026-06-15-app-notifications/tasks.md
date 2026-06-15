## 1. ui-slice 佇列

- [x] 1.1 `Notification` 加 `id` / `warning` 型別 / `title` / `actionPath?`
- [x] 1.2 `notifications: Notification[]` 佇列；`showNotification` push（prepare 加 nanoid id）、`dismissNotification(id)`

## 2. Toast 重做

- [x] 2.1 型別圖示 + 著色（success/danger/warning/info，lucide CheckCircle2/XCircle/AlertTriangle/Info）
- [x] 2.2 title + message + brandOrange accent 直條 + X 關閉鈕，圓角 16（Radius.sheet）
- [x] 2.3 Reanimated 滑入（useSharedValue + withTiming，避開 RN4 layout 動畫 web 不顯示問題）；自動消失 3.5s + 觸控暫停續計
- [x] 2.4 多則堆疊（同時上限 3 + 佇列上限 6）

## 3. 通知中心資料層

- [x] 3.1 `features/notifications/api/schemas.ts`（systemNotificationSchema）
- [x] 3.2 `mock.ts`（系統通知樣本 + 模擬輪詢期間新到通知）
- [x] 3.3 `hooks.ts`：`useNotifications`（refetchInterval 10s）/ `useMarkNotificationRead` / `useMarkAllNotificationsRead`（標 `// TODO: apiFetch`）
- [x] 3.4 `QUERY_KEYS` 擴充（notifications）

## 4. 通知中心 UI

- [x] 4.1 bell 圖示 + 未讀紅點（setting PageHeader right 入口）
- [x] 4.2 通知列表（已讀/未讀，未讀紅點 + highlight），點項目 markRead + 導向 actionPath（typed route enum）

## 5. i18n

- [x] 5.1 `notify` 補 `ok` / `view_page` / center_* / mark_all_read（三語系）

## 6. Verification

- [x] 6.1 `npx tsc --noEmit`（pass）　6.2 `npx expo lint`（pass）
- [x] 6.3 preview：通知中心 + 輪詢新到通知即時反映、toast 滑入（opacity 0→1 驗證）、bell 未讀紅點、orange active tab
