import { JsonRpcProvider } from '@pokt-foundation/pocketjs-provider'
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
  readonly provider: JsonRpcProvider
  readonly dispatchers: string[]

  constructor({ keyManager, provider, dispatchers }) {
    this.keyManager = keyManager
    this.provider = provider
    this.dispatchers = dispatchers
  }

  async getNewSession({
    chain,
    options,
  }: {
    chain: string
    options?: { retryAttempts: number; rejectSelfSignedCertificates: boolean }
    }): Promise<Session> {
      const dispatchResponse = await this.provider.dispatch({ sessionHeader: {
        applicationPubKey: this.keyManager.getPublicKey(),
        chain,
        sessionBlockHeight: 0,
      } })

      return dispatchResponse.session as Session
    }

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
    }) {
      console.log('nyom relay')
    }
}
