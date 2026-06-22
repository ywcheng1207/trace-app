## 1. 依賴與分組邏輯

- [x] 1.1 安裝 `expo-haptics@~56.0.3`（Expo Go 可用，無需 app.json 設定）
- [x] 1.2 新增 `src/features/notifications/lib/group-notifications.ts`：純函式 `groupByDate(items)` → `{ key: 'today'|'yesterday'|'thisWeek'|'earlier'; unreadCount; data }[]`（空桶略過），date-fns `isToday`/`isYesterday`/`isThisWeek` 分桶
- [x] 1.3 同檔 `formatRelativeTime(createdAt, language)`：今天/昨天/本週用 `formatDistanceToNow`（locale 對應 zhTW/zhCN/enUS），更早回退 `MM/dd`

## 2. 元件重構

- [x] 2.1 新增 `notification-section.tsx`：日期分組區段標題（i18n title + 未讀數 badge）
- [x] 2.2 新增 `notification-row.tsx`：彩色圓形 icon chip（依 kind）、標題、2 行內文、相對時間 + 絕對時間、未讀左色條 + 底色 + 加粗標題；`ReanimatedSwipeable`（右滑=已讀/未讀切換、左滑=刪除）
- [x] 2.3 swipe 動作接 `expo-haptics`（切換 `impactAsync(Light)`、刪除 `notificationAsync(Warning)`）
- [x] 2.4 改寫 `notification-bell.tsx`：`ScrollView.map` → `SectionList`（含 `GestureHandlerRootView` 包裹以支援 Modal 內手勢）；保留鈴鐺紅點與「全部已讀」
- [x] 2.5 載入態 `Skeleton` 數列骨架；空狀態維持 `EmptyState`

## 3. 資料層銜接

- [x] 3.1 右滑切換沿用新 `useToggleNotificationRead`；點擊單則沿用 `useMarkNotificationRead`；「全部已讀」沿用 `useMarkAllNotificationsRead`
- [x] 3.2 新增 `useDeleteNotification`（cache-only 移除 + `// TODO: apiFetch`，與既有 mark 系列一致——目前皆無後端端點）

## 4. i18n

- [x] 4.1 `*/notify.json` 三語系新增 `group_today`/`group_yesterday`/`group_this_week`/`group_earlier`
- [x] 4.2 `*/notify.json` 三語系新增 `mark_read`/`mark_unread`/`delete`

## 5. 驗收

- [x] 5.1 `tsc --noEmit` 通過
- [x] 5.2 `expo lint` 本次檔案 0 error / 0 warning（其餘 4 個 warning 為既有 api hooks）
- [x] 5.3 `expo export --platform ios` 成功打包（含 expo-haptics；4948 modules）
- [ ] 5.4 [需模擬器] 通知依今天/昨天/本週/更早分組，每段顯示未讀數
- [ ] 5.5 [需模擬器] 左滑刪除、右滑切換已讀皆可用（Modal 內手勢），不誤觸 Sheet 關閉；裝置上有 haptic
- [ ] 5.6 [需模擬器] 未讀左色條 + 底色 + 加粗標題正確；light/dark icon chip 配色正確
- [ ] 5.7 [需模擬器] 「全部已讀」後未讀數歸零、紅點消失，行為與原本一致

## 已知事項

- 通知 mark-read / toggle / delete 目前皆為 cache-only（後端尚無對應端點）；後端補端點後改真實 apiFetch。
- swipe 在 Modal-based `Sheet` 內需 `GestureHandlerRootView` 包裹（已加）；實機需確認手勢不與 Sheet 垂直拖曳衝突。
