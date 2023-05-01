import { Buffer } from 'buffer'
import { MsgUpgrade, Upgrade } from './../proto/generated/tx-signer'
import { Any } from '../proto/generated/google/protobuf/any'
import { TxMsg } from './tx-msg'

/**
 * Model representing a MsgGovUpgrade to indicate an upgrade height for protocol updates, i.e consensus breaking changes
 */
export class MsgProtoGovUpgrade extends TxMsg {
  public readonly fromAddress: string
  public readonly upgrade: Upgrade

  public readonly KEY: string = '/x.gov.MsgUpgrade'
  public readonly AMINO_KEY: string = 'gov/msg_upgrade'

  /**
   * Constructor this message
   * @param {string} fromAddress - Origin address
   * @param {string} upgrade - the upgrade details such as upgrade height and features being activated
   */
  public constructor(fromAddress: string, upgrade: Upgrade) {
    super()
    this.fromAddress = fromAddress
    this.upgrade = upgrade

    if (fromAddress.length == 0) {
      throw new Error('fromAddress cannot be empty')
    }

    if (upgrade.height == 1 && upgrade.version == 'FEATURE') {
      const zeroFeatures = upgrade.features.length == 0
      if (zeroFeatures) {
        throw new Error(
          'Zero features was provided to upgrade, despite being a feature upgrade.'
        )
      }
      // just updating features
    } else {
      // updating height and potentially features
    }

    upgrade.features.forEach((f) => {
      const featureKeyHeightTuple = f.split(':')

      if (featureKeyHeightTuple.length != 2) {
        throw new Error(
          `${f} is malformed for feature upgrade, format should be: KEY:HEIGHT`
        )
      }

      const featureHeight = featureKeyHeightTuple[1]
      if (isNaN(parseInt(featureHeight))) {
        throw new Error(
          `${featureHeight} is malformed for feature upgrade, feature height should be an integer.`
        )
      }
    })
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
        upgrade: this.upgrade,
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
      address: Buffer.from(this.fromAddress, 'hex'),
      upgrade: this.upgrade,
    }

    const result = Any.fromJSON({
      typeUrl: this.KEY,
      value: Buffer.from(MsgUpgrade.encode(data).finish()).toString('base64'),
    })

    return result
  }
}
