import { Buffer } from 'buffer'
import { MsgDAOTransfer } from './../proto/generated/tx-signer'
import { Any } from '../proto/generated/google/protobuf/any'
import { TxMsg } from './tx-msg'
import { DAOAction } from '../gov'

/**
 * Model representing a MsgGovDAOTransfer to send POKT from the DAO Module Account to another account
 */
export class MsgProtoGovDAOTransfer extends TxMsg {
  public readonly fromAddress: string
  public readonly toAddress: string
  public readonly amount: string
  public readonly KEY: string = '/x.gov.MsgDAOTransfer'
  public readonly AMINO_KEY: string = 'gov/msg_dao_transfer'
  public readonly action: DAOAction

  /**
   * Constructor this message
   * @param {string} fromAddress - DAOOwner Address
   * @param {string} toAddress - Destination address
   * @param {string} amount - Amount to be sent, needs to be a valid number greater than 0
   * @param {CoinDenom | undefined} amountDenom  - Amount value denomination
   * @param {DAOAction} action  - dao action to perform for transfers
   */
  public constructor(
    fromAddress: string,
    toAddress: string,
    amount: string,
    action: DAOAction
  ) {
    super()
    this.fromAddress = fromAddress
    this.toAddress = toAddress || ''
    this.amount = amount
    this.action = action

    if (fromAddress.length == 0) {
      throw new Error('fromAddress cannot be empty')
    }

    if (fromAddress === toAddress) {
      throw new Error('fromAddress cannot be equal to toAddress')
    }

    const amountNumber = Number(this.amount)

    if (isNaN(amountNumber)) {
      throw new Error('Amount is not a valid number')
    } else if (amountNumber < 0) {
      throw new Error('Amount < 0')
    }

    // Whitelisting valid actions just in case someone ignores types.
    if (!Object.values(DAOAction).includes(action)) {
      throw new Error('Invalid DAOAction: ' + action)
    }

    if (action == DAOAction.Transfer && toAddress.length == 0) {
      throw new Error('toAddress cannot be empty if action is transfer')
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
        action: this.action.toString(),
        amount: this.amount,
        from_address: this.fromAddress.toLowerCase(),
        to_address: this.toAddress.toLowerCase(),
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
      fromAddress: Buffer.from(this.fromAddress.toLowerCase(), 'hex'),
      toAddress: Buffer.from(this.toAddress.toLowerCase(), 'hex'),
      amount: this.amount,
      action: this.action.toString(),
    }

    const result = Any.fromJSON({
      typeUrl: this.KEY,
      value: Buffer.from(MsgDAOTransfer.encode(data).finish()).toString(
        'base64'
      ),
    })

    return result
  }
}
