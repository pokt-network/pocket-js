import {Buffer} from 'buffer'
import {MsgChangeParam} from './../proto/generated/tx-signer'
import {Any} from '../proto/generated/google/protobuf/any'
import {TxMsg} from './tx-msg'

/**
 * Model representing a MsgGovChangeParam to change an existing governance parameter
 */
export class MsgProtoGovChangeParam extends TxMsg {
  public readonly fromAddress: string
  public readonly paramKey: string
  public readonly paramValue: string
  public readonly KEY: string = '/x.gov.MsgChangeParam'
  public readonly AMINO_KEY: string = 'gov/msg_change_param'

  /**
   * Constructor this message
   * @param {string} fromAddress - Origin address
   * @param {string} paramKey - the acl key for governance parameter
   * @param {string} paramValue - the value the governance parameter will represent
   */
  public constructor(fromAddress: string, paramKey: string, paramValue: string) {
    super()
    this.fromAddress = fromAddress
    this.paramKey = paramKey
    this.paramValue = paramValue

    if (paramKey.length == 0) {
      throw new Error('paramKey cannot be empty')
    }

    if (paramValue.length == 0) {
      throw new Error('paramValue cannot be empty')
    }
  }
  /**
   * Converts an Msg Object to StdSignDoc
   * @returns {object} - Msg type key value.
   * @memberof MsgSend
   */
  public toStdSignDocMsgObj(): object {
    return {
      type: this.AMINO_KEY,
      value: {
        from_address: this.fromAddress.toLowerCase(),
        param_key: this.paramKey,
        param_val: this.paramValue,
      },
    }
  }

  /**
   * Converts an Msg Object to StdSignDoc
   * @returns {any} - Msg type key value.
   * @memberof MsgSend
   */
  public toStdTxMsgObj(): any {
    const data = {
      FromAddress: Buffer.from(this.fromAddress, 'hex'),
      paramKey:  this.paramKey,
      paramVal:  Buffer.from(this.paramValue, 'utf8'),
    }

    const result = Any.fromJSON({
      typeUrl: this.KEY,
      value: Buffer.from(MsgChangeParam.encode(data).finish()).toString('base64'),
    })

    return result
  }
}
