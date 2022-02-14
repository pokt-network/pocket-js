import { utils } from '@noble/ed25519'
import Sodium from 'libsodium-wrappers'
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

  static async createRandom(): Promise<KeyManager> {
    await Sodium.ready
    const keypair = Sodium.crypto_sign_keypair()
    const privateKey = utils.bytesToHex(keypair.privateKey)
    const publicKey = utils.bytesToHex(keypair.publicKey)
    const addr = await getAddressFromPublicKey(publicKey)
    console.log('CREATE_RANDOM', privateKey, publicKey, addr)

    return new KeyManager({ privateKey, publicKey, address: addr })
  }

  static async fromPrivateKey(privateKey: string): Promise<KeyManager> {
    await Sodium.ready
    const publicKey = publicKeyFromPrivate(privateKey)
    const addr = await getAddressFromPublicKey(publicKey)
    console.log('FROM_PRIVATE_KEY', privateKey, publicKey, addr)

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
}
