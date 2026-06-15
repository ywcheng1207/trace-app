## Context

app `profile` schema 已有 avatar（nullable）。`profile-edit-sheet.tsx` 編輯基本欄位。web 個人資料含頭像 / 生日 / 時區。

## Goals / Non-Goals

- Goals：頭像更換 UI、生日、時區，存入 mock profile。
- Non-Goals：頭像實際上傳 / 裁切、全 App 依時區換算日期。

## Decisions

- 頭像：`expo-image-picker` 選圖預覽，上傳 stub；mock 先存本地 uri。
- 生日：自製 DatePicker（與 statistics / schedule 一致），存 ISO date。
- 時區：Select 常見時區清單；存 IANA 字串。
- schema 擴充 `birthDate: string | null`、`timezone: string | null`。

## Risks

- 時區清單過長 → 提供搜尋 / 常用時區優先。
