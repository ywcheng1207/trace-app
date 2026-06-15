## Why

Exercises（動作管理）是 Trace 的核心資料庫——訓練計畫、統計都依賴它。foundation 已就緒，接著把 web 的 `/exercises` 功能以 RN 重做（純前端 mock），讓使用者能管理個人動作庫。

## What Changes

- `(tabs)/exercises` 由 placeholder 改為實際功能：動作列表 + 關鍵字搜尋 + 屬性/肌群篩選 chips + 新增按鈕。
- 動作 CRUD：建立 / 編輯（彈窗表單：名稱、筆記、目標肌群、`category` / `force` / `kineticChain` / `mechanic`）、軟刪除（封存）。
- 動作詳情 `exercises/[id]`：基本資訊、屬性、肌群、筆記、AI 建議入口（placeholder）。
- 封存頁 `exercises/archived`：還原 / 永久刪除。
- 新增共用 UI kit：Select（選單）、Chip、Modal/Sheet、TextArea。
- mock + Zod + React Query 資料層（含 in-memory CRUD），串接點標 `// TODO: apiFetch`。
- i18n：`exercises` 與精簡 `muscle` namespace（三語系）。

延後（隨後續迭代）：解剖圖 SVG 肌群選取器（先用 chip 多選）、示範影片、TipTap 富文字筆記（先用純文字）、quick-start、AI 影片分析。

## Capabilities

### New Capabilities
- `app-exercises`: 動作庫的列表 / 搜尋 / 篩選 / CRUD / 軟刪除封存與還原 / 詳情，純前端 mock，API-ready。

### Modified Capabilities
<!-- 無：沿用 foundation 的 app-shell / app-ui-foundation / app-data-layer / app-i18n，未變更其 requirement -->

## Impact

- 程式：`src/app/(tabs)/exercises/*`（改為資料夾 + Stack）、`src/features/exercises/*`（新）、`src/components/ui/*`（Select / Chip / Modal / TextArea 新增）、i18n locales。
- 行為：Exercises 分頁可實際操作（mock 資料），其餘分頁不受影響。
- 尚未影響：真實後端（全 mock，串接點標記）、解剖圖 / 影片 / AI（延後）。
