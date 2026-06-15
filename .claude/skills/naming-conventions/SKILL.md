---
name: naming-conventions
description: Naming conventions for trace-app (React Native / Expo) — variables, booleans, functions, events, components, files (kebab-case per expo-router), TypeScript types, Zod schemas. Use when naming anything.
---

# Naming Conventions

## General Principles

- 命名描述「意圖」而非「實作細節」
- 一律使用英文，禁止拼音或注音
- 避免縮寫（除業界通用：`id`, `err`, `req`, `res`, `ctx`, `ref`）

## Variables

| 類型 | 格式 | 範例 |
|------|------|------|
| 一般變數 | `camelCase` | `userProfile`, `totalCount` |
| 全域常量 | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRY` |
| 布林值 | `is/has/should/can` 前綴 | `isVisible`, `hasToken`, `canEdit` |
| 複雜 UI 顯示邏輯 | `showXXX` | `showDeleteConfirm`, `showSheet` |

## Functions & Events

| 類型 | 格式 | 範例 |
|------|------|------|
| 一般函式 | 動詞開頭 `camelCase` | `validateForm`, `parseDate` |
| 非同步取資料 | `fetchXXX` / `getXXX` | `fetchUserProfile`, `getTrainingList` |
| 事件處理（定義端） | `handleXXX` | `handleSavePress`, `handleSubmit` |
| 事件處理（Props 接收端） | `onXXX` | `onSave`, `onClose`, `onChange` |

> RN 事件多為 `onPress`（非 web 的 `onClick`）；定義端維持 `handleXXX`，傳遞時對應 `onPress={handleSavePress}`。

## Components & Files

> **與 web 端最大差異：檔名一律 `kebab-case`**（expo-router 慣例，現有 code 即如此）。元件「名稱」仍 `PascalCase`。

| 類型 | 格式 | 範例 |
|------|------|------|
| 元件名稱 | `PascalCase` | `TrainingCard`, `UserAvatar`, `ThemedText` |
| 元件檔案 | `kebab-case.tsx` | `training-card.tsx`, `themed-text.tsx` |
| 頁面專屬元件 | 頁面名稱為前綴 | `TrainingPageHeader` → `training-page-header.tsx` |
| 共用元件 | 語意明確，不加頁面前綴 | `StatusBadge` → `status-badge.tsx` |
| Hook 檔案 | `use-xxx.ts`（kebab） | `use-training-list.ts`, `use-theme.ts` |
| Util 檔案 | `kebab-case.ts` | `date-utils.ts`, `format-currency.ts` |
| 平台特化檔 | `name.ios.tsx` / `name.android.tsx` / `name.web.tsx` | `app-tabs.web.tsx` |

### expo-router 路由檔（特例）

路由檔名由 expo-router 約定，**不可改名**：

- `_layout.tsx`（layout）、`index.tsx`（該層首頁）
- 動態路由 `[id].tsx`、catch-all `[...rest].tsx`
- group `(tabs)`、`(auth)`（不影響 URL 的分組目錄）
- `+not-found.tsx`、`+html.tsx`（web）

## TypeScript & Data

| 類型 | 格式 | 範例 |
|------|------|------|
| Interface / Type | `PascalCase` | `UserProfile`, `TrainingPlan` |
| Zod Schema | `camelCase` + `Schema` | `userSchema`, `createTrainingSchema` |
| Request Payload | `PascalCase` + `Request` | `CreateUserRequest`, `UpdatePlanRequest` |
| API 回應型別（含關聯） | `Full` 前綴 | `FullTrainingPlan`, `FullUserProfile` |
| Enum-like Union | `UPPER_SNAKE_CASE` 字串 | `'ACTIVE' \| 'INACTIVE'` |

> 型別來源是後端 API 契約的 zod schema（`z.infer`），非 Prisma（app 不連 DB）。詳見 typescript-conventions。
