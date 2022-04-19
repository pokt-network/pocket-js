/**
 * Represents a /v1/rawtx RPC request
 */
export class RawTxRequest {
  public readonly address: string
  public readonly rawHexBytes: string

  /**
   * Constructor for this class
   * @param {string} address - The address hex of the sender
   * @param {string} rawHexBytes - The transaction bytes in hex format
   */
  public constructor(address: string, rawHexBytes: string) {
    this.address = address
    this.rawHexBytes = rawHexBytes
  }

  /**
   * JSON representation of this model
   * @returns {object} The JSON request specified by the /v1/rawtx RPC call
   */
  public toJSON(): { address: string; raw_hex_bytes: string } {
    return {
      address: this.address,
      raw_hex_bytes: this.rawHexBytes,
    }
  }
}
