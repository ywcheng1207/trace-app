import { cryptoReady } from '@/lib/crypto/sodium';

export class DecryptionError extends Error {
  constructor(cause?: unknown) {
    super('Decryption failed');
    this.name = 'DecryptionError';
    if (cause instanceof Error) this.cause = cause;
  }
}

const deriveKey = (sodium: Awaited<ReturnType<typeof cryptoReady>>, sharedSecretB64: string) =>
  sodium.crypto_generichash(32, sodium.from_base64(sharedSecretB64));

export const encryptPayload = async (plaintext: string, sharedSecretB64: string): Promise<string> => {
  const sodium = await cryptoReady();
  const key = deriveKey(sodium, sharedSecretB64);
  const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    sodium.from_string(plaintext),
    null,
    null,
    nonce,
    key,
  );
  return `${sodium.to_base64(nonce)}.${sodium.to_base64(ciphertext)}`;
};

export const decryptPayload = async (encrypted: string, sharedSecretB64: string): Promise<string> => {
  const sodium = await cryptoReady();
  const parts = encrypted.split('.');
  if (parts.length !== 2) throw new DecryptionError(new Error('Invalid encrypted format'));
  const [nonceB64, ctB64] = parts;
  try {
    const key = deriveKey(sodium, sharedSecretB64);
    const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null,
      sodium.from_base64(ctB64),
      null,
      sodium.from_base64(nonceB64),
      key,
    );
    return sodium.to_string(plaintext);
  } catch (e) {
    throw new DecryptionError(e);
  }
};
