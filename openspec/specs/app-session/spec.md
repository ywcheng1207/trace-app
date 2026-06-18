## ADDED Requirements

### Requirement: Token Storage（三 key）
`token-storage.ts` SHALL 提供 `accessToken`、`refreshToken`、`sharedSecret` 三個 key 的 get/set/clear 操作，一律使用 `expo-secure-store`。`clearSession()` SHALL 一次性清除三個 key。Expo web 環境 SHALL fallback 至 `AsyncStorage`（`expo-secure-store` 在 web 不可用）。

#### Scenario: 儲存 session
- **WHEN** login 成功後呼叫 storeSession
- **THEN** accessToken、refreshToken、sharedSecret 各自以獨立 key 存入 SecureStore

#### Scenario: 清除 session
- **WHEN** 呼叫 clearSession
- **THEN** 三個 key 全部從 SecureStore 刪除

### Requirement: Key Exchange 流程
`performKeyExchange()` SHALL 執行以下步驟：
1. GET `EXPO_PUBLIC_API_BASE_URL/api/control` 取得 `{publicKey, signature, fingerprint}`
2. 以 `verifyServerKey(publicKey, signature, EXPO_PUBLIC_SIGNING_PUBKEY)` 驗證
3. 以 `generateKeyPair()` 生成 frontend keypair
4. 以 `computeSharedSecret(frontendPrivKey, serverPubKey)` 得 sharedSecret
5. 回傳 `{sharedSecret, frontendPublicKey, frontendFingerprint}` 供 login/register 使用

任一步驟失敗 SHALL throw 對應錯誤（`ServerKeyVerificationError`、`KeyExchangeError`）。

#### Scenario: 成功 key exchange
- **WHEN** 後端回傳合法的 publicKey + signature
- **THEN** performKeyExchange 回傳 sharedSecret（base64）與 frontendPublicKey（base64）

#### Scenario: Server key 驗證失敗
- **WHEN** 後端回傳偽造或過期的 publicKey
- **THEN** performKeyExchange throw `ServerKeyVerificationError`，不繼續 login 流程

### Requirement: Cookie Header 構造
`buildCookieHeader()` SHALL 從 SecureStore 讀取三個 token 並組成：
`"accessToken=<val>; refreshToken=<val>; shared_secret=<val>"`
若任一值不存在，SHALL throw `SessionNotFoundError`。

#### Scenario: 有效 session
- **WHEN** 三個 token 均存在於 SecureStore
- **THEN** buildCookieHeader 回傳完整 Cookie 字串

#### Scenario: session 不完整
- **WHEN** 任一 token 不存在
- **THEN** throw `SessionNotFoundError`

### Requirement: Set-Cookie 解析
`parseSetCookies(rawHeader)` SHALL 解析後端 login/register 回應的 `Set-Cookie` header（多個 cookie 以 `, ` 分隔），回傳 `{accessToken, refreshToken, shared_secret}` Record。若關鍵 key 缺失 SHALL throw `ParseSetCookiesError`。

#### Scenario: 三個 cookie 均存在
- **WHEN** 解析完整 Set-Cookie header
- **THEN** 回傳 accessToken、refreshToken、shared_secret 三個 value

### Requirement: 401 Token Refresh
`refreshAccessToken()` SHALL GET `EXPO_PUBLIC_API_BASE_URL/api/auth/refresh`（帶 Cookie header）。
成功（200）SHALL 解析新 accessToken 並更新 SecureStore，回傳新 token。
失敗（401/其他）SHALL 呼叫 `clearSession()` 並 throw `SessionExpiredError`。
`apiFetch` 內部 SHALL 以 `isRefreshing` flag 防止 refresh loop，refresh 期間的其他 401 直接 throw。

#### Scenario: Refresh 成功
- **WHEN** 帶有效 refreshToken 請求 /api/auth/refresh
- **THEN** 取得新 accessToken 並更新 SecureStore，原始請求重試一次

#### Scenario: Refresh 失敗（refresh token 過期）
- **WHEN** refreshToken 也已過期
- **THEN** 呼叫 clearSession，throw SessionExpiredError，app 導向登入畫面
