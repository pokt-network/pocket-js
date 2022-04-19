import debug from 'debug'
import Sodium from 'libsodium-wrappers'
import { toUint8Array, fromUint8Array } from 'hex-lite'
import {
  getAddressFromPublicKey,
  publicKeyFromPrivate,
} from '@pokt-foundation/pocketjs-utils'

interface Account {
  address: string
  publicKey: string
  privateKey: string
}

/**
 * A KeyManager lets you import accounts with their private key or PPK (Portable Private Key)
 * and get its address, public key, private key, and sign messages.
 **/
export class KeyManager {
  private address: string

  private publicKey: string
  private privateKey: string

  constructor({
    address,
    privateKey,
    publicKey,
  }: {
    address: string
    privateKey: string
    publicKey: string
  }) {
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.address = address
  }

  /**
   * signs a valid hex-string payload with the imported private key.
   * @param {string} payload - The hex payload to sign.
   * @returns {string} - The signed payload as a string.
   * */
  async sign(payload: string): Promise<string> {
    await Sodium.ready
    return fromUint8Array(
      Sodium.crypto_sign_detached(
        toUint8Array(payload),
        toUint8Array(this.getPrivateKey())
      )
    )
  }

  /**
   * signs a valid hex-string payload with the imported private key and returns a valid Transaction Signature.
   * @param {string} payload - The hex payload to sign.
   * @returns {string} - The signed payload as a string.
   * */
  async signTransaction(payload: string): Promise<string> {
    await Sodium.ready
    return fromUint8Array(
      Sodium.crypto_sign_detached(
        toUint8Array(payload),
        toUint8Array(this.getPrivateKey())
      )
    )
  }

  /**
   * Creates a new, random Pocket account.
   * @returns {KeyManager} - A new Key Manager instance with the account attached.
   * */
  static async createRandom(): Promise<KeyManager> {
    await Sodium.ready
    const keypair = Sodium.crypto_sign_keypair()
    const privateKey = fromUint8Array(keypair.privateKey)
    const publicKey = fromUint8Array(keypair.publicKey)
    const addr = await getAddressFromPublicKey(publicKey)

    const logger = debug('KeyManager')
    logger(`Created account with public key ${publicKey} and address ${addr}`)

    return new KeyManager({ privateKey, publicKey, address: addr })
  }

  /**
   * Instanciates a new KeyManager from a valid ED25519 private key.
   * @param {string} privateKey - The private key to use to instanciate the new Key manager.
   * @returns {KeyManager} - A new Key Manager instance with the account attached.
   * */
  static async fromPrivateKey(privateKey: string): Promise<KeyManager> {
    await Sodium.ready
    const publicKey = publicKeyFromPrivate(privateKey)
    const addr = await getAddressFromPublicKey(publicKey)

    return new KeyManager({ privateKey, publicKey, address: addr })
  }

  /**
   * Gets the account address.
   * @returns {string} - The attached account's address.
   * */
  getAddress(): string {
    return this.address
  }

  /**
   * Gets the account public key.
   * @returns {string} - The attached account's public key.
   * */
  getPublicKey(): string {
    return this.publicKey
  }

  /**
   * Gets the account private key.
   * @returns {string} - The attached account's private key.
   * */
  getPrivateKey(): string {
    return this.privateKey
  }

  /**
   * Gets and exports the attached account.
   * @returns {Account} - The attached account.
   * */
  getAccount(): Account {
    return {
      address: this.address,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
    }
  }

  /**
   * Checks if the Key Manager has all the required parts of an account.
   * @returns {boolean} - If the key manager is properly instanciated or not.
   * */
  isConnected(): boolean {
    return Boolean(this.privateKey && this.publicKey && this.address)
  }
}
