import crypto from 'isomorphic-webcrypto'
import debug from 'debug'
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
  private secureEnsured = false

  constructor({ keyManager, provider, dispatchers }) {
    this.keyManager = keyManager
    this.provider = provider
    this.dispatchers = dispatchers
  }

  /**
   * Performs a dispatch request to obtain a new session. Fails if no dispatcher is provided through the provider.
   * @param {string} applicationPubKey - The application's public key.
   * @param {string} chain - The chain for the session.
   * @param {string} sessionBlockHeight - The session block height. Defaults to 0, as usually you'd want the latest session.
   * @param {object} options - The options available to tweak the request itself.
   * @param {number} options.retryAttempts - The number of retries to perform if the first call fails.
   * @param {boolean} options.rejectSelfSignedCertificates - Option to reject self signed certificates or not.
   * @param {timeout} options.timeout - Timeout before the call fails. In milliseconds.
   * @returns {DispatchResponse} - The dispatch response from the dispatcher node.
   * */
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
    const logger = debug('Relayer')
    const startTime = process.hrtime()

    if (!keyManager) {
      logger('Found error: no keymanager')
      throw new EmptyKeyManagerError('You need a signer to send a relay')
    }

    const serviceNode = node ?? Relayer.getRandomSessionNode(session)

    if (!serviceNode) {
      logger('Found error: no service node to use')
      throw new NoServiceNodeError(`Couldn't find a service node to use.`)
    }

    if (!this.isNodeInSession(session, serviceNode)) {
      logger('Found error: provided node not in session')
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

    const entropy = this.getRandomIntInclusive()

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

    const totalTime = process.hrtime(startTime)
    logger(`Relay data structure generated, TOOK ${totalTime}`)

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

  /**
   * Sends a relay to the network.
   * @param {string} blockchain - The chain for the session.
   * @param {string} data - The data to send, stringified.
   * @param {object} headers - The headers to include in the call, if any.
   * @param {Node} node - The node to send the relay to. The node must belong to the current session.
   * @param {string} path - The path to query in the relay e.g "/v1/query/node". Useful for chains like AVAX.
   * @param {AAT} pocketAAT - The pocket AAT used to authenticate the relay.
   * @param {Session} session - The current session the app is assigned to.
   * @param {object} options - The options available to tweak the request itself.
   * @param {number} options.retryAttempts - The number of retries to perform if the first call fails.
   * @param {boolean} options.rejectSelfSignedCertificates - Option to reject self signed certificates or not.
   * @param {timeout} options.timeout - Timeout before the call fails. In milliseconds.
   * @returns {RelayResponse} - The relay response.
   * */
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

    // React native only:
    // If this SDK is used in a mobile context,
    // the native crypto library needs to be used in a secure context to properly
    // generate random values.
    if (!this.secureEnsured) {
      if (crypto.ensureSecure) {
        await crypto.ensureSecure()
      }
      this.secureEnsured = true
    }

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

  static getRandomIntInclusive(min = 0, max = Number.MAX_SAFE_INTEGER) {
    const randomBuffer = new Uint32Array(1)

    crypto.getRandomValues(randomBuffer)

    const randomNumber = randomBuffer[0] / (0xffffffff + 1)

    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(randomNumber * (max - min + 1)) + min
  }
}
