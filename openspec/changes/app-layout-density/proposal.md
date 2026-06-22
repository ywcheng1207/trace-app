## Why

`schedule/[day]` 與 `exercises/[id]` 兩個高頻詳情頁，目前把多顆 **全寬按鈕縱向堆疊**，且各區段缺乏明確視覺分隔，違反手機 UI/UX 原則：

- `schedule/[day]`：訓練計畫區一次出現「新增動作」「套用範本」「清空計畫」「儲存計畫」四顆全寬按鈕縱向排列，主要動作（儲存）與次要 / 破壞性動作（清空）在視覺權重上沒有區別。「訓練計畫 / 身體數值 / 訓練筆記」三段只用一個 section title 分隔，密度過高、缺乏呼吸感。
- `exercises/[id]`：詳情頁底部「編輯」「AI 建議」「封存」三顆全寬按鈕縱向堆疊，外加上方「新增示範影片」「查看影片」也是全寬，破壞性的「封存」用全寬紅色 block，視覺上比主要動作還搶眼。

問題本質：**沒有動作層級（action hierarchy）、沒有漸進式揭露（progressive disclosure）、區段分隔不足**。一個畫面同時出現 ≥ 4 顆同等權重的全寬按鈕，是典型的桌面思維搬到手機。

## What Changes

- 建立全 App 一致的 **動作層級規範**：每個區段最多一顆 primary（filled）主要動作；次要動作用 `secondary` 並以每列最多 2 顆的橫向排列；破壞性 / 低頻動作（封存、清空）從全寬按鈕降級到 overflow ActionSheet 或 ghost / text 樣式，不得用全寬 filled 紅色 block。
- 新增共用 `SectionHeader` 與 `ActionSheet`（以既有 `Sheet` 為底）兩個 UI kit 元件，並寫入 `app-ui-foundation`。
- 重構 `schedule/[day]`：訓練計畫動作重新分層（儲存為主要、新增/套用為次要橫列、清空進 overflow）；強化三大區段（訓練計畫 / 身體數值 / 訓練筆記）的卡片分組與垂直節奏。
- 重構 `exercises/[id]`：將低頻 / 破壞性動作（封存）收進 header 的 overflow ActionSheet；「編輯」「AI 建議」整理為精簡動作列；「查看影片」整合進影片區段而非獨立全寬按鈕。
- 純版面 / 互動重構，**不改任何 API 串接、不改資料流**。

## Capabilities

### Modified Capabilities
- `app-ui-foundation`：UI kit 新增 `SectionHeader`、`ActionSheet`，並新增「動作層級與區段分隔」規範
- `app-schedule`：`日詳情 — 訓練計畫` 的版面與動作層級重構（行為不變）
- `app-exercises`：`動作詳情` 的版面與動作層級重構（行為不變）

## Impact

- `src/components/ui/section-header.tsx`（新增）
- `src/components/ui/action-sheet.tsx`（新增，以 `Sheet` 為底）
- `src/app/(tabs)/schedule/[day].tsx`（修改：動作分層 + 區段分隔）
- `src/app/(tabs)/exercises/[id].tsx`（修改：overflow ActionSheet + 動作列整理）
- `src/lib/i18n/locales/*/schedule.json`、`*/exercises.json`、`*/common.json`（三語系：overflow 選單與動作 label）
- 不新增任何套件依賴
