import { KeyManager } from '@pokt-foundation/pocketjs-signer'
import { JsonRpcProvider } from '@pokt-foundation/pocketjs-provider'
import { ChainID, TransactionBuilder } from '../src/tx-builder'
import {
  DAOAction,
  FEATURE_UPGRADE_KEY,
  FEATURE_UPGRADE_ONLY_HEIGHT,
  GovParameter,
  MsgProtoAppStake,
  MsgProtoAppUnstake,
  MsgProtoNodeStakeTx,
  MsgProtoNodeUnjail,
  MsgProtoNodeUnstake,
  MsgProtoSend,
  OLD_UPGRADE_HEIGHT_EMPTY_VALUE,
} from '../src/models'
import { RawTxRequest } from '@pokt-foundation/pocketjs-types'
import { MsgProtoGovUpgrade } from '../src/models/msgs/msg-proto-gov-upgrade'
import { MsgProtoGovChangeParam } from '../src/models/msgs/msg-proto-gov-change-param'
import { MsgProtoGovDAOTransfer } from '../src/models/msgs/msg-proto-gov-dao-transfer'

const PRIVATE_KEY =
  '1f8cbde30ef5a9db0a5a9d5eb40536fc9defc318b8581d543808b7504e0902bcb243b27bc9fbe5580457a46370ae5f03a6f6753633e51efdaf2cf534fdc26cc3'
const PUBLIC_KEY =
  'b243b27bc9fbe5580457a46370ae5f03a6f6753633e51efdaf2cf534fdc26cc3'
const ADDRESS = 'b50a6e20d3733fb89631ae32385b3c85c533c560'

