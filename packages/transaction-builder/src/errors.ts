export class InvalidChainIDError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params)
    this.message = message
    this.name = 'InvalidChainIDError'
  }
}

export class NoProviderError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params)
    this.message = message
    this.name = 'NoProviderError'
  }
}

export class NoSignerError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params)
    this.message = message
    this.name = 'NoSignerError'
  }
}
