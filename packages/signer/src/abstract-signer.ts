/**
 * An abstract signer describes a to-be-implemented signer.
 * Useful for creating custom signers, if ever needed.
 * */
export abstract class AbstractSigner {
  abstract getAddress(): string
  abstract getAccount(): Account
  abstract getPublicKey(): string
  abstract getPrivateKey(): string
  abstract sign(payload: string): Promise<string>
}

export interface Account {
  address: string
  publicKey: string
  privateKey: string
}
