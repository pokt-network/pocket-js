import { Buffer } from 'buffer'
import { MsgProtoStake } from '../proto/generated/tx-signer'
import { Any } from '../proto/generated/google/protobuf/any'
import { TxMsg } from './tx-msg'

/**
 * MsgProtoAppTransfer is a special case of MsgProtoAppStake where
 * chains and amount are not set
 */
export class MsgProtoAppTransfer extends TxMsg {
  public readonly KEY: string = '/x.apps.MsgProtoStake'
  public readonly AMINO_KEY: string = 'apps/MsgAppStake'
  public readonly pubKey: Buffer

  /**
   * Constructor for this class
   * @param {Buffer} pubKey - Application public key to be transferred to
   */
  constructor(pubKey: string) {
    super()
    this.pubKey = Buffer.from(pubKey, 'hex')
  }

  /**
   * Converts an Msg Object to StdSignDoc
   * @returns {object} - Msg type key value.
   * @memberof MsgAppStake
   */
  public toStdSignDocMsgObj(): object {
    return {
      type: this.AMINO_KEY,
      value: {
        chains: null,
        pubkey: {
          type: 'crypto/ed25519_public_key',
          value: this.pubKey.toString('hex'),
        },
        value: '0',
      },
    }
  }

  /**
   * Converts an Msg Object for StdTx encoding
   * @returns {any} - Msg type key value.
   * @memberof MsgAppStake
   */
  public toStdTxMsgObj(): any {
    const data : MsgProtoStake = {
      pubKey: this.pubKey,
      chains: [],
      value: '0',
    }

    return Any.fromJSON({
      typeUrl: this.KEY,
      value: Buffer.from(MsgProtoStake.encode(data).finish()).toString(
        'base64'
      ),
    })
  }
}
