import Constants from 'expo-constants';
import { z } from 'zod';

import { getAccessToken } from '@/lib/auth/token-storage';
import { ApiResponse } from '@/types/api';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (typeof Constants.expoConfig?.extra?.apiBaseUrl === 'string'
    ? Constants.expoConfig.extra.apiBaseUrl
    : '');

type ApiFetchOptions<T> = {
  schema: z.ZodType<T>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

/**
 * 統一的前台 API client。所有畫面資料請求都走這裡（搭配 React Query），禁止在元件層直接 fetch。
 *
 * 回應一律經 Zod 收窄：呼叫端必須提供該端點 `data` 的 schema，
 * 函式回傳強型別的 ApiResponse<T>，全程不使用 any / as。
 *
 * TODO: 對齊 trace 後端的 wire format——
 *   - 加密 payload（POST/PUT/DELETE）與回應解密
 *   - Ed25519 簽章（須對齊 trace 的 lib/crypto）
 *   - shared secret 協商
 * 目前僅實作 baseURL + token 附帶 + JSON + envelope 驗證的最小骨架，
 * 在確認後端格式前不臆測加密細節。
 */
export const apiFetch = async <T>(
  path: string,
  options: ApiFetchOptions<T>,
): Promise<ApiResponse<T>> => {
  const { schema, method = 'GET', body, signal } = options;
  const token = await getAccessToken();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const envelopeSchema = z.object({
    success: z.boolean(),
    data: schema.optional(),
    error: z.string().optional(),
  });

  const json: unknown = await response.json().catch(() => null);
  const parsed = envelopeSchema.safeParse(json);

  if (!parsed.success) return { success: false, error: 'invalid_response' };
  return parsed.data;
};
