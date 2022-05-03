import { setGlobalDispatcher } from 'undici'
import { DEFAULT_URL } from './test-utils'
import { JsonRpcProvider } from '../src/json-rpc-provider'
import {
  jsonRpcMockAgent,
  jsonRpcMockClient,
} from './json-rpc-provider-mock-agent'
import { responseSamples } from './response-samples'
import { V1RpcRoutes } from '@pokt-foundation/pocketjs-abstract-provider'

setGlobalDispatcher(jsonRpcMockAgent)

describe('JsonRpcProvider tests', () => {
  let provider: JsonRpcProvider
  beforeEach(() => {
    provider = new JsonRpcProvider({
      rpcUrl: DEFAULT_URL,
      dispatchers: [DEFAULT_URL],
    })
  })

  it('Gets the balance of an account', async () => {
    jsonRpcMockClient
      .intercept({
        path: `${DEFAULT_URL}${V1RpcRoutes.QueryBalance}`,
        method: 'POST',
        body: responseSamples.balance().request,
      })
      .reply(200, responseSamples.balance().response)
    const ans = await provider.getBalance(
      'ce16bb2714f93cfb3c00b5bd4b16dc5d8ca1687a'
    )
    expect(ans.toString()).toBe(
      responseSamples.balance().response.balance.toString()
    )
  })

  it('Gets the transaction count of an account', async () => {
    jsonRpcMockClient
      .intercept({
        path: `${DEFAULT_URL}${V1RpcRoutes.QueryAccountTxs}`,
        method: 'POST',
        body: responseSamples.accountTxs().request,
      })
      .reply(200, responseSamples.accountTxs().response)
    const ans = await provider.getTransactionCount(
      'ce16bb2714f93cfb3c00b5bd4b16dc5d8ca1687a'
    )
    expect(ans).toBe(responseSamples.accountTxs().response.total_txs)
  })

  it('Gets the type of an account', async () => {
    jsonRpcMockClient
      .intercept({
        path: `${DEFAULT_URL}${V1RpcRoutes.QueryApp}`,
        method: 'POST',
        body: responseSamples.queryAppFail().request,
      })
      .reply(200, responseSamples.queryAppFail().response)
    jsonRpcMockClient
      .intercept({
        path: `${DEFAULT_URL}${V1RpcRoutes.QueryNode}`,
        method: 'POST',
        body: responseSamples.queryNodeFail().request,
      })
      .reply(200, responseSamples.queryNodeFail().response)
    const ans = await provider.getType(
      'ce16bb2714f93cfb3c00b5bd4b16dc5d8ca1687a'
    )
    expect(ans).toBe('account')
  })
})

export {}
