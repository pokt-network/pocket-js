export class InvalidChainIDError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params)
    this.message = message
    this.name = 'InvalidChainIDError'
  }
}
