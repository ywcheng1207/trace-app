## ADDED Requirements

### Requirement: Crypto 模組初始化
App SHALL 透過 libsodium-wrappers（asm.js）提供所有加密原語。Singleton 初始化函式 `cryptoReady()` SHALL 在首次呼叫前 await `sodium.ready`，之後直接回傳快取的 sodium 實例。任何 crypto 操作在 sodium 未初始化前被呼叫 SHALL throw `CryptoNotInitializedError`。

#### Scenario: 首次初始化
- **WHEN** 應用程式啟動並呼叫 `cryptoReady()`
- **THEN** await sodium.ready 完成後，回傳 sodium 實例，後續呼叫不再重複 await

#### Scenario: 未初始化時呼叫 crypto
- **WHEN** 在 `cryptoReady()` 完成前呼叫任一 crypto 函式
- **THEN** throw `CryptoNotInitializedError`

### Requirement: XChaCha20-Poly1305 加解密
`encryptPayload(plaintext, sharedSecret)` SHALL：
1. 從 `sharedSecret`（base64 bytes）以 BLAKE2b-32 推導 32-byte 加密 key
2. 生成 24-byte random nonce（`randombytes_buf(24)`）
3. 以 `crypto_aead_xchacha20poly1305_ietf_encrypt` 加密
4. 回傳 `"<base64_nonce>.<base64_ciphertext>"` 字串

`decryptPayload(ciphertextStr, sharedSecret)` SHALL：
1. 從 `sharedSecret` 推導 key（同上）
2. 分割 `"."` 取得 nonce 與 ciphertext
3. 解密並回傳 UTF-8 plaintext 字串

#### Scenario: 加解密往返
- **WHEN** 對相同 sharedSecret 執行 encryptPayload 後再 decryptPayload
- **THEN** 解密結果與原始 plaintext 完全相同

#### Scenario: sharedSecret 不符時解密失敗
- **WHEN** 以不同 sharedSecret 嘗試解密
- **THEN** throw `DecryptionError`

### Requirement: X25519 Key Exchange
`generateKeyPair()` SHALL 呼叫 `crypto_kx_keypair()`，回傳 `{publicKey: Uint8Array, privateKey: Uint8Array}`。
`computeSharedSecret(frontendPrivKey, serverPubKey)` SHALL 呼叫 `crypto_scalarmult(frontendPrivKey, serverPubKey)` 並以 base64 回傳 shared secret。
`generateFingerprint(pubKey)` SHALL 呼叫 `crypto_generichash(32, pubKey)` 並以 base64 回傳。

#### Scenario: 計算 shared secret
- **WHEN** 以 frontend private key 與 server public key 呼叫 computeSharedSecret
- **THEN** 回傳 base64 字串，長度對應 32-byte Curve25519 output

### Requirement: Ed25519 Server Key 驗證
`verifyServerKey(serverPubKeyB64, signatureB64, signingPubKeySpkiB64)` SHALL：
1. 解 base64 得 serverPubKeyBytes（32 bytes）
2. 解 SPKI base64 → 截去 12-byte header → raw 32-byte Ed25519 公鑰
3. `crypto_sign_verify_detached(signature_bytes, serverPubKeyBytes, rawSigningKey)` 必須通過
4. `crypto_generichash(32, serverPubKeyBytes)` 回傳的 fingerprint 必須與後端回傳一致
5. 任一驗證失敗 SHALL throw `ServerKeyVerificationError`

#### Scenario: 合法簽章通過
- **WHEN** server 回傳的 publicKey 與 signature 使用正確的 signing key 驗簽
- **THEN** verifyServerKey 正常回傳，不 throw

#### Scenario: 簽章偽造被拒
- **WHEN** signature 不符合 signingPubKey 驗證
- **THEN** throw `ServerKeyVerificationError`
