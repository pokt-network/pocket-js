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
    this.message = 'Provider node returned a invalid non JSON response'
  }
}
