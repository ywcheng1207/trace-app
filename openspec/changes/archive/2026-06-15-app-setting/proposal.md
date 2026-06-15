## Why

Setting 是帳號與偏好的管理中心。foundation 時 Setting 只放了 profile 卡 + 登出，現在補成完整功能，對齊 web 的 `/setting`。這是 plan 的最後一個 feature change。

## What Changes

- `(tabs)/setting` 擴充為完整設定頁：
  - **個人資料**：顯示名稱、性別、身高的編輯（彈窗表單，RHF + Zod）。
  - **語系切換**：en / zh-Hant / zh-Hans，即時 `i18n.changeLanguage` + 持久化偏好。
  - **數值欄位偏好**：以 Switch 切換各身體數值欄位顯示與否，並實際影響 Schedule 的身體數值表單。
  - **密碼變更**：彈窗表單（舊 / 新 / 確認，Zod 驗證，mock）。
  - 既有登出保留。
- 新增 UI kit：`Switch`。
- profile 資料層擴充：可變 mock + `useUpdateProfile` / `useUpdateLanguage` / `useSetHiddenMetrics`；auth 新增 `useChangePassword`（mock）。
- i18n：`setting` namespace（三語系）。

延後：頭像、生日、活動量、時區（web 有，先做核心）。

## Capabilities

### New Capabilities
- `app-setting`: 個人資料編輯、語系切換、數值欄位偏好、密碼變更（mock，API-ready）。

### Modified Capabilities
<!-- 無：profile 改為可變 mock 屬實作細節，沿用 app-data-layer 既有 requirement -->


## Impact

- 程式：`src/app/(tabs)/setting.tsx`、`src/features/profile/*`（擴充）、`src/features/auth/*`（密碼變更）、`src/features/setting/components/*`（新）、`src/components/ui/switch.tsx`（新）、Schedule 的 `BodyMetricsForm`（依 hiddenMetrics 過濾）、i18n。
- 行為：Setting 可編輯資料 / 切語系 / 調欄位偏好 / 改密碼；欄位偏好影響 Schedule 身體數值表單。
- 尚未影響：真實後端（全 mock）。
