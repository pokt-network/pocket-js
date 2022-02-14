/**
 * Extracts the public key from a 64-byte long ed25519 private key
 * @param {Buffer} privateKey - Private key buffer.
 * @returns {Buffer} - Public Key buffer.
 */
export function publicKeyFromPrivate(privateKey: string): string {
  return privateKey.slice(64, privateKey.length)
}
