## ADDED Requirements

### Requirement: 通知佇列與 Toast

系統 SHALL 以 redux 佇列管理即時通知，Toast 可同時堆疊多則並自動消失。Toast 視覺 SHALL 對齊 web：型別圖示（success / error / warning / info）、標題 + 內文、品牌橘 accent、關閉鈕、滑入動畫。

#### Scenario: 推送通知
- **WHEN** 任一操作呼叫 `showNotification`（含 type / message，選填 title / actionPath）
- **THEN** Toast 以對應型別圖示與配色滑入顯示

#### Scenario: 多則堆疊
- **WHEN** 短時間內推送多則通知
- **THEN** Toast 垂直堆疊（同時顯示上限內），其餘排隊

#### Scenario: 自動消失與暫停
- **WHEN** 通知顯示
- **THEN** 數秒後自動消失；觸控/hover 時暫停計時，放開後續計

### Requirement: 通知中心與前端輪詢

系統 SHALL 提供通知中心顯示系統通知（如 AI 分析完成），資料由 React Query 以 `refetchInterval` 輪詢（mock），串接點標 `// TODO: apiFetch`。

#### Scenario: 查看通知中心
- **WHEN** 使用者點 bell 圖示
- **THEN** 顯示系統通知列表（已讀 / 未讀），未讀有紅點提示

#### Scenario: 點選通知
- **WHEN** 使用者點某則通知
- **THEN** 標為已讀並導向其 `actionPath`（若有）

#### Scenario: 輪詢更新
- **WHEN** 輪詢間隔到達
- **THEN** 通知列表（mock）刷新，新通知反映未讀數
