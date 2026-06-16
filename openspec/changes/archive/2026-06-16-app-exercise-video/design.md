## Context

Web 版的 `exercises/video/[id]` 頁面包含：日期區間篩選器（SearchableSelect + DateRangePicker）、影片側欄清單（thumbnail + 標題 + 日期）、主播放器（HTML5 video + AI analysis overlay）、可拖曳調整寬度的分割面板。App 版需要在 RN 的限制下實現同等功能，且需要考量手機螢幕空間（無法做 side-by-side 分割）。

現有相關基礎：
- `ExerciseVideoSection`（`exercise-video-section.tsx`）：上傳入口 stub，含 `useSetExerciseVideo` hook
- `exercises/[id].tsx`：詳情頁，可新增「影片」tab 或跳轉按鈕作為入口

## Goals / Non-Goals

**Goals**
- 建立獨立的 `exercises/video/[id]` 頁面
- 影片清單可依日期區間篩選，顯示縮圖 + 日期 + AI 分析狀態
- 點擊清單項目，以 `expo-video` 播放影片
- 有 AI 分析結果時，播放器下方顯示分析卡片
- Timeline 表格呈現影片歷史
- 上傳入口（stub）整合進此頁
- 從詳情頁加入導航入口

**Non-Goals**
- 不實作真實 API 上傳（仍為 stub）
- 不實作 AI 分析觸發（只顯示已有的分析結果）
- 不做影片剪輯或其他編輯功能
- 不做 side-by-side 影片比較（web 功能，手機空間不適合）

## Decisions

### D1：播放器採 expo-video

**決策**：使用 `expo-video`（Expo SDK 56 內建，Expo 官方推薦）作為影片播放器，取代舊版 `expo-av`。

**理由**：`expo-video` 是 Expo 52+ 的新播放 API，效能更好，支援硬體加速與背景播放控制。`expo-av` 已進入維護模式。

**影響**：需在 `package.json` 新增 `expo-video`，並在 `app.json` 的 `plugins` 加入對應設定。

---

### D2：畫面佈局採縱向堆疊

**決策**：手機版佈局為縱向：頂部 Header + 篩選列 → 播放器卡片（aspect-ratio 16:9）→ AI 分析卡片（若有）→ 影片 Timeline 清單（FlatList）。清單項目點擊後更新上方播放器，不跳轉新頁。

**理由**：Web 版是水平分割面板（側欄 + 主播放器），手機螢幕寬度不足以並排。縱向堆疊是手機版最自然的佈局，且 FlatList 可向下滾動查看更多影片。

---

### D3：日期區間以 DateRangePicker Sheet 實現

**決策**：影片清單頂部提供快速預設（7 / 30 / 90 天 chips）與 calendar icon button，點擊 icon 開啟 DateRangePicker Sheet，與 Statistics 頁自訂區間的互動模式一致。

**理由**：操作模式與 statistics 頁一致，使用者不需學習新的互動方式。

---

### D4：AI 分析結果採折疊卡片

**決策**：AI 分析結果以可折疊的 Card 呈現於播放器下方，預設展開（若有分析結果）。卡片包含：分析摘要文字、關鍵指標 chips（如「姿勢評分」「節奏穩定性」）、分析時間。

**理由**：Web 版將 AI 分析以 overlay 方式疊在影片上，手機螢幕小、overlay 會遮擋影片內容。卡片折疊方式在小螢幕上更清晰。

---

### D5：mock 資料結構

資料結構（mock）對應後端 API 預期契約：

```ts
type ExerciseVideo = {
  id: string
  exerciseId: string
  url: string          // 影片 URL（本地 uri 或 CDN）
  posterUrl?: string   // 縮圖 URL
  date: string         // 'YYYY-MM-DD'
  title?: string
  hasAiAnalysis: boolean
  aiResult?: ExerciseVideoAiResult
}

type ExerciseVideoAiResult = {
  analyzedAt: string
  summary: string
  metrics: { label: string; value: string }[]
}
```

## Risks / Trade-offs

- **expo-video 新 API**：`expo-video` 在部分舊版 Android 上可能有相容性問題，需要在 `app.json` 正確設定 `ios.infoPlist` 的 `NSCameraUsageDescription` 及 Android 的 `permissions`。[風險低，Expo 官方支援]
- **影片 URL 本地 uri**：上傳 stub 回傳的是本地 `file://` URI，不是 CDN URL，播放器需要能處理兩種格式。[風險低，expo-video 支援本地 URI]
- **縮圖 poster**：mock 的 `posterUrl` 可能為 null，播放器需有 fallback 佔位（灰底 + play icon）。

## Open Questions

- `expo-video` 是否已在 Expo SDK 56 的 bare workflow 中可用（確認 `expo install expo-video` 的版本對應）
- 後端影片上傳 API 的實際 response 格式（目前全部 stub，影響 `ExerciseVideo.url` 的 field name）
