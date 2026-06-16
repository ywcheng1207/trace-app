## Why

web 有「訓練範本」能力：把當日計畫另存為範本、套用到其他日期、管理（刪除）範本。app 完全沒有此功能。範本能大幅減少重複編排的成本，是訓練排程的重要便利功能。本 change 以純前端 mock 補齊範本能力並整合進 schedule 日詳情。

## What Changes

- 新增 `features/training-templates`（schemas / mock / hooks）：範本含名稱 + 計畫動作組合，in-memory CRUD，串接點標 `// TODO: apiFetch`。
- schedule 日詳情：
  - 「另存為範本」：把當日計畫存成具名範本（名稱重複時提示）。
  - 「套用範本」：選範本套用到當日；若當日已有計畫，先確認覆蓋。
  - 範本管理：列出 / 刪除範本（刪除需確認）。
- i18n：`schedule`（或新 `template` namespace）補範本相關文案（三語系）。

延後：範本分享 / 雲端同步（後端範疇）。

## Capabilities

### New Capabilities
- `app-training-templates`：訓練範本建立 / 套用 / 管理（純前端 mock），API-ready。

### Modified Capabilities
- `app-schedule`：「日詳情 — 訓練計畫」補另存 / 套用範本入口。

## Impact

- 程式：`features/training-templates/*`（新）、schedule 日詳情元件（加入另存 / 套用 / 管理）、i18n。
- 行為：使用者可把計畫存成範本並重複套用。
- 不影響：既有計畫資料結構（範本以動作組合衍生）。
