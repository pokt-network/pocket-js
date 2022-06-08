# Relayer

This package houses both the abstract relayer interface we expose to people so that they build their own Relayer, and an actual Relayer ready to use for sending relays and dispatching new sessions.

You'll need a staked aplication in the Pocket Network blockchain to use this package.

To learn more about the relay lifecycle, reach for the [docs](https://docs.pokt.network/home/v0/protocol/servicing).

## Installation
Install through your package manager of choice:
```
pnpm install @pokt-foundation/pocketjs-relayer
```

## Usage

```js 
import { AbstractRelayer, Relayer } from '@pokt-foundation/pocketjs-relayer'

// For the AbstractRelayer, just implement it!
class MyRelayer extends AbstractRelayer {
 // Now override the required methods...
}

// Initializing the relayer is simple:
// 1. Instanciate a provider
export const provider = new JsonRpcProvider({
  rpcUrl: MAINNET_RPC_URL,
  // For a relayer, dispatchers are needed
  dispatchers: DISPATCHERS,
})

// 2. Instanciate a signer for signing the relays
export const signer = await KeyManager.fromPrivateKey(process.env.PRIVATE_KEY)

// 3. Create a new relayer to send relays over the network!
export const relayer = new Relayer({
  keyManager: signer,
  provider,
  dispatchers: DISPATCHERS,
});

// Get a new session
const session = await relayer.getNewSession({
  chain: process.env.APP_CHAIN,
  applicationPubKey: process.env.APP_PUBLIC_KEY,
})

// Send a relay
const relay = await relayer.relay({
  data: process.env.RELAY_DATA,
  blockchain: process.env.APP_CHAIN,
  pocketAAT: POCKET_AAT,
  session: session,
})

```

## Relayer API

### Constructor
#### keyManager
- type: `KeyManager`
The KeyManager instance that holds the staked app in the blockchain.

#### provider
- type: `JsonRpcProvider` | `IsomorphicProvider`
The provider instance with available dispatchers to talk to the network.

#### dispatchers
- type: `String[]`
Backup set of dispatchers.

### Methods
#### getNewSession({ applicationPubKey, chain, sessionBlockHeight, options }): Promise<Session>
Performs a dispatch request to obtain a new session. Fails if no dispatcher is provided through the provider.

Returns `Promise<Session>`: The dispatch response as a session.

| Param                                | Type      | Description                                               |
|--------------------------------------|-----------|-----------------------------------------------------------|
| applicationPubKey                    | `string`  | The application's public key.                             |
| chain                                | `string`  | The chain for the ssions.                                 |
| sessionBlockHeight                   | `number`  | The session block height.                                 |
| options                              | `object`  | The options available to tweak the request itself.        |
| options.retryAttempts                | `number`  | The number of retries to perform if the first call fails. |
| options.rejectSelfSignedCertificates | `boolean` | Option to reject self signed certificates or not.         |
| options.timeout                      | `number`  | Timeout before the call fails. In milliseconds.           |

#### relay({ blockchain, data, headers, method, node, path, pocketAAT, session, options })
Sends a relay to the network.

| Param                                | Type      | Description                                                                 |
|--------------------------------------|-----------|-----------------------------------------------------------------------------|
| blockchain                           | `string`  | The chain for the session.                                                  |
| data                                 | `string`  | The data to send, stringified.                                              |
| headers                              | `object`  | The headers to include in the call, if any.                                 |
| node                                 | `Node`    | The node to send the relay to. The node must belong to the current session. |
| path                                 | `string`  | The path to query in the relay. Useful for chains like AVAX.                |
| pocketAAT                            | `AAT`     | The pocketAAT used to authenticate the relay.                               |
| session                              | `Session` | The current session the app is assigned to.                                 |
| options                              | `object`  | The options available to tweak the request itself.                          |
| options.retryAttempts                | `number`  | The number of retries to perform if the first call fails.                   |
| options.rejectSelfSignedCertificates | `boolean` | Option to reject self signed certificates or not.                           |
| options.timeout                      | `number`  | Timeout before the call fails. In milliseconds.                             |

