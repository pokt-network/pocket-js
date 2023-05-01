# TransactionBuilder

This package houses the TransactionBuilder, which lets you build a transaction to then send into the network.

## Installation

Install through your package manager of choice:

```
pnpm install @pokt-foundation/pocketjs-transaction-builder
```

## Usage

```js
import { TransactionBuilder } from '@pokt-foundation/pocketjs-transaction-builder'

// Initializing the TransactionBuilder is simple:
// 1. Instanciate a provider
export const provider = new JsonRpcProvider({
  rpcUrl: MAINNET_RPC_URL,
})

// 2. Instanciate a signer
export const signer = await KeyManager.fromPrivateKey(process.env.PRIVATE_KEY)

// 3. Instanciate the TransactionBuilder
export const builder = new TransactionBuilder({
  signer,
  provider,
})

// Create a new `Send` Message which is used to send funds over the network.
const sendMsg = transactionBuilder.send(
  signer.getAddress(),
  '07a6fca4dea9f01e4c19f301df0d0afac128561b',
  // Amount in uPOKT (1 POKT = 1*10^6 uPOKT)
  '1000000'
)
// Send it over the network!
const txresponse = await transactionBuilder.submit({
  memo: 'POKT Payment',
  txMsg: sendMsg,
})
```

## TransactionBuilder API

### Constructor

#### signer

- type: `KeyManager`
  The KeyManager instance that holds the staked app in the blockchain.

#### provider

- type: `JsonRpcProvider` | `IsomorphicProvider`
  The provider instance with available dispatchers to talk to the network.

#### chainID (optional)

- type: `mainnet` | `localnet` | `testnet`
  ChainID to send the transactions to. The provider endpoint must be connected to that chain ID.

### Methods

#### getChainID(): ChainID

Gets the current chain ID this transaction builder has been initialized for.

Returns `ChainID`: 'mainnet', 'localnet', or 'testnet'.

#### setChainID(id): void

Sets the chainID to one of the supported networks.

| Param | Type     | Description                                                                     |
| ----- | -------- | ------------------------------------------------------------------------------- |
| id    | `string` | The chain to send transactions to. The provider must be connected to that chain |

#### createTransaction({ fee, memo, txMsg }): Promise<RawTxRequest>

Signs and creates a transaction object that can be submitted to the network given the parameters and called upon Msgs.

Returns `Promise<RawTxRequest>`: The raw transaction request which can be sent over the network.

| Param | Type     | Description                                                                                  |
| ----- | -------- | -------------------------------------------------------------------------------------------- |
| fee   | `string` | The amount to pay as a fee for executing this transaction, in uPOKT (1 POKT = 1\*10^6 uPOKT) |
| memo  | `string` | Memo field for this transaction.                                                             |
| txMsg | `TxMsg`  | Transaction message generated with one of the available methods.                             |

#### submit({ fee, memo, txMsg }): Promise<TransactionResponse>

Submit receives a valid transaction message, creates a Raw Transaction Request and sends it over the network.

Returns `Promise<TransactionResponse`: The transaction response from the network, containing the transaction hash.

| Param | Type     | Description                                                                                  |
| ----- | -------- | -------------------------------------------------------------------------------------------- |
| fee   | `string` | The amount to pay as a fee for executing this transaction, in uPOKT (1 POKT = 1\*10^6 uPOKT) |
| memo  | `string` | Memo field for this transaction.                                                             |
| txMsg | `TxMsg`  | Transaction message generated with one of the available methods.                             |

#### submitRawTransaction(tx): Promise<TransactionResponse>

Submit receives an already made Raw Transaction Request and sends it over the network.

Returns `Promise<TransactionResponse`: The transaction response from the network, containing the transaction hash.

| Param | Type           | Description                                                    |
| ----- | -------------- | -------------------------------------------------------------- |
| tx    | `RawTxRequest` | The raw transaction request, created with `createTransaction`. |

#### send({ fromAddress, toAddress, amount }): MsgProtoSend

Adds a MsgSend TxMsg for this transaction.

Returns a `MsgProtoSend`: An unsigned Send transaction message.

| Param       | Type     | Description                                                 |
| ----------- | -------- | ----------------------------------------------------------- |
| fromAddress | `string` | Origin address, which is the address that the signer holds. |
| toAddress   | `string` | Destination address                                         |
| amount      | `string` | Amount of uPOKT to send.                                    |

#### appStake({ appPubKey, chains, amount }): MsgProtoAppStake

Adds a MsgAppStake TxMsg for this transaction.

Returns a `MsgProtoAppStake`: The unsigned App Stake message.

| Param     | Type       | Description                                                                                                  |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| appPubKey | `string`   | Application Public Key                                                                                       |
| chains    | `string[]` | Chains that the apps wants access to by staking POKT. Throughput will be equally divided through all chains. |
| amount    | `string`   | Amount of uPOKT to stake.                                                                                    |

