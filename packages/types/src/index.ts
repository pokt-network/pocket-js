/* eslint-disable @typescript-eslint/no-empty-interface */
export interface TransactionResponse {
  code?: BigInt
  codeSpace?: string
  data?: string
  hash: string
  height: BigInt
  info?: string
  rawLog?: string
  timestamp?: string
  tx?: string
}

export interface Block {}

export interface GetNodesOptions {}

export interface GetAppOptions {}

export enum StakingStatus {
  Unstaked = 0,
  Unstaking = 1,
  Staked = 2,
}

export interface App {
  address: string
  chains: string[]
  jailed: boolean
  maxRelays: bigint
  publicKey: string
  stakedTokens: bigint
  status: StakingStatus
}

export interface Node {
  address: string
  chains: string[]
  jailed: boolean
  publicKey: string
  serviceUrl: string
  stakedTokens: bigint
  status: StakingStatus
  unstakingTime: string
}

export interface Account {
  address: string
  balance: bigint
  publicKey: null | string
}

export type AccountWithTransactions = Account & {
  totalCount: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any[]
}

export interface SessionHeader {
  readonly applicationPubKey: string
  readonly chain: string
  readonly sessionBlockHeight: string | number
}

export type RelayHeaders = Record<string, string>

export interface PocketAAT {
  readonly version: string
  readonly clientPublicKey: string
  readonly applicationPublicKey: string
  readonly applicationSignature: string
}

export interface Session {
  readonly header: SessionHeader
  readonly key: string
  readonly nodes: Node[]
}

export enum HTTPMethod {
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
  NA = '',
}

export interface DispatchRequest {
  readonly sessionHeader: SessionHeader
}

export interface DispatchResponse {
  readonly blockHeight: BigInt
  readonly session: Session
}

export interface RequestHash {
  readonly payload: RelayPayload
  readonly meta: RelayMeta
}

export interface RelayProof {
  readonly entropy: BigInt
  readonly sessionBlockHeight: BigInt
  readonly servicerPubKey: string
  readonly blockchain: string
  readonly token: PocketAAT
  readonly signature: string
  readonly requestHash: string
}

export interface RelayPayload {
  readonly data: string
  readonly method: string
  readonly path: string
  readonly headers?: RelayHeaders | null
}

export interface RelayMeta {
  readonly blockHeight: bigint
}

export interface RelayRequest {
  readonly payload: RelayPayload
  readonly meta: RelayMeta
  readonly proof: RelayProof
}

export interface RelayResponse {
  readonly signature: string
  readonly payload: string
  readonly proof: RelayProof
  readonly relayRequest: RelayRequest
}

export {}
