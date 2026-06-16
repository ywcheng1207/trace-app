# app-mascot-assets Specification

## Purpose

Mascot 與品牌圖資的移植與使用規範，使 App 的 auth 進入點與 loading 畫面具備與 web 一致的品牌識別。

## Requirements

### Requirement: Mascot 圖資移植

App SHALL 包含從 web（`trace/assets/`）移植的 mascot 圖資，供 auth 進入點與 loading 畫面使用。圖資 SHALL 存放於 `assets/images/mascot/`。

#### Scenario: Auth 進入點顯示 mascot

- **WHEN** 使用者開啟登入畫面
- **THEN** 畫面頂部 SHALL 顯示 mascot 動圖（squat.gif）或靜態圖（mascot1.png，當平台不支援 GIF 動畫時）

#### Scenario: BrandLabel 顯示

- **WHEN** 使用者開啟登入畫面
- **THEN** mascot 下方 SHALL 顯示品牌文字標識（BrandLabel 元件，字型對齊 web `BrandLabel.tsx`）

#### Scenario: 圖資備援

- **WHEN** GIF 無法播放（靜態環境或不支援的裝置）
- **THEN** 改顯示對應的靜態 PNG（mascot1.png），不影響畫面佈局
