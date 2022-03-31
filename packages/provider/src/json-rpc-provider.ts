import AbortController from 'abort-controller'
import { fetch, Response } from 'undici'
import {
  Account,
  AccountWithTransactions,
  App,
  Block,
  DispatchRequest,
  DispatchResponse,
  GetAppOptions,
  GetNodesOptions,
  Node,
  SessionHeader,
  TransactionResponse,
} from '@pokt-foundation/pocketjs-types'
import { AbstractProvider } from '@pokt-foundation/pocketjs-abstract-provider'
import {
  DispatchersFailureError,
  RelayFailureError,
  TimeoutError,
} from './errors'
import { V1RpcRoutes } from './routes'

const DEFAULT_TIMEOUT = 1000

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
    timeout = DEFAULT_TIMEOUT,
    retryAttempts = 0,
    retriesPerformed = 0,
  }: {
    route: V1RpcRoutes
    body: any
    rpcUrl?: string
    timeout?: number
    retryAttempts?: number
    retriesPerformed?: number
  }): Promise<Response> {
    const shouldRetryOnFailure = retriesPerformed < retryAttempts
    const performRetry = () =>
      this.perform({
        route,
        body,
        rpcUrl,
        timeout,
        retryAttempts,
        retriesPerformed: retriesPerformed + 1,
      })

    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeout)

    const finalRpcUrl = rpcUrl
      ? rpcUrl
      : route === V1RpcRoutes.ClientDispatch
      ? this.dispatchers[
          Math.floor(Math.random() * 100) % this.dispatchers.length
        ]
      : this.rpcUrl

    const rpcResponse = await fetch(`${finalRpcUrl}${route}`, {
      method: 'POST',
      signal: controller.signal as AbortSignal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).catch((error) => {
      if (shouldRetryOnFailure) {
        return performRetry()
      } else {
        throw error
      }
    })

    // Fetch can fail by either throwing due to a network error or responding with
    // ok === false on 40x/50x so both situations be explicitly handled separately.
    return !rpcResponse.ok && shouldRetryOnFailure
      ? performRetry()
      : rpcResponse
  }

  async getBalance(address: string | Promise<string>): Promise<bigint> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryBalance,
      body: { address: await address },
    })
    const { balance } = (await res.json()) as { balance: bigint }
    return balance as bigint
  }

  async getTransactionCount(
    address: string | Promise<string>
  ): Promise<number> {
    const txsRes = await this.perform({
      route: V1RpcRoutes.QueryAccountTxs,
      body: { address: await address },
    })
    const txs = (await txsRes.json()) as any

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
    const node = (await nodeRes.json()) as any
    const app = (await appRes.json()) as any

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

    const transactionResponse = (await res.json()) as TransactionResponse

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

    const block = (await res.json()) as Block

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

    const tx = (await res.json()) as TransactionResponse

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

    const { height } = (await res.json()) as { height: number }

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
    const node = (await res.json()) as any

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
      stakedTokens: tokens.toString(),
      status,
      unstakingTime: unstaking_time,
    } as Node
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
    const app = (await res.json()) as any

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
      maxRelays: max_relays ?? 0,
      stakedTokens: staked_tokens ?? 0,
      status,
    } as App
  }

  async getAccount(address: string | Promise<string>): Promise<Account> {
    const res = await this.perform({
      route: V1RpcRoutes.QueryAccount,
      body: { address: await address },
    })
    const account = (await res.json()) as any

    if (!('address' in account)) {
      throw new Error('RPC Error')
    }

    const { coins, public_key } = account

    return {
      address: await address,
      balance: coins[0]?.amount ?? 0,
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
    const account = (await accountRes.json()) as any
    const txs = (await txsRes.json()) as any

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
      balance: coins[0]?.amount ?? 0,
      publicKey: public_key,
      totalCount: total_count,
      transactions: transactions,
    }
  }

  async dispatch(
    request: DispatchRequest,
    options: {
      retryAttempts?: number
      rejectSelfSignedCertificates?: boolean
      timeout?: number
    } = {
      retryAttempts: 0,
      rejectSelfSignedCertificates: false,
    }
  ): Promise<DispatchResponse> {
    if (!this.dispatchers.length) {
      throw new Error('You need to have dispatchers to perform a dispatch call')
    }

    try {
      const dispatchRes = await this.perform({
        route: V1RpcRoutes.ClientDispatch,
        body: {
          app_public_key: request.sessionHeader.applicationPubKey,
          chain: request.sessionHeader.chain,
          session_height: request.sessionHeader.sessionBlockHeight,
        },
        ...options
      })

      const dispatch = (await dispatchRes.json()) as any

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
          stakedTokens: tokens.toString(),
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
          blockHeight,
          header: formattedHeader,
          key,
          nodes: formattedNodes,
        },
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new TimeoutError()
      }
      throw new DispatchersFailureError()
    }
  }

  async relay(
    request,
    rpcUrl: string,
    options: {
      retryAttempts?: number
      rejectSelfSignedCertificates?: boolean
      timeout?: number
    } = {
      retryAttempts: 0,
      rejectSelfSignedCertificates: false,
    }
  ): Promise<unknown> {
    try {
      const relayAttempt = await this.perform({
        route: V1RpcRoutes.ClientRelay,
        body: request,
        rpcUrl,
        ...options,
      })

      const relayResponse = await relayAttempt.json()

      return relayResponse
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new TimeoutError()
      }
      throw new RelayFailureError()
    }
  }
}
