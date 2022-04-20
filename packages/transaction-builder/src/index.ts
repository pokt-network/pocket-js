import { Buffer } from 'buffer'
import {
  MsgProtoAppStake,
  MsgProtoAppUnstake,
  MsgProtoNodeStakeTx,
  MsgProtoNodeUnjail,
  MsgProtoNodeUnstake,
  MsgProtoSend,
} from './models/msgs'
import { AbstractProvider } from '@pokt-foundation/pocketjs-abstract-provider'
import { KeyManager } from '@pokt-foundation/pocketjs-signer'
import {
  RawTxRequest,
  TransactionResponse,
} from '@pokt-foundation/pocketjs-types'
import { TxEncoderFactory } from './factory/tx-encoder-factory'
import { TxMsg, CoinDenom, TxSignature } from './models/'

export type ChainID = 'mainnet' | 'testnet' | 'localnet'

export const DEFAULT_BASE_FEE = '10000'

export class TransactionBuilder {
  private provider: AbstractProvider
  private signer: KeyManager
  private chainID: ChainID

  constructor({
    provider,
    signer,
    chainID = 'mainnet',
  }: {
    provider: AbstractProvider
    signer: KeyManager
    chainID: ChainID
  }) {
    this.provider = provider
    this.signer = signer
    this.chainID = chainID
  }

  /**
   * Signs and creates a transaction object that can be submitted to the network given the parameters and called upon Msgs.
   * Will empty the msg list after succesful creation
   * @param {string} fee - The amount to pay as a fee for executing this transaction
   * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount
   * @param {string | undefined} memo - The memo field for this account
   * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
   * @memberof TransactionSender
   */
  public async createTransaction({
    fee,
    feeDenom = CoinDenom.Upokt,
    memo = '',
    txMsg,
  }: {
    fee: string | bigint
    feeDenom: CoinDenom
    memo: string
    txMsg: TxMsg
  }): Promise<RawTxRequest> {
    // First, let's check if all required parameters are filled correctly
    // Let's avoid a footgun: if coindenom is not UPokt, let's make sure fee is not
    // DEFAULT_BASE_FEE
    if (feeDenom != CoinDenom.Upokt && fee == DEFAULT_BASE_FEE) {
      throw new Error(
        'You are using the POKT denomination and overpaying the base fee. Use a smaller amount.'
      )
    }

    // Let's make sure txMsg is defined.
    if (!txMsg) {
      throw new Error('txMsg should be defined.')
    }

    const entropy = Number(
      BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString()
    ).toString()

    const signer = TxEncoderFactory.createEncoder(
      entropy,
      this.chainID,
      txMsg,
      fee.toString(),
      feeDenom,
      memo
    )

    const bytesToSign = signer.marshalStdSignDoc()

    const txBytes = await this.signer.sign(bytesToSign.toString('hex'))

    const marshalledTx = new TxSignature(
      Buffer.from(this.signer.getPublicKey(), 'hex'),
      Buffer.from(txBytes, 'hex')
    )

    const rawHexBytes = signer.marshalStdTx(marshalledTx).toString('hex')

    return new RawTxRequest(this.signer.getAddress(), rawHexBytes)
  }

  public async submit({
    fee,
    feeDenom = CoinDenom.Upokt,
    memo = '',
    txMsg,
  }: {
    fee: string | bigint
    feeDenom: CoinDenom
    memo: string
    txMsg: TxMsg
  }): Promise<TransactionResponse> {
    const tx = await this.createTransaction({ fee, feeDenom, memo, txMsg })

    return await this.provider.sendTransaction(tx)
  }

  public async submitRawTransaction(
    tx: RawTxRequest
  ): Promise<TransactionResponse> {
    return await this.provider.sendTransaction(tx)
  }

  /**
   * Adds a MsgSend TxMsg for this transaction
   * @param {string} fromAddress - Origin address
   * @param {string} toAddress - Destination address
   * @param {string} amount - Amount to be sent, needs to be a valid number greater than 0
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public send(
    fromAddress: string,
    toAddress: string,
    amount: string
  ): MsgProtoSend {
    return new MsgProtoSend(fromAddress, toAddress, amount)
  }

  /**
   * Adds a MsgAppStake TxMsg for this transaction
   * @param {string} appPubKey - Application Public Key
   * @param {string[]} chains - Network identifier list to be requested by this app
   * @param {string} amount - the amount to stake, must be greater than 0
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public appStake(
    appPubKey: string,
    chains: string[],
    amount: string
  ): MsgProtoAppStake {
    return new MsgProtoAppStake(appPubKey, chains, amount)
  }

  /**
   * Adds a MsgBeginAppUnstake TxMsg for this transaction
   * @param {string} address - Address of the Application to unstake for
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public appUnstake(address: string): MsgProtoAppUnstake {
    return new MsgProtoAppUnstake(address)
  }

  /**
   * Adds a MsgAppStake TxMsg for this transaction
   * @param {string} nodePubKey - Node Public key
   * @param {string[]} chains - Network identifier list to be serviced by this node
   * @param {string} amount - the amount to stake, must be greater than 0
   * @param {URL} serviceURL - Node service url
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public nodeStake(
    nodePubKey: string,
    chains: string[],
    amount: string,
    serviceURL: URL
  ): MsgProtoNodeStakeTx {
    return new MsgProtoNodeStakeTx(nodePubKey, chains, amount, serviceURL)
  }

  /**
   * Adds a MsgBeginUnstake TxMsg for this transaction
   * @param {string} address - Address of the Node to unstake for
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public nodeUnstake(address: string): MsgProtoNodeUnstake {
    return new MsgProtoNodeUnstake(address)
  }

  /**
   * Adds a MsgUnjail TxMsg for this transaction
   * @param {string} address - Address of the Node to unjail
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public nodeUnjail(address: string): MsgProtoNodeUnjail {
    return new MsgProtoNodeUnjail(address)
  }
}
