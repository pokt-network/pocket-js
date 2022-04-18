import { Buffer } from 'buffer'
import { fromUint8Array } from 'hex-lite'
import {
  MsgProtoSend,
  MsgProtoAppStake,
  MsgProtoAppUnstake,
  MsgProtoAppUnjail,
  MsgProtoNodeStakeTx,
  MsgProtoNodeUnstake,
  MsgProtoNodeUnjail,
} from './models/msgs'
import { TxMsg, CoinDenom, TxSignature, TransactionSignature } from './models/'
import { ITransactionSender } from './index'
import { KeyManager } from '@pokt-foundation/pocketjs-signer'
import { getAddressFromPublickey } from '@pokt-foundation/utils'
import { TxEncoderFactory } from './factory/tx-encoder-factory'

export class TransactionSender implements ITransactionSender {
  private txMsg?: TxMsg
  private unlockedAccount?: UnlockedAccount
  private pocket: Pocket
  private txSigner?: TransactionSigner
  private txMsgError?: Error

  /**
   * Constructor for this class. Requires either an unlockedAccount or txSigner
   * @param {Pocket} pocket - Pocket instance
   * @param {UnlockedAccount} unlockedAccount - Unlocked account
   * @param {TransactionSigner} txSigner - Transaction signer
   */
  public constructor(
    pocket: Pocket,
    unlockedAccount?: UnlockedAccount,
  ) {
    this.unlockedAccount = unlockedAccount
    this.pocket = pocket

    if (this.unlockedAccount === undefined && this.txSigner === undefined) {
      throw new Error('Need to define unlockedAccount or txSigner')
    }
  }

  /**
   * Signs and creates a transaction object that can be submitted to the network given the parameters and called upon Msgs.
   * Will empty the msg list after succesful creation
   * @param {string} chainID - The chainID of the network to be sent to
   * @param {string} fee - The amount to pay as a fee for executing this transaction
   * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount
   * @param {string | undefined} memo - The memo field for this account
   * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
   * @memberof TransactionSender
   */
  public async createTransaction(
    chainID: string,
    fee: string,
    feeDenom?: CoinDenom,
    memo?: string
  ): Promise<RawTxRequest | RpcError> {
    try {
      if (this.txMsgError !== undefined) {
        const rpcError = RpcError.fromError(this.txMsgError)
        this.txMsg = undefined
        this.txMsgError = undefined
        return rpcError
      }

      if (this.txMsg === undefined) {
        return new RpcError('0', 'No messages configured for this transaction')
      }

      const entropy = Number(
        BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString()
      ).toString()
      const signer = TxEncoderFactory.createEncoder(
        entropy,
        chainID,
        this.txMsg,
        fee,
        feeDenom,
        memo
      )
      let txSignatureOrError
      const bytesToSign = signer.marshalStdSignDoc()
      if (typeGuard(this.unlockedAccount, UnlockedAccount)) {
        txSignatureOrError = await this.signWithUnlockedAccount(
          bytesToSign,
          this.unlockedAccount as UnlockedAccount
        )
      }  else {
        return new RpcError('0', 'No account or TransactionSigner specified')
      }

      if (!typeGuard(txSignatureOrError, TxSignature)) {
        return new RpcError('0', 'Error generating signature for transaction')
      }

      const txSignature = txSignatureOrError as TxSignature
      const addressHex = getAddressFromPublickey(txSignature.pubKey)
      const encodedTxBytes = signer.marshalStdTx(txSignature)
      // Clean message and error
      this.txMsg = undefined
      this.txMsgError = undefined

      const txRequest = new RawTxRequest(
        addressHex.toString('hex'),
        encodedTxBytes.toString('hex')
      )
      return txRequest
    } catch (error) {
      return RpcError.fromError(error as Error)
    }
  }

