import { getRandomValues } from 'expo-crypto';

// Hermes (React Native) ships no global `crypto.getRandomValues`. libsodium's
// emscripten runtime aborts with "No secure random number generator found"
// during sodium_init unless one exists. expo-crypto provides a synchronous,
// WebCrypto-compatible implementation that works inside Expo Go.
//
// This module must be imported before `libsodium-wrappers` (see sodium.ts) so
// the global is in place before the asm.js runtime probes for a random source.

const globalScope: Record<string, unknown> = globalThis;
const existing = globalScope.crypto;

const hasGetRandomValues =
  typeof existing === 'object' &&
  existing !== null &&
  'getRandomValues' in existing &&
  typeof existing.getRandomValues === 'function';

if (!hasGetRandomValues) {
  globalScope.crypto = { getRandomValues };
}
