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
  DispatchRequest,
  DispatchResponse,
  SessionHeader,
} from '@pokt-foundation/pocketjs-types'
import { AbstractProvider } from './abstract-provider'
import { V1RpcRoutes } from './routes'

export class JsonRpcProvider implements AbstractProvider {
  private rpcUrl: string
  private dispatchers: string[]

  constructor({
    rpcUrl = '',
    dispatchers = [],
  }: {
    rpcUrl: string
    dispatchers?: string[]
  }) {
    this.rpcUrl = rpcUrl
    this.dispatchers = dispatchers ?? []
  }

  private async perform({
    route,
    body,
    rpcUrl,
  }: {
    route: V1RpcRoutes
    body: any
    rpcUrl?: string
  }): Promise<Response> {
    const finalRpcUrl = rpcUrl
      ? rpcUrl
      : route === V1RpcRoutes.ClientDispatch
      ? this.dispatchers[
          Math.floor(Math.random() * 100) % this.dispatchers.length
        ]
      : this.rpcUrl

    try {
      const rpcResponse = await fetch(`${finalRpcUrl}${route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      return rpcResponse
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return err
    }
  }

  async getBalance(address: string | Promise<string>): Promise<bigint> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryBalance,
      body: { address: await address },
    })
    const { balance } = await res.json()
    return balance as bigint
  }

  async getTransactionCount(
    address: string | Promise<string>
  ): Promise<number> {
    const txsRes = await this.perform({
      route: V1RpcRoutes.QueryAccountTxs,
      body: { address: await address },
    })
    const txs = await txsRes.json()

    if (!('total_count' in txs)) {
      throw new Error('RPC Error')
    }

    const { total_count } = txs

    return total_count
  }

  async getType(
    address: string | Promise<string>
  ): Promise<'node' | 'app' | 'account'> {
    const appRes = await this.perform({
      route: V1RpcRoutes.QueryApp,
      body: { address: await address },
    })
    const nodeRes = await this.perform({
      route: V1RpcRoutes.QueryNode,
      body: { address: await address },
    })
    const node = await nodeRes.json()
    const app = await appRes.json()

    if (!('service_url' in node) && 'max_relays' in app) {
      return 'app'
    }

    if ('service_url' in node && !('max_relays' in app)) {
      return 'node'
    }

    return 'account'
  }

  // Txs
  async sendTransaction(
    signerAddress: string | Promise<string>,
    signedTransaction: string | Promise<string>
  ): Promise<TransactionResponse> {
    const res = await this.perform({
      route: V1RpcRoutes.ClientRawTx,
      body: { address: await signerAddress, txHex: await signedTransaction },
    })

    const transactionResponse = await res.json()

    if (!('hash' in transactionResponse)) {
      throw new Error('RPC Error')
    }

    return transactionResponse
  }

  // Network
  async getBlock(blockNumber: number): Promise<Block> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryBlock,
      body: { height: blockNumber },
    })

    const block = await res.json()

    if (!('block' in block)) {
      throw new Error('RPC Error')
    }

    return block
  }

  async getTransaction(transactionHash: string): Promise<TransactionResponse> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryTX,
      body: { hash: transactionHash },
    })

    const tx = await res.json()

    if (!('hash' in tx)) {
      throw new Error('RPC Error')
    }

    return tx
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
      throw new Error('RPC Error')
    }

    const { chains, jailed, max_relays, public_key, staked_tokens, status } =
      app

    return {
      address: await address,
      chains,
      publicKey: public_key,
      jailed,
      maxRelays: BigInt(max_relays ?? 0),
      stakedTokens: BigInt(staked_tokens ?? 0),
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
      balance: BigInt(coins[0]?.amount ?? 0),
      publicKey: public_key,
    }
  }

  async getAccountWithTransactions(
    address: string | Promise<string>
  ): Promise<AccountWithTransactions> {
    const accountRes = await this.perform({
      route: V1RpcRoutes.QueryAccount,
      body: { address: await address },
    })
    const txsRes = await this.perform({
      route: V1RpcRoutes.QueryAccountTxs,
      body: { address: await address },
    })
    const account = await accountRes.json()
    const txs = await txsRes.json()

    if (!('address' in account)) {
      throw new Error('RPC Error')
    }
    if (!('total_count' in txs)) {
      throw new Error('RPC Error')
    }

    const { coins, public_key } = account
    const { total_count, txs: transactions } = txs

    return {
      address: await address,
      balance: BigInt(coins[0]?.amount ?? 0),
      publicKey: public_key,
      totalCount: total_count,
      transactions: transactions,
    }
  }

  async dispatch(request: DispatchRequest): Promise<DispatchResponse> {
    if (!this.dispatchers.length) {
      throw new Error('You need to have dispatchers to perform a dispatch call')
    }

    const dispatchRes = await this.perform({
      route: V1RpcRoutes.ClientDispatch,
      body: {
        app_public_key: request.sessionHeader.applicationPubKey,
        chain: request.sessionHeader.chain,
        session_height: request.sessionHeader.sessionBlockHeight,
      },
    })

    const dispatch = await dispatchRes.json()

    if (!('session' in dispatch)) {
      throw new Error('RPC Error')
    }

    const { block_height: blockHeight, session } = dispatch

    const { header, key, nodes } = session
    const formattedNodes: Node[] = nodes.map((node) => {
      const {
        address,
        chains,
        jailed,
        public_key,
        service_url,
        status,
        tokens,
        unstaking_time,
      } = node

      return {
        address,
        chains,
        publicKey: public_key,
        jailed,
        serviceUrl: service_url,
        stakedTokens: BigInt(tokens),
        status,
        unstakingTime: unstaking_time,
      } as Node
    })

    const formattedHeader: SessionHeader = {
      applicationPubKey: header.app_public_key,
      chain: header.chain,
      sessionBlockHeight: header.session_height,
    }

    return {
      blockHeight,
      session: {
        header: formattedHeader,
        nodes: formattedNodes,
        key,
      },
    }
  }

  async relay(request, rpcUrl: string): Promise<unknown> {
    const relayAttempt = await this.perform({
      route: V1RpcRoutes.ClientRelay,
      body: request,
      rpcUrl,
    })

    const relayResponse = await relayAttempt.json()

    return relayResponse
  }
}
