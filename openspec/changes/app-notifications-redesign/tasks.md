## 1. 依賴與分組邏輯

- [ ] 1.1 `npx expo install expo-haptics`，確認 Expo Go 可用、`app.json` 無需額外設定
- [ ] 1.2 新增 `src/features/notifications/lib/group-notifications.ts`：純函式 `groupByDate(items)` → `{ title: 'today'|'yesterday'|'thisWeek'|'earlier'; data; unreadCount }[]`（空桶略過），以 date-fns `isToday`/`isYesterday`/`isThisWeek` 分桶
- [ ] 1.3 同檔新增 `formatRelativeTime(createdAt, locale)`：今天/昨天/本週用 `formatDistanceToNow`，更早回退絕對 `MM/dd`（locale 對應 date-fns locale）

## 2. 元件重構

- [ ] 2.1 新增 `src/features/notifications/components/notification-section.tsx`：日期分組區段標題（title i18n + 未讀數 badge）
- [ ] 2.2 新增 `src/features/notifications/components/notification-row.tsx`：抽出單列；左側彩色圓形 icon chip（依 kind 著色）、標題、2 行內文、相對時間、未讀左色條 + 底色；以 `ReanimatedSwipeable` 包裹（右滑=已讀/未讀、左滑=刪除），`activeOffsetX` 限水平
- [ ] 2.3 在 swipe 觸發、標記、刪除處接 `expo-haptics`（一般動作 `impactAsync(Light)`、刪除 `notificationAsync(Warning)`）
- [ ] 2.4 改寫 `notification-bell.tsx`：`ScrollView.map` → `SectionList`（section=`NotificationSection`、item=`NotificationRow`）；保留鈴鐺未讀紅點與「全部已讀」
- [ ] 2.5 載入態接 `Skeleton`（數列骨架）；空狀態維持既有 `EmptyState`

## 3. 資料層銜接

- [ ] 3.1 右滑「已讀」沿用 `useMarkNotificationRead`；「全部已讀」沿用 `useMarkAllNotificationsRead`
- [ ] 3.2 新增 `useDeleteNotification`（onSuccess invalidate / 更新 cache）；若後端無 delete 端點，先 cache-only 移除並標 `// TODO: apiFetch`

## 4. i18n

- [ ] 4.1 `*/notify.json` 三語系：新增分組標題 key（`group_today`/`group_yesterday`/`group_this_week`/`group_earlier`）
- [ ] 4.2 `*/notify.json` 三語系：新增 swipe 動作 key（`mark_read`/`mark_unread`/`delete`）與未讀數 key

## 5. 驗收

- [ ] 5.1 `tsc --noEmit` 通過
- [ ] 5.2 `expo lint` 無錯（清單穩定 key、無硬編碼色碼、util 為純函式）
- [ ] 5.3 `expo export --platform ios` 成功打包（含 expo-haptics 原生模組）
- [ ] 5.4 [需模擬器] 通知依今天/昨天/本週/更早分組，每段顯示未讀數
- [ ] 5.5 [需模擬器] 左滑刪除、右滑切換已讀皆可用，且不誤觸 Sheet 關閉；裝置上有 haptic
- [ ] 5.6 [需模擬器] 未讀左色條 + 底色 + 加粗標題正確；light/dark 兩模式 icon chip 配色正確
- [ ] 5.7 [需模擬器] 「全部已讀」後未讀數歸零、紅點消失，行為與原本一致
