## MODIFIED Requirements

### Requirement: 登入畫面

App SHALL 提供登入畫面，含 Email 與密碼欄位，使用 React Hook Form + Zod 驗證。送出後（本階段為 mock）成功時寫入 token 至 `expo-secure-store` 並翻 `isAuthenticated`，導入 `(tabs)`。

登入畫面 SHALL 整合 Register tab，以「Login / Register」animated tab bar 呈現（底部滑動線動畫），使用者在同一畫面內切換，不需額外 navigation 跳轉。

登入畫面頂部 SHALL 顯示 mascot 圖示（squat.gif 或備援 PNG）與 BrandLabel，不顯示「歡迎回來」或任何大標題文字。所有文案 SHALL 對齊 web `entry` i18n namespace 的對應 key。

#### Scenario: 欄位驗證

- **WHEN** Email 格式錯誤或密碼為空即送出
- **THEN** 顯示對應欄位錯誤訊息（i18n），不進行登入，且欄位不發生 layout shift

#### Scenario: 登入成功（mock）

- **WHEN** 通過驗證並送出
- **THEN** 寫入 mock token、設定已登入狀態並導向 `(tabs)`

#### Scenario: 登入失敗回饋一致

- **WHEN** mock 登入失敗
- **THEN** 顯示統一的「Email 或密碼不正確」i18n 文案，不透露帳號是否存在

#### Scenario: 切換至 Register tab

- **WHEN** 使用者點擊「Register」tab
- **THEN** 同一畫面內以動畫切換至 Register 表單，mascot 與 BrandLabel 保持顯示

### Requirement: 註冊畫面

App SHALL 在登入進入點的 Register tab 中提供 Email、密碼、確認密碼、暱稱欄位，以 Zod 驗證（含密碼一致與強度規則），送出為 mock。`(auth)/register.tsx` 路由 SHALL 改為 redirect 到 `(auth)/login`，以保留路由相容性。

#### Scenario: 密碼不一致

- **WHEN** 密碼與確認密碼不同
- **THEN** 顯示一致性錯誤，不送出，且欄位不發生 layout shift

#### Scenario: 從外部 deep link 進入 /register

- **WHEN** 應用程式收到指向 /register 的 deep link
- **THEN** 導向 Login 畫面並自動切換至 Register tab

### Requirement: 忘記密碼與重設密碼畫面

App SHALL 提供忘記密碼（輸入 Email 請求重設）與重設密碼（輸入新密碼）兩個畫面。忘記密碼回饋 SHALL 不透露帳號是否存在。

#### Scenario: 請求重設

- **WHEN** 於忘記密碼畫面送出 Email
- **THEN** 顯示「若此 Email 已註冊，將收到重設信」的一致性 i18n 文案

### Requirement: Session 與登出

App SHALL 將 token 集中於 `@/lib/auth/token-storage`（secure-store），登入狀態存於 Redux UI 狀態。登出 SHALL 清除 token 與 React Query 快取並導回登入。

#### Scenario: 登出清除狀態

- **WHEN** 使用者登出
- **THEN** token 從 secure-store 移除、React Query 快取清空、導向登入畫面
