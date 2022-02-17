import Sodium from 'libsodium-wrappers'
import { toUint8Array, fromUint8Array } from 'hex-lite'
import { AbstractProvider } from '@pokt-foundation/pocketjs-provider'
import { TransactionResponse } from '@pokt-foundation/pocketjs-types'
import { AbstractSigner, TransactionRequest } from './abstract-signer'
import { KeyManager } from './key-manager'

export class Wallet implements AbstractSigner {
  readonly provider?: AbstractProvider // Provider that will send all calls
  readonly _isSigner: boolean // mark signer as a proper signer (useful for non-writable signers)
  readonly keyManager: KeyManager

  constructor({
    provider,
    keyManager,
    isSigner = false,
  }: {
    provider?: AbstractProvider
    keyManager: KeyManager
    isSigner: boolean
  }) {
    // Assume it's a void/readonly signer by default
    this._isSigner = isSigner ?? false
    this.provider = provider
    this.keyManager = keyManager
  }

  static async createRandom(): Promise<Wallet> {
    const keyManager = await KeyManager.createRandom()
    return new Wallet({
      keyManager,
      isSigner: true,
    })
  }

  getAddress(): Promise<string> {
    return new Promise(() => this.keyManager.getAddress())
  }

  connect(provider: AbstractProvider): Wallet {
    return new Wallet({
      provider,
      keyManager: this.keyManager,
      isSigner: this._isSigner || this.keyManager.isConnected(),
    })
  }

  async getBalance(address: string | Promise<string>): Promise<bigint> {
    if (!this.provider) {
      throw new Error('No provider')
    }

    return this.provider.getBalance(await address)
  }

  async getTransactionCount(
    address: string | Promise<string>
  ): Promise<number> {
    if (!this.provider) {
      throw new Error('No provider')
    }

    return this.provider.getTransactionCount(await address)
  }
  async sendTransaction(
    signedTransaction: string | Promise<string>
  ): Promise<TransactionResponse> {
    if (!this.provider) {
      throw new Error('No provider')
    }

    return this.provider.sendTransaction(
      this.keyManager.getAddress(),
      await signedTransaction
    )
  }

  async sign(payload: string): Promise<string> {
    await Sodium.ready
    console.log(Sodium.to_hex, toUint8Array(this.keyManager.getPrivateKey()))
    return fromUint8Array(
      Sodium.crypto_sign_detached(
        toUint8Array(payload),
        toUint8Array(this.keyManager.getPrivateKey())
      )
    )
  }

  async signTransaction(transaction: TransactionRequest): Promise<string> {
    await Sodium.ready

    throw new Error('Not implemented, needs transaction builder')
  }
}
