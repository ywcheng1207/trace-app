## 1. 依賴與資料層

- [ ] 1.1 執行 `npx expo install expo-video` 並確認 `app.json` 的 `plugins` 加入 `expo-video`
- [ ] 1.2 在 `src/features/exercises/api/schemas.ts` 新增 `ExerciseVideo`、`ExerciseVideoAiResult` 型別（Zod schema + `z.infer`）
- [ ] 1.3 在 `src/features/exercises/api/hooks.ts` 新增 `useExerciseVideos(exerciseId, dateRange)` hook（mock 資料，`// TODO: apiFetch`）
- [ ] 1.4 更新 `src/lib/i18n/locales/*/exercises.json` 三語系：加入影片頁相關 key（`video_title`, `video_empty_title`, `video_empty_desc`, `video_upload`, `video_analyzing`, `video_analyzed`, `video_ai_result`, `video_no_result` 等）

## 2. 影片頁面與元件

- [ ] 2.1 新增路由檔 `src/app/(tabs)/exercises/video/[id].tsx`（ExerciseVideoScreen 主畫面）
- [ ] 2.2 新增 `src/features/exercises/components/video-list-item.tsx`：單筆影片清單項（縮圖 / fallback 佔位 + 日期 + 分析狀態標籤 + 播放中指示）
- [ ] 2.3 新增 `src/features/exercises/components/video-player-card.tsx`：`expo-video` VideoView 包裝，接收 `url?: string`，無 URL 時顯示佔位
- [ ] 2.4 新增 `src/features/exercises/components/video-ai-result-card.tsx`：可折疊 Card，顯示分析摘要 + 關鍵指標 chips + 分析時間
- [ ] 2.5 新增 `src/features/exercises/components/video-timeline.tsx`：時間軸清單（日期 / 標題 / 分析狀態 icon），降序排列
- [ ] 2.6 在 ExerciseVideoScreen 整合：Header（返回 + 動作名稱 + 上傳 icon button）、日期篩選 chips + calendar icon button、`VideoPlayerCard`、`VideoAiResultCard`（條件顯示）、`FlatList`（`VideoListItem`）、`VideoTimeline`

## 3. 詳情頁整合

- [ ] 3.1 修改 `src/app/(tabs)/exercises/[id].tsx`：在現有 `ExerciseVideoSection` 下方（或取代）加入「查看影片」Button，`onPress` 導向 `exercises/video/${id}`
- [ ] 3.2 更新 `src/lib/i18n/locales/*/exercises.json` 三語系：加入「查看影片」button label key

## 4. 收尾與驗收

- [ ] 4.1 從 `exercises/[id]` 點擊「查看影片」確認正確導向影片頁
- [ ] 4.2 影片清單空狀態時確認 EmptyState 顯示正確
- [ ] 4.3 點擊清單項目確認播放器更新（mock URL 為本地 stub 時顯示佔位或直接播放）
- [ ] 4.4 有 mock AI 分析資料時確認 `VideoAiResultCard` 顯示，無時確認不顯示
- [ ] 4.5 Timeline 確認按日期降序顯示，分析狀態 icon 正確
- [ ] 4.6 切換日期區間 Chip 確認清單重新篩選（mock）
