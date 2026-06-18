import { z } from 'zod';

import { decryptPayload, encryptPayload } from '@/lib/crypto/encryption';
import { buildCookieHeader } from '@/lib/auth/session';
import { getSharedSecret } from '@/lib/auth/token-storage';
import { isRefreshing, refreshAccessToken, SessionExpiredError } from '@/lib/auth/token-refresh';
import { getSodium } from '@/lib/crypto/sodium';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

export class ApiError extends Error {
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiFetchOptions<_T = unknown> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  schema?: z.ZodTypeAny;
  signal?: AbortSignal;
};

const buildEncryptedBody = async (body: unknown): Promise<string> => {
  const sharedSecret = await getSharedSecret();
  if (!sharedSecret) throw new ApiError(401, 'No shared secret');

  const sodium = getSodium();
  const nonce = sodium.to_hex(sodium.randombytes_buf(16));
  const bodyObj = (typeof body === 'object' && body !== null) ? body as Record<string, unknown> : {};
  const payload = { nonce, timestamp: Date.now(), ip: '0.0.0.0', ...bodyObj };
  const ciphertext = await encryptPayload(JSON.stringify(payload), sharedSecret);
  return JSON.stringify({ ciphertext });
};

const handleResponse = async <T>(
  res: Response,
  schema?: z.ZodTypeAny,
): Promise<T> => {
  // Auth errors come back as non-200 with plain JSON {ok, code, message}
  if (!res.ok) {
    const json = await res.json().catch(() => ({})) as Record<string, unknown>;
    const code = typeof json['code'] === 'number' ? json['code'] : res.status;
    const message = typeof json['message'] === 'string' ? json['message'] : `HTTP ${res.status}`;
    throw new ApiError(code, message);
  }

  const json = await res.json() as Record<string, unknown>;

  let data: unknown;

  if ('ciphertext' in json && typeof json['ciphertext'] === 'string') {
    const sharedSecret = await getSharedSecret();
    if (!sharedSecret) throw new ApiError(401, 'No shared secret');
    const decrypted = await decryptPayload(json['ciphertext'], sharedSecret);
    const parsed = JSON.parse(decrypted) as Record<string, unknown>;

    if (parsed['ok'] === false) {
      const code = typeof parsed['code'] === 'number' ? parsed['code'] : 500;
      const message = typeof parsed['message'] === 'string' ? parsed['message'] : 'Unknown error';
      throw new ApiError(code, message);
    }

    data = parsed;
  } else {
    data = json;
  }

  if (schema) {
    return schema.parse(data) as T;
  }
  return data as T;
};

export const apiFetch = async <T = unknown>(
  path: string,
  options: ApiFetchOptions<T> = {},
): Promise<T> => {
  const { method = 'GET', body, schema, signal } = options;
  const isWrite = method !== 'GET';

  const cookieHeader = await buildCookieHeader();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };

  const requestBody = isWrite && body !== undefined ? await buildEncryptedBody(body) : undefined;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: requestBody,
    signal,
  });

  if (res.status === 401) {
    // Prevent refresh loop: if already refreshing, fail immediately
    if (isRefreshing()) throw new SessionExpiredError();

    await refreshAccessToken();

    // Retry once with fresh cookie
    const freshCookie = await buildCookieHeader();
    const retryRes = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { ...headers, Cookie: freshCookie },
      body: requestBody,
      signal,
    });
    return handleResponse<T>(retryRes, schema);
  }

  return handleResponse<T>(res, schema);
};
