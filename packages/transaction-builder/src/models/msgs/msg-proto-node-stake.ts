import { Buffer } from 'buffer'
import { MsgProtoNodeStake8 } from './../proto/generated/tx-signer'
import { Any } from '../proto/generated/google/protobuf/any'
import { TxMsg } from './tx-msg'

const MINIMUM_STAKE_AMOUNT = 15000000000

/**
 * Model representing a MsgNodeStake to stake as an Node in the Pocket Network
 */
export class MsgProtoNodeStakeTx extends TxMsg {
  public readonly KEY: string = '/x.nodes.MsgProtoStake8'
  public readonly AMINO_KEY: string = 'pos/8.0MsgStake'
  public readonly DEFAULT_PORT: string = '443'
  public readonly DEFAULT_PROTOCOL: string = 'https:'
  public readonly pubKey: Buffer
  public readonly outputAddress: Buffer
  public readonly chains: string[]
  public readonly amount: string
  public readonly serviceURL: URL
  public readonly rewardDelegators: { [key: string]: number } | undefined

  /**
   * @param {string} pubKey - Public key
   * @param {string[]} chains - String array containing a list of blockchain hashes
   * @param {string} amount - Amount to be sent, has to be a valid number and cannot be lesser than 0
   * @param {URL} serviceURL - Service node URL, needs to be https://
   * @param {Object.<string, number>} rewardDelegators - Reward delegators
   */
  constructor(
    pubKey: string,
    outputAddress: string,
    chains: string[],
    amount: string,
    serviceURL: URL,
    rewardDelegators: { [key: string]: number } | undefined,
  ) {
    super()
    this.pubKey = Buffer.from(pubKey, 'hex')
    this.outputAddress = Buffer.from(outputAddress, 'hex')
    this.chains = chains
    this.amount = amount
    this.serviceURL = serviceURL
    this.rewardDelegators = rewardDelegators

    if (!this.serviceURL.port) {
      this.serviceURL.port = '443'
    }

    const amountNumber = Number(this.amount)

    if (isNaN(amountNumber)) {
      throw new Error('Amount is not a valid number')
    } else if (amountNumber < MINIMUM_STAKE_AMOUNT) {
      throw new Error(
        `Amount below minimum stake amount (${MINIMUM_STAKE_AMOUNT})`
      )
    } else if (this.chains.length === 0) {
      throw new Error('Chains is empty')
    }
  }

  /**
   * Returns the parsed serviceURL
   * @returns {string} - Parsed serviceURL
   * @memberof MsgNodeStake
   */
  private getParsedServiceURL(): string {
    return `${
      this.serviceURL.protocol
        ? this.serviceURL.protocol
        : this.DEFAULT_PROTOCOL
    }//${this.serviceURL.hostname}:${
      this.serviceURL.port ? this.serviceURL.port : this.DEFAULT_PORT
    }`
  }

  /**
   * Converts an Msg Object to StdSignDoc
   * @returns {object} - Msg type key value.
   * @memberof MsgNodeStake
   */
  public toStdSignDocMsgObj(): object {
    const msg = {
      chains: this.chains,
      output_address: this.outputAddress.toString('hex'),
      public_key: {
        type: 'crypto/ed25519_public_key',
        value: this.pubKey.toString('hex'),
      },
      service_url: this.getParsedServiceURL(),
      value: this.amount,
    };
    if (this.rewardDelegators) {
      msg['reward_delegators'] = this.rewardDelegators;
    }
    return {
      type: this.AMINO_KEY,
      value: msg,
    }
  }

  /**
   * Converts an Msg Object to StdSignDoc
   * @returns {any} - Msg type key value.
   * @memberof MsgNodeStake
   */
  public toStdTxMsgObj(): any {
    const data = {
      Publickey: this.pubKey,
      Chains: this.chains,
      value: this.amount,
      ServiceUrl: this.getParsedServiceURL(),
      OutAddress: this.outputAddress,
      RewardDelegators: this.rewardDelegators || {},
    }

    return Any.fromJSON({
      typeUrl: this.KEY,
      value: Buffer.from(MsgProtoNodeStake8.encode(data).finish()).toString(
        'base64'
      ),
    })
  }
}
