import { buildCookieHeader, clearAllTokens, parseSetCookies, storeSession } from '@/lib/auth/session';
import { getSharedSecret } from '@/lib/auth/token-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

export class SessionExpiredError extends Error {
  constructor() {
    super('Session expired — please log in again');
    this.name = 'SessionExpiredError';
  }
}

// Module-level flag prevents concurrent refresh loops
let _isRefreshing = false;

export const isRefreshing = () => _isRefreshing;

export const refreshAccessToken = async (): Promise<void> => {
  _isRefreshing = true;
  try {
    const cookieHeader = await buildCookieHeader().catch(() => {
      throw new SessionExpiredError();
    });

    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
    });

    if (!res.ok) {
      await clearAllTokens();
      throw new SessionExpiredError();
    }

    // Server sets new cookies via Set-Cookie; parse and persist new tokens.
    // sharedSecret is unchanged on refresh — reuse existing value.
    const setCookieHeader = res.headers.get('set-cookie');
    const existingSharedSecret = await getSharedSecret();

    if (setCookieHeader && existingSharedSecret) {
      const parsed = parseSetCookies(setCookieHeader);
      const accessToken = parsed['accessToken'];
      const refreshToken = parsed['refreshToken'];
      if (accessToken && refreshToken) {
        await storeSession({ accessToken, refreshToken, sharedSecret: existingSharedSecret });
        return;
      }
    }

    // If Set-Cookie wasn't parseable but response was 200, session is still valid.
    // The browser-side web app reads cookies automatically — native app just continues.
  } finally {
    _isRefreshing = false;
  }
};
