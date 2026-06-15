## 1. 月曆重做

- [ ] 1.1 `day-cell.tsx` 改高格子：日期靠上 + chip 區（plan/metric/note）
- [ ] 1.2 plan chip 依完成度配色、metric 綠、note 黃；今天 brandOrange 外框+底、過去日淡化
- [ ] 1.3 整格為點擊區（足夠觸控面積）、圓角 8
- [ ] 1.4 `calendar-month.tsx` 加水平 swipe 換月（gesture-handler + reanimated），保留箭頭

## 2. 雙視圖

- [ ] 2.1 header Segmented（月曆 / 清單）
- [ ] 2.2 清單視圖元件：依日期列出有資料的天，點列進日詳情

## 3. 引導對話框

- [ ] 3.1 缺動作引導（導向 Exercises）
- [ ] 3.2 無動作提示 / 清空計畫確認 / 缺資料提示

## 4. 計畫上限

- [ ] 4.1 上限常數 + 達上限 disabled + 提示

## 5. i18n

- [ ] 5.1 `schedule` 補視圖切換 / 對話框文案（三語系）

## 6. Verification

- [ ] 6.1 `npx tsc --noEmit`　6.2 `npx expo lint`
- [ ] 6.3 preview：月曆觸控 / 滑動換月 / 雙視圖 / 對話框 / light-dark
