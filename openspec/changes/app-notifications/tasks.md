## 1. ui-slice 佇列

- [ ] 1.1 `Notification` 加 `id` / `warning` 型別 / `title` / `actionPath?`
- [ ] 1.2 `notifications: Notification[]` 佇列；`showNotification` push、`dismissNotification(id)`

## 2. Toast 重做

- [ ] 2.1 型別圖示 + 著色（success/danger/warning/info）
- [ ] 2.2 title + message + brandOrange accent + OK 鈕，圓角 16
- [ ] 2.3 Reanimated 滑入 / 淡入；自動消失 + 觸控暫停
- [ ] 2.4 多則堆疊（同時上限 + 排隊）

## 3. 通知中心資料層

- [ ] 3.1 `features/notifications/api/schemas.ts`
- [ ] 3.2 `mock.ts`（系統通知樣本）
- [ ] 3.3 `hooks.ts`：`useNotifications`（refetchInterval）/ `useMarkRead`（標 `// TODO: apiFetch`）
- [ ] 3.4 `QUERY_KEYS` 擴充

## 4. 通知中心 UI

- [ ] 4.1 bell 圖示 + 未讀紅點（tab header / setting 入口）
- [ ] 4.2 通知列表（已讀/未讀），點項目 markRead + 導向 actionPath

## 5. i18n

- [ ] 5.1 `notify` 補 `ok` / `view_page` 等（三語系）

## 6. Verification

- [ ] 6.1 `npx tsc --noEmit`　6.2 `npx expo lint`
- [ ] 6.3 preview：多則堆疊、滑入動畫、通知中心、light/dark
