export enum PocketCoreErrorCodes {
  AppNotFoundError = 45,
  DuplicateProofError = 37,
  EmptyPayloadDataError = 25,
  EvidenceSealedError = 90,
  InvalidBlockHeightError = 60,
  OverServiceError = 71,
  RequestHashError = 74,
  UnsupportedBlockchainError = 76,
  HTTPExecutionError = 28
}

export class PocketCoreError extends Error {
  code: number
  message: string

  constructor(code: number, message: string, ...params: any[]) {
    super(...params)
    this.code = code
    this.message = message
  }
}

export class EmptyPayloadDataError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, message, ...params)
    this.name = 'EmptyPayloadError'
  }
}

export class RequestHashError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, message, ...params)
    this.name = 'RequestHashError'
  }
}

export class UnsupportedBlockchainError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, message, ...params)
    this.name = 'UnsupportedBlockchainError'
  }
}

export class InvalidBlockHeightError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, message, ...params)
    this.name = 'InvalidBlockHeightError'
  }
}

export class AppNotFoundError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, message, ...params)
    this.name = 'AppNotFoundError'
  }
}

export class EvidenceSealedError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, message, ...params)
    this.name = 'EvidenceSealedError'
  }
}

export class DuplicateProofError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, message, ...params)
    this.name = 'DuplicateProofError'
  }
}

export class OverServiceError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, message, ...params)
    this.name = 'OverServiceError'
  }
}

export class HTTPExecutionError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, message, ...params)
    this.name = 'HTTPExecutionError'
  }
}

export function validateRelayResponse(relayResponse: any) {
  if ('response' in relayResponse && 'signature' in relayResponse) {
    return relayResponse.response
  }

  // probably an unhandled error
  if (!('response' in relayResponse) && !('error' in relayResponse)) {
    return relayResponse
  }

  switch (relayResponse.error.code) {
    case PocketCoreErrorCodes.AppNotFoundError:
      throw new AppNotFoundError(
        PocketCoreErrorCodes.AppNotFoundError,
        relayResponse.error.message ?? ''
      )
    case PocketCoreErrorCodes.DuplicateProofError:
      throw new DuplicateProofError(
        PocketCoreErrorCodes.DuplicateProofError,
        relayResponse.error.message
      )
    case PocketCoreErrorCodes.EmptyPayloadDataError:
      throw new EmptyPayloadDataError(
        PocketCoreErrorCodes.EmptyPayloadDataError,
        relayResponse.error.message
      )
    case PocketCoreErrorCodes.EvidenceSealedError:
      throw new EvidenceSealedError(
        PocketCoreErrorCodes.EvidenceSealedError,
        relayResponse.error.message
      )
    case PocketCoreErrorCodes.InvalidBlockHeightError:
      throw new InvalidBlockHeightError(
        PocketCoreErrorCodes.InvalidBlockHeightError,
        relayResponse.error.message
      )
    case PocketCoreErrorCodes.OverServiceError:
      throw new OverServiceError(
        PocketCoreErrorCodes.OverServiceError,
        relayResponse.error.message
      )
    case PocketCoreErrorCodes.RequestHashError:
      throw new RequestHashError(
        PocketCoreErrorCodes.RequestHashError,
        relayResponse.error.message
      )
    case PocketCoreErrorCodes.UnsupportedBlockchainError:
      throw new UnsupportedBlockchainError(
        PocketCoreErrorCodes.UnsupportedBlockchainError,
        relayResponse.error.message
      )
    case PocketCoreErrorCodes.HTTPExecutionError:
      throw new HTTPExecutionError(
        PocketCoreErrorCodes.HTTPExecutionError,
        relayResponse.error.message
      )
    default:
      throw new PocketCoreError(
        relayResponse.error.code,
        relayResponse.error.message ?? ''
      )
  }
}
