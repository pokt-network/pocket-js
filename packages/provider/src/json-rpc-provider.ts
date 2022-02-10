import fetch from 'isomorphic-unfetch'
import {
  Account,
  AccountWithTransactions,
  App,
  Node,
  Block,
  GetAppOptions,
  GetNodesOptions,
  TransactionResponse,
} from '@pokt-foundation/pocketjs-types'
import { AbstractProvider } from './abstract-provider'
import { V1RpcRoutes } from './routes'

export class JsonRpcProvider implements AbstractProvider {
  private rpcUrl: string

  constructor({ rpcUrl = '' }: { rpcUrl: string }) {
    this.rpcUrl = rpcUrl
  }

  getNetwork(): Promise<string> {
    throw new Error('Not implemented')
  }

  private perform({
    route,
    body,
  }: {
    route: V1RpcRoutes
    body: any
  }): Promise<Response> {
    return fetch(`${this.rpcUrl}${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  async getBalance(address: string | Promise<string>): Promise<bigint> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryBalance,
      body: { address: await address },
    })
    const { balance } = await res.json()
    return balance as bigint
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

  async getBlockNumber(): Promise<number> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryHeight,
      body: {},
    })

    const { height } = await res.json()

    if (!height) {
      throw new Error('RPC Error')
    }

    return height
  }

  getNodes(getNodesOptions: GetNodesOptions): Promise<Node[]> {
    throw new Error('Not implemented')
  }

  async getNode(
    address: string | Promise<string>,
    GetNodeOptions
  ): Promise<Node> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryNode,
      body: { address: await address },
    })
    const node = await res.json()

    if (!('chains' in node)) {
      console.log(node)
      throw new Error('RPC Error')
    }

    const {
      chains,
      jailed,
      public_key,
      service_url,
      status,
      tokens,
      unstaking_time,
    } = node

    return {
      address: await address,
      chains,
      publicKey: public_key,
      jailed,
      serviceUrl: service_url,
      stakedTokens: BigInt(tokens),
      status,
      unstakingTime: unstaking_time,
    }
  }

  getApps(getAppOption: GetAppOptions): Promise<App[]> {
    throw new Error('Not implemented')
  }

  async getApp(
    address: string | Promise<string>,
    options: GetAppOptions
  ): Promise<App> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryApp,
      body: { address: await address },
    })
    const app = await res.json()

    if (!('chains' in app)) {
      console.log(app)
      throw new Error('RPC Error')
    }

    const { chains, jailed, max_relays, public_key, staked_tokens, status } =
      app

    return {
      address: await address,
      chains,
      publicKey: public_key,
      jailed,
      maxRelays: BigInt(max_relays),
      stakedTokens: BigInt(staked_tokens),
      status,
    }
  }

  async getAccount(address: string | Promise<string>): Promise<Account> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryAccount,
      body: { address: await address },
    })
    const account = await res.json()

    if (!('address' in account)) {
      throw new Error('RPC Error')
    }

    const { coins, public_key } = account

    return {
      address: await address,
      balance: BigInt(coins[0].amount),
      publicKey: public_key,
    }
  }

  getAccountWithTransactions(
    address: string | Promise<string>
  ): Promise<AccountWithTransactions> {
    throw new Error('Not implemented')
  }
}
