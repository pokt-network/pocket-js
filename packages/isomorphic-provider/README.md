# IsomorphicProvider

The IsomorphicProvider is the NodeJS and browser compatble provider for making queries to the Pocket network chain, sending relays or dispatching sessions.

## Installation
Install from NPM, using your favorite package manager:

```js
pnpm i @pokt-foundation/pocketjs-isomorphic-provider
```

## Usage
### Initialization
```js
import { IsomorphicProvider } from '@pokt-foundation/pocketjs-isomorphic-provider'

// If you wanna just send queries to the chain, this is the simplest way to Initialize it:
const simpleProvider = new IsomorphicProvider({ 
  // RPC_URL = any URL that connects to a Pocket node, or a Pocket mainnet portal endpoint
  rpcUrl: process.env.RPC_URL 
})

// If you wanna also send relays, you'll need to initialize dispatchers as well.
// Dispatchers are Pocket nodes that only perform dispatch calls (to the route /client/dispatch) to generate sessions.
const providerWithDispatchers = new IsomorphicProvider({
    // RPC_URL = needs to be a pocket node to send relays.
    rpcUrl: process.env.RPC_URL
    // DISPATCHER_1, DISPATCHER_2 = pocket node URLs for dispatching. You can include as many as you can for redundancy.
    dispatchers: [process.env.DISPATCHER_1, process.env.DISPATCHER_2]
})

```
### Usage examples
```js
import { IsomorphicProvider } from '@pokt-foundation/pocketjs-isomorphic-provider'

const simpleProvider = new IsomorphicProvider({ 
  rpcUrl: process.env.RPC_URL 
})

// Getting an account's balance
const balance = await simpleProvider.getBalance('0992d9acddf86ad7dcae1c96cb37a88d0b716243')

// Getting the type of an account (node, app, or normal account);
const accountType = await simpleProvider.getType('4a6dd4559ff723ea1937ec379be0998e15c61c04');

// Getting existing apps, involving pagination
const apps = await simpleProvider.getApps({
  page: 1,
  perPage: 500,
  // customizable timeout
  timeout: 5000
})
```

## API

### Constructor
#### rpcUrl
- type: `String`
The URL of the RPC to connect to. Can be a Pocket Portal endpoint, or a Pocket node.

#### Dispatchers (optional)
- type: `String[]`
An array of URLs of Pocket nodes that will perform dispatch calls to generate new sessions.

### Methods
#### getBalance(address): Promise<bigint>
Fetches the provided address's balance.

Returns a `Promise<bigint>`: the address's balance.

| Param   | Type                          | Description                          |
|---------|-------------------------------|--------------------------------------|
| address | `string` or `Promise<string>` | The address to fetch the balance of. |

#### getTransactionCount(address): Promise<number>
Fetches the provided address's transaction count.

Returns a `Promise<number>`: the address's transaction count.

| Param   | Type                          | Description                                       |
|---------|-------------------------------|---------------------------------------------------|
| address | `string` or `Promise<string>` | The address to fetch the transaction count of of. |

#### getType(address): Promise<'node' | 'app' | 'account'>
Fetches the address's account type (node, app, or account).

Returns a `Promise<'node' | 'app' | 'account'>`: If the account is a node, an app, or a normal account.

| Param   | Type                          | Description                               |
|---------|-------------------------------|-------------------------------------------|
| address | `string` or `Promise<string>` | The address to fetch the account type of. |

#### sendTransaction(transaction): Promise<TransactionResponse>
Sends a signed transaction from this provider.

Returns a `Promise<TransactionResponse>`: The network's response to the transaction.

| Param       | Type           | Description                                                   |
|-------------|----------------|---------------------------------------------------------------|
| transaction | `RawTxRequest` | The transaction to send, formatted as a `TransactionRequest`. |

#### getBlock(blockNumber): Promise<Block>
Get an specific block by its block number.

Returns a `Promise<Block>`: The block requested.

| Param       | Type     | Description                                |
|-------------|----------|--------------------------------------------|
| blockNumber | `number` | The number (height) of the block to query. |

