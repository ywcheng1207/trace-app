## Context

web `training-templates`：範本建立（另存 / 名稱重複處理）、套用（套到已有計畫的日期需確認覆蓋）、管理（刪除）。app schedule 已有當日計畫（plan-exercise-card / picker）。

## Goals / Non-Goals

- Goals：範本 CRUD + schedule 整合（另存 / 套用 / 管理），純前端 mock。
- Non-Goals：範本分享、跨裝置同步。

## 資料模型（Zod）

- `trainingTemplateSchema`：`id` / `name` / `exercises`（動作組合：exerciseId + 預設組數結構）/ `createdAt`。
- mock：in-memory `Map<id, Template>`，含 1–2 筆樣本。
- hooks：`useTemplates` / `useCreateTemplate` / `useApplyTemplate` / `useDeleteTemplate`（標 `// TODO: apiFetch`），mutation onSuccess invalidate + notify。

## Schedule 整合

- 日詳情加動作：「另存為範本」→ 輸入名稱（重複時提示）→ createTemplate。
- 「套用範本」→ Sheet 選範本 → 若當日已有計畫，先 confirm 覆蓋 → 寫入當日計畫（mock）→ invalidate schedule。
- 範本管理：列表 + 刪除（confirm）。

## Decisions

- 範本是 server state → React Query 管理（非 redux）。
- 套用採「覆蓋當日計畫」語意，對齊 web；覆蓋前必確認。

## Risks

- 範本內動作若已被封存 / 刪除：套用時以名稱快取顯示、標記失效（對齊 web「動作名稱快取」）。
