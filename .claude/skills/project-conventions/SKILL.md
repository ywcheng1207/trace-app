---
name: project-conventions
description: Project conventions for trace-app (React Native / Expo) — API client (apiFetch), Expo Router navigation, forms, modals/sheets, notify system, i18n, and loading/feedback rules. Use when writing screens, data fetching, forms, navigation, or any feature requiring user feedback.
---

# Project Conventions (React Native / Expo)

> trace-app 是**純 client**：直接消費 `trace` 後端的加密 API，本專案**沒有 API route / server wrapper**。

## API Requests

- 前台會員功能一律透過 `@/lib/api` 的 `apiFetch`（封裝 baseURL、token、加解密、錯誤通知），**禁止在元件層直接 `fetch`**
- baseURL 來自 Expo 設定（`expo-constants` 的 `extra` / env），不硬編碼
- token 由 `apiFetch` 自 `expo-secure-store` 取出附帶，**禁止在元件手動處理 token**
- Server State 一律用 React Query（`useQuery` / `useMutation`）包 `apiFetch`，禁止用 `useState` + `useEffect` 手刻
- 與後端的加密 / Ed25519 簽章格式**必須對齊 `trace` 的 `lib/crypto`**（`apiFetch` 內目前標有 TODO，實作前先確認 wire format）
- 禁止在元件層手動 `catch` API 錯誤後自行通知，統一由 `apiFetch` 或 React Query 全域配置處理

## Navigation（Expo Router）

- 路由 file-based 置於 `src/app/`，導頁用 `<Link>` 或 `router.push/replace`，享 typed routes 型別檢查
- 路由參數用 `useLocalSearchParams()`（值皆 string，需轉型 + Zod 驗證）
- 分頁 / 巢狀導覽用 `Tabs` / `Stack` layout（`_layout.tsx`）
- 需要登入才可進入的頁面，在 layout 層做 redirect（`<Redirect>`），不要在每個畫面各自判斷

## Forms

- 表單一律 React Hook Form + Zod（`zodResolver`）；RN 輸入用 `Controller` 橋接（見 state-management）
- 抽共用 `AppFormField`（包 `Controller` + label + 錯誤訊息）統一欄位呈現與連動邏輯
- 送出前 Zod 驗證，錯誤訊息走 i18n

## Modals / Sheets

- 彈窗用 RN `Modal` 或 `@expo/ui` 的 sheet / bottom sheet 元件，**無 shadcn Dialog**
- 原生 `Alert` **僅限**作業系統級確認（如「確定刪除？」破壞性操作的二次確認），一般成功/失敗回饋不可用 `Alert`

## Notify / User Feedback

- 通知一律走專案 `notify` 系統（Redux UI slice + 全域 Toast 元件），**禁止用原生 `Alert` 或第三方 toast library 當一般回饋**
- CRUD 或重要狀態變更必須提供 User Feedback（`notify`）
- 必須處理 Loading State（`isLoading` / `isFetching` → spinner / skeleton / 禁用按鈕），避免畫面無反應
- 文案一律 i18n，禁止在 `notify` 寫死任何語言字串

## i18n

- 文字節點一律走 i18next（`useTranslation`），**禁止在 JSX 寫死中英文字串**
- 新增任何文字必須**同步更新三個語系**（`zh-Hant` / `zh-Hans` / `en`）的 JSON
- 語系偵測用 `expo-localization`（裝置語系）→ 使用者覆寫（存 secure 以外的偏好儲存）→ fallback
- 跨 namespace 引用用 `t('namespace:key')` 前綴語法

## Loading & Empty / Error States

- 每個資料畫面都要處理三態：Loading / Empty / Error，不可只寫 happy path
- 列表空資料顯示 empty state，錯誤顯示可重試 UI（搭配 React Query `refetch`）
