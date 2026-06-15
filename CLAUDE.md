@AGENTS.md

> **Expo SDK 56**：寫任何 code 前，先確認對應版本的 API（https://docs.expo.dev/versions/v56.0.0/）。本專案 = `trace`（Next.js web）的手機 App，純 client，消費 trace 後端的加密 API。

## 回應格式：SDD × Git Flow 進度圖

**推進了開發任務的回應，最開頭必須先放一張進度圖**（置於 code block 內，等寬對齊），
把當前階段用 `【 】` 框起來，並在圖下用 `▶ 目前：<階段> — <剛做了什麼／下一步>` 點出位置。

階段對應（SDD 生命週期 ↔ git）：

| 階段 | 意義 | git 動作 |
|------|------|---------|
| explore | 釐清需求、想清楚（不寫 code） | 想法，尚未開 branch |
| propose | 建 change：proposal / design / tasks（+ delta spec） | 開 feature branch + spec commit |
| apply | 照 tasks 實作 | branch 上 commits |
| sync | delta 套回 `openspec/specs/` | 編輯 specs/ commit |
| archive | 歸檔 change | `git mv` → `changes/archive/` → merge main |

模板（把 `【 】` 移到當前階段）：

```
SDD:   explore → propose ────────── apply ────────── sync ──────── archive
                    │                  │                │              │
git:   (想法)   開 branch +        在 branch        編輯 specs/     git mv →
                spec commit         上 commits       吸收 delta     changes/archive/
                    │                                                  │
                    └───────────────── 同一個 PR ──────────────────────┘
                                            │
                              merge → main → EAS Build / OTA Update → Notion Changelog
▶ 目前：<階段> — <一句話>
```

規則：
- 只在「實際推進開發任務」（實作、修 bug、SDD 任一步）的回應放此圖；純討論、問答、查詢不放。
- **依變更規模分流（AI 自行判定）**：
  - **大 feature / 改對外行為** → 走 feature branch + SDD + PR；branch 上 `sync + archive` 完成後，圖下標 `✅ 分支完成，可開 PR`，主動提示去處理 PR。
  - **小修 / 重構 / 設定 / 文件（非 feature）** → 不走 change、不開 PR；圖下標 `⚠ 此任務未走 change 流程（直接 main）`，`▶` 指向對應 git 動作，並在**回應結尾主動問一句**「要不要直接合併進 main？」（即直接 commit + push，不經 PR）。

---

## Skills

遇到以下場景時，讀取對應 skill 的規範並遵循：

- 寫 API client 呼叫（`apiFetch`）、畫面資料 fetch、表單、彈窗 / sheet、notify、i18n → @.claude/skills/project-conventions/SKILL.md
- 寫或審查任何 React Native 元件、expo-router page / layout → @.claude/skills/react-conventions/SKILL.md
- 定義型別、寫 Zod schema、處理 API 回應資料 → @.claude/skills/typescript-conventions/SKILL.md
- 寫 JS/TS 邏輯、util 函式、code review → @.claude/skills/javascript-conventions/SKILL.md
- 實作表單、全域狀態、資料 fetch 或 mutation → @.claude/skills/state-management/SKILL.md
- 命名任何變數、函式、元件、檔案或型別 → @.claude/skills/naming-conventions/SKILL.md
- 寫或審查 StyleSheet 樣式、theme token、dark mode、RWD → @.claude/skills/styling-conventions/SKILL.md
- 效能優化（列表、圖片、動畫、執行緒、資料 fetch）→ @.claude/skills/react-native-best-practices/SKILL.md
- UI 設計選型、配色、字型 → @.claude/skills/ui-ux-pro-max/SKILL.md（用 `--stack react-native`；產出的顏色仍須遵循 styling-conventions 的 theme token 規則）
- 建立或更新 Notion 專案文件、整理 Feature / Changelog → @.claude/skills/notion-docs/SKILL.md
- 寫錯誤處理、處理用戶輸入、token / 儲存、deep link、Code Review 任何涉及認證 / 授權 / 敏感資料的程式碼 → @.claude/skills/security-conventions/SKILL.md

---

## Hard Rules

### API

- 前台資料請求一律用 `@/lib/api` 的 `apiFetch`，禁止在元件層直接 `fetch`
- Server State 一律用 React Query 包 `apiFetch`，禁止 `useState` + `useEffect` 手刻請求
- 與後端的加密 / Ed25519 簽章格式必須對齊 `trace` 的 `lib/crypto`（本專案純 client，無 API route / server wrapper）

### TypeScript

- 禁止 `any`、`!`（non-null assertion）；禁止 `as`（唯一例外：不支援泛型的第三方套件），`unknown` 須經 Zod 或型別守衛收窄後使用
- **無 Prisma**：資料結構型別一律由 API 契約的 Zod schema（`z.infer`）推導，禁止手寫對應後端回應的 `interface` / `type`

### React

- 禁止 `var`、`forwardRef`、`defaultProps`、`React.FC`
- 禁止 `import React from 'react'`（用具名匯入）
- 清單渲染禁止用 index 或 `Math.random()` 當 key；長列表用 `FlatList`
- React Compiler 已開啟，不要手刻 `useMemo` / `useCallback` / `memo`

### Styling

- 樣式用 `StyleSheet.create`，禁止把大量 inline style 物件塞進 JSX
- 禁止硬編碼色碼 / 魔術數字，色彩用 `Colors` token（`useTheme()`）、間距用 `Spacing` scale（`@/constants/theme`）
- 條件式樣式用 style 陣列（`style={[base, cond && variant]}`），無 Tailwind / `cn()`
- dark mode 走 `useColorScheme` / `useTheme`，禁止在元件內以 JS 判斷主題分支硬編碼顏色

### State

- Redux 禁止儲存 Server State（後端資料）；Server State 一律用 React Query（`@tanstack/react-query`）
- 敏感資料（token）一律 `expo-secure-store`，禁止進 Redux / AsyncStorage
