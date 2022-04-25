/* eslint-disable @typescript-eslint/no-empty-interface */
export interface RawTransactionResponse {
  logs: string | null
  txhash: string
}
export interface TransactionResponse {
  logs: string | null
  txHash: string
}

export interface Block {}

export interface GetNodesOptions {
  stakingStatus?: StakingStatus
  jailedStatus?: JailedStatus
  blockHeight?: number
  blockchain?: string
  page?: number
  perPage?: number
}

export interface GetAppsOptions {
  stakingStatus?: StakingStatus
  blockHeight?: number
  blockchain?: string
  page?: number
  perPage?: number
}

export enum StakingStatus {
  Unstaked = 0,
  Unstaking = 1,
  Staked = 2,
}

export enum JailedStatus {
  NA = '',
  Jailed = 1,
  Unjailed = 2,
}

export interface App {
  address: string
  chains: string[]
  jailed: boolean
  maxRelays: string
  publicKey: string
  stakedTokens: string
  status: StakingStatus
}

export interface PaginatedApp {
  apps: App[]
  page: number
  totalPages: number
  perPage: number
}

export interface Node {
  address: string
  chains: string[]
  jailed: boolean
  publicKey: string
  serviceUrl: string
  stakedTokens: string
  status: StakingStatus
  unstakingTime: string
}

export interface PaginatedNode {
  nodes: Node[]
  page: number
  totalPages: number
  perPage: number
}

export interface Account {
  address: string
  balance: string
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
  readonly blockHeight: number
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
  readonly blockHeight: number
  readonly session: Session
}

export interface RequestHash {
  readonly payload: RelayPayload
  readonly meta: RelayMeta
}

export interface RelayProof {
  readonly entropy: string
  readonly sessionBlockHeight: number
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
  readonly blockHeight: string
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

export * from './tx-request'
