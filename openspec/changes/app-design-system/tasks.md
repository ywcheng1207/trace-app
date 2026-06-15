## 1. Token 重寫

- [ ] 1.1 `theme.ts` `Colors.light` / `Colors.dark` 依對應表重映射（含 info 新 key）
- [ ] 1.2 新增品牌 token：`brandOrange` / `brandYellow` / `brandBeige` / `brandDark`
- [ ] 1.3 `accent` key 指向 brandOrange 語意
- [ ] 1.4 `Radius` 改 `sm4/md6/lg8/xl12/full`，加 `sheet: 16`
- [ ] 1.5 `ThemeColor` 型別、`use-theme` 同步新增 key

## 2. 元件校正

- [ ] 2.1 全域 grep 硬編碼色碼 / 魔術圓角，逐一改用 token
- [ ] 2.2 既有用 `primary`（藍）當強調的地方，視語意改 `accent`(brandOrange) 或保留 primary
- [ ] 2.3 確認 Button / Card / Chip / Sheet / TextField 等 UI kit 圓角採 8px 基準

## 3. （選配）字型

- [ ] 3.1 `expo-font` 載入 Geist（sans / mono），`Fonts` 對應；未載入 fallback system

## 4. Verification

- [ ] 4.1 `npx tsc --noEmit`
- [ ] 4.2 `npx expo lint`
- [ ] 4.3 web preview 逐頁檢查 light / dark 對齊 web、無硬編碼殘留
