## Context

trace-app 目前所有功能 hook 均回傳假資料（mock）。trace 後端部署在 Vercel，使用自製的 XChaCha20-Poly1305 + X25519 ECDH 加密協議（`lib/crypto/`）。app 若要連上真實後端，必須在 RN 側完整複製這套加密協議，並模擬瀏覽器 Cookie 行為（後端以 `httpOnly Cookie` 維持 session）。

目前 app 缺少：
1. crypto 原語（libsodium）
2. key exchange 流程（X25519 + Ed25519 verify）
3. session 持久化（accessToken / refreshToken / sharedSecret）
4. 加密 request body / 解密 response
5. Cookie header 手動構造

## Goals / Non-Goals

**Goals:**
- 與 trace 後端完成完整的加密握手（key exchange → derive shared secret）
- 支援所有 auth 流程：login, register, logout, refresh, forgot/reset/change password
- 重寫 apiFetch：Cookie header 附帶、POST/PUT/DELETE 加密、response 解密、401 自動 refresh 重試
- 在 Expo SDK 56（Hermes JS engine）安全執行 libsodium-wrappers（asm.js build）
- 建立三 key 的 SecureStore 層：accessToken、refreshToken、sharedSecret

**Non-Goals:**
- 不修改 trace 後端（本次無任何後端改動）
- 不實作 feature hooks（留給 app-api-features change）
- 不實作 biometrics、certificate pinning、custom TLS
- 不支援 web 端（Expo web）的 crypto（目前無此需求）

## Decisions

### D1：選用 libsodium-wrappers（asm.js）而非 react-native-sodium

`react-native-sodium` 需要 native build（EAS Build），在 Expo Go / simulator 無法運作，且維護不活躍。
`libsodium-wrappers` 為官方 JS binding（asm.js），在 Hermes 可正常執行，與 trace 後端已使用的相同套件，免除版本對齊問題。

**決定：`libsodium-wrappers` ^0.7.15 + `@types/libsodium-wrappers`**

使用 pattern：
```ts
import _sodium from 'libsodium-wrappers'
let sodium: typeof _sodium | null = null
export async function cryptoReady() {
  if (sodium) return sodium
  await _sodium.ready
  sodium = _sodium
  return sodium
}
```
sodium.ready 為 promise，必須在首次使用前 await，之後 singleton 即可。

---

### D2：key exchange 時機 — 每次 login/register 執行，不快取 keypair

server keypair 每次 `/api/control` 請求都會重新生成，app 也每次生成新的 frontendKeyPair。
shared secret 的來源不同於 session，是 ECDH 結果，login 完後只需存 `sharedSecret`（後端亦存 shared_secret cookie）。

**決定：每次 login/register 都完整執行 key exchange，完成後只保留 sharedSecret**

---

### D3：Cookie 模擬策略 — 手動 Cookie header，不用 cookie-jar library

iOS/Android native fetch 不會自動傳送 httpOnly cookie。必須手動讀取 Set-Cookie 並在後續請求帶 Cookie header。
`tough-cookie` / `axios-cookiejar-support` 在 RN 有 compatibility 問題（path module、node built-in 依賴）。

**決定：自行解析 Set-Cookie，3 個 key 存 SecureStore，每次請求手動組 Cookie header**

Set-Cookie 解析：
```ts
// response.headers.get('set-cookie') 在 RN 回傳合併字串
// 格式：accessToken=<jwt>; Path=/; ..., refreshToken=<token>; Path=/; ...
function parseSetCookies(raw: string): Record<string, string> {
  return raw.split(', ').reduce((acc, chunk) => {
    const [nameVal] = chunk.split('; ')
    const idx = nameVal.indexOf('=')
    acc[nameVal.slice(0, idx)] = nameVal.slice(idx + 1)
    return acc
  }, {} as Record<string, string>)
}
```

---

### D4：apiFetch 新介面 — throw-on-error，回傳 `T`

舊 `ApiResponse<T>` wrapper 讓呼叫端需要每次 `if (!res.success)` 判斷。
React Query 的 `useMutation.onError` / `useQuery.onError` 設計正是對應 throw 的模式。

**決定：apiFetch 直接回傳 `T`，遇錯誤 throw `ApiError extends Error`**

```ts
class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public rawCode?: string,
  ) { super(message) }
}

async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T>
```

解密後的 payload 結構：`{ok: boolean, code: number, message: string, ...data}`
若 `ok === false`，throw `ApiError(code, message)`。

