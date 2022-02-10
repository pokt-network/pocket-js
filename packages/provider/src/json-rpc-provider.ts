import {
  Account,
  AccountWithTransactions,
  App,
  Block,
  GetAppOptions,
  GetNodesOptions,
  TransactionResponse,
} from '@pokt-foundation/pocketjs-types'
import { AbstractProvider } from './abstract-provider'

export class JsonRpcProvider implements AbstractProvider {
  getNetwork(): Promise<string> {
    throw new Error('Not implemented')
  }
  getBalance(address: string | Promise<string>): Promise<bigint> {
    throw new Error('Not implemented')
  }
  getTransactionCount(address: string | Promise<string>): Promise<number> {
    throw new Error('Not implemented')
  }
  getType(
    address: string | Promise<string>
  ): Promise<'node' | 'app' | 'account'> {
    throw new Error('Not implemented')
  }

  // Txs
  sendTransaction(
    signedTransaction: string | Promise<string>
  ): Promise<TransactionResponse> {
    throw new Error('Not implemented')
  }
  // Network
  getBlock(blockNumber: number): Promise<Block> {
    throw new Error('Not implemented')
  }
  getBlockWithTransactions(blockHeight: number): Promise<Block> {
    throw new Error('Not implemented')
  }
  getTransaction(transactionHash: string): Promise<TransactionResponse> {
    throw new Error('Not implemented')
  }
  getBlockNumber(): Promise<number> {
    throw new Error('Not implemented')
  }
  getNodes(getNodesOptions: GetNodesOptions): Promise<Node[]> {
    throw new Error('Not implemented')
  }
  getNode(address: string | Promise<string>, GetNodeOptions): Promise<Node> {
    throw new Error('Not implemented')
  }
  getApps(getAppOption: GetAppOptions): Promise<App[]> {
    throw new Error('Not implemented')
  }
  getApp(address: string | Promise<string>, GetAppOptions): Promise<App> {
    throw new Error('Not implemented')
  }
  getAccount(address: string | Promise<string>): Promise<Account> {
    throw new Error('Not implemented')
  }
  getAccountWithTransactions(
    address: string | Promise<string>
  ): Promise<AccountWithTransactions> {
    throw new Error('Not implemented')
  }
}
