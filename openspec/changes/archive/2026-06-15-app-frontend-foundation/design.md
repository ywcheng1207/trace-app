## Context

trace-app 是 Expo SDK 56 + expo-router + React 19（React Compiler 開啟）的純 client。目前僅有 starter 模板與已接好的 providers（React Query / Redux / i18n）。本變更建立後續所有 feature 共用的前端地基，對齊 `trace`（web）的功能但採行動裝置慣例。資料全 mock，串接 API 的點預留。

## Goals / Non-Goals

**Goals:**
- 一套可重用的導覽、UI kit、資料層樣板與 i18n，讓後續 feature 直接接上。
- 進入點具 auth gate；完整 auth 前端流程（mock）。
- 所有資料存取走 React Query + Zod + mock，串接點清楚標記，未來一行切換 `apiFetch`。

**Non-Goals:**
- 真實後端串接、加解密 / 簽章（沿用 `api-fetch.ts` 既有 TODO）。
- 各 feature 的實際畫面（Schedule/Exercises/Statistics/Setting 內容由後續 change 實作）。
- 解剖圖肌群選取器、AI 影片分析等進階元件（隨對應 feature 再做）。

## Decisions

- **導覽用 expo-router route groups**：`(auth)` Stack 與 `(tabs)` 底部分頁，root `_layout` 做 auth gate。替代方案：直接用 react-navigation → 否決，expo-router 為專案預設且已啟用 typed routes。
- **行動版改底部分頁**：web 是 sidebar（Schedule/Exercises/Statistics/Setting），行動裝置改 bottom tabs，符合平台慣例、單手操作。
- **登入狀態**：token 存 `expo-secure-store`（敏感資料規範），`isAuthenticated` 存 Redux UI slice；啟動時還原，未還原完成前顯示 splash/loading 避免閃爍。
- **資料層樣板**：`src/features/<f>/api/{schemas,mock,hooks}.ts`。hook `queryFn` 呼叫 mock 並標 `// TODO: apiFetch`；mutation 先 in-memory/optimistic。型別一律 `z.infer`。
- **圖表庫 `react-native-gifted-charts`**：API 友善、line/bar/pie 齊全；僅 statistics 用到，foundation 先裝並驗證可用。替代：victory-native（需 skia，較重）→ 否決。
- **圖示 `lucide-react-native`**：與 web 的 lucide 視覺一致；依賴 `react-native-svg`（charts 也需要）。
- **UI kit 自建（StyleSheet + theme token）**：不引入 NativeWind/第三方 UI 庫，符合 styling-conventions。

## Risks / Trade-offs

- gifted-charts 的 linear-gradient peer 在 Expo managed 可能需 `expo-linear-gradient` 或 dev build → 安裝時驗證；若阻塞，charts 延到 `app-statistics` change 再處理，不卡 foundation。
- Auth gate 啟動閃爍（先顯示 auth 再跳 tabs）→ 以還原狀態前顯示 loading/splash 緩解。
- React 19 / 新架構與第三方庫相容性 → 以 `npx expo install` 取相容版本，tsc + web preview 驗證。
- 後續切換真實 API 時 mock 結構若與後端不符 → 以 Zod schema 對齊後端契約為單一事實來源降低風險。

## Open Questions

- 後端實際 wire format（加密 / 簽章）未定 → 不影響本階段（全 mock）。
- Onboarding / landing 是否需要（web 有 landing）→ 暫以登入頁為進入點，待產品決定。