#### appUnstake(address): MsgProtoAppUnstake

Adds a MsgProtoAppUnstake TxMsg for this transaction.

Returns `MsgProtoAppUnstake`: The unsigned app unstake message.

| Param   | Type     | Description             |
| ------- | -------- | ----------------------- |
| address | `string` | Address of the account. |

#### nodeStake({ nodePubKey, chains, amount, serviceURL }): MsgProtoNodeStakeTx

Adds a NodeStake TxMsg for this transaction.

Returns a `MsgProtoNodeStakeTx`: The unsigned node stake message.

| Param      | Type       | Description                                                  |
| ---------- | ---------- | ------------------------------------------------------------ |
| nodePubKey | `string`   | Node Public Key                                              |
| chains     | `string[]` | Chains that the node wants to service to by staking POKT.    |
| amount     | `string`   | Amount of uPOKT to stake.                                    |
| serviceURL | `URL`      | Node service URL that will be used to send requests through. |

#### nodeUnstake(address): MsgProtoNodeUnstake

Adds a MsgProtoNodeUnstake for this transaction.

Returns `MsgProtoNodeUnstake`: The unsigned node unstake message.

| Param   | Type     | Description             |
| ------- | -------- | ----------------------- |
| address | `string` | Address of the account. |

#### nodeUnjail(address): MsgAProtoNodeUnjail

Adds a MsgUnjail for this transaction.

Returns a `MsgProtoNodeUnstake`: The unsigned node unjail message.

| Param   | Type     | Description             |
| ------- | -------- | ----------------------- |
| address | `string` | Address of the account. |

#### govDAOTransfer({ toAddress, amount, action }): MsgProtoGovUpgrade

Adds a MsgProtoGovDAOTransferTxMsg for this transaction.

Returns a `MsgProtoGovDAOTransfer`: The unsigned upgrade message

| Param     | Type        | Description                                                                            |
| --------- | ----------- | -------------------------------------------------------------------------------------- |
| action    | `DAOAction` | the action the dao transfer represent (i.e `transfer` or `burn`)                       |
| amount    | `string`    | the Amount of uPOKT to perform with specified action                                   |
| toAddress | `string`    | the recipient of the dao action once executed for transfers. Not required for burning. |

#### govChangeParam({ paramKey, paramValue, overrideGovParamsWhitelistValidation }): MsgProtoGovUpgrade

Adds a MsgProtoGovChangeParamTxMsg for this transaction.

Returns a `MsgProtoGovChangeParam`: The unsigned upgrade message

| Param                                | Type                     | Description                                                                                     |
| ------------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------- |
| paramKey                             | `GovParameter`, `string` | the governance parameter key                                                                    |
| paramValue                           | `string`                 | the new governance parameter value in ASCII (plain text) format.                                |
| paramValue                           | `string`                 | the new governance parameter value in ASCII (plain text) format.                                |
| overrideGovParamsWhitelistValidation | `boolean (optional)`     | used to override the validation check for a governance parameter not found in GovParameter enum |

#### govUpgradeHeight({ height, version }): MsgProtoGovUpgrade

Adds a MsgProtoGovUpgradeTxMsg for this transaction.

The GovUpgradeTxMsg is multipurpose. This function acts as an opinionated way of applying the protocol's upgrade height

Returns a `MsgProtoGovUpgrade`: The unsigned upgrade message

| Param   | Type     | Description                              |
| ------- | -------- | ---------------------------------------- |
| height  | `int`    | height to upgrade the protocol's version |
| version | `string` | the new protocol's version               |

#### govUpgradeFeatures({ features }): MsgProtoGovUpgrade

Adds a MsgProtoGovUpgradeTxMsg for this transaction.

The GovUpgradeTxMsg is multipurpose. This function acts as an opinionated way of applying the protocol's upgrade features.

Returns a `MsgProtoGovUpgrade`: The unsigned upgrade message

| Param    | Type       | Description                                                                |
| -------- | ---------- | -------------------------------------------------------------------------- |
| features | `string[]` | array of features `[ {featureName1}:{height1}, {featureName2}:{height2} ]` |

#### govUpgrade({ features, height, version }): MsgProtoGovUpgrade

The GovUpgradeTxMsg is multipurpose, use this only if you are familiar with the tx msg, otherwise rely on `govUpgradeHeight` and `govUpgradeFeatures`

Returns a `MsgProtoGovUpgrade`: The unsigned upgrade message

| Param    | Type       | Description                                                                                                            |
| -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| height   | `int`      | height to upgrade the protocol's version                                                                               |
| version  | `string`   | the new protocol's version                                                                                             |
| features | `string[]` | array of features to deactivate / activate with the notation: `[ {featureName1}:{height1}, {featureName2}:{height2} ]` |
