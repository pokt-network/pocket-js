import sha3 from 'js-sha3'
import { JsonRpcProvider } from '@pokt-foundation/pocketjs-provider'
import { AbstractSigner, KeyManager } from '@pokt-foundation/pocketjs-signer'
import {
  HTTPMethod,
  Node,
  PocketAAT,
  RelayHeaders,
  RelayPayload,
  Session,
} from '@pokt-foundation/pocketjs-types'
import { AbstractRelayer } from './abstract-relayer'
import {
  EmptyKeyManagerError,
  NoServiceNodeError,
  ServiceNodeNotInSessionError,
  validateRelayResponse,
} from './errors'

export class Relayer implements AbstractRelayer {
  readonly keyManager: KeyManager
  readonly provider: JsonRpcProvider
  readonly dispatchers: string[]

  constructor({ keyManager, provider, dispatchers }) {
    this.keyManager = keyManager
    this.provider = provider
    this.dispatchers = dispatchers
  }

  async getNewSession({
    applicationPubKey,
    chain,
    sessionBlockHeight = 0,
    options = {
      retryAttempts: 3,
      rejectSelfSignedCertificates: false,
    },
  }: {
    applicationPubKey?: string
    chain: string
    sessionBlockHeight?: number
    options?: {
      retryAttempts?: number
      rejectSelfSignedCertificates?: boolean
      timeout?: number
    }
  }): Promise<Session> {
    const dispatchResponse = await this.provider.dispatch(
      {
        sessionHeader: {
          applicationPubKey:
            applicationPubKey ?? this.keyManager.getPublicKey(),
          chain,
          sessionBlockHeight: sessionBlockHeight ?? 0,
        },
      },
      options
    )

    return dispatchResponse.session as Session
  }

  static async relay({
    blockchain,
    data,
    headers = null,
    keyManager,
    method = '',
    node,
    path = '',
    pocketAAT,
    provider,
    session,
    options = {
      retryAttempts: 0,
      rejectSelfSignedCertificates: false,
    },
  }: {
    blockchain: string
    data: string
    headers?: RelayHeaders | null
    keyManager: KeyManager | AbstractSigner
    method: HTTPMethod | ''
    node: Node
    path: string
    pocketAAT: PocketAAT
    provider: JsonRpcProvider
    session: Session
    options?: {
      retryAttempts?: number
      rejectSelfSignedCertificates?: boolean
      timeout?: number
    }
  }) {
    if (!keyManager) {
      throw new EmptyKeyManagerError('You need a signer to send a relay')
    }

    const serviceNode = node ?? Relayer.getRandomSessionNode(session)

    if (!serviceNode) {
      throw new NoServiceNodeError(`Couldn't find a service node to use.`)
    }

    if (!this.isNodeInSession(session, serviceNode)) {
      throw new ServiceNodeNotInSessionError(
        `Provided node is not in the current session`
      )
    }

    const servicerPubKey = serviceNode.publicKey

    const relayPayload = {
      data,
      method,
      path,
      headers,
    } as RelayPayload

    const relayMeta = {
      block_height: Number(session.header.sessionBlockHeight.toString()),
    }

    const requestHash = {
      payload: relayPayload,
      meta: relayMeta,
    }

    const entropy = Number(BigInt(Math.floor(Math.random() * 99999999999999)))

    const proofBytes = this.generateProofBytes({
      entropy,
      sessionBlockHeight: Number(session.header.sessionBlockHeight.toString()),
      servicerPublicKey: servicerPubKey,
      blockchain,
      pocketAAT,
      requestHash,
    })
    const signedProofBytes = await keyManager.sign(proofBytes)

    const relayProof = {
      entropy: Number(entropy.toString()),
      session_block_height: Number(
        session.header.sessionBlockHeight.toString()
      ),
      servicer_pub_key: servicerPubKey,
      blockchain,
      aat: {
        version: pocketAAT.version,
        app_pub_key: pocketAAT.applicationPublicKey,
        client_pub_key: pocketAAT.clientPublicKey,
        signature: pocketAAT.applicationSignature,
      },
      signature: signedProofBytes,
      request_hash: this.hashRequest(requestHash),
    }

    const relayRequest = {
      payload: relayPayload,
      meta: relayMeta,
      proof: relayProof,
    }

    const relay = await provider.relay(
      relayRequest,
      serviceNode.serviceUrl.toString(),
      options
    )

    const relayResponse = await validateRelayResponse(relay)

    return {
      response: relayResponse,
      relayProof: {
        entropy: relayProof.entropy,
        sessionBlockheight: relayProof.session_block_height,
        servicerPubKey: servicerPubKey,
        blockchain,
        aat: {
          version: pocketAAT.version,
          appPubKey: pocketAAT.applicationPublicKey,
          clientPubKey: pocketAAT.clientPublicKey,
          signature: pocketAAT.applicationSignature,
        },
        signature: signedProofBytes,
        requestHash: this.hashRequest(requestHash),
      },
      serviceNode,
    }
  }

  async relay({
    blockchain,
    data,
    headers = null,
    method = '',
    node,
    path = '',
    pocketAAT,
    session,
    options = {
      retryAttempts: 0,
      rejectSelfSignedCertificates: false,
    },
  }: {
    data: string
    blockchain: string
    pocketAAT: PocketAAT
    headers?: RelayHeaders | null
    method: HTTPMethod | ''
    session: Session
    node: Node
    path: string
    options?: {
      retryAttempts?: number
      rejectSelfSignedCertificates?: boolean
      timeout?: number
    }
  }) {
    if (!this.keyManager) {
      throw new Error('You need a signer to send a relay')
    }
    const serviceNode = node ?? undefined

    return Relayer.relay({
      blockchain,
      data,
      headers,
      method,
      node: serviceNode,
      path,
      pocketAAT,
      session,
      keyManager: this.keyManager,
      provider: this.provider,
      options,
    })
  }

  static getRandomSessionNode(session: Session): Node {
    const nodesInSession = session.nodes.length
    const rng = Math.floor(Math.random() * 100) % nodesInSession

    return session.nodes[rng]
  }

  static isNodeInSession(session: Session, node: Node): boolean {
    return Boolean(session.nodes.find((n) => n.publicKey === node.publicKey))
  }

  static generateProofBytes({
    entropy,
    sessionBlockHeight,
    servicerPublicKey,
    blockchain,
    pocketAAT,
    requestHash,
  }: {
    entropy: bigint | string | number
    sessionBlockHeight: string | number
    servicerPublicKey: string
    blockchain: string
    pocketAAT: PocketAAT
    requestHash: any
  }): string {
    const proofJSON = {
      entropy: Number(entropy.toString()),
      session_block_height: Number(sessionBlockHeight.toString()),
      servicer_pub_key: servicerPublicKey,
      blockchain: blockchain,
      signature: '',
      token: this.hashAAT(pocketAAT),
      request_hash: this.hashRequest(requestHash),
    }
    const proofJSONStr = JSON.stringify(proofJSON)
    // Hash proofJSONStr
    const hash = sha3.sha3_256.create()
    hash.update(proofJSONStr)
    return hash.hex()
  }

  static hashAAT(aat: PocketAAT): string {
    const token = {
      version: aat.version,
      app_pub_key: aat.applicationPublicKey,
      client_pub_key: aat.clientPublicKey,
      signature: '',
    }
    const hash = sha3.sha3_256.create()
    hash.update(JSON.stringify(token))
    return hash.hex()
  }

  static hashRequest(requestHash): string {
    const hash = sha3.sha3_256.create()
    hash.update(JSON.stringify(requestHash))
    return hash.hex()
  }
}
