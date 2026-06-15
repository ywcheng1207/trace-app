---
name: styling-conventions
description: Styling conventions for trace-app (React Native / Expo) — StyleSheet usage, theme token (Colors/Fonts/Spacing) rules, dark mode via useTheme, themed components, responsive layout, and platform-specific styling. Use when writing or reviewing any RN style.
---

# Styling Conventions (React Native)

> 無 Tailwind / NativeWind / shadcn。樣式一律走 **`StyleSheet` + `src/constants/theme.ts` 的 design token**。

## Core Rules

- 樣式用 `StyleSheet.create({...})` 定義，置於**檔案最底部**；元件 JSX 透過 `style={styles.xxx}` 引用
- 動態樣式用 style **陣列**組合：`style={[styles.base, isActive && styles.active]}`（取代 web 的 `cn()`）。條件太多時拆分子元件
- 禁止把大量 inline 物件直接寫在 JSX `style={{...}}`（每次 render 產生新物件）；只有依 props/state 計算的少量動態值可 inline，其餘進 `StyleSheet`
- 禁止自訂全域 CSS；`src/global.css` 僅供 **web target** 的字型變數使用，不在 native 生效

```tsx
// ❌
<View style={{ flexDirection: 'row', padding: 16, backgroundColor: '#F0F0F3' }} />

// ✅
<View style={[styles.row, isSelected && styles.rowSelected]} />
// ...
const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: Spacing.three, backgroundColor: theme.backgroundElement },
})
```

## Color — 一律用 Theme Token

- 顏色一律來自 `Colors`（`@/constants/theme`），透過 `useTheme()`（`@/hooks/use-theme`）依 light/dark 取值，**禁止硬編碼色碼**（`'#ff0000'`、`'rgb(...)'`）
- 動態主題色需在元件內取 `const theme = useTheme()`，再放進 style 陣列：`style={[styles.box, { backgroundColor: theme.background }]}`
- 靜態、與主題無關的色（極少數）仍應集中在 token，不散落 magic hex
- 既有 token：`text` / `background` / `backgroundElement` / `backgroundSelected` / `textSecondary`（light & dark）。需要新色先加進 `Colors` 再使用

## Dark Mode

- 深淺模式一律透過 `useColorScheme()`（或封裝後的 `useTheme()`）取色，**禁止在元件內用 JS 判斷主題去 if/else 切換硬編碼顏色**
- 新增任何顏色都必須同時補 `Colors.light` 與 `Colors.dark` 兩個值

## Typography

- 文字一律用 `ThemedText`（`@/components/themed-text`）的 `type`（`title` / `subtitle` / `default` / `small` / `link` …），不要每個檔案重刻 `fontSize`/`fontWeight`
- 字型家族用 `Fonts`（`@/constants/theme`，`sans` / `serif` / `rounded` / `mono`），禁止寫死字型字串
- 需要新的文字樣式時，優先擴充 `ThemedText` 的 `type`，而非散落 inline style
- 長文字用 `numberOfLines` + `ellipsizeMode` 控制溢出

## Spacing & Layout

- 間距、尺寸優先用 `Spacing` scale（`@/constants/theme`：`half/one/two/three/four/five/six`），避免散落魔術數字
- 佈局用 Flexbox（RN 預設 `flexDirection: 'column'`）；用 `gap` 取代逐一 `margin`
- 頁面以 `react-native-safe-area-context` 的 `SafeAreaView` / `useSafeAreaInsets` 處理瀏海與底部安全區；底部 tab 高度用 `BottomTabInset`
- 內容最大寬度用 `MaxContentWidth`（大螢幕 / web / 平板置中）

## Style Object 屬性排序

單一 style 物件內，屬性依序：**佈局 → 尺寸 → 間距 → 外觀 → 文字**

```ts
card: {
  flexDirection: 'row', alignItems: 'center',   // 佈局
  width: '100%', height: 56,                      // 尺寸
  paddingHorizontal: Spacing.three, gap: Spacing.two, // 間距
  borderRadius: 12, backgroundColor: theme.backgroundElement, // 外觀
}
```

## Components

- 基礎元件優先用 RN 原生（`View` / `Text` / `Pressable` / `ScrollView` / `FlatList`）與 `@expo/ui`，以及專案 themed 元件（`ThemedView` / `ThemedText`）
- 互動元件用 `Pressable`（可表達 `pressed` 狀態），提供按壓回饋（opacity / 背景變化）；可點區域 ≥ 44×44pt
- 禁止重複造輪子：已存在的 themed / `@expo/ui` 元件不自行重寫

## Responsive & Platform

- 響應式用 `useWindowDimensions()`（避免在 module scope 讀 `Dimensions.get()`，旋轉/分割畫面不會更新）
- 平台差異用 `Platform.select({ ios, android, default })` 或 `*.ios.tsx`/`*.android.tsx`/`*.web.tsx` 檔分流
