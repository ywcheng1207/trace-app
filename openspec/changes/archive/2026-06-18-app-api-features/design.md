## Context

本 change 是 `app-api-foundation` 的延伸，foundation 已提供 `apiFetch`（加密 POST、Cookie header、解密 response、401 retry）。此 change 目標：將所有 feature hooks 的 mock 替換為真實 apiFetch 呼叫，同時確保 Zod schema 與後端實際回應對齊。

## Goals / Non-Goals

**Goals:**
- 7 個 feature 模組（profile、exercises、schedule、statistics、ai-coach、notifications、training-templates）的所有 hooks 改為真實 API
- 每個 hook 的 Zod schema 對齊後端 trace 的實際 response 結構
- 刪除所有 `api/mock.ts` 檔案
- 確保 React Query query key、staleTime、invalidation 邏輯正確

**Non-Goals:**
- file upload（頭像上傳、exercise video）— 留 stub
- 後端 API 改動
- 新 UI 功能

## Decisions

### D1：所有 hook 統一換成 apiFetch，schema.parse 取代 mock 回傳

每個 feature hooks.ts 的 queryFn/mutationFn 直接呼叫 `apiFetch<z.infer<typeof schema>>`（含 schema 參數），React Query 的 onError 接收 ApiError。

```ts
const { data } = useQuery({
  queryKey: QUERY_KEYS.profile(),
  queryFn: () => apiFetch('/api/user/me', { schema: profileSchema }),
  staleTime: 1000 * 60 * 5,
})
```

### D2：後端 response 欄位命名策略

trace 後端 Prisma 欄位以 snake_case 命名（如 `display_name`、`birth_date`），但 API response 經 JSON.stringify 後仍為 snake_case，除非後端有轉換。
**決定**：對齊後端實際回傳（snake_case），在 Zod schema 中用 snake_case key，前端元件存取時在 hook 內以 `transform` 轉為 camelCase，或直接在 schema 中定義 camelCase output via `.transform()`。若發現後端已回傳 camelCase 則直接用 camelCase schema。

### D3：mutation 的 optimistic update

本次不實作 optimistic update（複雜度 vs. 收益不符），使用標準的 `onSuccess → queryClient.invalidateQueries` 模式。

### D4：schedule session 的「進行中」session 狀態

後端的 training session 有 `status: 'IN_PROGRESS' | 'COMPLETED'` 等狀態，由 POST /api/sessions（start）與 PUT /api/sessions/[id]/complete 控制。app 需要取得「今天進行中的 session」，通過 GET /api/sessions?date=yyyy-MM-dd 篩選。

### D5：AI Coach rate limiting 處理

後端已有每日額度（`AI_COACH_DAILY_LIMIT`），超限回 429 + ApiError。
App 層：onError 顯示 i18n 的「今日 AI 建議已達上限」文案，不需特別處理 429 vs 其他錯誤（apiFetch 統一 throw ApiError）。

## Risks / Trade-offs

**[後端實際 response schema 可能與 mock 不一致]**
→ 需要實際呼叫一次後端確認欄位。在 apply phase 串接前先以 `console.log` 印出 raw response 確認，再完成 Zod schema。

**[部分 mock 資料比後端回傳多欄位（AI coach 等）]**
→ Zod 的 `.strip()` 預設行為會丟棄多餘欄位，不影響型別安全；若需要特定欄位需確認後端有回傳。

**[staleTime 設定影響 UX]**
→ 短 staleTime 多請求但資料新鮮；長 staleTime 少請求但可能過時。
→ 各 feature 根據資料特性設定：profile = 5min，exercises = 10min，schedule（當天）= 2min，statistics = 5min，notifications = 1min。

## Migration Plan

1. 確認 foundation apiFetch 已完整實作（app-api-foundation 的 T10 done）
2. 從最簡單的 profile hooks 開始，一次驗證一個 feature
3. 每個 feature 完成後：刪除對應 `api/mock.ts`，確認畫面資料正常
4. 最後批次驗證 E2E（登入 → 各主要畫面有真實資料）

## Open Questions

- **後端 `/api/exercises` 分頁格式**：`{data: Exercise[], total: number, page: number}` 或其他？需實際呼叫確認。
- **schedule GET `useMonthSummaries` 的參數格式**：year+month 查詢參數或 ISO date range？
- **AI coach endpoint path**：確認是 `/api/ai-coach` 還是 `/api/exercises/[id]/ai-advice`（兩個不同 endpoint）。
