## 1. 依賴與資料層

- [x] 1.1 執行 `npx expo install expo-video` 並確認 `app.json` 的 `plugins` 加入 `expo-video`
- [x] 1.2 在 `src/features/exercises/api/schemas.ts` 新增 `ExerciseVideo`、`ExerciseVideoAiResult` 型別（Zod schema + `z.infer`）
- [x] 1.3 在 `src/features/exercises/api/hooks.ts` 新增 `useExerciseVideos(exerciseId, dateRange)` hook（mock 資料於 `video-mock.ts`，`// TODO: apiFetch`）
- [x] 1.4 更新 `src/lib/i18n/locales/*/exercises.json` 三語系：加入影片頁相關 key（view_videos / video_title / video_empty_* / video_upload / video_analyzed / video_ai_result / video_no_result / video_timeline 等）

## 2. 影片頁面與元件

- [x] 2.1 新增路由檔 `src/app/(tabs)/exercises/video/[id].tsx`（ExerciseVideoScreen 主畫面）
- [x] 2.2 新增 `src/features/exercises/components/video-list-item.tsx`：單筆影片清單項（縮圖 / fallback 佔位 + 日期 + 分析狀態標籤 + 選取高亮）
- [x] 2.3 新增 `src/features/exercises/components/video-player-card.tsx`：`expo-video` `useVideoPlayer` + `VideoView`，無 URL 時顯示佔位
- [x] 2.4 新增 `src/features/exercises/components/video-ai-result-card.tsx`：可折疊 Card，顯示分析摘要 + 關鍵指標 + 分析時間
- [x] 2.5 新增 `src/features/exercises/components/video-timeline.tsx`：時間軸清單（日期 / 標題 / 分析狀態 icon），降序排列
- [x] 2.6 ExerciseVideoScreen 整合：top bar（返回 + 動作名稱 + 上傳 icon）、日期 chips + calendar icon button、`FlatList`（ListHeader=播放器+AI卡、item=`VideoListItem`、empty=EmptyState、footer=`VideoTimeline`）

## 3. 詳情頁整合

- [x] 3.1 修改 `src/app/(tabs)/exercises/[id].tsx`：在現有 `ExerciseVideoSection` 下方加入「查看影片」Button，`onPress` 導向 `exercises/video/${id}`
- [x] 3.2 更新 `src/lib/i18n/locales/*/exercises.json` 三語系：加入「查看影片」button label key（view_videos）

## 4. 收尾與驗收

- [x] 4.1 從 `exercises/[id]` 點擊「查看影片」導向影片頁（button + router.push + 路由檔 + bundle 驗證）
- [x] 4.2 空狀態 EmptyState（FlatList `ListEmptyComponent` 已接）
- [ ] 4.3 [需模擬器] 點擊清單項目確認播放器更新並實際播放影片
- [x] 4.4 AI 分析卡條件顯示（`selected?.aiResult ? <VideoAiResultCard/> : null`）
- [x] 4.5 Timeline 按日期降序 + 分析狀態 icon（sort + CircleCheck/CircleDashed）
- [x] 4.6 日期區間切換重新篩選（mock 依 date 過濾 + queryKey 帶區間）
- [x] 4.7 headless 驗證：`tsc --noEmit` 通過、`expo lint` 無錯、`expo export --platform ios` 成功打包（含 expo-video 原生模組與新路由）
