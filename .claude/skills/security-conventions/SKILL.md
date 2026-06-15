---
name: security-conventions
description: Security conventions for trace-app (React Native / Expo) — secure token storage, no secrets in the app bundle, input validation, deep link safety, WebView/external link handling, sensitive logging, and HTTPS. Use when handling auth tokens, user input, deep links, storage, or reviewing any client security-sensitive code.
---

# Security Conventions (Mobile Client)

> trace-app 是**前端 App**，威脅模型與 web server 不同。後端的錯誤遮罩 / 帳號列舉 / 限流屬 `trace` server 職責；本檔聚焦 **client 端**該守的事。

---

## 1. Token / 敏感資料儲存

| 儲存方式 | 安全性 | 用途 |
|----------|--------|------|
| `expo-secure-store`（Keychain / Keystore） | 高 | **access token / refresh token / 任何敏感憑證的唯一選擇** |
| `@react-native-async-storage/async-storage` | 低（明文、可被 root/越獄/備份讀取） | 只放**非敏感** UI 偏好（theme / locale），**禁止存 token** |
| Redux / React state | 記憶體，App 關閉即清 | 短暫操作可接受 |

- token 一律 `expo-secure-store`，集中在 `@/lib/auth/token-storage`，禁止散落各處讀寫
- 登出時清空 secure-store 的 token 與 React Query 快取

## 2. App Bundle 內一切皆公開

- **打包進 App 的所有東西（JS bundle、env、常數）使用者都能逆向取得**。不像 web 有 server-only 環境——RN 沒有「只在伺服器」的程式碼
- 禁止把任何密鑰、API secret、第三方私鑰寫進 App（即使不加 `EXPO_PUBLIC_` 前綴也一樣會被打包）
- 需要密鑰的操作（簽章、第三方 API）一律走後端代理，App 只拿短期 token
- `EXPO_PUBLIC_` 前綴的 env 等同公開設定，只放 baseURL 這類非機敏值

## 3. 輸入驗證

- 前端驗證只是 UX，**後端才是真正防線**；但 client 對所有外部輸入仍須驗證
- 從外部進入的資料皆視為 `unknown`，先 Zod `safeParse` 再用：API 回應、deep link 參數、推播 payload、`AsyncStorage`/secure-store 讀回值
- URL / deep link 參數永遠是字串，需顯式轉型 + 範圍檢查

## 4. Deep Link / URL Scheme

- App scheme 為 `traceapp://`（見 `app.json`）。處理 deep link（`expo-linking` / expo-router）時**必須驗證來路與參數**，不可直接拿參數做敏感操作（如自動帶 token 登入、跳轉外部網址）
- 外部連結用 `expo-web-browser` 開啟前，驗證為 `https://` 且網域在白名單內；禁止開啟 `javascript:` 等非預期協定

## 5. WebView / 外部內容

- 若使用 `react-native-webview` 載入外部內容：限制 `originWhitelist`、關閉不需要的 `javaScriptEnabled`、不要把 token 注入 WebView
- RN 無 DOM、無 `dangerouslySetInnerHTML`；若渲染來源不受控的 HTML（未來才有的場景）需先消毒
- 圖片用 `expo-image` 並限制來源網域，禁止無限制載入任意 user-provided URL

## 6. 敏感資料處理 / Logging

- 禁止 `console.log` token、密碼、簽章、完整 API payload（log 可能被 crash 回報 / 第三方 SDK 收集）
- 只記錄非敏感診斷資訊（如 `userId`、錯誤碼）
- 顯示給使用者的錯誤一律通用文案（`notify` + i18n），不透露後端內部結構；登入 / 忘記密碼等回饋對「帳號是否存在」保持一致，避免帳號列舉（client 端配合後端的一致回應）

## 7. 連線 / 傳輸

- 一律 HTTPS；iOS ATS、Android `usesCleartextTraffic=false` 維持預設（不放行明文）
- 高敏感版本可評估 certificate pinning（非 MVP 必要，先記錄）

## 8. 裝置層（選配，記錄待評估）

- 進入敏感畫面可加生物辨識（`expo-local-authentication`）
- 剪貼簿避免長存敏感資料；背景時可遮蔽畫面快照（隱私）

---

## Code Review Checklist

| 項目 | 檢查要點 |
|------|----------|
| Token 儲存 | 是否誤用 `AsyncStorage`/Redux 存 token，未走 `expo-secure-store` |
| Bundle 密鑰 | 是否把 secret / 私鑰打包進 App |
| 輸入驗證 | API 回應 / deep link / storage 讀回是否未經 Zod 收窄就使用 |
| Deep link | scheme 參數是否未驗證直接做敏感操作 |
| 外部連結 | 開啟前是否驗證 `https://` + 網域白名單 |
| Log 安全 | `console.log` 是否含 token / 密碼 / payload |
| 錯誤文案 | 是否洩露後端結構、或對帳號存在與否回應不一致 |
| 傳輸 | 是否放行明文 HTTP |
