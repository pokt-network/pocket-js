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

export interface App {}

export interface Account {}

export type AccountWithTransactions = Account
