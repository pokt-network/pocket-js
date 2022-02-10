import { utils } from '@noble/ed25519'
import Sodium from 'libsodium-wrappers'
import { getAddressFromPublicKey } from '@pokt-foundation/pocketjs-utils'

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
    console.log(keypair, privateKey, publicKey, addr)

    return new KeyManager({ privateKey, publicKey, address: addr })
  }
}
