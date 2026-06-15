## Why

Exercises 基本 CRUD / 封存已完成，但 web 還有幾個重要細節 app 沒做：解剖圖 SVG 肌群選取器（目前用 chip 多選，較不直覺）、示範影片、動作筆記（富文字）、刪除前使用狀況查詢（避免刪到計畫引用中的動作）、新用戶快速建立入門動作。本 change 把這些補齊（純前端，影片 / 上傳 stub）。

## What Changes

- 解剖圖肌群選取器：以 `react-native-svg` 畫人體前 / 後視圖，點區塊選 / 反選肌群，選取狀態著色；相容既有 chip 資料（舊資料可顯示）；行動裝置排版可縮放 / 切換前後。
- 示範影片：動作詳情可看 / 換示範影片（播放器 UI + 上傳入口 stub，標 `// TODO`）。
- 動作筆記：`note/[id]` 編輯筆記（先結構化文字 / 簡易格式，渲染走白名單，不注入 raw HTML）。
- 使用狀況查詢：刪除 / 封存前查此動作被哪些計畫引用，提示後再確認。
- 快速建立入門動作：動作庫為空時，提供一鍵建立常見入門動作。

延後：影片實際上傳 / 壓縮 / Gemini（拆到 `app-ai-coach`）、TipTap 完整富文字。

## Capabilities

### Modified Capabilities
- `app-exercises`：「動作建立與編輯」改用解剖圖選取器；「軟刪除封存與還原」加使用狀況查詢；新增示範影片 / 筆記 / 快速建立 requirement。

## Impact

- 程式：`features/exercises/components/muscle-selector.tsx`（改 SVG）、新增解剖圖元件、影片播放器、筆記編輯、quick-start；詳情 `exercises/[id]`、`exercises/note/[id]`。
- 行為：肌群選取更直覺、可看示範影片 / 筆記、刪除有保護、新手可快速建庫。
- 不影響：既有 exercise schema（肌群欄位相容）。
