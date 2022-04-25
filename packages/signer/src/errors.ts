export class InvalidPPKError extends Error {
  constructor() {
    super()
    this.name = 'InvalidPPKError'
    this.message =
      'Invalid PPK. One or more of the properties of this PPK have been tampered with.'
  }
}
