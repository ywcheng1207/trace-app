## REMOVED Requirements

### Requirement: 身體數值欄位偏好（Setting 頁）

**Reason**: 欄位偏好設定已移至統計頁（`app-statistics`），統計頁的 `MetricPreferencesSheet` 提供相同功能且位置更符合使用流程（使用者在查看統計時才需要調整顯示欄位）。偏好資料仍存於 `profile.hiddenMetrics`，只有 UI 入口改變。

**Migration**: Setting 頁移除 `metric_preferences` section（含 section header、hint 文字、所有 Switch 列表及對應 `BODY_METRIC_GROUPS` 迭代）。使用者若在 Setting 頁找不到此設定，引導至統計頁操作（可考慮在 Setting 頁加一個「前往統計頁調整」的連結列，但非必要）。對應 i18n key（`metric_preferences`、`metric_preferences_desc`）保留（統計頁 Sheet 會複用），不從 JSON 刪除。
