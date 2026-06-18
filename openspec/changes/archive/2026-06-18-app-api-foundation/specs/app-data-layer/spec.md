## MODIFIED Requirements

### Requirement: Server State 經 React Query
App 的伺服器資料 SHALL 一律由 React Query 管理（`useQuery` / `useMutation`），query key 集中於 `QUERY_KEYS`，禁止以 `useState` + `useEffect` 手刻資料請求或存入 Redux。

#### Scenario: 查詢資料
- **WHEN** 畫面需要伺服器資料
- **THEN** 透過對應 feature 的 `useXxx` hook（React Query）取得，並處理 loading / empty / error 三態

### Requirement: apiFetch 加密 API 客戶端
`apiFetch<T>(path, options?)` SHALL：
- 自動附帶 Cookie header（`buildCookieHeader()`）
- GET 請求：不加密 body
- POST/PUT/DELETE：以 `encryptPayload(body, sharedSecret)` 加密，body = `{ciphertext: "..."}`
- Response：若含 `ciphertext` key → `decryptPayload` → JSON.parse；否則直接 JSON.parse
- 解密後 payload `ok === false` SHALL throw `ApiError(code, message)`
- 401 response SHALL 觸發自動 refresh + 一次重試（詳見 app-session spec）
- 若提供 `schema`（ZodSchema），SHALL 以 `schema.parse()` 驗證解密後資料，驗證失敗 throw `ZodError`
- 回傳型別為 `T`（直接回傳資料，不包 `ApiResponse` wrapper），**throw on error**

#### Scenario: 加密 POST 請求
- **WHEN** 呼叫 apiFetch POST 並帶有 body
- **THEN** body 以 XChaCha20-Poly1305 加密，帶 Cookie header 送出，response 自動解密

#### Scenario: GET 不加密
- **WHEN** 呼叫 apiFetch GET
- **THEN** 不加密 body，帶 Cookie header 送出，response 自動解密

#### Scenario: API 錯誤
- **WHEN** 解密後 payload ok === false
- **THEN** throw ApiError，呼叫端的 React Query onError callback 接收

#### Scenario: Schema 驗證通過
- **WHEN** 提供 schema 且 response 資料符合 schema
- **THEN** 回傳通過 parse 的型別安全資料

#### Scenario: Schema 驗證失敗
- **WHEN** 提供 schema 且 response 資料不符合
- **THEN** throw ZodError，供 React Query 捕捉

### Requirement: 回應驗證
透過 `apiFetch` 取得的回應 SHALL 在提供 Zod schema 時以 `schema.parse()` 收窄型別後才使用。feature hooks 的 queryFn SHALL 直接呼叫 `apiFetch`，不再使用 mock fetcher。

#### Scenario: 資料型別安全
- **WHEN** feature hook 呼叫 apiFetch 並提供 schema
- **THEN** 回傳資料型別由 `z.infer<typeof schema>` 靜態推導，無需手動型別斷言

## REMOVED Requirements

### Requirement: API-ready Mock 樣板
**Reason**: 本 change 起，真實 apiFetch 取代所有 mock fetcher。`api/mock.ts` 架構與 `// TODO: apiFetch` 標記不再需要。
**Migration**: 各 feature 的 `api/hooks.ts` 直接呼叫 `apiFetch`，schema 保留於 `api/schemas.ts`（`api/mock.ts` 移除）。
