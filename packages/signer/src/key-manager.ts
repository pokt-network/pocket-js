import Sodium from 'libsodium-wrappers'
import crypto from 'isomorphic-crypto'
import { Buffer } from 'buffer'
import debug from 'debug'
import {
  getAddressFromPublicKey,
  publicKeyFromPrivate,
} from '@pokt-foundation/pocketjs-utils'
import { syncScrypt } from 'scrypt-js'
import { InvalidPPKError } from './errors'

interface Account {
  address: string
  publicKey: string
  privateKey: string
}

const HEX_REGEX = /^[0-9a-fA-F]+$/
// Scrypt-related constants
const SCRYPT_HASH_LENGTH = 32
const SCRYPT_OPTIONS = {
  N: 32768,
  r: 8,
  p: 1,
  maxmem: 4294967290,
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
    return Buffer.from(
      Sodium.crypto_sign_detached(
        Buffer.from(payload, 'hex'),
        Buffer.from(this.getPrivateKey(), 'hex')
      )
    ).toString('hex')
  }

  /**
   * Creates a new, random Pocket account.
   * @returns {KeyManager} - A new Key Manager instance with the account attached.
   * */
  static async createRandom(): Promise<KeyManager> {
    await Sodium.ready
    const keypair = Sodium.crypto_sign_keypair()
    const privateKey = Buffer.from(keypair.privateKey).toString('hex')
    const publicKey = Buffer.from(keypair.publicKey).toString('hex')
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
   * Instanciates a new KeyManager from a valid Portable-Private-Key file.
   * @param {string} password - The password that was used in the PPK.
   * @param {string} ppk - The stringified PPK.
   * @returns {KeyManager} - A new Key Manager instance with the account attached.
   * */
  static async fromPPK({
    password,
    ppk,
  }: {
    password: string
    ppk: string
  }): Promise<KeyManager> {
    const isPPKValid = this.validatePPKJSON(ppk)

    if (!isPPKValid) {
      throw new InvalidPPKError()
    }

    const jsonObject = JSON.parse(ppk)
    const scryptHashLength = 32
    const ivLength = Number(jsonObject.secparam)
    const tagLength = 16
    const algorithm = 'aes-256-gcm'
    const scryptOptions = {
      N: 32768,
      r: 8,
      p: 1,
      maxmem: 4294967290,
    }
    // Retrieve the salt
    const decryptSalt = Buffer.from(jsonObject.salt, 'hex')
    // Scrypt hash
    const scryptHash = syncScrypt(
      Buffer.from(password, 'utf8'),
      decryptSalt,
      scryptOptions.N,
      scryptOptions.r,
      scryptOptions.p,
      scryptHashLength
    )
    // Create a buffer from the ciphertext
    const inputBuffer = Buffer.from(jsonObject.ciphertext, 'base64')

    // Create empty iv, tag and data constants
    const iv = scryptHash.slice(0, ivLength)
    const tag = inputBuffer.slice(inputBuffer.length - tagLength)
    const data = inputBuffer.slice(0, inputBuffer.length - tagLength)

    // Create the decipher
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(scryptHash),
      iv
    )
    // Set the auth tag
    decipher.setAuthTag(tag)
    // Update the decipher with the data to utf8
    let privateKey = decipher.update(data, undefined, 'utf8')
    privateKey += decipher.final('utf8')

    // generate public key and address from private key extracted
    const publicKey = publicKeyFromPrivate(privateKey)
    const addr = await getAddressFromPublicKey(publicKey)

    return new KeyManager({
      privateKey: privateKey.toString('hex'),
      publicKey,
      address: addr,
    })
  }

  /**
   * Exports a private key as a Portable-Private-Key, unlockable with the used password.
   * @param {string} password - The password to use in the PPK.
   * @param {string} privateKey - The private key to create the PPK from.
   * @param {string} hint - Password hint.
   * @returns {KeyManager} - A new Key Manager instance with the account attached.
   * */
  static async exportPPK({
    privateKey,
    password,
    hint,
  }: {
    privateKey: string
    password: string
    hint: string
  }): Promise<string> {
    const secParam = 12
    const algorithm = 'aes-256-gcm'
    const salt = crypto.randomBytes(16)
    const scryptHash = syncScrypt(
      Buffer.from(password, 'utf8'),
      salt,
      SCRYPT_OPTIONS.N,
      SCRYPT_OPTIONS.r,
      SCRYPT_OPTIONS.p,
      SCRYPT_HASH_LENGTH
    )
    // Create the nonce from the first 12 bytes of the sha256 Scrypt hash
    const scryptHashBuffer = Buffer.from(scryptHash)
    const iv = Buffer.allocUnsafe(secParam)
    scryptHashBuffer.copy(iv, 0, 0, secParam)
    // Generate ciphertext by using the privateKey, nonce and sha256 Scrypt hash
    const cipher = await crypto.createCipheriv(algorithm, scryptHashBuffer, iv)
    let cipherText = cipher.update(privateKey, 'utf8', 'hex')
    cipherText += cipher.final('hex')
    // Concatenate the ciphertext final + auth tag
    cipherText = cipherText + cipher.getAuthTag().toString('hex')
    // Returns the Armored JSON string
    return JSON.stringify({
      kdf: 'scrypt',
      salt: salt.toString('hex'),
      secparam: secParam.toString(),
      hint: hint,
      ciphertext: Buffer.from(cipherText, 'hex').toString('base64'),
    })
  }

  /**
   * Validates the PPK json string properties
   * @param {string} jsonStr - JSON String holding the ppk information.
   * @returns {boolean} True or false.
   */
  static validatePPKJSON(jsonStr: string): boolean {
    const jsonObject = JSON.parse(jsonStr)
    // Check if undefined
    if (
      jsonObject.kdf === undefined ||
      jsonObject.salt === undefined ||
      jsonObject.secparam === undefined ||
      jsonObject.ciphertext === undefined
    ) {
      return false
    }
    // Validate the properties
    if (
      jsonObject.kdf !== 'scrypt' ||
      !new RegExp(HEX_REGEX).test(jsonObject.salt) ||
      jsonObject.secparam <= 0 ||
      jsonObject.ciphertext.length <= 0
    ) {
      return false
    }
    return true
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
   * Exports a private key as a Portable-Private-Key, unlockable with the used password.
   * @param {string} password - The password to use in the PPK.
   * @param {string} hint - Password hint.
   * @returns {string} - The stringified PPK.
   * */
  async exportPPK({
    password,
    hint = '',
  }: {
    password: string
    hint?: string
  }): Promise<string> {
    return KeyManager.exportPPK({
      privateKey: this.getPrivateKey(),
      password,
      hint,
    })
  }

  /**
   * Checks if the Key Manager has all the required parts of an account.
   * @returns {boolean} - If the key manager is properly instanciated or not.
   * */
  isConnected(): boolean {
    return Boolean(this.privateKey && this.publicKey && this.address)
  }
}
