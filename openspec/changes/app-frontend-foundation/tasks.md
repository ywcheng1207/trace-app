## 1. Dependencies

- [x] 1.1 `npx expo install react-native-svg`；`npm i react-native-gifted-charts lucide-react-native date-fns`
- [x] 1.2 gifted-charts 已安裝（charts 實際使用延到 `app-statistics`，屆時驗證 linear-gradient peer）

## 2. Theme & UI Kit

- [x] 2.1 擴充 `src/constants/theme.ts`：語意色（primary/accent/danger/success/border/muted…）light+dark + Radius
- [x] 2.2 共用元件：Button、Card、Badge、Skeleton、Avatar、EmptyState、Loading（Progress 延到首次需要）
- [ ] 2.3 表單元件：TextField 已完成；Select / DatePicker / Checkbox / Switch 延到首次使用的 feature 一併設計
- [x] 2.4 PageHeader、ScreenContainer 完成；Modal/Sheet 延到首次使用的 feature
- [x] 2.5 全域 Toast：接 `ui-slice` notification，掛在 providers 層

## 3. Data Layer 樣板

- [x] 3.1 擴充 `src/lib/query/query-keys.ts`
- [x] 3.2 feature 資料層樣板（`features/<f>/api/{schemas,mock,hooks}.ts`），hooks `queryFn` 標 `// TODO: apiFetch`
- [x] 3.3 profile（schema + mock + `useProfile`）+ auth（login/register/reset mock）示範

## 4. i18n Base

- [x] 4.1 namespace（common / nav / auth / notify）三語系（zh-Hant / zh-Hans / en）
- [x] 4.2 `src/lib/i18n/index.ts` 註冊 namespace

## 5. 導覽重構（expo-router）

- [x] 5.1 移除 starter（index/explore/app-tabs/animated-icon/hint-row…）
- [x] 5.2 root `_layout.tsx` providers + auth gate（restoring 顯示 Loading）+ `index.tsx` 入口轉址
- [x] 5.3 `(auth)/_layout` Stack；`(tabs)/_layout` 底部分頁（lucide icon + i18n label）
- [x] 5.4 四個 tab placeholder（schedule / exercises / statistics / setting）

## 6. Auth 流程

- [x] 6.1 `(auth)/login`（RHF + Zod，mock 登入寫 token + setAuthenticated）
- [x] 6.2 `(auth)/register`（密碼一致驗證，mock）
- [x] 6.3 `(auth)/forgot-password`（送出後顯示已寄送）、`(auth)/reset-password`
- [x] 6.4 auth-slice + token-storage（web fallback）+ Setting 登出

## 7. Verification

- [x] 7.1 `npx tsc --noEmit` 通過
- [x] 7.2 `npx expo lint` 通過
- [x] 7.3 Expo web preview：登入流程、四分頁切換、Setting profile + 登出、無 console error（截圖）

## Deferred（隨首個需要的 feature change 一併設計）
- UI kit：Select / DatePicker / Checkbox / Switch / Modal / Sheet / Progress
- 各 feature 內容：Schedule / Exercises / Statistics / Setting 實際畫面
