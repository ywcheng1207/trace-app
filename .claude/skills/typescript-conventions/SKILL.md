---
name: typescript-conventions
description: TypeScript conventions for trace-app (React Native / Expo) — API contract types via Zod (no Prisma), Zod schema patterns, type strictness rules, and API response types. Use when defining types, creating Zod schemas, or shaping API request/response data.
---

# TypeScript Conventions

## API Contract Types（無 Prisma）

> **與 web 端最大差異：app 不連 DB、無 Prisma**。所有「資料結構型別」來源是後端 API 契約。

- 禁止手寫對應後端回應的 `interface` / `type`，改用 **Zod schema + `z.infer`** 推導
- 同一份 schema 同時負責「執行期驗證」與「靜態型別」，單一事實來源
- 含關聯（巢狀物件）的回應，用組合 schema 表達，型別用 `Full` 前綴命名
- API schema 集中收攏（例如 `@/lib/api/schemas/*` 或對應 feature 目錄），跨頁面共用

```ts
const trainingPlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  exercises: z.array(exerciseSchema),
})
export type FullTrainingPlan = z.infer<typeof trainingPlanSchema>
```

## Zod & Validation

- API Request Body 與表單 Payload 必須使用 Zod Schema 定義
- 透過 `z.infer<typeof schema>` 自動產生 TypeScript 型別，禁止手動重複定義
- 從外部進入的資料（API 回應、deep link 參數、`AsyncStorage` 讀回、推播 payload）為 `unknown`，**必須先 `safeParse` 收窄**才可使用

```ts
const result = createUserSchema.safeParse(data)
if (!result.success) return // 處理錯誤
const { name, email } = result.data // 強型別
```

## Type Strictness

- **Union > Enum**：狀態一律優先使用字串 Union（`'ACTIVE' | 'INACTIVE'`），避免 Enum 在 runtime 的額外負擔與 Zod 轉換問題
- **禁止 Non-null Assertion（`!`）**：一律透過邏輯排除 `null`（`if (!data) return`）
- **禁止硬轉型（`as`）**：除非處理不支援 Generics 的第三方套件；應透過 Zod 驗證或正確泛型傳遞來取得型別
- **禁止 `any`**：`unknown` 須經 Zod 或型別守衛收窄後使用；元件 Props 禁止 `any`
- **善用 Utility Types**：編輯表單型別通常是 `Partial<T>` 或 `Omit<T, 'id'>`
- 事件回呼 Props 命名規則為 `onXXX`，型別明確標注（RN 事件如 `onPress?: () => void`）

## API Response

統一使用泛型結構（定義於 `@/types/api`）：

```ts
type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}
```

- 成功時 `success: true`，回傳 `data`
- 失敗時 `success: false`，提供 `error` 字串供前端 `notify`
- client 端不直接信任後端任何欄位型別，回應 `data` 經 Zod schema 驗證後再使用

## Type Lifecycle

| 階段 | 來源 |
|------|------|
| 定義期 | Zod Schema（API 契約 / Form）→ 自動產生型別 |
| 傳輸期 | `z.infer` 型別貫穿 API 請求與回應 |
| 渲染期 | 驗證後的強型別資料傳入元件，確保關聯欄位完全符合預期 |
