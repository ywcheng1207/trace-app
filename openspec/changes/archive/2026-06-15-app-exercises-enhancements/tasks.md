## 1. 解剖圖肌群選取器

- [x] 1.1 `muscle-anatomy.tsx`：react-native-svg 人體前 / 後視圖（區塊近似，可點 Rect/Ellipse zone）
- [x] 1.2 點擊 toggle 選取 + brandOrange 著色；前 / 後 SegmentedControl 切換
- [x] 1.3 zone↔muscle union 雙向相容（zone active = 任一 muscle 選取；chip 顯示舊資料）
- [x] 1.4 `muscle-selector.tsx` 改為 SVG anatomy + chip 細項 fallback

## 2. 示範影片

- [x] 2.1 詳情 `ExerciseVideoSection` 播放器 UI（player placeholder + PlayCircle）
- [x] 2.2 「換 / 新增影片」expo-image-picker（videos）入口，上傳 stub `// TODO`；schema 加 videoUrl

## 3. 動作筆記

- [x] 3.1 `exercises/note/[id]` 編輯（純文字 / 白名單渲染，無 raw HTML）
- [x] 3.2 詳情筆記區加「編輯」入口

## 4. 使用狀況查詢

- [x] 4.1 `useExerciseUsage`（mock，依 id 衍生穩定引用數）
- [x] 4.2 詳情封存改 ConfirmDialog（取代 web 失效的 Alert.alert），被引用時提示；archived purge 同步改 ConfirmDialog

## 5. 快速建立

- [x] 5.1 動作庫空 EmptyState「快速建立入門動作」批次建立 6 個常見動作（mock）

## 6. i18n / Verification

- [x] 6.1 `exercises` / `muscle` 補文案（前後視圖 / 影片 / 筆記 / 使用 / quick-start，三語系）
- [x] 6.2 `npx tsc --noEmit`（pass）　6.3 `npx expo lint`（pass）
- [x] 6.4 preview：解剖圖選取（chest zone tap → orange）、示範影片 player、筆記編輯入口、AI 建議入口；SVG onPress 在 web 有 react-native-svg responder 警告（benign，native 無）
