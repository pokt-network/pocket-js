import sha3 from 'js-sha3'
import { JsonRpcProvider } from '@pokt-foundation/pocketjs-provider'
import { AbstractSigner, KeyManager } from '@pokt-foundation/pocketjs-signer'
import {
  HTTPMethod,
  Node,
  PocketAAT,
  RelayHeaders,
  RelayMeta,
  RelayPayload,
  RelayResponse,
  RequestHash,
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
    applicationPubKey,
    chain,
    options,
  }: {
    applicationPubKey?: string
    chain: string
    options?: { retryAttempts: number; rejectSelfSignedCertificates: boolean }
  }): Promise<Session> {
    const dispatchResponse = await this.provider.dispatch({
      sessionHeader: {
        applicationPubKey: applicationPubKey ?? this.keyManager.getPublicKey(),
        chain,
        sessionBlockHeight: 0,
      },
    })

    return dispatchResponse.session as Session
  }

  async relay({
    data,
    blockchain,
    pocketAAT,
    headers = null,
    method = '',
    session,
    node,
    path = '',
  }: {
    data: string
    blockchain: string
    pocketAAT: PocketAAT
    headers?: RelayHeaders | null
    method: HTTPMethod | ''
    session: Session
    node: Node
    path: string
  }) {
    if (!this.keyManager) {
      throw new Error('You need a signer to send a relay')
    }
    const serviceNode = node ?? this.getRandomSessionNode(session)

    if (!serviceNode) {
      throw new Error(`Couldn't find a service node.`)
    }

    if (!this.isNodeInSession(session, serviceNode)) {
      throw new Error(`Node is not in the current session`)
    }

    const servicerPubKey = serviceNode.publicKey

    const relayPayload = {
      data,
      method,
      path,
      headers,
    }

    const relayMeta = {
      block_height: Number(session.header.sessionBlockHeight.toString()),
    }

    const requestHash = {
      payload: relayPayload,
      meta: relayMeta,
    }

    const entropy = Number(
      BigInt(Math.floor(Math.random() * 99999999999999999))
    )

    const proofBytes = this.generateProofBytes({
      entropy,
      sessionBlockHeight: Number(session.header.sessionBlockHeight.toString()),
      servicerPublicKey: servicerPubKey,
      blockchain,
      pocketAAT,
      requestHash,
    })
    const signedProofBytes = await this.keyManager.sign(proofBytes)

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

    const relay = await this.provider.relay(relayRequest, serviceNode.serviceUrl.toString())

    return relay
  }

  getRandomSessionNode(session: Session): Node {
    const nodesInSession = session.nodes.length
    const rng = Math.floor(Math.random() * 100) % nodesInSession

    return session.nodes[rng]
  }

  isNodeInSession(session: Session, node: Node): boolean {
    return Boolean(
      session.nodes.find((n) => n.publicKey === node.publicKey)
    )
  }

  generateProofBytes({
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

  hashAAT(aat: PocketAAT): string {
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

  hashRequest(requestHash): string {
    const hash = sha3.sha3_256.create()
    hash.update(JSON.stringify(requestHash))
    return hash.hex()
  }
}
