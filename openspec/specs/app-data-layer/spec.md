# app-data-layer Specification

## Purpose
TBD - created by archiving change app-frontend-foundation. Update Purpose after archive.
## Requirements
### Requirement: Server State 經 React Query
App 的伺服器資料 SHALL 一律由 React Query 管理（`useQuery` / `useMutation`），query key 集中於 `QUERY_KEYS`，禁止以 `useState` + `useEffect` 手刻資料請求或存入 Redux。

#### Scenario: 查詢資料
- **WHEN** 畫面需要伺服器資料
- **THEN** 透過對應 feature 的 `useXxx` hook（React Query）取得，並處理 loading / empty / error 三態

### Requirement: API-ready Mock 樣板
每個 feature 的資料存取 SHALL 採統一樣板：`api/schemas.ts`（Zod schema + `z.infer` 型別）、`api/mock.ts`（mock 資料與 fetcher）、`api/hooks.ts`（React Query hook）。hook 的 `queryFn` 本階段呼叫 mock，並 SHALL 在串接點標註 `// TODO: apiFetch('/api/...', { schema })`，使日後切換成真實 `apiFetch` 僅需替換該行。

#### Scenario: 預留串接點
- **WHEN** 檢視任一 feature 的 `hooks.ts`
- **THEN** 每個 query/mutation 的串接位置都有明確 `// TODO: apiFetch` 標記與對應 Zod schema

#### Scenario: 型別來自 Zod
- **WHEN** 定義資料結構型別
- **THEN** 以 `z.infer` 從 schema 推導，無手寫 interface、無 Prisma

### Requirement: 回應驗證
透過 `@/lib/api` 的 `apiFetch` 取得的回應 SHALL 經對應 Zod schema 收窄後才使用；mock fetcher 回傳的資料 SHALL 與該 schema 結構一致，確保切換真實 API 時型別不變。

#### Scenario: mock 與 schema 一致
- **WHEN** mock fetcher 產生資料
- **THEN** 該資料可通過對應 schema 的 `safeParse`

