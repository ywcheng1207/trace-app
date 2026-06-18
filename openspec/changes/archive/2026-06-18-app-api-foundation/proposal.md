## Why

trace-app 目前所有資料存取皆為 mock，無法與真實的 trace 後端（Vercel）通訊。為使 app 能真正上線，必須實作完整的加密通訊層，對齊 trace 後端的 XChaCha20-Poly1305 + X25519 ECDH 加密協議，並建立正確的 session 管理（cookie 模擬）與 JWT token 刷新機制。

## What Changes

- **新增 crypto 模組**（`src/lib/crypto/`）：libsodium-wrappers 初始化、XChaCha20-Poly1305 加解密、X25519 DH key exchange、BLAKE2b fingerprint、Ed25519 簽章驗證
- **新增 session 管理**（`src/lib/auth/session.ts`）：key exchange 流程（GET /api/control → verify → derive shared secret）、cookie header 構造、session 持久化
- **擴充 token storage**：在既有 accessToken 之外，新增 refreshToken 與 sharedSecret 的 SecureStore 存取
- **重寫 apiFetch**（`src/lib/api/api-fetch.ts`）：Cookie header 附帶、POST/PUT/DELETE 加密 body、response 解密、401 自動 token refresh + 重試、Zod schema 驗證
- **重寫 auth hooks**（`useLogin`、`useRegister`、`useLogout`、`useAuthBootstrap`、`useRequestPasswordReset`、`useResetPassword`、`useChangePassword`）：全部替換 mock，串接真實 API 端點
- **移除所有 auth mock 檔案**
- **安裝套件**：`libsodium-wrappers` ^0.7.15 + `@types/libsodium-wrappers`
- **環境設定**：`EXPO_PUBLIC_API_BASE_URL`、`EXPO_PUBLIC_SIGNING_PUBKEY`（Ed25519 signing key 驗證用）

## Capabilities

### New Capabilities

- `app-crypto`: XChaCha20-Poly1305 加解密、X25519 DH key exchange、BLAKE2b fingerprint、Ed25519 signature verify；所有 crypto 操作封裝於 `src/lib/crypto/`
- `app-session`: key exchange 流程（GET /api/control → 驗證 → 派生 shared secret）、session 持久化（SecureStore）、Cookie header 構造、401 自動 refresh 流程

### Modified Capabilities

- `app-auth`: 登入/註冊/登出/密碼重設 hooks 從 mock 改為真實加密 API 呼叫；useAuthBootstrap 改為 token 有效性驗證；**BREAKING** apiFetch 回傳型別從 `ApiResponse<T>` 改為直接 throw-on-error，hooks 需對應調整

## Impact

- **新增依賴**：`libsodium-wrappers`（asm.js，無 native build 需求）
- **Vercel 後端**：無需任何修改（cookie simulation 透過手動 Cookie header，native 環境無 CORS 限制，Set-Cookie 在 RN fetch 可直接讀取）
- **expo-secure-store**：三個 key（accessToken、refreshToken、sharedSecret），web dev fallback 走 AsyncStorage
- **React Query query cache**：auth 相關 query keys 不變；apiFetch 介面改變後，feature hooks（下一個 change：app-api-features）需逐一更新
- **型別**：`src/types/api.ts` 的 `ApiResponse<T>` wrapper 廢棄；decrypted response 解構 `{ok, code, message, ...data}` 由 apiFetch 內部處理，呼叫端只拿 `T`
