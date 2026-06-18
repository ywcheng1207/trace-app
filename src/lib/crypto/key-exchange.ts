import { cryptoReady } from '@/lib/crypto/sodium';

export class ServerKeyVerificationError extends Error {
  constructor(reason: string) {
    super(`Server key verification failed: ${reason}`);
    this.name = 'ServerKeyVerificationError';
  }
}

export const generateKeyPair = async () => {
  const sodium = await cryptoReady();
  const { publicKey, privateKey } = sodium.crypto_kx_keypair();
  return {
    publicKey: sodium.to_base64(publicKey),
    privateKey: sodium.to_base64(privateKey),
  };
};

export const computeSharedSecret = async (
  frontendPrivKeyB64: string,
  serverPubKeyB64: string,
): Promise<string> => {
  const sodium = await cryptoReady();
  const sharedSecret = sodium.crypto_scalarmult(
    sodium.from_base64(frontendPrivKeyB64),
    sodium.from_base64(serverPubKeyB64),
  );
  return sodium.to_base64(sharedSecret);
};

export const generateFingerprint = async (pubKeyB64: string): Promise<string> => {
  const sodium = await cryptoReady();
  const hash = sodium.crypto_generichash(32, sodium.from_base64(pubKeyB64));
  return sodium.to_base64(hash);
};

// The server public key and fingerprint come from libsodium (url-safe base64, no
// padding), but the Ed25519 signature and SPKI signing key are produced by Node's
// Buffer / WebCrypto (standard base64, with padding). libsodium's default decoder is
// url-safe-no-padding and throws on '+', '/' and '='. Normalize so either variant
// decodes cleanly.
const fromFlexibleBase64 = (
  sodium: Awaited<ReturnType<typeof cryptoReady>>,
  value: string,
): Uint8Array => {
  const normalized = value.trim().replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return sodium.from_base64(padded, sodium.base64_variants.ORIGINAL);
};

export const verifyServerKey = async (
  serverPubKeyB64: string,
  signatureB64: string,
  signingPubKeySpkiB64: string,
  expectedFingerprintB64: string,
): Promise<void> => {
  const sodium = await cryptoReady();

  // Verify fingerprint: BLAKE2b-32 of server public key bytes
  const serverPubKeyBytes = sodium.from_base64(serverPubKeyB64);
  const actualFingerprint = sodium.to_base64(sodium.crypto_generichash(32, serverPubKeyBytes));
  if (actualFingerprint !== expectedFingerprintB64) {
    throw new ServerKeyVerificationError('fingerprint mismatch');
  }

  // Ed25519 verify: strip 12-byte SPKI header → raw 32-byte key
  // The server signs the base64 string of the public key (UTF-8 encoded)
  const spkiBytes = fromFlexibleBase64(sodium, signingPubKeySpkiB64);
  const rawSigningKey = spkiBytes.slice(12);
  const signatureBytes = fromFlexibleBase64(sodium, signatureB64);
  // Message is the UTF-8 encoding of the base64 string (matches server signData)
  const messageBytes = sodium.from_string(serverPubKeyB64);

  const valid = sodium.crypto_sign_verify_detached(signatureBytes, messageBytes, rawSigningKey);
  if (!valid) {
    throw new ServerKeyVerificationError('Ed25519 signature invalid');
  }
};
