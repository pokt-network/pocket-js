import Sodium from 'libsodium-wrappers'
import { Buffer } from 'buffer'
import { AbstractProvider } from '@pokt-foundation/pocketjs-abstract-provider'
import { TransactionResponse } from '@pokt-foundation/pocketjs-types'
import { AbstractSigner, TransactionRequest } from './abstract-signer'
import { KeyManager } from './key-manager'
import {
  getAddressFromPublicKey,
  publicKeyFromPrivate,
} from '@pokt-foundation/pocketjs-utils'

/**
 * A Wallet is a minimal wallet implementation that lets you import accounts
 * with their private key or PPK (Portable Private Key), get its address, public key, private key, sign messages
 * and query its own information from the chain if a provider is attached.
 **/
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

  /**
   * Creates a new, random Pocket account.
   * @returns {Wallet} - A new Wallet instance with the account attached.
   * */
  static async createRandom(): Promise<Wallet> {
    const keyManager = await KeyManager.createRandom()
    return new Wallet({
      keyManager,
      isSigner: true,
    })
  }

  /**
   * Instanciates a new Wallet from a valid ED25519 private key.
   * @param {string} privateKey - The private key to use to instanciate the new Key manager.
   * @returns {Wallet} - A new Key Manager instance with the account attached.
   * */
  static async fromPrivateKey(privateKey: string): Promise<Wallet> {
    await Sodium.ready
    const publicKey = publicKeyFromPrivate(privateKey)
    const addr = await getAddressFromPublicKey(publicKey)

    const keyManager = new KeyManager({ address: addr, privateKey, publicKey })

    return new Wallet({ keyManager, isSigner: true })
  }

  /**
   * Instanciates a new Wallet from a valid PPK.
   * @param {string} privateKey - The private key to use to instanciate the new Key manager.
   * @returns {Wallet} - A new Key Manager instance with the account attached.
   * */
  static async fromPPK({
    password,
    ppk,
  }: {
    password: string
    ppk: string
  }): Promise<Wallet> {
    await Sodium.ready
    const keyManager = await KeyManager.fromPPK({ password, ppk })
    return new Wallet({ keyManager, isSigner: true })
  }

  /**
   * Exports a private key as a Portable-Private-Key, unlockable with the used password.
   * @param {string} password - The password to use in the PPK.
   * @param {string} hint - Password hint.
   * @returns {KeyManager} - A new Key Manager instance with the account attached.
   * */
  async exportPPK({
    password,
    hint = '',
  }: {
    password: string
    hint?: string
  }): Promise<string> {
    return KeyManager.exportPPK({
      privateKey: this.keyManager.getPrivateKey(),
      password,
      hint,
    })
  }

  /**
   * Gets the account address.
   * @returns {string} - The attached account's address.
   * */
  getAddress(): Promise<string> {
    return new Promise(() => this.keyManager.getAddress())
  }

  /**
   * Attaches a provider to the Wallet.
   * @returns {Wallet} - A clone instance of the Wallet with the provider attached.
   * */
  connect(provider: AbstractProvider): Wallet {
    return new Wallet({
      provider,
      keyManager: this.keyManager,
      isSigner: this._isSigner || this.keyManager.isConnected(),
    })
  }

  /**
   * Fetches the wallet's account balance. A provider is required.
   * @returns {bigint} - The wallet account's balance.
   * */
  async getBalance(): Promise<bigint> {
    if (!this.provider) {
      throw new Error('No provider')
    }

    return this.provider.getBalance(this.getAddress())
  }

  /**
   * Fetches the wallet's account transaction count. A provider is required.
   * @returns {number} - The wallet account's transaction count.
   * */
  async getTransactionCount(): Promise<number> {
    if (!this.provider) {
      throw new Error('No provider')
    }

    return this.provider.getTransactionCount(this.getAddress())
  }

  /**
   * Sends a transaction from this wallet's account. A provider is required.
   * @returns {Transaction} - The network's response to the transaction.
   * */
  async sendTransaction(
    signedTransaction: string | Promise<string>
  ): Promise<TransactionResponse> {
    throw new Error('not implemented')
  }

  /**
   * signs a valid hex-string payload with the imported private key.
   * @param {string} payload - The hex payload to sign.
   * @returns {string} - The signed payload as a string.
   * */
  async sign(payload: string): Promise<string> {
    await Sodium.ready
    return Buffer.from(
      Sodium.crypto_sign_detached(
        Buffer.from(payload, 'hex'),
        Buffer.from(this.keyManager.getPrivateKey(), 'hex')
      )
    ).toString('hex')
  }

  /**
   * Signs a transaction from this wallet's account.
   * @param {TransactionRequest} transaction - The transaction to sign, formatted as a `TransactionRequest`.
   * @returns {string} - The signed transaction.
   * */
  async signTransaction(transaction: TransactionRequest): Promise<string> {
    throw new Error('not implemented')
  }
}