#### getTransaction(transactionHash): Promise<Transaction>
Gets an specific transaction specified by its hash.

Returns a `Promise<Transaction>`: The transaction requested;

| Param           | Type     | Description                         |
|-----------------|----------|-------------------------------------|
| transactionHash | `string` | The hash of the transaction to get. |

#### getBlockNumber(): Promise<number>
Fetches the latest block number.

Returns `Promise<number>`: The latest height as observed by the node the provider is connected to.

#### getBlockTransactions(GetBlockTransactionsOptions): Promise<PaginableBlockTransactions>
Fetches the requested block's transactions.

Returns a `Promise<PaginableBlockTransactions>`: The block's transactions.

- `GetBlockTransactionOptions` object params:
| Param         | Type      | Description                                     |
|---------------|-----------|-------------------------------------------------|
| blockHeight   | `number`  | The block's height.                             |
| page          | `number`  | The page to query for, pagination-wise.         |
| perPage       | `number`  | The number of transactions to include per page. |
| includeProofs | `boolean` | Include the transactions's proofs.              |
| timeout       | `number`  | Time to wait before cancelling the request.     |

#### getNodes(GetNodesOptions): Promise<Paginable<Node>>
Fetches nodes acrtibve from the network with the options provided.

Returns `Promise<Paginable<Node>>`: An array with the nodes requested and their information.

- `GetNodesOptions` params:
| Param       | Type     | Description                                     |
|-------------|----------|-------------------------------------------------|
| blockHeight | `number` | The block's height.                             |
| page        | `number` | The page to query for, pagination-wise.         |
| perPage     | `number` | The number of transactions to include per page. |
| timeout     | `number` | Time to wait before cancelling the request.     |

#### getNode({ address, blockHeight }): Promise<Node>
Fetches a node from the network with the options provided.

Returns `Promise<Node>`: The node requested and its information.

| Param          | Type     | Description                                                  |
|----------------|----------|--------------------------------------------------------------|
| address        | `string` | The address of the node to get the claims from.              |
| blockHeight    | `number` | The block height to use to determine the result of the call. |

####  getApps(GetAppsOptions): Promise<Paginable<App>>
Fetches apps from the network with the options provided.

Returns `Promise<Paginable<App>>`: An array with the apps requested and their information.

- `GetAppsOptions` params:
| Param       | Type     | Description                                     |
|-------------|----------|-------------------------------------------------|
| blockHeight | `number` | The block's height.                             |
| page        | `number` | The page to query for, pagination-wise.         |
| perPage     | `number` | The number of transactions to include per page. |
| timeout     | `number` | Time to wait before cancelling the request.     |

#### getApp({ address, blockHeight }): Promise<App>
Fetches an app from the network with the options provided.

Returns `Promise<App>`: The app requested and its information.

| Param          | Type     | Description                                                  |
|----------------|----------|--------------------------------------------------------------|
| address        | `string` | The address of the node to get the claims from.              |
| blockHeight    | `number` | The block height to use to determine the result of the call. |

#### getAccount(address): Promise<Account>
Fetches an account from the network.

Returns `Promise<Account>`: The account requested and its information.

| Param   | Type                          | Description                          |
|---------|-------------------------------|--------------------------------------|
| address | `string` or `Promise<string>` | The address to fetch the balance of. |

#### getAccountWithTransactions(address, options): Promise<AccountWithTransactions>
Fetches an account from the network, along with its transactions.

Returns `Promise<AccountWithTransactions>`: The account requested and its information, along with its transactions.

| Param           | Type                                | Description                                         |
|-----------------|-------------------------------------|-----------------------------------------------------|
| address         | `string` or `Promise<string>`       | The address of the account to query.                |
| options         | `GetAccountWithTransactionsOptions` | The options object for the method.                  |
| options.page    | `number`                            | The page to get (pagination-wise) for transactions. |
| options.perPage | `number`                            | The number of transactions to include per page.     |
| timeout         | `number`                            | Time to wait before cancelling the request.         |

#### dispatch(request, options): Promise<DispatchResponse>
Performs a dispatch request to a random dispatcher from the ones provided. Fails if no dispatcher is found. Best used through a Relayer, as this is a very low level method.

