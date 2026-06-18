## MODIFIED Requirements

### Requirement: 個人資料編輯
設定頁 SHALL 允許編輯個人資料：顯示名稱、頭像、生日、時區與既有欄位。個人資料 SHALL 透過 GET `/api/user/me` 取得（`useProfile` → apiFetch + Zod schema）。儲存 SHALL 呼叫 PUT `/api/user/me`（`useUpdateProfile` → apiFetch 加密）。語系更新 SHALL 呼叫 PUT `/api/user/language`（`useUpdateLanguage`）。頭像更換提供選圖 UI，實際上傳仍為 stub（`// TODO: implement file upload`）。

#### Scenario: 取得個人資料
- **WHEN** 設定頁載入
- **THEN** GET /api/user/me 回傳使用者資料，呈現於畫面

#### Scenario: 更換頭像
- **WHEN** 使用者選新圖片並儲存
- **THEN** 個人資料頭像更新為預覽圖（上傳為 stub）

#### Scenario: 設定生日
- **WHEN** 使用者以 DatePicker 選生日並儲存
- **THEN** PUT /api/user/me 送出更新，onSuccess invalidate profile query，畫面呈現新生日

#### Scenario: 設定時區
- **WHEN** 使用者選時區並儲存
- **THEN** PUT /api/user/me 送出更新，onSuccess invalidate profile query

### Requirement: 語系切換
設定頁 SHALL 允許切換介面語系（en / zh-Hant / zh-Hans），選定後即時套用（`i18n.changeLanguage`）並呼叫 PUT `/api/user/language` 持久化至後端。

#### Scenario: 切換語系
- **WHEN** 使用者選擇另一語系
- **THEN** 介面文字即時切換，PUT /api/user/language 在背景送出更新

### Requirement: 密碼變更
設定頁 SHALL 提供密碼變更表單（舊密碼、新密碼、確認新密碼），以 Zod 驗證（新密碼長度、兩次一致），提交 SHALL 呼叫 POST `/api/auth/change-password`（apiFetch 加密）。

#### Scenario: 新密碼不一致
- **WHEN** 新密碼與確認不一致
- **THEN** 顯示一致性錯誤，不提交

#### Scenario: 變更成功
- **WHEN** 通過驗證並提交，後端回傳 200
- **THEN** 顯示成功 notify 並關閉表單
