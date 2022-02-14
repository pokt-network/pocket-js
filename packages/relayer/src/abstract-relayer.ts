import {
  Node,
  PocketAAT,
  Session,
  SessionHeader,
} from '@pokt-foundation/pocketjs-types'

export abstract class AbstractRelayer {
  abstract getNewSession(
    pocketAAT: PocketAAT,
    chain: string,
    options?: { retryAttempts: number; rejectSelfSignedCertificates: boolean }
  ): Session
}
