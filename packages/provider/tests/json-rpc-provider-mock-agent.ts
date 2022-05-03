import { V1RpcRoutes } from '@pokt-foundation/pocketjs-abstract-provider'
import { MockAgent } from 'undici'
import { responseSamples } from './response-samples'
import { DEFAULT_URL } from './test-utils'

export const jsonRpcMockAgent = new MockAgent()

jsonRpcMockAgent.disableNetConnect()

export const jsonRpcMockClient = jsonRpcMockAgent.get(DEFAULT_URL)
