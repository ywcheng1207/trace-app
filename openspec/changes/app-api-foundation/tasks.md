## 1. 套件安裝與環境設定

- [ ] 1.1 安裝 `libsodium-wrappers` ^0.7.15 與 `@types/libsodium-wrappers`，更新 `package.json` + `package-lock.json`
- [ ] 1.2 在 `app.config.ts`（或 `app.json`）的 `extra` / `EXPO_PUBLIC_` 加入 `EXPO_PUBLIC_API_BASE_URL` 與 `EXPO_PUBLIC_SIGNING_PUBKEY` 兩個環境變數宣告
- [ ] 1.3 新增 `.env.local.example`，記錄兩個 env var 的格式說明與取值方式（SPKI base64 公鑰）
- [ ] 1.4 在 `token-storage.ts` 加入 `Platform.OS === 'web'` 判斷：web 環境 fallback 至 `AsyncStorage`，native 用 `expo-secure-store`
- [ ] 1.5 建立 `.env.local`（`EXPO_PUBLIC_API_BASE_URL=https://trace-beta-seven.vercel.app`、`EXPO_PUBLIC_SIGNING_PUBKEY=<SPKI>`），確認本機開發可直連 Vercel production
- [ ] 1.6 建立 `eas.json`，在 `production` / `preview` profile 的 `env` 區塊加入兩個 env var

## 2. Crypto 模組（src/lib/crypto/）

- [ ] 2.1 新增 `src/lib/crypto/sodium.ts`：`cryptoReady()` singleton，await `sodium.ready` 後快取並回傳；定義 `CryptoNotInitializedError`
- [ ] 2.2 新增 `src/lib/crypto/encryption.ts`：`encryptPayload(plaintext, sharedSecret)` — BLAKE2b-32 key derivation → 24-byte nonce → XChaCha20-Poly1305 encrypt → `"<b64nonce>.<b64ciphertext>"`
- [ ] 2.3 在 `src/lib/crypto/encryption.ts` 新增 `decryptPayload(ciphertextStr, sharedSecret)` — split `.` → derive key → decrypt → UTF-8 string；定義 `DecryptionError`
- [ ] 2.4 新增 `src/lib/crypto/key-exchange.ts`：`generateKeyPair()` — `crypto_kx_keypair()` 回傳 `{publicKey, privateKey}`
- [ ] 2.5 在 `src/lib/crypto/key-exchange.ts` 新增 `computeSharedSecret(frontendPrivKey, serverPubKey)` — `crypto_scalarmult` 回傳 base64
- [ ] 2.6 在 `src/lib/crypto/key-exchange.ts` 新增 `generateFingerprint(pubKey)` — `crypto_generichash(32, pubKey)` 回傳 base64
- [ ] 2.7 在 `src/lib/crypto/key-exchange.ts` 新增 `verifyServerKey(serverPubKeyB64, signatureB64, signingPubKeySpkiB64)` — SPKI slice(12) → Ed25519 verify + fingerprint 比對；定義 `ServerKeyVerificationError`
- [ ] 2.8 新增 `src/lib/crypto/index.ts`，re-export 所有 crypto 公開函式與 error class

## 3. Token Storage 擴充（src/lib/auth/token-storage.ts）

- [ ] 3.1 在 `token-storage.ts` 加入 `refreshToken` 的 `getRefreshToken` / `setRefreshToken` / `removeRefreshToken`
- [ ] 3.2 在 `token-storage.ts` 加入 `sharedSecret` 的 `getSharedSecret` / `setSharedSecret` / `removeSharedSecret`
- [ ] 3.3 新增 `clearAllTokens()` 一次性清除三個 key（accessToken、refreshToken、sharedSecret）

## 4. Session 管理（src/lib/auth/session.ts）

- [ ] 4.1 新增 `src/lib/auth/session.ts`：`performKeyExchange()` — GET `/api/control` → `verifyServerKey` → `generateKeyPair` → `computeSharedSecret`，回傳 `{sharedSecret, frontendPublicKey, frontendFingerprint}`；定義 `KeyExchangeError`
- [ ] 4.2 在 `session.ts` 新增 `parseSetCookies(rawHeader)` — 解析 Set-Cookie header 字串，回傳 `{accessToken, refreshToken, shared_secret}`；定義 `ParseSetCookiesError`
- [ ] 4.3 在 `session.ts` 新增 `storeSession({accessToken, refreshToken, sharedSecret})` — 呼叫三個 set 函式
- [ ] 4.4 在 `session.ts` 新增 `buildCookieHeader()` — 讀三個 token，組成 `"accessToken=<val>; refreshToken=<val>; shared_secret=<val>"`；定義 `SessionNotFoundError`

