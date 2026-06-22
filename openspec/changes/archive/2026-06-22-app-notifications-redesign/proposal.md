## Why

通知中心（`NotificationBell` 開啟的 `Sheet`）功能完整但**完全沒有設計感**：一條條等寬、帶 1px 邊框的卡片縱向排列，沒有日期分組、沒有 swipe 操作、沒有 haptic、未讀僅以淡底 + 小圓點表示、空狀態與載入狀態陽春。與現代 App 的通知 inbox 模式（如 iOS 通知中心、Notion、Linear）差距明顯。

研究現代行動端通知模式（Material / iOS / 2025–2026 trend）歸納出本次要補的核心：**日期分組、swipe 操作（已讀 / 刪除）、haptic 回饋、未讀視覺強化、骨架載入、精緻空狀態**。

## What Changes

- **日期分組**：以 date-fns 將通知分成「今天 / 昨天 / 本週 / 更早」區段，每段一個 sticky-ish 小標題。
- **Swipe 操作**：每列支援左滑刪除、右滑切換已讀 / 未讀（`react-native-gesture-handler` 已在依賴），搭配 `expo-haptics` 觸覺回饋。
- **未讀視覺強化**：未讀列以左側 accent 色條（`brandOrange`）+ 輕微底色標示，標題加粗；區段標題顯示未讀數。
- **現代化列樣式**：左側彩色圓形 icon chip（依 kind 著色）、標題、2 行內文、相對時間（如「3 小時前」）、未讀點。
- **狀態三態**：載入時顯示 Skeleton；空狀態維持精緻 `EmptyState`；錯誤交由全域處理。
- **互動回饋**：點擊、標記、刪除都給對應 haptic。
- 純前端呈現層重構，沿用既有 `useNotifications` / `useMarkNotificationRead` / `useMarkAllNotificationsRead` hook 與資料流。

## Capabilities

### Modified Capabilities
- `app-notifications`：通知中心的呈現層重構（分組 / swipe / haptic / 未讀強化），資料層 API 契約不變

## Impact

- `src/features/notifications/components/notification-bell.tsx`（修改：改用分組 + Swipeable 列）
- `src/features/notifications/components/notification-row.tsx`（新增：抽出單列，含 swipe + haptic）
- `src/features/notifications/components/notification-section.tsx`（新增：日期分組區段標題）
- `src/features/notifications/lib/group-notifications.ts`（新增：純函式，依 createdAt 分組 + 相對時間）
- `src/lib/i18n/locales/*/notify.json`（三語系：分組標題、swipe 動作、相對時間 key）
- `package.json`（新增 `expo-haptics`；`react-native-gesture-handler` 已存在）
