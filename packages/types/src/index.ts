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
    Staked = 2
}

export interface App {
  address: string
  chains: string[],
  jailed: boolean,
  maxRelays: bigint,
  publicKey: string,
  stakedTokens: bigint,
  status: StakingStatus
}

export interface Account {
  address: string
  balance: bigint
  publicKey: null | string
}

export type AccountWithTransactions = Account
