# PocketJS

![Build](https://github.com/pokt-foundation/pocket-js-slim/actions/workflows/node.js.yml/badge.svg)

A complete, fast and slim SDK to interact with the Pocket Network.

## Usage
Add the packages for each part to your project:

```console
yarn add @pokt-foundation/pocketjs-provider @pokt-foundation/pocketjs-signer @pokt-foundation/pocketjs-relayer @pokt-foundation/pocketjs-utils
```

And use each piece as you see fit:

```javascript
import { JsonRpcProvider } from "@pokt-foundation/pocketjs-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { Relayer } from "@pokt-foundation/pocketjs-relayer";
import { MAINNET_RPC_URL, DISPATCHERS, RELAY_DATA, POCKET_AAT } from "./config.js";

// Instanciate a provider for querying information on the chain!
export const provider = new JsonRpcProvider({
  rpcUrl: MAINNET_RPC_URL,
  // If you'll instanciate a relayer, you need to add dispatchers as well
  dispatchers: DISPATCHERS,
});

const balance = await provider.getBalance("07a6fca4dea9f01e4c19f301df0d0afac128561b")

// Instanciate a signer for importing an account and signing messages!
export const signer = await KeyManager.fromPrivateKey(
  process.env.PRIVATE_KEY
);

const address = signer.getAddress();
const publicKey = signer.getPublicKey();
const signedMessage = signer.sign("deadbeef");

export const relayer = new Relayer({
  keyManager: signer,
  provider,
  dispatchers: DISPATCHERS,
});

const session = await relayer.getNewSession({
  chain: process.env.APP_CHAIN,
  applicationPubKey: process.env.APP_PUBLIC_KEY,
});

const relay = await relayer.relay({
  data: process.env.RELAY_DATA,
  blockchain: process.env.APP_CHAIN,
  pocketAAT: POCKET_AAT,
  session: session,
});
```
