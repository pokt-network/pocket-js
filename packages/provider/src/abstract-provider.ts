import {
  Account,
  AccountWithTransactions,
  App,
  Block,
  GetAppOptions,
  GetNodesOptions,
  TransactionResponse,
} from '@pokt-foundation/pocketjs-types'

export abstract class AbstractProvider {
  // Account
  abstract getNetwork(): Promise<string> // mainnet or testnet
  abstract getBalance(address: string | Promise<string>): Promise<bigint>
  abstract getTransactionCount(
    address: string | Promise<string>
  ): Promise<number>
  abstract getType(
    address: string | Promise<string>
  ): Promise<'node' | 'app' | 'account'>
  // Txs
  abstract sendTransaction(
    signedTransaction: string | Promise<string>
  ): Promise<TransactionResponse>
  // Network
  abstract getBlock(blockNumber: number): Promise<Block>
  abstract getBlockWithTransactions(blockHeight: number): Promise<Block>
  abstract getTransaction(transactionHash: string): Promise<TransactionResponse>
  abstract getBlockNumber(): Promise<number>
  abstract getNodes(getNodesOptions: GetNodesOptions): Promise<Node[]>
  abstract getNode(
    address: string | Promise<string>,
    GetNodeOptions
  ): Promise<Node>
  abstract getApps(getAppOption: GetAppOptions): Promise<App[]>
  abstract getApp(
    address: string | Promise<string>,
    GetAppOptions
  ): Promise<App>
  abstract getAccount(address: string | Promise<string>): Promise<Account>
  abstract getAccountWithTransactions(
    address: string | Promise<string>
  ): Promise<AccountWithTransactions>

  // TODO: Add methods for params/requestChallenge
}
