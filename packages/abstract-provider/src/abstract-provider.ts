import {
  Account,
  AccountWithTransactions,
  App,
  Block,
  GetAppsOptions,
  GetNodesOptions,
  Node,
  PaginatedApp,
  PaginatedNode,
  RawTxRequest,
  TransactionResponse,
} from '@pokt-foundation/pocketjs-types'

export abstract class AbstractProvider {
  // Account
  abstract getBalance(address: string | Promise<string>): Promise<bigint>
  abstract getTransactionCount(
    address: string | Promise<string>
  ): Promise<number>
  abstract getType(
    address: string | Promise<string>
  ): Promise<'node' | 'app' | 'account'>
  // Txs
  abstract sendTransaction(
    transaction: RawTxRequest
  ): Promise<TransactionResponse>
  // Network
  abstract getBlock(blockNumber: number): Promise<Block>
  abstract getTransaction(transactionHash: string): Promise<TransactionResponse>
  abstract getBlockNumber(): Promise<number>
  abstract getNodes(getNodesOptions: GetNodesOptions): Promise<PaginatedNode>
  abstract getNode({
    address,
    blockHeight,
  }: {
    address: string | Promise<string>
    blockHeight?: number
  }): Promise<Node>
  abstract getApps(getAppOption: GetAppsOptions): Promise<PaginatedApp>
  abstract getApp({
    address,
    blockHeight,
  }: {
    address: string | Promise<string>
    blockHeight?: number
  }): Promise<App>
  abstract getAccount(address: string | Promise<string>): Promise<Account>
  abstract getAccountWithTransactions(
    address: string | Promise<string>
  ): Promise<AccountWithTransactions>

  // TODO: Add methods for params/requestChallenge
}
