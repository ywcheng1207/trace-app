## 1. Token 重寫

- [x] 1.1 `theme.ts` `Colors.light` / `Colors.dark` 依對應表重映射（含 info 新 key）
- [x] 1.2 新增品牌 token：`brandOrange` / `brandYellow` / `brandBeige` / `brandDark`
- [x] 1.3 `accent` key 指向 brandOrange 語意
- [x] 1.4 `Radius` 改 `sm4/md6/lg8/xl12/full`，加 `sheet: 16`
- [x] 1.5 `ThemeColor` 型別、`use-theme` 同步新增 key

## 2. 元件校正

- [x] 2.1 全域 grep 硬編碼色碼 / 魔術圓角，逐一改用 token（themed-text linkPrimary 去硬編碼）
- [x] 2.2 既有用 `primary`（藍）當強調的地方，視語意改 `accent`(brandOrange)：auth 連結 / tab active / 返回 / today / +add set
- [x] 2.3 確認 Button / Card / Chip / Sheet / TextField 等 UI kit 圓角採 8px 基準（sheet/toast 用 16）

## 3. （選配）字型

- [ ] 3.1 `expo-font` 載入 Geist — 延後（選配，不阻塞；先確保色/圓角，字型留後續 change）

## 4. Verification

- [x] 4.1 `npx tsc --noEmit`（pass）
- [x] 4.2 `npx expo lint`（pass）
- [x] 4.3 web preview 逐頁檢查 light / dark 對齊 web（login light/dark：primary 近黑/近白、連結 brandOrange、inputs zinc）