## 5. Token Refresh（src/lib/auth/token-refresh.ts）

- [ ] 5.1 新增 `src/lib/auth/token-refresh.ts`：`isRefreshing` module-level flag，`refreshAccessToken()` — GET `/api/auth/refresh`（帶 Cookie header）→ 解析新 accessToken → `setAccessToken`；定義 `SessionExpiredError`
- [ ] 5.2 在 `refreshAccessToken()` 中處理 refresh 失敗（401）：呼叫 `clearAllTokens()`，throw `SessionExpiredError`

## 6. apiFetch 重寫（src/lib/api/api-fetch.ts）

- [ ] 6.1 定義 `ApiError extends Error`（含 `code: number`、`rawCode?: string`）與 `ApiFetchOptions`（含 `method?`、`body?`、`schema?: ZodSchema<T>`）於 `src/lib/api/api-fetch.ts`
- [ ] 6.2 實作 `apiFetch<T>(path, options?)` 核心邏輯：`buildCookieHeader()` → GET 不加密、POST/PUT/DELETE 以 `encryptPayload` 加密 body（含 nonce、timestamp、ip: "0.0.0.0"）
- [ ] 6.3 在 `apiFetch` 中實作 response 解密：若 body 含 `ciphertext` key → `decryptPayload` → JSON.parse；否則直接 JSON.parse
- [ ] 6.4 在 `apiFetch` 中實作 ok 判斷：`ok === false` → throw `ApiError(code, message)`
- [ ] 6.5 在 `apiFetch` 中實作 401 自動 refresh + 一次重試邏輯（引用 `refreshAccessToken`，利用 `isRefreshing` flag 防 loop）
- [ ] 6.6 在 `apiFetch` 中實作 schema 驗證：若 options 有 `schema`，以 `schema.parse()` 驗證解密後資料

## 7. Auth Hooks 重寫（src/features/auth/api/hooks.ts）

- [ ] 7.1 重寫 `useLogin`：呼叫 `performKeyExchange` → 加密 payload（identifier、password、nonce uuid、timestamp、ip、language）→ POST `/api/auth/login`（apiFetch，不走解密：login response 是 plaintext）→ 解析 Set-Cookie → `storeSession` → dispatch auth state
- [ ] 7.2 重寫 `useRegister`：與 login 流程相同，加密 payload 多 `displayName`，POST `/api/auth/register`
- [ ] 7.3 重寫 `useLogout`：DELETE `/api/auth/logout`（apiFetch 帶加密 body `{nonce, timestamp, ip}`），完成後 `clearAllTokens` + `queryClient.clear()` + 導向 login；API 失敗仍執行本地清除
- [ ] 7.4 重寫 `useAuthBootstrap`：無 token → 直接 dispatch `'unauthenticated'`；有 token → GET `/api/user/me`（apiFetch）→ 成功 dispatch `'authenticated'`，`SessionExpiredError` → dispatch `'unauthenticated'`
- [ ] 7.5 重寫 `useRequestPasswordReset`：POST `/api/auth/reset-password/request`（apiFetch 加密），無論成功/失敗顯示統一文案（不透露帳號存在）
- [ ] 7.6 重寫 `useResetPassword`：POST `/api/auth/reset-password/confirm`（apiFetch 加密，帶 URL token + 新密碼）
- [ ] 7.7 重寫 `useChangePassword`：POST `/api/auth/change-password`（apiFetch 加密，帶 oldPassword + newPassword）

## 8. App 啟動整合

- [ ] 8.1 在 `src/providers/app-providers.tsx` 加入 sodium init：在 PersistGate 前以 `useEffect` 呼叫 `cryptoReady()`，確保 crypto 在任何 API 呼叫前就緒
- [ ] 8.2 確認 `SessionExpiredError` 被捕捉後能正確清 session 並導向 login（於 app-providers 或 auth bootstrap 層）

## 9. 清理

- [ ] 9.1 刪除 `src/features/auth/api/mock.ts`（或等同的 mock login/register 函式檔案）
- [ ] 9.2 移除所有 auth hooks 中的 `// TODO: apiFetch` 標記（已替換為真實呼叫）
- [ ] 9.3 更新 `src/types/api.ts`：移除舊 `ApiResponse<T>` wrapper type（若其他地方有引用，一併替換）

## 10. 驗證

- [ ] 10.1 E2E 流程驗證：登入（useLogin）→ GET /api/user/me → 登出（useLogout），確認 SecureStore 三 key 正確存取與清除
- [ ] 10.2 驗證 auth bootstrap：重新啟動 app → 有效 token → 直接進 tabs；清除 token → 進 login
- [ ] 10.3 驗證 401 refresh 流程：手動讓 accessToken 過期 → 下次請求自動 refresh → 重試成功
