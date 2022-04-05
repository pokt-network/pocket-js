import crypto from 'isomorphic-webcrypto'
import { fromUint8Array } from 'hex-lite'

/**
* Converts a valid hex string to a byte array.
* @param {string} str - The hex string to convert.
* @returns {Uint8Array} - A byte array with the converted hex string.
*
* */
function hexStringToByteArray(str: string): Uint8Array {
  const bytes: number[] = []
  for (let i = 0; i < str.length; i += 2) {
    bytes.push(parseInt(str.substr(i, 2), 16))
  }

  return new Uint8Array(bytes)
}

/**
 * Converts an Application's Public Key into an address.
 * @param publicKey the application's public key
 * @returns the application's address
 */
export async function getAddressFromPublicKey(
  publicKey: string
): Promise<string> {
  const hash = await crypto.subtle.digest(
    {
      name: 'SHA-256',
    },
    hexStringToByteArray(publicKey)
  )

  return fromUint8Array(new Uint8Array(hash)).slice(0, 40)
}
