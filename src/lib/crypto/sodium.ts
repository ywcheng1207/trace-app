import _sodium from 'libsodium-wrappers';

let _isReady = false;

export class CryptoNotInitializedError extends Error {
  constructor() {
    super('Sodium not initialized — await cryptoReady() first');
    this.name = 'CryptoNotInitializedError';
  }
}

export const cryptoReady = async () => {
  if (_isReady) return _sodium;
  await Promise.race([
    _sodium.ready,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Sodium initialization timeout')), 5000)
    ),
  ]);
  _isReady = true;
  return _sodium;
};

export const getSodium = () => {
  if (!_isReady) throw new CryptoNotInitializedError();
  return _sodium;
};
