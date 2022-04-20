import { KeyManager } from '@pokt-foundation/pocketjs-signer'
import { JsonRpcProvider } from '@pokt-foundation/pocketjs-provider'
import { ChainID, TransactionBuilder } from '../src/tx-builder'
import {
  MsgProtoAppStake,
  MsgProtoAppUnstake,
  MsgProtoNodeUnstake,
  MsgProtoNodeStakeTx,
  MsgProtoSend,
  MsgProtoNodeUnjail,
} from '../src/models'

const PRIVATE_KEY =
  '1f8cbde30ef5a9db0a5a9d5eb40536fc9defc318b8581d543808b7504e0902bcb243b27bc9fbe5580457a46370ae5f03a6f6753633e51efdaf2cf534fdc26cc3'
const PUBLIC_KEY =
  'b243b27bc9fbe5580457a46370ae5f03a6f6753633e51efdaf2cf534fdc26cc3'
const ADDRESS = 'b50a6e20d3733fb89631ae32385b3c85c533c560'
const SIGNED_MESSAGE =
  '5d04dfc0d0e579d815f761b452c7d01e5f20a71b9fb66dbbeb1959cffed9da0a621ee06dfd11171757f9c9541768eaf59cce75ac4acc1ad122556ec26e166108'

describe('TransactionBuilder: tests', () => {
  it('Creates a new TransactionBuilder with the provided params', async () => {
    const signer = await KeyManager.fromPrivateKey(PRIVATE_KEY)
    const provider = new JsonRpcProvider({ rpcUrl: 'http://localhost:8081' })
    const chainID = 'mainnet'

    const transactionBuilder = new TransactionBuilder({
      provider,
      signer,
      chainID,
    })

    expect(transactionBuilder.getChainID()).toBe(chainID)
  })

  it('Can switch the chainID on the fly', async () => {
    const signer = await KeyManager.fromPrivateKey(PRIVATE_KEY)
    const provider = new JsonRpcProvider({ rpcUrl: 'http://localhost:8081' })
    let chainID = 'mainnet'

    const transactionBuilder = new TransactionBuilder({
      provider,
      signer,
      chainID: chainID as ChainID,
    })

    expect(transactionBuilder.getChainID()).toBe(chainID)

    chainID = 'testnet'
    transactionBuilder.setChainID(chainID as ChainID)
    expect(transactionBuilder.getChainID()).toBe(chainID)
  })

  it('Creates properly formatted messages without errors', async () => {
    const signer = await KeyManager.fromPrivateKey(PRIVATE_KEY)
    const provider = new JsonRpcProvider({ rpcUrl: 'http://localhost:8081' })
    const chainID = 'mainnet'

    const transactionBuilder = new TransactionBuilder({
      provider,
      signer,
      chainID,
    })

    const sendMsg = transactionBuilder.send(
      'b50a6e20d3733fb89631ae32385b3c85c533c560',
      'fcf719ca739dccbc281b12bc0d671aaa7a015848',
      '1000000'
    )
    expect(sendMsg instanceof MsgProtoSend).toBe(true)

    const appStakeMsg = transactionBuilder.appStake(
      PUBLIC_KEY,
      ['0040'],
      '69420000000'
    )
    expect(appStakeMsg instanceof MsgProtoAppStake).toBe(true)

    const appUnstakeMsg = transactionBuilder.appUnstake(ADDRESS)
    expect(appUnstakeMsg instanceof MsgProtoAppUnstake).toBe(true)

    const nodeStakeMsg = transactionBuilder.nodeStake(
      signer.getPublicKey(),
      ['0040'],
      '69420000000',
      new URL('https://mofongonodes.co:8081')
    )
    expect(nodeStakeMsg instanceof MsgProtoNodeStakeTx).toBe(true)

    const nodeUnstakeMsg = transactionBuilder.nodeUnstake(signer.getAddress())
    expect(nodeUnstakeMsg instanceof MsgProtoNodeUnstake).toBe(true)

    const nodeUnjailMsg = transactionBuilder.nodeUnjail(signer.getAddress())
    expect(nodeUnjailMsg instanceof MsgProtoNodeUnjail).toBe(true)
  })
})

export {}
