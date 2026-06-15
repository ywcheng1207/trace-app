## Context

最後一個 feature change，補完 Setting。沿用既有架構。profile mock 由唯讀改為可變以支援更新。

## Goals / Non-Goals

**Goals:** 個人資料編輯、語系切換（即時）、數值欄位偏好（影響 Schedule 表單）、密碼變更（mock）；補 `Switch` UI。

**Non-Goals:** 頭像 / 生日 / 活動量 / 時區編輯（先做核心欄位）、真實密碼後端、TDEE。

## Decisions

- **profile mock 改可變**：module-level 可變 profile 物件 + `mockUpdateProfile` / `mockUpdateLanguage` / `mockSetHiddenMetrics`；對應 hooks invalidate profile query。對齊未來 `apiFetch` PUT。
- **語系**：選定即呼叫 `i18n.changeLanguage(lng)`（即時生效）並 `useUpdateLanguage`（mock 持久化）+ Redux `ui.locale` 記錄。
- **數值欄位偏好**：`profile.hiddenMetrics: string[]`；Setting 用 `Switch` 切換，`BodyMetricsForm` 依此過濾欄位（跨 feature 連動，落實「偏好真的有作用」）。
- **密碼變更**歸於 auth feature（`useChangePassword` mock + `passwordChangeSchema`）；以彈窗表單呈現。
- 編輯 / 密碼用 `Sheet` 彈窗，與 exercises 一致。

## Risks / Trade-offs

- profile 可變 mock reload 後重置 → 可接受（純前端）。
- 語系持久化於 mock/Redux，App 重啟後回預設偵測 → 後續可接 AsyncStorage/redux-persist（已在 state-management 規範中列為方向）。

## Open Questions
- 其餘 profile 欄位（頭像/生日/時區）何時補 → 後續迭代。
