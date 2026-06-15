---
name: react-native-best-practices
description: Performance best practices for trace-app (React Native / Expo / Reanimated / React Query). Use when writing or reviewing screens, long lists, images, animations, navigation, or data fetching for performance.
---

# React Native Best Practices

> 取代 web 端的 `vercel-react-best-practices`。**SSR / RSC / hydration / bundle-barrel / Next.js server 類規則一律 N/A**；保留可轉移的 re-render 規則，並加上 RN 特有的列表 / 圖片 / 動畫 / 執行緒考量。

## 0. React Compiler 已開啟

`app.json` → `experiments.reactCompiler: true`。**不要手刻 `useMemo` / `useCallback` / `memo`**，編譯器自動記憶化。只有 profiler（React DevTools / Flipper）證實有瓶頸時才手動優化。

## 1. 列表（最高影響）

- 大量資料一律 `FlatList` / `SectionList`（或評估 `@shopify/flash-list`），**禁止用 `.map()` 一次渲染長列表**（無回收、記憶體爆）
- 提供穩定 `keyExtractor`（回傳資料 id，禁止 index）
- 固定高度的項目設定 `getItemLayout`，跳過量測
- `renderItem` 抽成**獨立元件**，避免每次 render 產生新 closure / inline 物件
- 視情況調 `initialNumToRender`、`windowSize`、`maxToRenderPerBatch`、`removeClippedSubviews`
- 列表項的圖片、衍生值在 item 元件內處理，不要在 parent 預先 map 一輪

## 2. 圖片

- 一律用 `expo-image`（內建記憶體 / 磁碟快取、`contentFit`、placeholder），優於 RN `Image`
- 指定明確尺寸避免 layout 抖動；遠端圖善用快取策略，列表縮圖用適當解析度

## 3. 動畫 / 手勢

- 動畫用 `react-native-reanimated`（worklet 跑在 **UI thread**），手勢用 `react-native-gesture-handler`，避免用 `Animated` + `setState` 在 JS thread 驅動高頻動畫
- 避免在動畫每幀觸發 React re-render；用 shared value + `useAnimatedStyle`
- 動畫包在 `View` wrapper 上，而非直接動會觸發 layout 的屬性

## 4. 執行緒 / 互動

- 重運算不要卡 JS thread：拆批、`InteractionManager.runAfterInteractions` 延後到動畫結束、或 `startTransition` 標記非急迫更新
- 導頁、開 Modal 前的重初始化延後，避免轉場掉幀

## 5. Re-render（可從 web 轉移）

- 衍生狀態在 render 期間計算，不要用 effect 同步出第二份 state
- 訂閱「衍生布林 / 最小切片」而非整包物件（Redux `useSelector` 選最小值，必要時用 `shallowEqual`）
- 回呼用 functional `setState`（`setX(prev => ...)`）保持穩定
- 昂貴的 `useState` 初始值用 lazy initializer（`useState(() => ...)`）
- 高頻、不需驅動畫面的值用 `useRef`，不要進 state

## 6. 資料 / 網路（React Query）

- 多個獨立請求用 `Promise.all` 並行，避免 waterfall
- 設合理 `staleTime` / `gcTime` 減少重抓；列表分頁用 `useInfiniteQuery`
- 行動網路不穩：善用 `retry`、`refetchOnReconnect`、樂觀更新（optimistic update）
- 預取（`prefetchQuery`）下一畫面資料，改善感知速度

## 7. Bundle / 啟動

- Hermes 引擎維持開啟；避免引入過大依賴（先看 RN 是否有原生替代）
- 直接匯入子路徑、避免 barrel re-export 拖入整包
- 善用 expo-router 的路由分割；重元件需要時才載入
- 啟動初始化（store、i18n）只做一次，集中在 provider 層
