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

  async sign(payload: string): Promise<string> {
    await Sodium.ready
    return fromUint8Array(Sodium.crypto_sign_detached(toUint8Array(payload), toUint8Array(this.getPrivateKey())))
  }

  static async createRandom(): Promise<KeyManager> {
    await Sodium.ready
    const keypair = Sodium.crypto_sign_keypair()
    const privateKey = fromUint8Array(keypair.privateKey)
    const publicKey = fromUint8Array(keypair.publicKey)
    const addr = await getAddressFromPublicKey(publicKey)

    return new KeyManager({ privateKey, publicKey, address: addr })
  }

  static async fromPrivateKey(privateKey: string): Promise<KeyManager> {
    await Sodium.ready
    const publicKey = publicKeyFromPrivate(privateKey)
    const addr = await getAddressFromPublicKey(publicKey)

    return new KeyManager({ privateKey, publicKey, address: addr })
  }

  getAddress(): string {
    return this.address
  }

  getPublicKey(): string {
    return this.publicKey
  }

  getPrivateKey(): string {
    return this.privateKey
  }

  getAccount(): Account {
    return {
      address: this.address,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
    }
  }

  isConnected(): boolean {
    return Boolean(this.privateKey && this.publicKey && this.address)
  }
}
