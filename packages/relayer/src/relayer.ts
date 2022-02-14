import { AbstractProvider } from '@pokt-foundation/pocketjs-provider'
import { AbstractSigner, KeyManager } from '@pokt-foundation/pocketjs-signer'
import {
  HTTPMethod,
  Node,
  PocketAAT,
  RelayHeaders,
  RelayResponse,
  Session,
  SessionHeader,
} from '@pokt-foundation/pocketjs-types'
import { AbstractRelayer } from './abstract-relayer'

export class Relayer implements AbstractRelayer {
  readonly keyManager: KeyManager | AbstractSigner
  readonly provider: AbstractProvider
  readonly dispatchers: string[]

  constructor({ keyManager, provider, dispatchers }) {
    this.keyManager = keyManager
    this.provider = provider
    this.dispatchers = dispatchers
  }

  getNewSession({
    pocketAAT,
    chain,
    options,
  }: {
    pocketAAT: PocketAAT
    chain: string
    options?: { retryAttempts: number; rejectSelfSignedCertificates: boolean }
  }): Session {}

  relay({
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
  }): Promise<RelayResponse> {}
}
