## MODIFIED Requirements

### Requirement: 登入畫面
App SHALL 提供登入畫面，含 Email 與密碼欄位，使用 React Hook Form + Zod 驗證。送出後執行完整加密登入流程：key exchange → 加密 payload → POST /api/auth/login → 解析 Set-Cookie → 存入 SecureStore → 翻 `isAuthenticated` → 導入 `(tabs)`。

登入畫面 SHALL 整合 Register tab，以「Login / Register」animated tab bar 呈現（底部滑動線動畫），使用者在同一畫面內切換，不需額外 navigation 跳轉。

登入畫面頂部 SHALL 顯示 mascot 圖示（squat.gif 或備援 PNG）與 BrandLabel，不顯示「歡迎回來」或任何大標題文字。所有文案 SHALL 對齊 web `entry` i18n namespace 的對應 key。

#### Scenario: 欄位驗證
- **WHEN** Email 格式錯誤或密碼為空即送出
- **THEN** 顯示對應欄位錯誤訊息（i18n），不進行登入，且欄位不發生 layout shift

#### Scenario: 登入成功（真實 API）
- **WHEN** 通過驗證並送出，後端回傳 HTTP 200 + `{success: true}`
- **THEN** 解析 Set-Cookie 存入 SecureStore（accessToken、refreshToken、sharedSecret），設定已登入狀態並導向 `(tabs)`

#### Scenario: 登入失敗回饋一致
- **WHEN** 後端回傳 401（帳號不存在或密碼錯誤）
- **THEN** 顯示統一的「Email 或密碼不正確」i18n 文案，不透露帳號是否存在

#### Scenario: 切換至 Register tab
- **WHEN** 使用者點擊「Register」tab
- **THEN** 同一畫面內以動畫切換至 Register 表單，mascot 與 BrandLabel 保持顯示

### Requirement: 註冊畫面
App SHALL 在登入進入點的 Register tab 中提供 Email、密碼、確認密碼、暱稱欄位，以 Zod 驗證（含密碼一致與強度規則）。送出後執行與登入相同的 key exchange + 加密流程，POST /api/auth/register。`(auth)/register.tsx` 路由 SHALL 改為 redirect 到 `(auth)/login`，以保留路由相容性。

#### Scenario: 密碼不一致
- **WHEN** 密碼與確認密碼不同
- **THEN** 顯示一致性錯誤，不送出，且欄位不發生 layout shift

#### Scenario: 從外部 deep link 進入 /register
- **WHEN** 應用程式收到指向 /register 的 deep link
- **THEN** 導向 Login 畫面並自動切換至 Register tab

#### Scenario: 註冊成功
- **WHEN** 後端回傳 HTTP 200 + `{success: true}`
- **THEN** 解析 Set-Cookie 存入 SecureStore，直接導向 `(tabs)`（不需再次登入）

### Requirement: 忘記密碼與重設密碼畫面
App SHALL 提供忘記密碼（POST /api/auth/reset-password/request，加密 payload）與重設密碼（POST /api/auth/reset-password/confirm，加密 payload）兩個畫面。忘記密碼回饋 SHALL 不透露帳號是否存在。重設密碼需要 URL token（deep link：`trace://reset-password?token=...`）。

#### Scenario: 請求重設
- **WHEN** 於忘記密碼畫面送出 Email
- **THEN** 顯示「若此 Email 已註冊，將收到重設信」的一致性 i18n 文案，無論帳號存在與否

#### Scenario: 重設密碼成功
- **WHEN** 以正確 token 與新密碼送出重設請求
- **THEN** 後端回傳 200，顯示成功通知，自動導向登入

### Requirement: Session 與登出
App SHALL 將 token 集中於 `@/lib/auth/token-storage`（secure-store），登入狀態存於 Redux auth slice。登出 SHALL 呼叫 DELETE /api/auth/logout（加密 body：`{nonce, timestamp, ip}`），清除 SecureStore 三個 key、清空 React Query 快取並導回登入。

#### Scenario: 登出清除狀態
- **WHEN** 使用者登出
- **THEN** 呼叫 DELETE /api/auth/logout，accessToken、refreshToken、sharedSecret 從 SecureStore 移除，React Query 快取清空，導向登入畫面

#### Scenario: 登出 API 失敗時仍清除本地狀態
- **WHEN** DELETE /api/auth/logout 回傳 4xx/5xx
- **THEN** 仍清除本地 SecureStore 與 React Query 快取，導向登入（不阻塞使用者登出）

### Requirement: Auth Bootstrap
App SHALL 在啟動時驗證 stored token 有效性。`useAuthBootstrap` SHALL GET /api/user/me（需 Cookie header），成功（200）→ auth state = `'authenticated'`，401 → 自動 refresh 重試，refresh 失敗 → auth state = `'unauthenticated'`。SecureStore 無 token → 直接 `'unauthenticated'`（不打 API）。

#### Scenario: 有效 token
- **WHEN** SecureStore 有三個 token 且 GET /api/user/me 回傳 200
- **THEN** auth state 設為 `'authenticated'`，app 直接進 `(tabs)`

#### Scenario: Token 過期但 refresh 成功
- **WHEN** GET /api/user/me 回傳 401，refresh 成功
- **THEN** 以新 token 重試 GET /api/user/me，成功後 auth state = `'authenticated'`

#### Scenario: 所有 token 失效
- **WHEN** GET /api/user/me 401 且 refresh 也 401
- **THEN** clearSession，auth state = `'unauthenticated'`，導向登入
