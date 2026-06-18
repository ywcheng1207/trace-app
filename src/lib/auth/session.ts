import {
  computeSharedSecret,
  generateFingerprint,
  generateKeyPair,
  verifyServerKey,
  ServerKeyVerificationError,
} from '@/lib/crypto/key-exchange';
import {
  getAccessToken,
  getRefreshToken,
  getSharedSecret,
  setAccessToken,
  setRefreshToken,
  setSharedSecret,
  clearAllTokens,
} from '@/lib/auth/token-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const SIGNING_PUBKEY = process.env.EXPO_PUBLIC_SIGNING_PUBKEY ?? '';

export class KeyExchangeError extends Error {
  constructor(cause?: unknown) {
    super('Key exchange failed');
    this.name = 'KeyExchangeError';
    if (cause instanceof Error) this.cause = cause;
  }
}

export class SessionNotFoundError extends Error {
  constructor() {
    super('Session not found — please log in again');
    this.name = 'SessionNotFoundError';
  }
}

export class ParseSetCookiesError extends Error {
  constructor() {
    super('Failed to parse Set-Cookie header');
    this.name = 'ParseSetCookiesError';
  }
}

type KeyExchangeResult = {
  sharedSecret: string;
  frontendPublicKey: string;
  frontendFingerprint: string;
};

export const performKeyExchange = async (): Promise<KeyExchangeResult> => {
  try {
    const res = await fetch(`${BASE_URL}/api/control`);
    if (!res.ok) throw new Error(`/api/control returned ${res.status}`);
    const { publicKey, signature, fingerprint } = (await res.json()) as {
      publicKey: string;
      signature: string;
      fingerprint: string;
    };

    if (SIGNING_PUBKEY) {
      await verifyServerKey(publicKey, signature, SIGNING_PUBKEY, fingerprint);
    }

    const { publicKey: frontendPublicKey, privateKey: frontendPrivateKey } = await generateKeyPair();
    const sharedSecret = await computeSharedSecret(frontendPrivateKey, publicKey);
    const frontendFingerprint = await generateFingerprint(frontendPublicKey);

    return { sharedSecret, frontendPublicKey, frontendFingerprint };
  } catch (e) {
    if (e instanceof ServerKeyVerificationError) throw e;
    throw new KeyExchangeError(e);
  }
};

// Parses the raw Set-Cookie header string from RN native fetch.
// RN concatenates multiple Set-Cookie headers with ", ".
// JWT and bcrypt tokens don't contain commas, so splitting on ", " is safe.
export const parseSetCookies = (raw: string): Record<string, string> => {
  const result: Record<string, string> = {};
  const chunks = raw.split(', ');
  for (const chunk of chunks) {
    const nameVal = chunk.split(';')[0].trim();
    const idx = nameVal.indexOf('=');
    if (idx === -1) continue;
    result[nameVal.slice(0, idx)] = nameVal.slice(idx + 1);
  }
  return result;
};

type SessionTokens = {
  accessToken: string;
  refreshToken: string;
  sharedSecret: string;
};

export const storeSession = async (tokens: SessionTokens): Promise<void> => {
  await Promise.all([
    setAccessToken(tokens.accessToken),
    setRefreshToken(tokens.refreshToken),
    setSharedSecret(tokens.sharedSecret),
  ]);
};

export const buildCookieHeader = async (): Promise<string> => {
  const [accessToken, refreshToken, sharedSecret] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
    getSharedSecret(),
  ]);
  if (!accessToken || !refreshToken || !sharedSecret) throw new SessionNotFoundError();
  return `accessToken=${accessToken}; refreshToken=${refreshToken}; shared_secret=${sharedSecret}`;
};

export { clearAllTokens };
