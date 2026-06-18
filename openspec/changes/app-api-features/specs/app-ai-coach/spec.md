## MODIFIED Requirements

### Requirement: AI 訓練建議
AI Coach 功能 SHALL 透過 POST `/api/ai-coach`（`useAiCoach`，apiFetch 加密）取得個人化訓練建議。達每日額度上限（後端 429）SHALL 顯示「今日 AI 建議已達上限」i18n 文案。

#### Scenario: 取得 AI 訓練建議
- **WHEN** 使用者在 AI Coach 頁面請求建議
- **THEN** POST /api/ai-coach 送出，回傳建議內容顯示於畫面

#### Scenario: 每日額度已達上限
- **WHEN** 後端回傳 429（ApiError）
- **THEN** 顯示「今日 AI 建議已達上限，請明天再試」i18n 文案

### Requirement: 動作 AI 建議
動作詳情頁的 AI 建議入口 SHALL 呼叫 POST `/api/exercises/[id]/ai-advice`（`useAiAdvice`，apiFetch 加密）取得針對特定動作的 AI 建議。

#### Scenario: 取得動作 AI 建議
- **WHEN** 使用者在動作詳情頁點擊 AI 建議入口
- **THEN** POST /api/exercises/[id]/ai-advice 送出，回傳建議顯示於 sheet 或詳情區塊
