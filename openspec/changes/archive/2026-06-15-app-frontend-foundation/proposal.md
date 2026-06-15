## Why

trace-app 目前只有 Expo starter 模板。要開始把 `trace`（web）的使用者功能搬成手機 App，必須先有一層共用地基：導覽結構、登入前後的路由分流、共用 UI 元件、資料層樣板（mock + 可切換 API）、與 i18n。沒有這層，後續每個 feature（Schedule / Exercises / Statistics / Setting）都會各自重造輪子且風格不一致。

## What Changes

- 重構 expo-router 路由：新增 `(auth)` 與 `(tabs)` 兩個 route group，root layout 依登入狀態分流（auth gate），移除 starter 的 `index` / `explore` / `app-tabs` 範例內容。**BREAKING**（改寫進入點）。
- 底部 Tab 導覽：Schedule / Exercises / Statistics / Setting 四個分頁（icon + i18n label），各 tab 先放 placeholder 畫面。
- Auth 前端流程：login / register / forgot-password / reset-password 四個畫面（RHF + Zod 驗證），純前端 mock 登入（寫假 token 進 `expo-secure-store`、翻 `isAuthenticated`），Setting 提供登出。
- 共用 UI kit（RN/StyleSheet）：Button、Field/Input、Select、DatePicker、Checkbox、Switch、Card、Badge、Progress、Skeleton、Modal/Sheet、Tabs、Avatar、PageHeader、Loading、EmptyState、Toast（接 `ui-slice` notification）。
- 主題擴充：`src/constants/theme.ts` 新增語意色（primary/accent/danger/success/border…，light+dark 同步）。
- 資料層樣板：mock + Zod schema + React Query hook 的標準模式，queryFn 先呼叫 mock 並標 `// TODO: apiFetch`，預留串接後端；擴充 `QUERY_KEYS`。
- i18n base：移植 main-route / translation / entry / notify namespace 至三語系（zh-Hant / zh-Hans / en）。
- 新增依賴：`react-native-gifted-charts` + `react-native-svg` + linear-gradient peer、`lucide-react-native`、`date-fns`。

## Capabilities

### New Capabilities
- `app-shell`: expo-router 導覽結構（auth gate、`(auth)` Stack、`(tabs)` 底部分頁）與登入前後分流。
- `app-ui-foundation`: 主題 token 擴充與共用 RN UI kit（StyleSheet + theme token，無 Tailwind/shadcn）。
- `app-auth`: 登入 / 註冊 / 忘記密碼 / 重設密碼前端流程與 mock session 管理（token 存 secure-store）。
- `app-data-layer`: mock + Zod + React Query 的 API-ready 資料存取樣板（一行可切換成 `apiFetch`）。
- `app-i18n`: App 端多語系基礎（expo-localization 偵測、namespace 結構、三語系同步）。

### Modified Capabilities
<!-- 無：foundation 為全新 App 端能力，未變更既有 spec 行為 -->

## Impact

- 程式：`src/app/*`（路由重構）、`src/components/ui/*`（新）、`src/features/*`（新）、`src/constants/theme.ts`、`src/lib/i18n/*`、`src/store/*`。
- 依賴：新增上列 npm/expo 套件。
- 行為：App 進入點改為 auth gate；未登入導向登入頁，登入後進入四分頁。
- 尚未影響：真正的後端 API（本階段全 mock，串接點以 `// TODO: apiFetch` 標記）。
