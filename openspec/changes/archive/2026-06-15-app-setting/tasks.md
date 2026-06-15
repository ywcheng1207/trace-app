## 1. UI Kit

- [x] 1.1 `Switch`（RHF 無關，受控 on/off）

## 2. 資料層

- [x] 2.1 profile schema 加 `hiddenMetrics`；新增 `profileEditSchema`
- [x] 2.2 profile mock 改可變 + `mockUpdateProfile` / `mockUpdateLanguage` / `mockSetHiddenMetrics`
- [x] 2.3 hooks：`useUpdateProfile` / `useUpdateLanguage` / `useSetHiddenMetrics`（invalidate profile）
- [x] 2.4 auth：`passwordChangeSchema` + `mockChangePassword` + `useChangePassword`

## 3. i18n

- [x] 3.1 `setting` namespace（三語系）
- [x] 3.2 註冊 namespace

## 4. 畫面

- [x] 4.1 `setting` 重寫：個人資料 / 語系 / 數值欄位偏好 / 密碼變更 / 登出 區塊
- [x] 4.2 `ProfileEditSheet`（RHF：顯示名稱 / 性別 Select / 身高）
- [x] 4.3 `PasswordChangeSheet`（RHF：舊 / 新 / 確認）
- [x] 4.4 語系切換（i18n.changeLanguage + mutation）、欄位偏好（Switch + mutation）
- [x] 4.5 Schedule `BodyMetricsForm` 依 `hiddenMetrics` 過濾欄位

## 5. Verification

- [x] 5.1 `npx tsc --noEmit`
- [x] 5.2 `npx expo lint`
- [x] 5.3 Expo web preview：編輯資料、切語系（文字即時變）、切欄位偏好、改密碼、無 console error（截圖）
