# app-notifications Specification

## Purpose
通知中心：輪詢取得通知、日期分組呈現、已讀 / 刪除管理與未讀提示。

## Requirements

### Requirement: 通知列表與已讀管理
通知 SHALL 透過 GET `/api/notifications`（`useNotifications`，apiFetch，`staleTime: 1000 * 60`）取得。標記已讀 SHALL 呼叫 PUT `/api/notifications/[id]/read`（`useMarkRead`）。全部已讀 SHALL 呼叫 PUT `/api/notifications/read-all`（`useMarkAllRead`）。刪除單則 SHALL 呼叫 `useDeleteNotification`（後端端點未備時得先 cache-only 移除，標 `// TODO: apiFetch`）。mutation onSuccess SHALL invalidate notifications query 或更新 cache。

通知中心 SHALL 維持由 `NotificationBell` 開啟的 `Sheet`，內容以 `SectionList` 呈現，依 `createdAt` 分組為「今天 / 昨天 / 本週 / 更早」，每段標題顯示該段未讀數。每列 SHALL 以左側彩色圓形 icon chip（依 kind 著色）、標題、最多 2 行內文、相對時間呈現；未讀列 SHALL 以左側 accent 色條 + 輕微底色 + 加粗標題強化。每列 SHALL 支援左滑刪除、右滑切換已讀，並於支援裝置上提供 haptic 回饋。載入時 SHALL 顯示 Skeleton。

#### Scenario: 取得通知列表
- **WHEN** 使用者開啟通知列表
- **THEN** GET /api/notifications 回傳通知，依日期分組顯示於 SectionList

#### Scenario: 標記單則已讀
- **WHEN** 使用者點選單則通知，或對該列右滑選「已讀」
- **THEN** PUT /api/notifications/[id]/read 送出，onSuccess invalidate queries，未讀數更新，並給 haptic

#### Scenario: 全部標記已讀
- **WHEN** 使用者點「全部已讀」
- **THEN** PUT /api/notifications/read-all 送出，onSuccess invalidate queries，未讀數歸零

#### Scenario: 左滑刪除通知
- **WHEN** 使用者對某列左滑並確認刪除
- **THEN** 該則從列表移除（呼叫 `useDeleteNotification`），並給 haptic 回饋

#### Scenario: 日期分組與未讀強化
- **WHEN** 通知中心有跨越多天的通知，且含未讀
- **THEN** 通知分為今天/昨天/本週/更早區段，各段顯示未讀數，未讀列以左色條 + 底色 + 加粗標題與已讀區別

#### Scenario: 載入中顯示 Skeleton
- **WHEN** 通知資料載入中
- **THEN** 通知中心顯示 Skeleton 骨架而非空白
