import { TransactionResponse } from '@pokt-foundation/pocketjs-types'

export class PocketCoreError extends Error {
  code: number
  message: string

  constructor(code: number, message: string, ...params: any[]) {
    super(...params)
    this.code = code
    this.message = message
  }
}

export enum PocketCoreErrorCodes {
  UnauthorizedError = 4,
}

export class DispatchersFailureError extends Error {
  constructor(...params: any[]) {
    super(...params)
    this.name = 'DispatchersFailureError'
    this.message = 'Failed to obtain a session due to dispatchers failure'
  }
}

export class RelayFailureError extends Error {
  constructor(...params: any[]) {
    super(...params)
    this.name = 'RelayFailureError'
    this.message = 'Provider node returned an invalid non JSON response'
  }
}

export class TimeoutError extends Error {
  constructor(...params: any[]) {
    super(...params)
    this.name = 'TimeoutError'
    this.message = 'Provider timed out during request'
  }
}

export class SignatureVerificationFailedError extends PocketCoreError {
  constructor(message: string, ...params: any[]) {
    super(PocketCoreErrorCodes.UnauthorizedError, message, ...params)
    this.name = 'SignatureVerificationFailedError'
  }
}

export function validateTransactionResponse(transactionResponse: any) {
  if (!('code' in transactionResponse) && !('raw_log' in transactionResponse)) {
    return {
      logs: transactionResponse.logs,
      txHash: transactionResponse.txhash,
    } as TransactionResponse
  }

  switch (transactionResponse.code) {
    case PocketCoreErrorCodes.UnauthorizedError:
      throw new SignatureVerificationFailedError(
        'Signature verification failed for the transaction. Make sure you have the correct parameters and that your ChainID is either "mainnet", "testnet", or "localnet"'
      )
    default:
      throw new PocketCoreError(
        transactionResponse.code,
        transactionResponse?.raw_log ?? ''
      )
  }
}

/**
 * Error thrown when a transaction cannot be found on the blockchain.
 * This typically occurs when querying for a transaction hash that doesn't exist
 * or hasn't been confirmed yet.
 */
export class TransactionNotFoundError extends Error {
  public readonly transactionHash: string

  constructor(transactionHash: string, details?: string) {
    const message = details
      ? `Transaction not found: ${transactionHash}. Details: ${details}`
      : `Transaction not found: ${transactionHash}`
    super(message)
    this.name = 'TransactionNotFoundError'
    this.transactionHash = transactionHash
    Object.setPrototypeOf(this, TransactionNotFoundError.prototype)
  }
}

/**
 * Error thrown when attempting to access a transaction that is still pending.
 * Reserved for future implementation when pending transaction detection is added.
 */
export class PendingTransactionError extends Error {
  public readonly transactionHash: string

  constructor(transactionHash: string, estimatedTimeMs?: number) {
    const message = estimatedTimeMs
      ? `Transaction is pending: ${transactionHash}. Estimated confirmation time: ${estimatedTimeMs}ms`
      : `Transaction is pending: ${transactionHash}`
    super(message)
    this.name = 'PendingTransactionError'
    this.transactionHash = transactionHash
    Object.setPrototypeOf(this, PendingTransactionError.prototype)
  }
}
