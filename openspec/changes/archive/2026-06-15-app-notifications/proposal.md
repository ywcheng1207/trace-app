## Why

目前通知只有單則 `toast.tsx`（一條色 bar + 一行字），樣式陽春、不能堆疊、型別只有 success/error/info、沒有標題與動作連結，與 web 的 `NotificationStack`（圖示 + 標題 + 內文 + 橘 accent + OK 鈕 + 滑入動畫 + 多則堆疊）落差大。此外 web 有「通知中心」與前端輪詢（系統通知如 AI 分析完成），app 完全沒有。本 change 重做通知視覺並補上佇列與通知中心（純前端 mock，輪詢以 React Query `refetchInterval` 模擬）。

## What Changes

- `toast.tsx` 重做對齊 web：型別圖示（success / error / warning / info）、標題 + 內文、品牌橘 accent、OK 關閉鈕、Reanimated 滑入、自動消失（hover/觸控可暫停）。
- `ui-slice` 通知改為**佇列**（可同時堆疊多則）；新增 `warning` 型別、`title`、可選 `actionPath` 欄位。
- 新增通知中心：bell 圖示（tab header / setting）→ 通知列表（已讀 / 未讀），點項目可導向對應頁。
- 系統通知資料層：`features/notifications`（schemas / mock / hooks），以 React Query `refetchInterval` 模擬輪詢，串接點標 `// TODO: apiFetch`。
- i18n：`notify` 補 `ok` / `view_page` 等 key（三語系）。

延後：真實 WebSocket / push、Redis 離線降級（後端範疇）。

## Capabilities

### New Capabilities
- `app-notifications`：通知佇列 + 視覺、通知中心、前端輪詢（mock），API-ready。

### Modified Capabilities
- `app-ui-foundation`：「共用 UI Kit」requirement 補充 toast 重做後的契約。

## Impact

- 程式：`src/components/ui/toast.tsx`（重做）、`src/store/slices/ui-slice.ts`（佇列）、`src/features/notifications/*`（新）、通知中心元件、i18n。
- 行為：通知可堆疊、樣式對齊 web、可進通知中心查看歷史。
- 不影響：其餘 feature 的 mutation onSuccess/onError 仍以 `showNotification` 推送（介面相容）。
