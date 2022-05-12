/* eslint-disable @typescript-eslint/no-empty-interface */
export interface Paginable<T> {
  data: T[]
  page: number
  totalPages: number
  perPage: number
}

export interface Timeoutable {
  timeout?: number
}

export interface RawTransactionResponse {
  logs: string | null
  txhash: string
}
export interface TransactionResponse {
  logs: string | null
  txHash: string
}

export interface Block {
  block: {
    data: {
      txs: string[]
    }
    evidence: {
      evidence: any
    }
    header: {
      app_hash: string
      chain_id: string
      consensus_hash: string
      data_hash: string
      evidence_hash: string
      height: string
      last_block_id: {
        hash: string
        parts: {
          hash: string
          total: string
        }
      }
      last_commit_hash: string
      last_results_hash: string
      next_validators_hash: string
      num_txs: string
      proposer_address: string
      time: string
      total_txs: string
      validators_hash: string
      version: {
        app: string
        block: string
      }
    }
    last_commit: {
      block_id: {
        hash: string
        parts: {
          hash: string
          total: string
        }
      }
      precommits: any[]
    }
  }
  block_id: {
    hash: string
    parts: {
      hash: string
      total: string
    }
  }
}

export interface Transaction {
  hash: string
  height: number
  index: number
  tx_result: {
    code: number
    data: string
    log: string
    info: string
    events: string[]
    codespace: string
    signer: string
    recipient: string
    message_type: string
  }
  tx: string
  proof: {
    root_hash: string
    data: string
    proof: {
      total: number
      index: number
      leaf_hash: string
      aunts: string[]
    }
  }
  stdTx: {
    entropy: number
    fee: {
      amount: string
      denom: string
    }[]
    memo: string
    msg: object
    signature: {
      pub_key: string
      signature: string
    }
  }
}

export interface PaginableBlockTransactions {
  pageCount: number
  totalTxs: number
  txs: Transaction[]
}

export interface GetPaginableOptions extends Timeoutable {
  page?: number
  perPage?: number
}

export interface GetBlockTransactionsOptions extends GetPaginableOptions {
  blockHeight?: number
  includeProofs?: boolean
}

export interface GetNodesOptions extends GetPaginableOptions {
  stakingStatus?: StakingStatus
  jailedStatus?: JailedStatus
  blockHeight?: number
  blockchain?: string
}

export interface GetAppsOptions extends GetPaginableOptions {
  stakingStatus?: StakingStatus
  blockHeight?: number
  blockchain?: string
}

export interface GetAccountWithTransactionsOptions extends GetPaginableOptions {
  received?: boolean
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
