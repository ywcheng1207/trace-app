## 1. Schema

- [x] 1.1 `profile` schema 加 `birthDate` / `timezone`；`profileEditSchema` 加 avatar / birthDate / timezone
- [x] 1.2 mock profile 補欄位（timezone 預設 Asia/Taipei）；mockUpdateProfile 透過 spread 支援

## 2. 編輯 UI

- [x] 2.1 頭像顯示 + 更換（expo-image-picker launchImageLibraryAsync，上傳 stub `// TODO: apiFetch`，本地 uri 預覽）
- [x] 2.2 生日 DatePicker（新增可重用 `DatePicker` 元件，calendar Sheet，maxDate=今天）
- [x] 2.3 時區 Select（COMMON_TIMEZONES 常用優先，IANA 值）

## 3. i18n / Verification

- [x] 3.1 `setting` 補 change_avatar / birth_date / timezone 文案（三語系）
- [x] 3.2 `npx tsc --noEmit`（pass）　3.3 `npx expo lint`（pass）
- [x] 3.4 preview：編輯 Sheet 顯示頭像/更換/生日 DatePicker/時區 Select，無 console error
