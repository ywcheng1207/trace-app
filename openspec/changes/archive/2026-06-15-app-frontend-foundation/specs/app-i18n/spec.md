## ADDED Requirements

### Requirement: 多語系與偵測
App SHALL 以 i18next + react-i18next 提供 zh-Hant / zh-Hans / en 三語系，初始語系以 `expo-localization` 偵測裝置語系決定，無對應時 fallback 至 en。

#### Scenario: 依裝置語系初始化
- **WHEN** App 啟動
- **THEN** 介面語系為裝置語系對應的支援語系，否則為 en

### Requirement: Namespace 結構與同步
文字 SHALL 以 namespace 切分（foundation 階段含 main-route / translation / entry / notify），每個 key SHALL 於三語系檔案同步存在。JSX 內 SHALL 透過 `t()` 取字，禁止寫死任一語言字串。

#### Scenario: 新增文字
- **WHEN** 新增任一文字節點
- **THEN** 於 zh-Hant / zh-Hans / en 三檔同步新增該 key，元件以 `t('ns:key')` 引用

#### Scenario: 缺漏 fallback
- **WHEN** 某語系缺少某 key
- **THEN** 顯示 fallback 語系（en）的字串而非 raw key
