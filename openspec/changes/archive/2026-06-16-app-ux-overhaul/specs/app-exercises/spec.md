## MODIFIED Requirements

### Requirement: 肌群選取器

動作編輯表單中的肌群選取器 SHALL 以 SVG polygon 精確人體解剖圖呈現（正面／背面兩視圖），polygon 資料 SHALL 與 web 版本的 `ANTERIOR_POLYGONS` / `POSTERIOR_POLYGONS` 使用相同 region 對應，以 `react-native-svg` 的 `<Polygon>` 元件渲染。

解剖圖 SHALL 不在圖下方平鋪列出所有細項肌群。使用者 SHALL 透過以下下鑽流程選取細項肌群：

1. 點擊解剖圖上的大區域（region polygon）→ 該區域高亮
2. 自動開啟底部 `MuscleDrillSheet`，顯示該 region 所屬的細項肌群 chips
3. 使用者在 Sheet 中勾選 / 取消細項 → 確認後關閉 Sheet，解剖圖更新高亮狀態

Polygon 顏色 SHALL 反映選取狀態：未選取任何細項 → `muted`；選取部分細項 → `primary/60`；全選 → `primary`。

#### Scenario: 點擊解剖圖區域開啟 Sheet

- **WHEN** 使用者點擊解剖圖上某個 region（如「胸部」）
- **THEN** 該 region polygon 高亮，底部 MuscleDrillSheet 開啟，顯示該 region 的細項 chips

#### Scenario: 在 Sheet 中勾選細項

- **WHEN** 使用者在 MuscleDrillSheet 中點擊細項 chip
- **THEN** chip 切換為已選取狀態，確認後 Sheet 關閉，解剖圖對應 region 顏色更新

#### Scenario: 正面 / 背面切換

- **WHEN** 使用者切換解剖圖視圖（前 / 後）
- **THEN** SVG 圖切換，已選取的 region 在對應視圖維持高亮

#### Scenario: 無細項肌群選取時 region 無高亮

- **WHEN** 某 region 的所有細項肌群均未選取
- **THEN** 該 region polygon 顯示 muted 色（非高亮）
