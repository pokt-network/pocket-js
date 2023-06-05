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

    if (upgrade.Height == 0) {
      throw new Error('upgrade height cannot be zero')
    }

    if (upgrade.Version.length == 0) {
      throw new Error(
        'version cannot be empty, it should be a semantic version or FEATURE'
      )
    }

    // Validate that features are provided
    if (upgrade.Version == 'FEATURE') {
      if (upgrade.Height != 1) {
        throw new Error('Features cannot be added unless height is 1')
      }

      const zeroFeatures = upgrade.Features.length == 0
      if (zeroFeatures) {
        throw new Error(
          'Zero features was provided to upgrade, despite being a feature upgrade.'
        )
      }

      upgrade.Features.forEach((f) => {
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
    } else {
      // Version upgrade but features were added
      if (upgrade.Features.length > 0) {
        throw new Error('Features cannot be added unless version is FEATURE')
      }
    }
  }
  /**
   * Converts an Msg Object to StdSignDoc
   * @returns {object} - Msg type key value.
   * @memberof MsgSend
   */
  public toStdSignDocMsgObj(): object {
    // Upgrades are conditional
    let upgradeMsg: {
      Features?: string[]
      Height: string
      Version: string
    } = {
      ...(this.upgrade.Features.length > 0 && {
        Features: this.upgrade.Features,
      }),
      Height: `${this.upgrade.Height}`,
      Version: this.upgrade.Version,
    }

    return {
      type: this.AMINO_KEY,
      value: {
        address: this.fromAddress.toLowerCase(),
        upgrade: upgradeMsg,
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
      address: Buffer.from(this.fromAddress.toLowerCase(), 'hex'),
      upgrade: this.upgrade,
    }

    const result = Any.fromJSON({
      typeUrl: this.KEY,
      value: Buffer.from(MsgUpgrade.encode(data).finish()).toString('base64'),
    })

    return result
  }
}
