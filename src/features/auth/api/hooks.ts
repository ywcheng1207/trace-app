import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  ForgotPasswordRequest,
  LoginRequest,
  PasswordChangeRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/features/auth/api/schemas';
import { encryptPayload } from '@/lib/crypto/encryption';
import { getSodium } from '@/lib/crypto/sodium';
import { buildCookieHeader, clearAllTokens, parseSetCookies, performKeyExchange, storeSession } from '@/lib/auth/session';
import { getAccessToken, getRefreshToken, getSharedSecret } from '@/lib/auth/token-storage';
import { queryClient } from '@/lib/query/query-client';
import { useAppDispatch } from '@/store/hooks';
import { setAuthenticated, setUnauthenticated } from '@/store/slices/auth-slice';
import { ApiError, apiFetch } from '@/lib/api/api-fetch';
import { SessionExpiredError } from '@/lib/auth/token-refresh';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

const buildAuthPayload = async (data: Record<string, unknown>, sharedSecret: string): Promise<string> => {
  const sodium = getSodium();
  const nonce = sodium.to_hex(sodium.randombytes_buf(16));
  const payload = { ...data, nonce, timestamp: Date.now(), ip: '0.0.0.0' };
  const ciphertext = await encryptPayload(JSON.stringify(payload), sharedSecret);
  return JSON.stringify({ encryptedData: ciphertext });
};

// ── Auth Bootstrap ────────────────────────────────────────────────────────────

export const useAuthBootstrap = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;
    const restore = async () => {
      const [accessToken, refreshToken, sharedSecret] = await Promise.all([
        getAccessToken(),
        getRefreshToken(),
        getSharedSecret(),
      ]);

      if (!active) return;

      if (!accessToken || !refreshToken || !sharedSecret) {
        dispatch(setUnauthenticated());
        return;
      }

      try {
        await apiFetch('/api/user/me', { schema: undefined });
        if (active) dispatch(setAuthenticated(null));
      } catch (e) {
        if (!active) return;
        if (e instanceof SessionExpiredError) {
          dispatch(setUnauthenticated());
        } else if (e instanceof ApiError && e.code === 401) {
          dispatch(setUnauthenticated());
        } else {
          // Network error etc. — keep restoring state, don't kick user out
          dispatch(setAuthenticated(null));
        }
      }
    };
    void restore();
    return () => {
      active = false;
    };
  }, [dispatch]);
};

// ── Login ─────────────────────────────────────────────────────────────────────

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const { sharedSecret, frontendPublicKey, frontendFingerprint } = await performKeyExchange();

      const encryptedBody = await buildAuthPayload(
        { identifier: payload.email, password: payload.password, language: 'zh-Hant' },
        sharedSecret,
      );

      const parsed = JSON.parse(encryptedBody) as { encryptedData: string };
      const body = JSON.stringify({
        encryptedData: parsed.encryptedData,
        frontendPublicKey,
        frontendFingerprint,
      });

      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!res.ok) throw new ApiError(res.status, 'Login failed');

      const setCookieHeader = res.headers.get('set-cookie');
      if (!setCookieHeader) throw new ApiError(500, 'No session cookies received');

      const cookies = parseSetCookies(setCookieHeader);
      const accessToken = cookies['accessToken'];
      const refreshToken = cookies['refreshToken'];
      const cookieSharedSecret = cookies['shared_secret'];

      if (!accessToken || !refreshToken) throw new ApiError(500, 'Incomplete session cookies');

      await storeSession({
        accessToken,
        refreshToken,
        sharedSecret: cookieSharedSecret ?? sharedSecret,
      });
    },
    onSuccess: () => {
      dispatch(setAuthenticated(null));
    },
  });
};

// ── Register ──────────────────────────────────────────────────────────────────

export const useRegister = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const { sharedSecret, frontendPublicKey, frontendFingerprint } = await performKeyExchange();

      const encryptedBody = await buildAuthPayload(
        { username: payload.displayName, email: payload.email, password: payload.password, language: 'zh-Hant' },
        sharedSecret,
      );

      const parsed = JSON.parse(encryptedBody) as { encryptedData: string };
      const body = JSON.stringify({
        encryptedData: parsed.encryptedData,
        frontendPublicKey,
        frontendFingerprint,
      });

      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!res.ok) throw new ApiError(res.status, 'Registration failed');

      const setCookieHeader = res.headers.get('set-cookie');
      if (!setCookieHeader) throw new ApiError(500, 'No session cookies received');

      const cookies = parseSetCookies(setCookieHeader);
      const accessToken = cookies['accessToken'];
      const refreshToken = cookies['refreshToken'];
      const cookieSharedSecret = cookies['shared_secret'];

      if (!accessToken || !refreshToken) throw new ApiError(500, 'Incomplete session cookies');

      await storeSession({
        accessToken,
        refreshToken,
        sharedSecret: cookieSharedSecret ?? sharedSecret,
      });
    },
    onSuccess: () => {
      dispatch(setAuthenticated(null));
    },
  });
};

// ── Logout ────────────────────────────────────────────────────────────────────

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return async () => {
    try {
      const cookieHeader = await buildCookieHeader();
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { Cookie: cookieHeader },
      });
    } catch {
      // Best-effort: always clear local state regardless of API result
    }
    await clearAllTokens();
    queryClient.clear();
    dispatch(setUnauthenticated());
  };
};

// ── Password Reset ────────────────────────────────────────────────────────────

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordRequest) => {
      await apiFetch('/api/auth/reset-password/request', {
        method: 'POST',
        body: { email: payload.email },
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: ResetPasswordRequest) => {
      await apiFetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        body: { password: payload.password },
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: PasswordChangeRequest) => {
      await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: { oldPassword: payload.oldPassword, newPassword: payload.newPassword },
      });
    },
  });
};
