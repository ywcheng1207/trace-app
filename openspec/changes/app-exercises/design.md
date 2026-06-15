## Context

沿用 foundation 的架構（StyleSheet + theme、mock + Zod + React Query、expo-router、i18n）。Exercises 是首個完整 CRUD feature，會把 foundation 延後的部分 UI kit（Select / Chip / Modal / TextArea）補齊。

## Goals / Non-Goals

**Goals:** 動作列表/搜尋/篩選/CRUD/封存還原/詳情，純前端 mock 且 API-ready；補齊表單/彈窗類 UI kit。

**Non-Goals:** 解剖圖 SVG 肌群選取器（先 chip 多選）、示範影片與動作分析、TipTap 富文字（先純文字 TextArea）、quick-start、AI 影片分析、`usage`（刪除前引用查詢）。

## Decisions

- **enums 用字串 Union + 常數表**：`category`（STRENGTH/HYPERTROPHY/POWER/CARDIO/MOBILITY/OTHER）、`force`（PUSH/PULL/SQUAT/HINGE/LUNGE/CARRY/ROTATION/STATIC/LISS/HIIT）、`kineticChain`（OKC/CKC）、`mechanic`（COMPOUND/ISOLATION）。label 走 i18n（`exercises` namespace 的既有 key）。
- **肌群先用精簡 region→muscle 多選 chip**（i18n `muscle` namespace），不做 SVG 人體圖。資料型別保留 `muscleGroups: string[]`，未來換 SVG 不需改 schema。
- **mock in-memory CRUD**：mock 模組維護一份可變陣列，create/update/archive/restore/purge 操作它；React Query `invalidateQueries` 觸發重抓。串接點標 `// TODO: apiFetch`。
- **建立/編輯用 Modal**（新 UI kit），詳情/封存用獨立路由（exercises 改資料夾 + Stack）。

## Risks / Trade-offs

- mock in-memory 狀態在 reload 後重置 → 可接受（純前端原型）；串接真實 API 後由後端持久化。
- Select 在 RN 無原生下拉 → 以 Modal 清單實作，注意可及性與鍵盤。

## Open Questions
- 肌群最終分類粒度（精簡 vs 完整解剖）待產品確認；目前以精簡版可運作。