describe('TransactionBuilder Tests', () => {
  const serviceURL = new URL('http://localhost:8081')
  let signer: KeyManager,
    provider: JsonRpcProvider,
    chainID: ChainID,
    transactionBuilder: TransactionBuilder

  beforeAll(async () => {
    signer = await KeyManager.fromPrivateKey(PRIVATE_KEY)
    provider = new JsonRpcProvider({ rpcUrl: 'http://localhost:8081' })
    chainID = 'mainnet'

    transactionBuilder = new TransactionBuilder({
      provider,
      signer,
      chainID,
    })
  })

  it('Creates a new TransactionBuilder with the provided params', async () => {
    expect(transactionBuilder.getChainID()).toBe(chainID)
  })

  it('Can switch the chainID on the fly', async () => {
    expect(transactionBuilder.getChainID()).toBe(chainID)

    chainID = 'testnet'
    transactionBuilder.setChainID(chainID as ChainID)
    expect(transactionBuilder.getChainID()).toBe(chainID)

    transactionBuilder.setChainID('mainnet')
  })

  describe('TransactionBuilder:Messages:HappyPaths', () => {
    it('General happy path: creates properly formatted messages without errors', async () => {
      const signer = await KeyManager.fromPrivateKey(PRIVATE_KEY)
      const provider = new JsonRpcProvider({ rpcUrl: 'http://localhost:8081' })
      const chainID = 'mainnet'

      const transactionBuilder = new TransactionBuilder({
        provider,
        signer,
        chainID,
      })

      const sendMsg = transactionBuilder.send({
        toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
        amount: '1000000',
      })
      expect(sendMsg instanceof MsgProtoSend).toBe(true)
      expect(sendMsg.fromAddress).toBe(signer.getAddress())

      const appStakeMsg = transactionBuilder.appStake({
        appPubKey: PUBLIC_KEY,
        chains: ['0040'],
        amount: '69420000000',
      })
      expect(appStakeMsg instanceof MsgProtoAppStake).toBe(true)

      const appUnstakeMsg = transactionBuilder.appUnstake(ADDRESS)
      expect(appUnstakeMsg instanceof MsgProtoAppUnstake).toBe(true)

      const nodeStakeMsg = transactionBuilder.nodeStake({
        nodePubKey: signer.getPublicKey(),
        chains: ['0040'],
        amount: '69420000000',
        serviceURL: new URL('https://mofongonodes.co:8081'),
      })
      expect(nodeStakeMsg instanceof MsgProtoNodeStakeTx).toBe(true)

      const nodeUnstakeMsg = transactionBuilder.nodeUnstake({})
      expect(nodeUnstakeMsg instanceof MsgProtoNodeUnstake).toBe(true)

      const nodeUnjailMsg = transactionBuilder.nodeUnjail({})
      expect(nodeUnjailMsg instanceof MsgProtoNodeUnjail).toBe(true)

      // Governance TX Msg
      const govDaoTransferMsg = transactionBuilder.govDAOTransfer({
        action: DAOAction.Transfer,
        amount: '1',
        toAddress: '123',
      })
      expect(govDaoTransferMsg instanceof MsgProtoGovDAOTransfer).toBe(true)

      const govDaoBurnMsg = transactionBuilder.govDAOTransfer({
        toAddress: '',
        action: DAOAction.Burn,
        amount: '1',
      })
      expect(govDaoBurnMsg instanceof MsgProtoGovDAOTransfer).toBe(true)

      const govChangeParamMsg = transactionBuilder.govChangeParam({
        paramKey: GovParameter.GOV_Acl,
        paramValue: '123',
      })
      expect(govChangeParamMsg instanceof MsgProtoGovChangeParam).toBe(true)

      const govChangeParamMsgWithOverride = transactionBuilder.govChangeParam({
        paramKey: 'NewParamKey',
        paramValue: '123',
        overrideGovParamsWhitelistValidation: true,
      })
      expect(
        govChangeParamMsgWithOverride instanceof MsgProtoGovChangeParam
      ).toBe(true)

      const TEST_UPGRADE_HEIGHT = 20
      const TEST_UPGRADE_VERSION = '0.9.1.3'
      const TEST_UPGRADE_FEATURES = ['NCUST:93222', 'REDUP:9312']
      const govUpgradeAtHeightMsg = transactionBuilder.govUpgradeVersion({
        upgrade: {
          height: TEST_UPGRADE_HEIGHT,
          version: TEST_UPGRADE_VERSION,
        },
      })
      expect(govUpgradeAtHeightMsg instanceof MsgProtoGovUpgrade).toBe(true)
      expect(govUpgradeAtHeightMsg.fromAddress).toBe(signer.getAddress())
      expect(govUpgradeAtHeightMsg.upgrade.Height).toBe(`${TEST_UPGRADE_HEIGHT}`)
      expect(govUpgradeAtHeightMsg.upgrade.Features.length).toBe(0)
      expect(govUpgradeAtHeightMsg.upgrade.OldUpgradeHeight).toBe(
        OLD_UPGRADE_HEIGHT_EMPTY_VALUE
      )
      expect(govUpgradeAtHeightMsg.upgrade.Version).toBe(TEST_UPGRADE_VERSION)

      const govUpgradeFeaturesAtHeightMsg =
        transactionBuilder.govUpgradeFeatures({
          upgrade: {
            features: TEST_UPGRADE_FEATURES,
          },
        })
      expect(govUpgradeFeaturesAtHeightMsg instanceof MsgProtoGovUpgrade).toBe(
        true
      )
      expect(govUpgradeFeaturesAtHeightMsg.fromAddress).toBe(
        signer.getAddress()
      )
      expect(govUpgradeFeaturesAtHeightMsg.upgrade.Height).toBe(
        FEATURE_UPGRADE_ONLY_HEIGHT
      )
      expect(govUpgradeFeaturesAtHeightMsg.upgrade.Features).toEqual(
        TEST_UPGRADE_FEATURES
      )
      expect(govUpgradeFeaturesAtHeightMsg.upgrade.OldUpgradeHeight).toBe(
        OLD_UPGRADE_HEIGHT_EMPTY_VALUE
      )
      expect(govUpgradeFeaturesAtHeightMsg.upgrade.Version).toBe(
        FEATURE_UPGRADE_KEY
      )

      const govUpgradeMsg = transactionBuilder.govUpgrade({
        upgrade: {
          height: TEST_UPGRADE_HEIGHT,
          version: TEST_UPGRADE_VERSION,
          features: TEST_UPGRADE_FEATURES,
        },
      })
      expect(govUpgradeMsg instanceof MsgProtoGovUpgrade).toBe(true)
      expect(govUpgradeMsg.fromAddress).toBe(signer.getAddress())
      expect(govUpgradeMsg.upgrade.Height).toBe(`${TEST_UPGRADE_HEIGHT}`)
      expect(govUpgradeMsg.upgrade.Features.length).toBeGreaterThanOrEqual(1)
      expect(govUpgradeMsg.upgrade.OldUpgradeHeight).toBe(
        OLD_UPGRADE_HEIGHT_EMPTY_VALUE
      )
      expect(govUpgradeMsg.upgrade.Version).toBe(TEST_UPGRADE_VERSION)
    })
  })

  describe('TransactionBuilder:Messages:UnhappyPaths:MsgProtoSend', () => {
    test('Invalid case: same addresses', () => {
      expect(() =>
        transactionBuilder.send({
          fromAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          amount: '1000000',
        })
      ).toThrow(/fromAddress cannot be equal/)
    })
    test('Invalid case: amount < 0', () => {
      expect(() =>
        transactionBuilder.send({
          fromAddress: 'b50a6e20d3733fb89631ae32385b3c85c533c560',
          toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          amount: '-1',
        })
      ).toThrow(/Amount < 0/)
    })
    test('Invalid case: invalid input for amount', () => {
      expect(() =>
        transactionBuilder.send({
          fromAddress: 'b50a6e20d3733fb89631ae32385b3c85c533c560',
          toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          amount: 'adf80',
        })
      ).toThrow(/Amount is not a valid number/)
    })
  })

  describe('TransactionBuilder:Messages:UnhappyPaths:MsgProtoAppStake', () => {
    test('Invalid case: amount to stake too small (below 1 POKT)', () => {
      expect(() =>
        transactionBuilder.appStake({
          appPubKey: PUBLIC_KEY,
          chains: ['0040'],
          amount: '10000',
        })
      ).toThrow(/Amount should be bigger than/)
    })
    test('Invalid case: chains empty', () => {
      expect(() =>
        transactionBuilder.appStake({
          appPubKey: PUBLIC_KEY,
          chains: [],
          amount: '1000000',
        })
      ).toThrow(/empty/)
    })
    test('Invalid case: invalid input for amount', () => {
      expect(() =>
        transactionBuilder.appStake({
          appPubKey: PUBLIC_KEY,
          chains: ['0040'],
          amount: 'askdja0912',
        })
      ).toThrow(/Amount is not a valid number/)
    })
  })

  describe('TransactionBuilder:Messages:UnhappyPaths:MsgProtoNodeStakeTx', () => {
    test('Invalid case: amount to stake too small', () => {
      expect(() =>
        transactionBuilder.nodeStake({
          nodePubKey: PUBLIC_KEY,
          chains: ['0040'],
          amount: '69420',
          serviceURL: serviceURL,
        })
      ).toThrow(/Amount below minimum/)
    })
    test('Invalid case: chains empty', () => {
      expect(() =>
        transactionBuilder.nodeStake({
          nodePubKey: PUBLIC_KEY,
          chains: [],
          amount: '69420000000000',
          serviceURL: serviceURL,
        })
      ).toThrow(/empty/)
    })
    test('Invalid case: invalid input for amount', () => {
      expect(() =>
        transactionBuilder.nodeStake({
          nodePubKey: PUBLIC_KEY,
          chains: [],
          amount: 'asdfasd6778',
          serviceURL: serviceURL,
        })
      ).toThrow(/Amount is not a valid number/)
    })
  })

  describe('TransactionBuilder:Messages:UnhappyPaths:MsgProtoGovChangeParam', () => {
    test('Invalid case: paramKey empty', () => {
      expect(() =>
        transactionBuilder.govChangeParam({
          fromAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          paramKey: '',
          paramValue: 'v1wen',
        })
      ).toThrow(/paramKey cannot be empty/)
    })
    test('Invalid case: paramValue empty', () => {
      expect(() =>
        transactionBuilder.govChangeParam({
          fromAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          paramKey: GovParameter.GOV_DaoOwner,
          paramValue: '',
        })
      ).toThrow(/paramValue cannot be empty/)
    })

    test('Invalid case: invalid governance param without override', () => {
      expect(() =>
        transactionBuilder.govChangeParam({
          fromAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          paramKey: 'newParamKey',
          paramValue: 'paramValue',
        })
      ).toThrow(/is not a valid gov parameter/)
    })
  })

  describe('TransactionBuilder:Messages:UnhappyPaths:MsgProtoGovDAOTransfer', () => {
    test('Invalid case: from address empty', () => {
      expect(() =>
        transactionBuilder.govDAOTransfer({
          fromAddress: '',
          toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          action: DAOAction.Burn,
          amount: '1',
        })
      ).toThrow(/fromAddress cannot be empty/)
    })
    test('Invalid case: from and to the same', () => {
      expect(() =>
        transactionBuilder.govDAOTransfer({
          fromAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          action: DAOAction.Burn,
          amount: '1',
        })
      ).toThrow(/fromAddress cannot be equal to toAddress/)
    })
    test('Invalid case: amount < 0', () => {
      expect(() =>
        transactionBuilder.govDAOTransfer({
          fromAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015842',
          toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          action: DAOAction.Burn,
          amount: '-1',
        })
      ).toThrow(/Amount < 0/)
    })
    test('Invalid case: amount not number', () => {
      expect(() =>
        transactionBuilder.govDAOTransfer({
          fromAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015842',
          toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          action: DAOAction.Burn,
          amount: 'wee',
        })
      ).toThrow(/Amount is not a valid number/)
    })
    test('Invalid case: invalid action', () => {
      expect(() =>
        transactionBuilder.govDAOTransfer({
          fromAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015842',
          toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
          // @ts-ignore
          action: 'i bypassed type safety!',
          amount: '1',
        })
      ).toThrow(/Invalid DAOAction/)
    })
    test('Invalid case: action is transfer and toAddress is empty', () => {
      expect(() =>
        transactionBuilder.govDAOTransfer({
          fromAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015842',
          toAddress: '',
          action: DAOAction.Transfer,
          amount: '1',
        })
      ).toThrow(/toAddress cannot be empty if action is transfer/)
    })
  })

  describe('TransactionBuilder:Messages:UnhappyPaths:MsgProtoGovUpgrade', () => {
    test('Invalid case: from address empty', () => {
      expect(() =>
        transactionBuilder.govUpgrade({
          fromAddress: '',
          upgrade: {
            height: 1,
            version: 'FEATURE',
            features: ['NCUST:74620'],
          },
        })
      ).toThrow(/fromAddress cannot be empty/)
    })
    test('Invalid case: upgrade feature with empty features', () => {
      expect(() =>
        transactionBuilder.govUpgradeFeatures({
          upgrade: {
            features: [],
          },
        })
      ).toThrow(
        /Zero features was provided to upgrade, despite being a feature upgrade./
      )
    })
    test('Invalid case: upgrade feature with malformed feature tuple', () => {
      expect(() =>
        transactionBuilder.govUpgradeFeatures({
          upgrade: {
            features: ['REDUP,badHeight'],
          },
        })
      ).toThrow(
        /is malformed for feature upgrade, format should be: KEY:HEIGHT/
      )
    })
    test('Invalid case: upgrade feature with malformed height', () => {
      expect(() =>
        transactionBuilder.govUpgradeFeatures({
          upgrade: {
            features: ['REDUP:badHeight'],
          },
        })
      ).toThrow(
        /is malformed for feature upgrade, feature height should be an integer./
      )
    })
  })

  describe('TransactionBuilder:createTransaction:HappyPath', () => {
    test('Creates a RawTxRequest for MsgProtoSend', async () => {
      const txMsg = transactionBuilder.send({
        fromAddress: 'b50a6e20d3733fb89631ae32385b3c85c533c560',
        toAddress: 'fcf719ca739dccbc281b12bc0d671aaa7a015848',
        amount: '1000000',
      })

      const rawTxRequest = await transactionBuilder.createTransaction({ txMsg })

      expect(rawTxRequest instanceof RawTxRequest).toBe(true)
      expect(rawTxRequest.address).toBe(signer.getAddress())
    })
    test('Creates a RawTxRequest for MsgProtoAppStake', async () => {
      const txMsg = transactionBuilder.appStake({
        appPubKey: signer.getPublicKey(),
        chains: ['0040'],
        amount: '1000000',
      })

      const rawTxRequest = await transactionBuilder.createTransaction({ txMsg })

      expect(rawTxRequest instanceof RawTxRequest).toBe(true)
      expect(rawTxRequest.address).toBe(signer.getAddress())
    })
    test('Creates a RawTxRequest for MsgProtoAppUnstake', async () => {
      const txMsg = transactionBuilder.appUnstake(signer.getAddress())

      const rawTxRequest = await transactionBuilder.createTransaction({ txMsg })

      expect(rawTxRequest instanceof RawTxRequest).toBe(true)
      expect(rawTxRequest.address).toBe(signer.getAddress())
    })
    test('Creates a RawTxRequest for MsgProtoNodeStakeTx', async () => {
      const txMsg = transactionBuilder.nodeStake({
        nodePubKey: signer.getPublicKey(),
        chains: ['0040'],
        amount: '15000000000',
        serviceURL,
      })

      const rawTxRequest = await transactionBuilder.createTransaction({ txMsg })

      expect(rawTxRequest instanceof RawTxRequest).toBe(true)
      expect(rawTxRequest.address).toBe(signer.getAddress())
    })
    test('Creates a RawTxRequest for MsgProtoNodeUnstake', async () => {
      const txMsg = transactionBuilder.nodeUnstake({})

      const rawTxRequest = await transactionBuilder.createTransaction({ txMsg })

      expect(rawTxRequest instanceof RawTxRequest).toBe(true)
      expect(rawTxRequest.address).toBe(signer.getAddress())
    })
    test('Creates a RawTxRequest for MsgProtoNodeUnjail', async () => {
      const txMsg = transactionBuilder.nodeUnjail({})

      const rawTxRequest = await transactionBuilder.createTransaction({ txMsg })

      expect(rawTxRequest instanceof RawTxRequest).toBe(true)
      expect(rawTxRequest.address).toBe(signer.getAddress())
    })

    test('Creates a RawTxRequest for MsgProtoGovChangeParam', async () => {
      const txMsg = transactionBuilder.govChangeParam({
        paramKey: GovParameter.GOV_Acl,
        paramValue: '123',
      })

      const rawTxRequest = await transactionBuilder.createTransaction({ txMsg })

      expect(rawTxRequest instanceof RawTxRequest).toBe(true)
      expect(rawTxRequest.address).toBe(signer.getAddress())
    })

    test('Creates a RawTxRequest for MsgProtoGovDAOTransfer', async () => {
      const txMsg = transactionBuilder.govDAOTransfer({
        action: DAOAction.Burn,
        amount: '1',
      })

      const rawTxRequest = await transactionBuilder.createTransaction({ txMsg })

      expect(rawTxRequest instanceof RawTxRequest).toBe(true)
      expect(rawTxRequest.address).toBe(signer.getAddress())
    })

    test('Creates a RawTxRequest for MsgProtoGovUpgrade', async () => {
      const TEST_UPGRADE_HEIGHT = 20
      const TEST_UPGRADE_VERSION = '0.9.1.3'
      const TEST_UPGRADE_FEATURES = ['NCUST:93222', 'REDUP:9312']
      const govUpgradeAtHeightMsg = transactionBuilder.govUpgradeVersion({
        upgrade: {
          height: TEST_UPGRADE_HEIGHT,
          version: TEST_UPGRADE_VERSION,
        },
      })
      const govUpgradeFeaturesAtHeightMsg =
        transactionBuilder.govUpgradeFeatures({
          upgrade: {
            features: TEST_UPGRADE_FEATURES,
          },
        })
      const govUpgradeMsg = transactionBuilder.govUpgrade({
        upgrade: {
          height: TEST_UPGRADE_HEIGHT,
          version: TEST_UPGRADE_VERSION,
          features: TEST_UPGRADE_FEATURES,
        },
      })
      for (const txMsg of [
        govUpgradeMsg,
        govUpgradeAtHeightMsg,
        govUpgradeFeaturesAtHeightMsg,
      ]) {
        const rawTxRequest = await transactionBuilder.createTransaction({
          txMsg,
        })
        expect(rawTxRequest instanceof RawTxRequest).toBe(true)
        expect(rawTxRequest.address).toBe(signer.getAddress())
      }
    })
  })
})
