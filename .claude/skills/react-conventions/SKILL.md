---
name: react-conventions
description: React and Expo Router component conventions for trace-app (React Native) — component definition style, file structure, internal code order, props/rendering rules, hooks, and Expo Router routing. Use when writing, reviewing, or refactoring any RN component or route.
---

# React (Native) Conventions

## Component Definition

- 元件皆以 arrow function 定義，禁止 `function` 宣告式元件
  - 例外：expo-router 路由檔的 `export default`，沿用模板的 `export default function` 亦可接受，但新寫的一般元件一律 arrow function
- 禁止使用：`forwardRef`、`defaultProps`、`React.FC`
  - React 19 已支援 `ref` 作為一般 prop，無需 `forwardRef`
- 移除 `import React from 'react'`（新版 JSX transform 自動注入；需要時用具名匯入 `import { useState } from 'react'`）
- 移除未使用的宣告（"declared but its value is never read"）

## File & Import Structure

- Import 順序（以空行間隔）：
  1. React / React Native / Expo（`react`, `react-native`, `expo-*`, `expo-router`）
  2. 第三方套件
  3. 客製化元件
  4. 客製化 Utils / hooks / types
- 路徑一律用 `@/` 引用，禁止相對路徑 `../../`
- 移除所有中英文說明性註解；區隔區塊的 `//` 可保留
- 超過 500 行考慮拆分，先寫在同一個檔案，按層級由小到大排列

## Internal Component Order

以 `//` 間隔，依序排列：

1. Hooks / Context / i18n（外部資源：`useTheme`, `useTranslation`, `useLocalSearchParams`…）
2. State / Ref（內部狀態）
3. 變數定義（衍生計算）
4. Function 定義（`handleXXX` / `fetchXXX`）
5. Effects（副作用）
6. JSX（渲染）

## Props & Rendering

- 在參數列直接解構 Props 並提供預設值
- 清單渲染必須提供穩定 key，禁止使用 index 或 `Math.random()`
- 長列表用 `FlatList` / `SectionList`（或 `FlashList`），搭配 `keyExtractor` 回傳穩定 id；避免用 `.map()` 硬渲染大量項目（見 react-native-best-practices）
- 禁止 `&&` 數字陷阱（`{count && <X />}` 在 count=0 時 RN 會丟「Text strings must be rendered within a <Text>」錯），改用三元運算子或 `count > 0 ? ... : null`
- 避免三元運算子嵌套逾一層
- JSX 內禁止直接呼叫函式或放入複雜表達式，先賦值給語意清晰的變數再引用（例外：`t()`、`StyleSheet` 取值等無副作用的純函式可直接在 JSX 呼叫）
- 禁止在 JSX 內定義 Inline Function（純粹參數傳遞如 `() => handler(id)`、或 `onPress` 短回呼除外）
- 避免以 `renderXXX` 函式替代子元件：包含結構性 JSX（完整卡片、列表項等）應抽出為獨立子元件（列表的 `renderItem` 也優先抽成獨立元件）

## Hooks & Async

- 確實填寫 `useEffect` 的 Dependency Array
- `setTimeout`、`setInterval`、事件訂閱（`AppState`、`Dimensions`、`Keyboard`、`Linking`…）必須在 cleanup 函式中移除
- **React Compiler 已開啟**（`app.json` → `experiments.reactCompiler: true`）：不要手刻 `useMemo` / `useCallback` / `memo`，編譯器會自動處理；僅在 profiler 證實有瓶頸時才手動優化

## Expo Router

- 路由為 file-based，置於 `src/app/`；layout 用 `_layout.tsx`（`Stack` / `Tabs` / `Slot`）
- 動態路由參數用 `useLocalSearchParams()` / `useGlobalSearchParams()` 取得（**值皆為 string，需自行轉型 + Zod 驗證**），不要把參數當成已驗證型別
- 導頁用 `<Link href="...">` 或 `router.push()` / `router.replace()`；已啟用 typed routes（`experiments.typedRoutes`），路徑享有型別檢查
- 不在 render 期間呼叫 `router.push`（會造成 navigation 副作用），應放在事件處理或 effect 內
- 平台差異用 `Platform.select` 或 `*.ios.tsx` / `*.android.tsx` / `*.web.tsx` 檔分流，禁止在 JSX 散落 `Platform.OS ===` 判斷
