## Context

現況（已讀 `notification-bell.tsx`）：`NotificationBell` 是一顆鈴鐺 + 未讀紅點，點開 `Sheet`，內含「全部已讀」文字鈕 + `ScrollView`（`maxHeight: 460`）逐列渲染 `NotificationRow`。每列：kind icon + 標題（1 行）+ 內文（2 行）+ 時間（`MM/dd HH:mm`）+ 未讀小圓點，外加 1px 邊框。`SystemNotification` schema：`{ id, kind: success|error|warning|info, title, body, read, createdAt, actionPath? }`。

資料層 hook（沿用，不改）：`useNotifications`、`useMarkNotificationRead(id)`、`useMarkAllNotificationsRead()`。

可用基礎：`react-native-gesture-handler ~2.31`、`react-native-reanimated 4.3`、`date-fns 4.4` 皆已在依賴；`Sheet`、`EmptyState`、`Skeleton`、theme token、`lucide-react-native` 可用。`expo-haptics` 尚未安裝。

研究結論（現代通知 inbox 模式）：日期分組 / 摘要、swipe 複合手勢 + haptic 確認、未讀強化、漸進式揭露。

## Goals / Non-Goals

**Goals**
- 通知依日期分組（今天 / 昨天 / 本週 / 更早），每段標題顯示該段未讀數。
- 每列可左滑刪除、右滑切換已讀，操作伴隨 haptic。
- 未讀以左側 accent 色條 + 輕微底色 + 加粗標題強化。
- 時間顯示改為相對時間（date-fns `formatDistanceToNow`，依 locale）。
- 載入顯示 Skeleton；空狀態維持精緻 `EmptyState`。
- 沿用既有 hook 與資料流，呈現層重構。

**Non-Goals**
- 不改通知資料層 API 契約（`useNotifications` 等維持）。
- 不做 push notification（OS 推播）— 屬另一主題。
- 不改 `app-layout-density` 與 `app-rich-text-notes` 範圍內容。
- 不把通知中心改成獨立全螢幕路由（維持 Sheet，降低變動面）。

## Decisions

### D1：維持 Sheet，不改全螢幕路由

通知中心維持由 `NotificationBell` 開啟的 `Sheet`，僅重構內容。

**理由**：全螢幕路由變動面大（新增 route、tab / header 入口調整），對「重新設計呈現」的目標非必要。Sheet 內以分組 `SectionList` 即可承載分組 + 長列表。

### D2：日期分組純函式

新增 `lib/group-notifications.ts`：輸入 `SystemNotification[]`，以 date-fns `isToday` / `isYesterday` / `isThisWeek` 分為四桶，輸出 `SectionList` 可用的 `{ title: 'today'|'yesterday'|'thisWeek'|'earlier'; data: SystemNotification[]; unreadCount }[]`，空桶不輸出。相對時間由同檔的 `formatRelativeTime(createdAt, locale)` 以 `formatDistanceToNow` 產生。

**理由**：分組與時間格式為純展示邏輯，抽成純函式符合 javascript-conventions（util 純函式），方便測試且不污染元件。

### D3：列表改用 `SectionList` + `react-native-gesture-handler` Swipeable

`ScrollView` 改為 `SectionList`（section header = `NotificationSection`，item = `NotificationRow`）。`NotificationRow` 以 gesture-handler 的 `Swipeable`（或 `ReanimatedSwipeable`）包裹：右滑露出「已讀 / 未讀」動作、左滑露出「刪除」動作。

**理由**：`SectionList` 原生支援分組與大量資料回收，效能優於手刻 `ScrollView.map`（呼應 react-native-best-practices 列表規則）。gesture-handler 已在依賴，無新增。

### D4：Haptic 用 expo-haptics

新增 `expo-haptics`（Expo Go 內建可用），在 swipe 觸發動作、標記已讀、刪除時給 `impactAsync(Light)`；破壞性刪除給 `notificationAsync(Warning)`。

**理由**：haptic 讓手勢從「猜測」變「確認」，是現代手勢互動標配；expo-haptics 在 Expo Go 即可用、零原生設定。

### D5：未讀視覺規格

未讀列：左側 3px `brandOrange` 色條 + `backgroundElement` 輕微底色 + 標題 `fontWeight 600`；已讀列：無色條、透明底、標題一般字重。移除原本每列的 1px 全框，改以區段內間距與底色區分，降低視覺雜訊。

**理由**：用「左側色條 + 底色」表達未讀是 inbox 通用語彙，比小圓點更易掃視；去掉逐列邊框讓清單更現代、less boxy。

### D6：刪除 / 已讀的資料行為對齊現有 hook

右滑「已讀」沿用 `useMarkNotificationRead`；「全部已讀」沿用 `useMarkAllNotificationsRead`。左滑「刪除」目前無對應 hook → 本 change SHALL 新增 `useDeleteNotification`，行為與既有 mark 系列一致（成功後 invalidate / 更新 cache）。實際後端端點以資料層現況為準（若後端尚無 delete endpoint，先以本地 cache 移除並標 `// TODO: apiFetch`，與專案既有 mock-pending 模式一致）。

**理由**：刪除是 inbox 基本操作；對齊既有 mutation 模式（onSuccess invalidate）確保資料一致；後端端點未備時用既有 pending 模式銜接，不阻塞 UI 重構。

## Risks / Trade-offs

- **Swipeable 在 Sheet 內的手勢衝突**：Sheet 本身可能攔截垂直拖曳，水平 swipe 需確保不誤觸 Sheet 關閉。緩解：`Swipeable` 限定水平 `activeOffsetX`，Sheet 維持垂直。需在模擬器驗證。
- **expo-haptics 平台差異**：Android haptic 強度與 iOS 不同，且需裝置才有感（模擬器無觸覺）。屬漸進增強，無觸覺不影響功能。
- **刪除端點未定**：若後端無 delete endpoint，刪除暫為 cache-only，重新 poll 後可能復現。設計上以 `// TODO: apiFetch` 標記，與專案慣例一致。
- **reanimated 4 的 Swipeable API**：reanimated 4 + gesture-handler 的 swipe 寫法需用對應版本 API（`ReanimatedSwipeable`），apply 時確認版本相容。

## Open Questions

- 後端是否提供刪除單則通知的端點（影響 D6 是真 API 或 cache-only）。
- 相對時間在「更早」區段是否改顯示絕對日期（如 `MM/dd`）較清楚 → 設計傾向：今天 / 昨天 / 本週用相對時間，更早用絕對日期，apply 時定案。