  /**
   * Signs and submits a transaction to the network given the parameters for each Msg in the Msg list. Will empty the msg list after submission attempt
   * @param {string} chainID - The chainID of the network to be sent to
   * @param {string} fee - The amount to pay as a fee for executing this transaction
   * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount
   * @param {string | undefined} memo - The memo field for this account
   * @param {number | undefined} timeout - Request timeout
   * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
   * @memberof TransactionSender
   */
  public async submit(
    chainID: string,
    fee: string,
    feeDenom?: CoinDenom,
    memo?: string,
    timeout?: number
  ): Promise<RawTxResponse | RpcError> {
    try {
      const rawTxRequestOrError = await this.createTransaction(
        chainID,
        fee,
        feeDenom,
        memo
      )

      if (!typeGuard(rawTxRequestOrError, RawTxRequest)) {
        return rawTxRequestOrError
      }
      const rawTxRequest = rawTxRequestOrError as RawTxRequest

      // Clean message and error
      this.txMsg = undefined
      this.txMsgError = undefined
      const response = await this.pocket
        .rpc()!
        .client.rawtx(rawTxRequest.address, rawTxRequest.txHex, timeout)

      return response
    } catch (error) {
      return RpcError.fromError(error as Error)
    }
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
  ): ITransactionSender {
    try {
      this.txMsg = new MsgProtoSend(fromAddress, toAddress, amount)
    } catch (error) {
      this.txMsgError = error as Error
    }
    return this
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
  ): ITransactionSender {
    try {
      this.txMsg = new MsgProtoAppStake(appPubKey, chains, amount)
    } catch (error) {
      this.txMsgError = error as Error
    }
    return this
  }

  /**
   * Adds a MsgBeginAppUnstake TxMsg for this transaction
   * @param {string} address - Address of the Application to unstake for
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public appUnstake(address: string): ITransactionSender {
    try {
      this.txMsg = new MsgProtoAppUnstake(address)
    } catch (error) {
      this.txMsgError = error as Error
    }
    return this
  }

  /**
   * Adds a MsgAppUnjail TxMsg for this transaction
   * @param {string} address - Address of the Application to unjail
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public appUnjail(address: string): ITransactionSender {
    try {
      this.txMsg = new MsgProtoAppUnjail(address)
    } catch (error) {
      this.txMsgError = error as Error
    }
    return this
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
  ): ITransactionSender {
    try {
      this.txMsg = new MsgProtoNodeStakeTx(
        nodePubKey,
        chains,
        amount,
        serviceURL
      )
    } catch (error) {
      this.txMsgError = error as Error
    }
    return this
  }

  /**
   * Adds a MsgBeginUnstake TxMsg for this transaction
   * @param {string} address - Address of the Node to unstake for
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public nodeUnstake(address: string): ITransactionSender {
    try {
      this.txMsg = new MsgProtoNodeUnstake(address)
    } catch (error) {
      this.txMsgError = error as Error
    }
    return this
  }

  /**
   * Adds a MsgUnjail TxMsg for this transaction
   * @param {string} address - Address of the Node to unjail
   * @returns {ITransactionSender} - A transaction sender.
   * @memberof TransactionSender
   */
  public nodeUnjail(address: string): ITransactionSender {
    try {
      this.txMsg = new MsgProtoNodeUnjail(address)
    } catch (error) {
      this.txMsgError = error as Error
    }
    return this
  }

  /**
   * Signs using the unlockedAccount attribute of this class
   * @param {Buffer} bytesToSign - Bytes to be signed
   * @param {UnlockedAccount} unlockedAccount - Unlocked account for signing
   * @returns {TxSignature | Error} - A transaction signature or error.
   * @memberof TransactionSender
   */
  private async signWithUnlockedAccount(
    bytesToSign: Buffer,
    unlockedAccount: KeyManager
  ): Promise<TxSignature | Error> {
    const signature = await unlockedAccount.sign(fromUint8Array(bytesToSign)))
    return new TxSignature(
      unlockedAccount.publicKey,
      Buffer.from(signature, 'hex')
    )
  }
}
