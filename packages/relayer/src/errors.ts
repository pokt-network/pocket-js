export class PocketCoreError extends Error {
  code: number

  constructor(code: number, ...params: any[]) {
    super(...params)
    this.code = code
  }
}

export class EmptyPayloadError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, ...params)
    this.message = message
    this.name = 'EmptyPayloadError'
  }
}

export class RequestHashError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, ...params)
    this.message = message
    this.name = 'RequestHashError'
  }
}

export class UnsupportedBlockchainNodeError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, ...params)
    this.message = message
    this.name = 'UnsupportedBlockchainNodeError'
  }
}

export class InvalidBlockHeightError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, ...params)
    this.message = message
    this.name = 'InvalidBlockHeightError'
  }
}

export class AppNotFoundError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, ...params)
    this.message = message
    this.name = 'AppNotFoundError'
  }
}

export class SealedEvidenceError extends PocketCoreError {
  constructor(code: number, message: string, ...params: any[]) {
    super(code, ...params)
    this.message = message
    this.name = 'AppNotFoundError'
  }
}
