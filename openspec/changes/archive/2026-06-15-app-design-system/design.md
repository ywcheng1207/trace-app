## Context

web `app/globals.css` 以 oklch 定義 shadcn「zinc」調色盤 + 品牌色，`--radius: 0.5rem`。app 需以 RN 的 hex token 等價呈現，並維持 `useTheme()` 的 light/dark 切換。

## Goals / Non-Goals

- Goals：色票 / 圓角 / （選配）字型對齊 web；light/dark 皆正確；既有元件無硬編碼色。
- Non-Goals：不改資料流、不改元件結構、不導入 Tailwind/NativeWind。

## Token 對應（oklch → hex）

| token | light | dark | 用途 |
|---|---|---|---|
| background | `#ffffff` | `#09090b` | 頁面底 |
| card | `#ffffff` | `#09090b` | 卡片（web dark card == background） |
| backgroundElement | `#f4f4f5` | `#27272a` | 次級面（zinc-100 / zinc-800） |
| text | `#09090b` | `#fafafa` | 主文字 |
| textSecondary / muted | `#71717a` | `#a1a1aa` | 次文字（zinc-500 / zinc-400） |
| border | `#e4e4e7` | `#27272a` | 邊框（zinc-200 / zinc-800） |
| primary | `#18181b` | `#fafafa` | 主要動作（近黑 / 近白） |
| primaryForeground | `#fafafa` | `#18181b` | primary 上文字 |
| danger | `#dc2626` | `#ef4444` | 錯誤 / 刪除 |
| success | `#10b981` | `#34d399` | 成功 / 身體數值 |
| warning | `#f59e0b` | `#fbbf24` | 警告 |
| info | `#3b82f6` | `#60a5fa` | 資訊 |
| brandOrange | `#ff7d23` | `#ff7d23` | 今天 / accent / 連結 |
| brandYellow | `#f8d24e` | `#f8d24e` | 選取高亮 |
| brandBeige | `#e4dbd4` | `#e4dbd4` | 輔助 |
| brandDark | `#333333` | `#333333` | 輔助 |
| overlay | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.6)` | 彈窗遮罩 |

## Radius

`{ sm: 4, md: 6, lg: 8, xl: 12, full: 999 }`；toast / sheet 等浮動大面用獨立常數 16（`Radius.sheet`）。元件預設圓角採 `lg`(8) 對齊 web 的 `--radius`。

## Decisions

- 沿用既有 `Colors.light/dark` 結構與 `useTheme()`，僅換值與加 key → 元件改動最小、相容既有 `theme.xxx` 用法。
- `accent` 既有 key 重新指向 `brandOrange` 語意，避免大量改名。
- Geist 字型列為選配（不阻塞）：先確保色 / 圓角，字型可後續 change 補。

## Risks

- primary 由藍轉近黑可能讓部分畫面對比感變化 → 以 preview 逐頁檢查 light/dark。
