## Context

兩個目標頁面的現況（已讀原始碼）：

- `schedule/[day].tsx`：`ScreenContainer scroll` 內依序為 訓練計畫 section title → 計畫卡 / EmptyState → `planActions`（新增動作 / [範本橫列：套用範本 + 另存範本] / 清空 / 儲存計畫，全部 `fullWidth`）→ 身體數值 section title + Card → 訓練筆記 section title + Card（TextArea + 儲存）。
- `exercises/[id].tsx`：返回列 → 標題 → 基本資訊 Card → 目標肌群 Card → `ExerciseVideoSection` → 「查看影片」全寬 secondary Button → 筆記 Card（含「編輯筆記」文字鈕）→ `buttons`（編輯 / AI 建議 / 封存，全部 `fullWidth`，封存為 `danger`）。

可用基礎：`Button`（variants：primary/secondary/danger/ghost，size sm，fullWidth）、`Card`、`Sheet`、`IconButton`、`ScreenContainer`、`EmptyState`、`ConfirmDialog`、theme token（`Spacing` half=2/one=4/two=8/three=16/four=24/five=32、`Radius`）。`lucide-react-native` 已用於 icon（如 `ChevronLeft`）。

## Goals / Non-Goals

**Goals**
- 任一畫面的任一區段，同時可見的 primary（filled）按鈕至多 1 顆。
- 破壞性動作（封存、清空計畫）不再以全寬 filled 樣式出現，降級至 overflow ActionSheet 或 ghost/text。
- 三大區段（計畫 / 身體數值 / 筆記）有清楚的視覺分隔與一致垂直節奏。
- 抽出可全 App 重用的 `SectionHeader` 與 `ActionSheet`，避免各頁各自拼裝。
- 行為（API 呼叫、確認流程、notify）完全不變。

**Non-Goals**
- 不改任何 hook / apiFetch / query key / 資料流。
- 不做富文本（屬 `app-rich-text-notes` change）。
- 不重設計通知（屬 `app-notifications-redesign` change）。
- 不引入新套件、不引入手勢 / 動畫框架。
- 不動 `schedule/index`（月曆）與 `exercises/index`（列表）版面。

## Decisions

### D1：動作層級規範（全 App 適用）

於 `app-ui-foundation` 新增規範，明確三級：

| 層級 | 樣式 | 數量 / 位置 | 範例 |
|------|------|------------|------|
| Primary | `Button` filled（default variant），fullWidth | 每區段至多 1 顆，置於該區段動作群底部 | 儲存計畫、儲存數值、儲存筆記、編輯 |
| Secondary | `Button` variant=`secondary`，每列最多 2 顆橫向（`flex:1` 平分） | 一列或兩列 | 新增動作、套用範本、AI 建議 |
| Tertiary / Destructive | overflow ActionSheet 項目，或 `ghost`/text | header 的 `⋯` IconButton 開 ActionSheet | 封存、清空計畫、另存範本 |

**理由**：手機畫面寬度有限，多顆同權重全寬按鈕會讓使用者無法一眼判斷主要動作；破壞性動作用搶眼樣式更是反模式。三級制讓視覺權重對應操作頻率與後果。

### D2：Overflow ActionSheet（漸進式揭露）

新增 `src/components/ui/action-sheet.tsx`，以既有 `Sheet` 為底，接受 `actions: { label; icon?; destructive?; onPress }[]`，由 header 右上的 `⋯`（`MoreHorizontal`）`IconButton` 觸發。破壞性項目以 `theme.danger` 文字色呈現，點擊後仍走原本的 `ConfirmDialog` 確認流程。

**理由**：低頻 / 破壞性動作藏進 overflow 是 iOS / Material 通用模式，釋放主畫面空間給高頻動作；保留 `ConfirmDialog` 確保破壞性操作不被誤觸。

### D3：SectionHeader 與區段節奏

新增 `src/components/ui/section-header.tsx`：`{ title; description?; action? }`，標題用既有 section title 樣式，右側可選 action（如「編輯筆記」文字鈕移到此）。各大區段之間統一 `Spacing.four` 間距，區段內元素 `Spacing.three`。

**理由**：把分散在各頁的 section title `<Text>` 收斂為單一元件，確保跨頁一致的分隔與節奏；description 行可補充情境（取代目前塞在標題下方的零散 subtitle）。

### D4：`schedule/[day]` 重構後結構

```
返回列
標題（日期）+ subtitle
─ SectionHeader「訓練計畫」(action: ⋯ overflow → 清空計畫 / 另存範本)
  計畫卡 or EmptyState
  [secondary 橫列] 新增動作 | 套用範本
  [primary] 儲存計畫
─ SectionHeader「身體數值」
  Card(BodyMetricsForm) — 內含自己的儲存
─ SectionHeader「訓練筆記」
  Card(TextArea)
  [primary] 儲存筆記
```

清空計畫、另存範本移入「訓練計畫」SectionHeader 的 overflow；新增動作 + 套用範本變成同一列 secondary；儲存計畫維持唯一 primary。

### D5：`exercises/[id]` 重構後結構

```
返回列 + header overflow ⋯（→ 封存）
標題
基本資訊 Card
目標肌群 Card
影片區段（ExerciseVideoSection 內含「查看影片」入口，移除獨立全寬按鈕）
SectionHeader「動作筆記」(action: 編輯筆記)
  筆記預覽 Card
[secondary 橫列] AI 建議        （編輯改為 primary）
[primary] 編輯
```

封存（破壞性）移入 header overflow，仍走 `ConfirmDialog`；「查看影片」收進影片區段；「編輯」升為唯一 primary、「AI 建議」為 secondary。

### D6：不使用手勢 / 動畫框架

ActionSheet 沿用 `Sheet` 既有的開合，不引入 `react-native-gesture-handler` 的 swipe。

**理由**：本 change 聚焦版面層級，手勢互動非必要；降低相依與風險。

## Risks / Trade-offs

- **overflow 可發現性**：破壞性動作藏進 `⋯` 後可發現性下降。緩解：`⋯` 放在 header 固定位置（iOS 慣例），且封存 / 清空本就是低頻操作。
- **ActionSheet 與既有 ConfirmDialog 串接**：需確保 ActionSheet 關閉 → 開 ConfirmDialog 的時序不衝突（先 close sheet 再 open dialog，或 dialog 疊在 sheet 上）。設計上以「先關 sheet、再開 dialog」處理。
- **BodyMetricsForm 自帶儲存**：身體數值區的 primary 由該 form 內部負責，與 D1「每區段 1 顆 primary」一致，不需外移。

## Open Questions

- `SectionHeader` 的 `action` 是否需支援 icon-only（如 `⋯`）與 text 兩型 → 設計上 `action` 接 `ReactNode`，由呼叫端決定。
- 是否一併把 `exercises/[id]` 的「查看影片」入口樣式與 `ExerciseVideoSection` 整合（屬視覺細節，apply 時定案）。
