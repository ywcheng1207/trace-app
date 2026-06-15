## Context

web `ExercisesMuscleGroupSelector`（解剖圖、區塊選取、舊資料相容、行動排版）、`video/[id]` + `ExercisesVideoSection`、`note/[id]`、刪除前使用狀況查詢、快速建立入門動作。app 目前肌群為 chip 多選、無影片 / 筆記頁 / 使用查詢 / quick-start。已裝 `react-native-svg`。

## Goals / Non-Goals

- Goals：解剖圖選取器、示範影片 UI、筆記編輯、使用狀況查詢、快速建立（純前端 / stub）。
- Non-Goals：影片實際上傳 / 壓縮 / AI 分析（拆 ai-coach）；完整 TipTap。

## 解剖圖選取器

- `react-native-svg` 畫人體前 / 後視圖，肌群為可點 path；點擊 toggle 選取，選中著色（brandOrange / primary）。
- 前 / 後切換 tab；資料仍存既有肌群 union → 與 chip 資料雙向相容（舊資料可顯示、可編輯）。
- 行動排版：SVG 等比縮放置中，觸控區足夠。

## 示範影片

- 詳情顯示播放器（`expo-video` 或既有播放元件）；「換影片」入口開 picker，但實際上傳 stub（`// TODO: apiFetch` + upload authorize）。

## 動作筆記

- `note/[id]` 編輯：結構化 / 簡易格式文字；渲染走白名單，**禁止** raw HTML 注入（對齊 security-conventions）。

## 使用狀況查詢

- 封存 / 刪除前呼叫 `useExerciseUsage(id)`（mock：回傳引用此動作的計畫數 / 列表），有引用則提示後再確認。

## 快速建立

- 動作庫為空的 EmptyState 提供「快速建立入門動作」→ 批次建立常見動作（mock）。

## Risks

- SVG 人體 path 工程量大 → 先以分區塊（胸 / 背 / 腿…）的可點區域近似，非精細肌肉，仍對齊 web 的「區塊選取」語意。
