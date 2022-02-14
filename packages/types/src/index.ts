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
  readonly sessionBlockHeight: bigint
}

export interface PocketAAT {
  readonly version: string
  readonly clientPublicKey: string
  readonly applicationPublicKey: string
  readonly applicationSignature: string
}

export interface Session {
  readonly sessionHeader: SessionHeader
  readonly sessionKey: string
  readonly sessionNodes: Node[]
}

export {}
