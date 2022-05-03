import { MockAgent, setGlobalDispatcher } from 'undici'
import { DEFAULT_URL } from './test-utils'
import { JsonRpcProvider } from '../src/json-rpc-provider'
import { V1RpcRoutes } from '@pokt-foundation/pocketjs-abstract-provider'
import { responseSamples } from './response-samples'

describe('JsonRpcProvider tests', () => {
  let provider: JsonRpcProvider
  let jsonRpcMockAgent: MockAgent
  let jsonRpcMockClient
  beforeEach(() => {
    provider = new JsonRpcProvider({
      rpcUrl: DEFAULT_URL,
      dispatchers: [DEFAULT_URL],
    })
    jsonRpcMockAgent = new MockAgent()
    jsonRpcMockAgent.disableNetConnect()
    jsonRpcMockClient = jsonRpcMockAgent.get(DEFAULT_URL)
    setGlobalDispatcher(jsonRpcMockAgent)
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
    await jsonRpcMockClient.close()
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
    await jsonRpcMockClient.close()
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
    await jsonRpcMockClient.close()
  })
  it('Gets the type of an app', async () => {
    jsonRpcMockClient
      .intercept({
        path: `${DEFAULT_URL}${V1RpcRoutes.QueryApp}`,
        method: 'POST',
        body: responseSamples.queryApp().request,
      })
      .reply(200, responseSamples.queryApp().response)
    jsonRpcMockClient
      .intercept({
        path: `${DEFAULT_URL}${V1RpcRoutes.QueryNode}`,
        method: 'POST',
        body: responseSamples.queryApp().request,
      })
      .reply(200, responseSamples.queryNodeFail().response)
    const ans = await provider.getType(
      '3808c2de7d2e8eeaa2e13768feb78b10b13c8699'
    )
    expect(ans).toBe('app')
    await jsonRpcMockClient.close()
  })
})
