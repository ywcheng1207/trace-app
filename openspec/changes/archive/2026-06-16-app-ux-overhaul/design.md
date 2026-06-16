## Context

trace-app 的 UI 建立在 StyleSheet + design token 的基礎上，各功能模組（auth、schedule、exercises、statistics、setting）已分別完成初版實作。本次翻修橫跨六個模組，核心問題是「以 web 為對標，但在 RN 環境用手機適配的方式實現同等設計意圖」。

現況主要缺陷：
- TextField 的 error 區以 `gap` 撐開，error 出現/消失導致版面位移
- auth 進入點缺少 mascot 與品牌識別，Register 是獨立 screen 造成操作多一層
- Calendar 以 SegmentedControl 實作視圖切換，Card 外框限制了月曆的延展空間
- MuscleSelector 解剖圖用幾何形狀拼出，與 web SVG polygon 精度差距大；所有細項肌群平鋪，畫面很長
- Statistics 排版雜亂，圖表無 Y 軸 / 網格線，身體數值偏好設定放在 Setting 頁不符使用流程

## Goals / Non-Goals

**Goals**
- 修正 TextField layout shift，讓所有表單不因 error 狀態產生跳動
- auth 進入點對齊 web 設計意圖（mascot + BrandLabel + 單頁 Login/Register tabs）
- Calendar 月曆全面無框化，月份操作移至下方，視圖切換為 icon button
- MuscleSelector 解剖圖換成真實 SVG polygon，以 Sheet 下鑽取代平鋪
- Statistics 圖表加入 Y 軸 / 網格線 / press tooltip；身體數值偏好入口移入此頁
- Setting 移除 metric preferences 區塊（已搬移）

**Non-Goals**
- 不改動後端 API 合約或任何 API route
- 不實作影片播放功能（屬 `app-exercise-video` change）
- 不改動現有的 Redux store 結構，metric preferences 仍存於 profile.hiddenMetrics
- 不引入 NativeWind 或 Tailwind（維持 StyleSheet 架構）

## Decisions

### D1：TextField 固定 error 高度

**決策**：在 TextField 底部始終渲染 error 佔位（`minHeight: 18`），error 有文字時顯示，無時透明但仍佔空間。

**理由**：web 的 `Field.tsx` 採相同方式固定底部 error 行。RN 中以 `opacity: 0` + `minHeight` 控制最為簡單，不影響其他 prop。

**替代方案**：`LayoutAnimation` 動畫展開 / 收合 ── 實作複雜，且動畫本身也會造成短暫位移，放棄。

---

### D2：Auth 進入點 ── animated tab 取代雙 screen

**決策**：保留 `(auth)/login.tsx` 作為進入點，將 Register 的內容以 inline animated tab 整合進同一畫面（tab bar 用 Animated API 做底部滑動線）；`(auth)/register.tsx` 改為 redirect 到 login（保留路由相容性）。

**理由**：web 用 `MotionTabs`（framer-motion）在同一頁切換 Login/Register，手機上相同的設計意圖以 Animated API 實現，不需要 navigation stack 的 back 手勢。

**替代方案**：維持兩個 screen ── 使用者需要多一次 back 才能在 Login/Register 之間切換，體驗較差。

---

### D3：Calendar 月份切換 ── 大按鈕置底

**決策**：月份切換按鈕（上月 / 下月）從 Header 的 ChevronLeft/Right（icon，36px touch target）移至月曆下方，設計為 `height: 44` 的半寬 Pressable，並顯示「< 上月」、「下月 >」文字標籤。月曆移除 Card 包裹，直接在 ScrollView content 中延展。

**理由**：月份切換是高頻操作；按鈕在頂部需要拇指向上伸展（不舒適），移至底部符合單手操作習慣。Web 將 chevron 放在標題兩側（桌面游標操作精準），手機需要不同的互動設計。

---

### D4：MuscleSelector ── SVG polygon + Sheet 下鑽

**決策**：
1. 移植 web 的 `ANTERIOR_POLYGONS` / `POSTERIOR_POLYGONS` 資料到 `src/lib/constants/body-map.ts`（僅 polygon points 與 region 對應）
2. 用 `react-native-svg` 的 `<Polygon>` 元件渲染（已在專案依賴中）
3. 新增 `MuscleDrillSheet`：點擊某個 region → Bottom Sheet 顯示該 region 的細項肌群 chips

**理由**：web 的解剖圖是精確的 SVG polygon（人體輪廓 + 可點擊高亮），幾何形狀版本的精度與觀感相差太遠。RN 中 `react-native-svg` 已支援 `<Polygon>`，資料可直接複用 web 的 polygon points 字串。

**替代方案**：用圖片（png）做解剖圖背景 + 透明 overlay 偵測點擊 ── 精度差、圖片維護成本高，放棄。

---

### D5：Statistics 圖表 ── 升級 gifted-charts 設定

**決策**：維持 `react-native-gifted-charts`，但全面重設配置：啟用 `showYAxisIndices`、`yAxisLabelWidth`、`rulesType="solid"`（網格線）、`showDataPointOnFocus`（按壓 tooltip）、`barBorderRadius`（圓角）、統一 `barWidth` 與 `spacing`。另增 chart container card 並加入 chart title / subtitle / legend 層次。

**理由**：不換圖表庫可降低風險（gifted-charts 已整合）；Whoop / Strava 的設計語言可以透過配置參數達到 ── Y 軸、網格、tooltip、圓角都是 gifted-charts 支援的 prop。

**替代方案**：換用 `victory-native` 或 `recharts`（react-native-web） ── bundle size 增加、現有 mock 資料 schema 需要重映射，不值得。

---

### D6：Metric Preferences 入口移至 Statistics 頁

**決策**：在 Statistics 頁 Header 右側加一個 `sliders-horizontal` icon button；點擊開啟 `MetricPreferencesSheet`（Bottom Sheet，與現有 Setting 中的內容相同但以 Sheet 呈現）。Setting 頁移除 `metric_preferences` 整個 section（包含對應 i18n key 和 Switch 列表）。

**理由**：使用者在查看統計時才有「想看哪些數值」的需求；放在 Setting 頁需要跳頁，使用流程不直覺。web 版本是在 Setting 頁控制，但 web 的 Setting 和 Statistics 在同一側欄中，切換成本低；手機上兩者是不同 tab，搬移改善可發現性。

## Risks / Trade-offs

- **SVG polygon 座標移植**：web 的 SVG viewBox 是 `-2 -2 104 226`，RN 需要指定等比的 width/height；polygon points 字串可直接複用，但 RN 的 `<Svg>` 需要設定 `viewBox` 保持比例。[風險小]
- **register.tsx redirect**：改為 redirect 後若有外部 deep link 指向 `/register`，會變成導向 login 的 register tab。目前 app 無 deep link 實作，可接受。[風險低]
- **i18n namespace 對齊**：Login/Register 合併後 i18n key 需要整合，`auth.json` 需要新增 web `entry` namespace 中的部分 key（brand label 等）。需要三語系同步更新。[風險中，工作量明確]

## Open Questions

- mascot gif（squat.gif）在 RN 中需要 `expo-image` 或 `react-native-fast-image` 才能播放 GIF；確認目前專案是否已裝，否則改用靜態 mascot PNG（mascot1.png）
- Statistics 圖表 press tooltip 在 gifted-charts 中需要搭配 `Pointer` 元件，確認版本相容性
