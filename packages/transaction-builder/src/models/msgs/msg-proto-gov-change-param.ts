import { Buffer } from 'buffer'
import { MsgChangeParam } from './../proto/generated/tx-signer'
import { Any } from '../proto/generated/google/protobuf/any'
import { TxMsg } from './tx-msg'
import { GovParameter } from '../gov'

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
   * @param {string} paramValue - the plain text (ASCII) value the governance parameter will represent
   * @param {string} overrideGovParamsWhitelistValidation - In the event that the PocketJS does not support the specified paramKey, this parameter can be set to true to override the validation check.
   */
  public constructor(
    fromAddress: string,
    paramKey: GovParameter | string,
    paramValue: string,
    overrideGovParamsWhitelistValidation?: boolean
  ) {
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

    if (
      !overrideGovParamsWhitelistValidation &&
      !Object.values(GovParameter).includes(paramKey as GovParameter)
    ) {
      throw new Error(
        `${paramKey} is not a valid gov parameter, if this is an error, you can set overrideGovParamsWhitelistValidation to true to bypass the validation`
      )
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
        address: this.fromAddress.toLowerCase(),
        param_key: this.paramKey,
        param_value: Buffer.from(JSON.stringify(this.paramValue)).toString('base64')
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
      FromAddress: Buffer.from(this.fromAddress.toLowerCase(), 'hex'),
      paramKey: this.paramKey,
      paramVal: Buffer.from(
        Buffer.from(JSON.stringify(this.paramValue)).toString('base64'),
          'base64'
      ),
    }

    const result = Any.fromJSON({
      typeUrl: this.KEY,
      value: Buffer.from(MsgChangeParam.encode(data).finish()).toString(
        'base64'
      ),
    })

    return result
  }
}
