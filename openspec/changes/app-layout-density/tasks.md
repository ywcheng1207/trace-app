## 1. 共用 UI kit

- [x] 1.1 新增 `src/components/ui/section-header.tsx`：props `{ title: string; description?: string; action?: ReactNode }`，標題沿用既有 section title 樣式，右側 `action` 區（`flexDirection: row, justifyContent: space-between`），全程用 theme token
- [x] 1.2 新增 `src/components/ui/action-sheet.tsx`：以既有 `Sheet` 為底，props `{ visible; onClose; actions: { key: string; label: string; icon?: ReactNode; destructive?: boolean; onPress: () => void }[] }`，破壞性項目文字用 `theme.danger`，點擊後先 `onClose` 再執行 `onPress`
- [x] 1.3 在 `app-ui-foundation` 規範下確認兩元件命名 / props 符合 naming-conventions（`onXXX`、PascalCase 檔名 kebab-case）

## 2. schedule/[day] 版面重構

- [x] 2.1 將「訓練計畫」「身體數值」「訓練筆記」三個 `<Text sectionTitle>` 改為 `SectionHeader`，區段間距統一 `Spacing.four`（container gap 16 + section marginTop 8）
- [x] 2.2 「訓練計畫」SectionHeader 的 `action` 放 `⋯` IconButton（`MoreHorizontal`），開 `ActionSheet`，項目：清空計畫（destructive）、另存範本（僅 exercises.length>0 時整個 ⋯ 才出現）
- [x] 2.3 移除原本全寬的「清空計畫」「另存範本」按鈕；「新增動作」+「套用範本」改為同一列 secondary（各 `flex:1`）；「儲存計畫」維持唯一 primary fullWidth 於動作群底部
- [x] 2.4 「清空計畫」經 ActionSheet 觸發後，仍開既有 `ConfirmDialog`（先關 sheet 再開 dialog）；「另存範本」經 ActionSheet 觸發後開既有 `SaveTemplateSheet`
- [x] 2.5 保留 `isAtPlanLimit` 的上限提示文字與「新增動作」disabled 行為，位置移至 secondary 橫列下方

## 3. exercises/[id] 版面重構

- [x] 3.1 返回列右側新增 `⋯` IconButton 開 `ActionSheet`，項目：封存（destructive）→ 觸發後開既有 `ConfirmDialog`（archive 流程不變）
- [x] 3.2 移除底部 `buttons` 群中的「封存」全寬 danger 按鈕
- [x] 3.3 「編輯」升為唯一 primary fullWidth；「AI 建議」改為 secondary，置於「編輯」上方一列
- [x] 3.4 移除獨立的「查看影片」全寬按鈕，整合為 `ExerciseVideoSection` 區段標題列的「查看影片」連結（`onViewVideos` prop）
- [x] 3.5 筆記區改用 `SectionHeader`（title=動作筆記，action=「編輯筆記」文字鈕），下方保留筆記預覽 Card

## 4. i18n

- [x] 4.1 `*/common.json` 三語系：新增 `more_actions`（`cancel` 已存在）
- [x] 4.2 `*/schedule.json` 三語系：沿用既有 `clear_plan` / `save_as_template`，ActionSheet 標題重用 `training_plan`
- [x] 4.3 `*/exercises.json` 三語系：沿用既有 `archive` / `view_videos` / `edit_note`

## 5. 驗收

- [x] 5.1 `tsc --noEmit` 通過
- [x] 5.2 `expo lint` 我這次動的檔案 0 error / 0 warning（4 個既有 warning 屬前一 change 的 api hooks，非本次範圍）
- [x] 5.3 `expo export --platform ios` 成功打包（4149 modules，含新元件與重構頁面）
- [ ] 5.4 [需模擬器] schedule/[day]：每區段至多 1 顆 primary；清空 / 另存範本只能從 ⋯ 進入；清空仍出確認框；儲存計畫 / 儲存筆記行為不變
- [ ] 5.5 [需模擬器] exercises/[id]：封存只能從 ⋯ 進入且仍出確認框；編輯為唯一 primary；查看影片可從影片區進入；筆記編輯入口正常
- [ ] 5.6 [需模擬器] light / dark 兩模式下區段分隔、ActionSheet 破壞性項目顏色正確
