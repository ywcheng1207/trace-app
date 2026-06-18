## MODIFIED Requirements

### Requirement: 訓練模板
訓練模板 SHALL 透過 GET `/api/training-templates`（`useTrainingTemplates`，apiFetch，`staleTime: 1000 * 60 * 10`）取得列表。套用模板 SHALL 呼叫 POST `/api/training-plans/from-template`（`useCreateFromTemplate`，apiFetch 加密，body 含 templateId + date）。onSuccess SHALL invalidate training plans + month summary queries。

#### Scenario: 取得模板列表
- **WHEN** 使用者開啟模板選擇介面
- **THEN** GET /api/training-templates 回傳模板列表顯示

#### Scenario: 套用模板
- **WHEN** 使用者選定模板並套用至某日
- **THEN** POST /api/training-plans/from-template 送出，onSuccess invalidate schedule queries，當日計畫更新
