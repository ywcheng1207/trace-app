## Why

設定的個人資料目前可編輯名稱 / 既有欄位，但 web 個人資料還有頭像、生日、時區，app 的 foundation 階段刻意延後。這些是完善個人檔案的基本欄位（時區也影響日期顯示）。本 change 補齊（純前端 mock，頭像上傳 stub）。

## What Changes

- 頭像：顯示 + 更換（image picker UI，實際上傳 stub `// TODO: apiFetch`）。
- 生日：DatePicker 選擇，存入 profile。
- 時區：時區選擇（Select），存入 profile，供日期顯示參考。
- `profile` schema 擴充：`avatar`（已有）、`birthDate`、`timezone`。
- i18n：`setting` 補頭像 / 生日 / 時區文案（三語系）。

延後：頭像實際上傳 / 裁切、依時區實際換算所有日期（留 API / 後續）。

## Capabilities

### Modified Capabilities
- `app-setting`：「個人資料編輯」加入頭像 / 生日 / 時區。

## Impact

- 程式：`features/profile/api/schemas.ts`（+ birthDate / timezone）、`profile-edit-sheet.tsx`、頭像 picker、DatePicker、時區 Select、i18n。
- 行為：個人資料更完整。
- 不影響：其他 feature。
