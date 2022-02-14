import { AbstractSigner, KeyManager } from '@pokt-foundation/pocketjs-signer'
import { AbstractProvider } from '@pokt-foundation/pocketjs-provider'
import {
  HTTPMethod,
  Node,
  PocketAAT,
  RelayHeaders,
  RelayResponse,
  Session,
  SessionHeader,
} from '@pokt-foundation/pocketjs-types'

export abstract class AbstractRelayer {
  readonly keyManager: KeyManager | AbstractSigner
  readonly provider: AbstractProvider
  readonly dispatchers: string[]

  constructor({ keyManager, provider, dispatchers }) {
    this.keyManager = keyManager
    this.provider = provider
    this.dispatchers = dispatchers
  }

  abstract getNewSession({
    pocketAAT,
    chain,
    options,
  }: {
    pocketAAT: PocketAAT
    chain: string
    options?: { retryAttempts: number; rejectSelfSignedCertificates: boolean }
  }): Session

  abstract relay({
    data,
    blockchain,
    pocketAAT,
    headers,
    method,
    session,
    node,
    path,
  }: {
    data: string
    blockchain: string
    pocketAAT: PocketAAT
    headers: RelayHeaders
    method: HTTPMethod
    session: Session
    node: Node
    path: string
  }): Promise<RelayResponse>
}
