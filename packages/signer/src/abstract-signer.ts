import { AbstractProvider } from '@pokt-foundation/pocketjs-provider'
import { TransactionResponse } from '@pokt-foundation/pocketjs-types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TransactionRequest {}

export abstract class AbstractSigner {
  readonly provider?: AbstractProvider // Provider that will send all calls
  readonly _isSigner: boolean // mark signer as a proper signer (useful for non-writable signers)

  constructor() {
    // Assume it's a void/readonly signer by default
    this._isSigner = false
  }

  abstract getAddress(): Promise<string>
  abstract getBalance(address: string | Promise<string>): Promise<bigint>
  abstract getTransactionCount(
    address: string | Promise<string>
  ): Promise<number>
  // Txs
  abstract sendTransaction(
    signedTransaction: string | Promise<string>
  ): Promise<TransactionResponse>
  abstract signMessage(message: string): Promise<string>
  abstract signTransaction(transaction: TransactionRequest): Promise<string>
}