---

### D5：Ed25519 SPKI 公鑰處理 — 截去 12-byte header 得 raw 32 bytes

後端 `NEXT_PUBLIC_SIGNING_PUBKEY` 為 SPKI base64（44 chars）。
libsodium `crypto_sign_verify_detached` 需要 raw 32-byte key。
SPKI 格式 = 12-byte header + 32-byte raw key，固定偏移：

```ts
const spkiBytes = sodium.from_base64(signingPubKeyB64)
const rawKey = spkiBytes.slice(12) // 固定 12-byte SPKI header
```

**決定：在 session.ts 的 verifyServerKey 中固定 slice(12)，不做動態 ASN.1 解析**

---

### D6：401 自動 refresh — 最多一次重試

401 → refresh → 重試邏輯在 apiFetch 內封裝，避免每個 hook 重複處理。
防止 refresh loop：用 `isRefreshing` flag；refresh 本身失敗（401）→ clearSession + 導向 login。

```
apiFetch → 401 response
  → isRefreshing? throw (避免 loop)
  : isRefreshing = true → GET /api/auth/refresh (帶 Cookie)
    → 200: 解析新 accessToken, storeTokens → isRefreshing = false → retry once
    → 401: clearSession → throw SessionExpiredError → app 導向 login
```

---

### D7：useAuthBootstrap — 以 GET /api/user/me 驗 token 有效性

啟動時需判斷 stored token 是否有效（不能只看 SecureStore 有無值，JWT 可能過期）。
`GET /api/user/me` 是最輕量的 authenticated endpoint，回傳 `{id, email}`。
若 401 → refresh 重試，重試失敗 → state = 'unauthenticated'。
成功 → state = 'authenticated'，同時 prefetch profile。

---

### D8：login 回應特殊處理 — 非加密 plaintext JSON

後端 login/register 成功的 HTTP 200 body 是 plaintext `{success: true, isBanned: false}`，**不是** `{ciphertext: ...}`。
apiFetch 需區分：若 response body 含 `ciphertext` key → 走解密路徑，否則直接解析 JSON。
auth endpoints 的 session cookie 從 `Set-Cookie` header 讀取。

## Risks / Trade-offs

**[libsodium-wrappers asm.js bundle 大小 ~300KB]**
→ 接受：crypto 安全性優先，且只 import 一次；tree-shaking 對 asm.js 無效，但可用 dynamic import 延後載入。

**[sodium.ready 必須 await — app 啟動時機]**
→ 在 App providers 層於 PersistGate 之前 await sodium.ready；若未初始化就呼叫 crypto → throw 明確的 CryptoNotInitializedError。

**[Set-Cookie 在 Expo web 模式無法讀取（browser 安全限制）]**
→ 接受：本次 Non-Goal，Expo web 不在支援範圍。

**[X25519 + XChaCha20-Poly1305 相較 TLS 非標準]**
→ 非本次設計範圍，後端已定型。

**[apiFetch 介面 BREAKING change]**
→ 因 feature hooks 全為 mock，統一在本 change + app-api-features 一起換，不存在 backward compat 需求。

## Migration Plan

1. 安裝 libsodium-wrappers，更新 package.json（不破壞現有 build）
2. 新增 `src/lib/crypto/` 模組（純新增，不動既有檔案）
3. 擴充 token-storage.ts（加新 function，不刪舊的）
4. 新增 session.ts（純新增）
5. **重寫** apiFetch（此步驟後，所有呼叫 apiFetch 的 mock hooks 會 type-error，需一起修）
6. 重寫 auth hooks（login/register/logout/bootstrap → 真實 API）
7. 確認 auth flow E2E 通過（login → me → logout）
8. app-api-features change 接手重寫 feature hooks

Rollback：全部在 feature branch `feature/app-api-integration`，未 merge 前不影響 main。

## Open Questions

- **register endpoint 加密 payload 需要 key exchange 嗎？** 是，與 login 流程完全一致（POST /api/auth/register，加密 body）。
- **token-refresh endpoint 的加密 payload 格式？** `GET /api/auth/refresh` 使用 `handleGetRequest`（不加密 body），只帶 Cookie header 即可。
- **sharedSecret 是否在 refresh 後更新？** 否，sharedSecret 來自 key exchange 時的 ECDH，refresh 只換 accessToken。sharedSecret 維持到 logout 或下次 login。