Returns `Promise<DispatchResponse>`: The dispatch response from the dispatcher node.

| Param                                | Type              | Description                                       |
|--------------------------------------|-------------------|---------------------------------------------------|
| request                              | `DispatchRequest` | The dispatch request.                             |
| options                              | `object`          | The options object for the method.                |
| options.retryAttempts                | `number`          | Number of retries if the first request fails.     |
| options.rejectSelfSignedCertificates | `boolean`         | Option to reject self signed certificates or not. |
| options.timeout                      | `number`          | Time to wait before cancelling the request.       |

#### relay(request, rpcUrl, options): Promise<unknown>
Sends a relay to the network through the main RPC URL provided. Best used through a Relayer, as this is a very low level method.

Returns `Promise<unknown>`: The relay response (in unknown format, depends on the chain used).

| Param                                | Type              | Description                                       |
|--------------------------------------|-------------------|---------------------------------------------------|
| request                              | `DispatchRequest` | The dispatch request.                             |
| rpcUrl                               | `string`          | The rpcUrl to use                                 |
| options                              | `object`          | The options object for the method.                |
| options.retryAttempts                | `number`          | Number of retries if the first request fails.     |
| options.rejectSelfSignedCertificates | `boolean`         | Option to reject self signed certificates or not. |
| options.timeout                      | `number`          | Time to wait before cancelling the request.       |

#### getAllParams(height, options): Promise<unknown>
Gets all the parameters used to configure the Pocket Network.

Returns `Promise<any>`: The raw data structure with the parameters.

| Param           | Type     | Description                                 |
|-----------------|----------|---------------------------------------------|
| height          | `number` | The height to use for querying the params.  |
| options         | `object` | The options object for the method.          |
| options.timeout | `number` | Time to wait before cancelling the request. |

#### getNodeClaims(address, options): Promise<Paginable<any>>
Gets the corresponding node's claims.

Returns `Promise<Paginable<any>>`: The raw data structure containing the node claims.

| Param           | Type     | Description                                                  |
|-----------------|----------|--------------------------------------------------------------|
| address         | `string` | The address of the node to get the claims from.              |
| options         | `object` | The options object for the method.                           |
| options.height  | `number` | The block height to use to determine the result of the call. |
| options.page    | `number` | The page to get the node claims from.                        |
| options.perPage | `number` | How many claims per page to retrieve.                        |
| options.timeout | `number` | Time to wait before cancelling the request.                  |

#### getSupply(height, options): Promise<any>
Gets the requested supply information.

Returns `Promise<any>`: The raw data structure with the supply info.

| Param           | Type     | Description                                 |
|-----------------|----------|---------------------------------------------|
| height          | `number` | The height to use for querying the info.    |
| options         | `object` | The options object for the method.          |
| options.timeout | `number` | Time to wait before cancelling the request. |

#### getSupportedCHains(height, options): Promise<any>
Gets the supported chains in the protocol.

Returns `Promise<any`: The currently supported chains in a raw manner.

| Param           | Type     | Description                                 |
|-----------------|----------|---------------------------------------------|
| height          | `number` | The height to use for querying the info.    |
| options         | `object` | The options object for the method.          |
| options.timeout | `number` | Time to wait before cancelling the request. |

#### getPocketParams(height, options): Promise<any>
Gets the current Pocket Network Params.

Returns `Promise<any>`: The current raw pocket params.

| Param           | Type     | Description                                 |
|-----------------|----------|---------------------------------------------|
| height          | `number` | The height to use for querying the info.    |
| options         | `object` | The options object for the method.          |
| options.timeout | `number` | Time to wait before cancelling the request. |

#### getAppParams(height, options): Promise<any>
Gets the current Application Params.

Returns `Promise<any>`: The raw application params.

| Param           | Type     | Description                                 |
|-----------------|----------|---------------------------------------------|
| height          | `number` | The height to use for querying the info.    |
| options         | `object` | The options object for the method.          |
| options.timeout | `number` | Time to wait before cancelling the request. |
