## ADDED Requirements

### Requirement: 影片清單與篩選

`exercises/video/[id]` 頁面 SHALL 以 `FlatList` 呈現該動作的所有已上傳影片，每個清單項目 SHALL 顯示影片縮圖（或 fallback 佔位）、上傳日期、影片標題（若有）、AI 分析狀態標籤（「已分析」/ 「分析中」/ 無）。

清單頂部 SHALL 提供快速日期區間預設 chips（7 / 30 / 90 天）與 calendar icon button（開啟自訂日期 Sheet），切換後清單依新區間篩選。

資料由 `useExerciseVideos(exerciseId, dateRange)` hook 提供（mock，`// TODO: apiFetch`）。

#### Scenario: 有影片時顯示清單

- **WHEN** 該動作在選定區間內有已上傳影片
- **THEN** FlatList 顯示各影片縮圖 + 日期 + 分析狀態標籤

#### Scenario: 無影片時顯示 EmptyState

- **WHEN** 該動作在選定區間內無影片
- **THEN** 顯示 EmptyState，提示「目前沒有影片，點擊下方按鈕上傳第一支」

#### Scenario: 切換日期區間篩選

- **WHEN** 使用者點擊 7 / 30 / 90 天 Chip 或輸入自訂區間後確認
- **THEN** 清單依新區間重新篩選影片

### Requirement: 影片播放

點擊清單中的影片項目，SHA 以 `expo-video` 在畫面上方的播放器卡片（16:9 aspect-ratio）播放選定影片，同時高亮對應的清單項目。

#### Scenario: 點擊清單項目播放

- **WHEN** 使用者點擊清單中某支影片
- **THEN** 播放器卡片更新並開始播放該影片，對應清單項目顯示「播放中」指示

#### Scenario: 無影片時播放器顯示佔位

- **WHEN** 尚未選擇任何影片
- **THEN** 播放器卡片顯示灰底 + play icon 的佔位，提示「選擇影片以播放」

#### Scenario: 播放本地 URI 影片

- **WHEN** 影片 URL 為本地 `file://` URI（上傳 stub 產生）
- **THEN** 播放器能正常播放本地影片

### Requirement: AI 分析結果顯示

若選定影片 `hasAiAnalysis === true`，SHALL 在播放器下方顯示 `VideoAiResultCard`，內容含分析摘要文字、關鍵指標 chips（label + value）、分析時間戳。Card 預設展開，可折疊。

#### Scenario: 有 AI 分析時顯示結果卡片

- **WHEN** 使用者選擇一支已有 AI 分析的影片
- **THEN** 播放器下方自動顯示 `VideoAiResultCard`

#### Scenario: 無 AI 分析時不顯示卡片

- **WHEN** 使用者選擇一支無 AI 分析的影片
- **THEN** 播放器下方不顯示 `VideoAiResultCard`，可選擇顯示「尚未分析」說明

### Requirement: 影片上傳入口

影片頁面 SHALL 提供「上傳新影片」的浮動 button 或 Header icon button，點擊後觸發現有的 image/video picker 邏輯（`ExerciseVideoSection` 的 `pickVideo`），上傳仍為 stub（`// TODO: apiFetch`）。

#### Scenario: 上傳新影片

- **WHEN** 使用者點擊上傳按鈕
- **THEN** 開啟裝置相片庫（video 類型），選片後觸發上傳 stub，清單樂觀更新（或重新 fetch）

### Requirement: 影片 Timeline

頁面底部 SHALL 以時間軸格式（日期為軸）顯示所有影片的歷史記錄，每條記錄含日期、影片標題（或「無標題」）、分析狀態圖示。時間軸以最新在上排序。

#### Scenario: Timeline 顯示影片歷史

- **WHEN** 清單有至少一支影片
- **THEN** 頁面底部顯示 Timeline，所有影片依日期降序排列，分析狀態以 icon 表示
