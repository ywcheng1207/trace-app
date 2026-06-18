## Why

Web 版 Trace 有完整的 `exercises/video/[id]` 頁面：以日期區間篩選、播放、瀏覽動作影片，並顯示 AI 分析結果。App 目前的 `exercises/[id]` 詳情頁僅包含 `ExerciseVideoSection`（一個上傳 stub），沒有獨立的影片瀏覽/播放頁，也沒有 AI 分析結果的顯示路徑。這使得 app 的影片功能完全缺位，而影片 + AI 分析是 Trace 的核心差異化功能之一。

## What Changes

- 新增 `(tabs)/exercises/video/[id]` 路由與畫面
- 影片清單：以日期區間篩選，列出該 exercise 的所有已上傳影片（縮圖 + 日期 + 分析狀態標籤）
- 影片播放器：使用 `expo-video`，點擊清單項目播放對應影片
- AI 分析結果：若影片已有 AI 分析，顯示分析卡片（結果文字 + 關鍵指標）
- 上傳入口：整合現有 `ExerciseVideoSection` 的上傳邏輯（stub），作為新增影片的入口
- Timeline 表格：以時間軸方式呈現各影片的日期 / 有無 AI 分析 / 完成狀態
- 從 `exercises/[id]` 詳情頁加入「查看影片」按鈕導向此頁
- 純前端 mock（API 串接點標 `// TODO: apiFetch`）

## Capabilities

### New Capabilities
- `app-exercise-video`：動作影片瀏覽、播放與 AI 分析結果展示頁

### Modified Capabilities
- `app-exercises`：詳情頁新增「查看影片」導航入口

## Impact

- `src/app/(tabs)/exercises/video/[id].tsx`（新增）
- `src/features/exercises/api/schemas.ts`（新增 `ExerciseVideo`、`ExerciseVideoAiResult` 型別）
- `src/features/exercises/api/hooks.ts`（新增 `useExerciseVideos` hook，mock）
- `src/features/exercises/components/video-list.tsx`（新增）
- `src/features/exercises/components/video-player-card.tsx`（新增）
- `src/features/exercises/components/video-ai-result-card.tsx`（新增）
- `src/features/exercises/components/video-timeline.tsx`（新增）
- `src/app/(tabs)/exercises/[id].tsx`（修改：加入影片頁入口按鈕）
- `src/lib/i18n/locales/*/exercises.json`（三語系補充影片相關 key）
- `package.json`（確認 `expo-video` 已在依賴，若無則新增）
