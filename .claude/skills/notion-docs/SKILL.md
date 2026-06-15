---
name: notion-docs
description: Notion documentation conventions for trace-app (React Native / Expo) — page structure, tech stack, API client/types, Features/Changelog database schemas, and update SOPs. Use when creating or updating trace-app Notion docs, organizing Feature/Changelog entries, or syncing docs after a release.
---

# Notion Documentation Conventions (trace-app)

## General Principles

- 文件以簡潔、可查詢為首要目標，避免裝飾性文字、不使用 emoji
- 每個頁面只處理一個主題
- 新增功能或變更時，同步更新 Features 與 Changelog，保持文件與程式碼同步
- **trace-app（mobile）與 trace（web）的 Notion 文件分開維護**，避免混淆兩套技術棧

---

## Page Structure（頂層分類）

- Project Overview
- Architecture
- API Client & Types
- Components & Conventions
- i18n
- Deployment（EAS）
- Features（Notion Database）
- Changelog（Notion Database）

頂層索引頁含所有子頁面連結 + 「最後更新」日期表，每次更新內容同步更新日期。

---

## Page: Project Overview

**簡介**：專案定位（trace 的手機 App）、目標用戶、目前階段。

**技術棧**（表格）：

| 層級 | 技術 |
|------|------|
| Framework | Expo SDK 56 + React Native 0.85 |
| Routing | expo-router（file-based, typed routes） |
| Language | TypeScript（strict） |
| Compiler | React Compiler 開啟 |
| Server State | React Query（@tanstack/react-query） |
| Global UI State | Redux Toolkit + react-redux（+ redux-persist） |
| Form | React Hook Form + Zod |
| Styling | StyleSheet + theme token（`src/constants/theme.ts`） |
| Storage | expo-secure-store（敏感）/ AsyncStorage（非敏感） |
| i18n | i18next + react-i18next + expo-localization（zh-Hant / zh-Hans / en） |
| Backend | 消費 `trace` 後端加密 API（純 client） |
| Deployment | EAS Build / Submit / Update（OTA） |

**環境清單**：dev / preview / production 的差異（API baseURL、env、EAS channel）。

**分支策略**：main（release trigger）、feature/* 用途與合併規則。

---

## Page: Architecture

- **資料夾結構**：`src/app`（路由）、`src/components`、`src/hooks`、`src/lib`（api / query / i18n / auth）、`src/store`、`src/constants`、`src/providers`。
- **資料流**：
  ```
  Screen → useQuery/useMutation → apiFetch（@/lib/api）→ trace 後端加密 API
  ```
  說明各層職責（token 附帶、加解密、驗證、回傳）。
- **認證流程**：token 存 `expo-secure-store`，`apiFetch` 取出附帶；加密 / Ed25519 簽章對齊 trace `lib/crypto`；標注 wire format。
- **i18n 架構**：偵測順序 `expo-localization`（裝置）→ 使用者覆寫 → fallback；namespace 拆分方式。
- **導覽架構**：Tabs / Stack layout 樹狀圖。

---

## Page: API Client & Types

> 取代 web 文件的 Prisma ERD 頁（app 不連 DB）。

- `apiFetch` 介面契約：參數、回傳 `ApiResponse<T>`、錯誤處理、token 附帶。
- 各端點以 Notion Database 記錄（端點 / Method / 權限 / 說明 / Request / Response 摘要），僅記界面契約，不記後端實作。
- 型別來源：對應端點的 Zod schema（`z.infer`），列出主要 schema 與其欄位。

---

## Page: Components & Conventions

以 Notion Database 呈現（元件 / 路徑 / 類型 [Component / Form Component / Hook / Provider] / 用途 / 主要 Props 或回傳值）。頁面本體保留命名與設計規範速查。

---

## Page: i18n

- Namespace 對照表（每個 JSON 對應的情境）。
- 新增翻譯 SOP：確認 namespace → 三語系（zh-Hant / zh-Hans / en）同步新增 key → `useTranslation` → `t('key')` → 跨 namespace 用 `t('ns:key')`。
- 禁止事項：JSX 寫死字串、只更新部分語系。

---

## Page: Deployment（EAS）

- **EAS 設定**：`eas.json` 的 build profiles（development / preview / production）、submit 設定。
- **OTA Update**：EAS Update channel 與發佈流程、哪些變更可 OTA、哪些需重新送審。
- **Environment / Config**：

| 變數 | 用途 | 環境 | 備註 |
|------|------|------|------|
| EXPO_PUBLIC_API_BASE_URL | 後端 API baseURL | all | 公開值，會打包進 App |

> 機敏資料禁止進 App bundle（見 security-conventions）。

- **App Store / Play Store**：版本號、build number、送審注意事項。

---

## Page: Features（Notion Database）

欄位：名稱 / User Story / 入口路由（`src/app` 路徑）/ 核心元件 / 子元件 / API 用途說明 / 狀態（規劃中 / 開發中 / 完成）。

Feature 頁面內容含：畫面區塊說明表、API 資料流 code block、狀態管理（query key / form schema / UI state / invalidate 時機）。

---

## Page: Changelog（Notion Database）

欄位：Commit（短 hash + 摘要）/ 日期 / 類型（feat / fix / refactor / chore / docs）/ 說明 / Branch / GitHub 連結。

每次 push 或 merge 後，以有意義的功能節點為單位整理進 Database。Changelog 頁面內容含「改動檔案」表與「主要改動」分段（問題背景 / 前後對比 / 影響範圍）。
