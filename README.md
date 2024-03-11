# PocketJS

![Build](https://github.com/pokt-foundation/pocket-js-slim/actions/workflows/node.js.yml/badge.svg)

A complete, fast and slim SDK to interact with the Pocket Network.

## Usage

Add the packages for each part to your project:

```console
yarn add @pokt-foundation/pocketjs-provider @pokt-foundation/pocketjs-signer @pokt-foundation/pocketjs-transaction-builder @pokt-foundation/pocketjs-relayer @pokt-foundation/pocketjs-utils
```

And use each piece as you see fit:

```javascript
import { JsonRpcProvider } from "@pokt-foundation/pocketjs-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { TransactionBuilder } from "@pokt-foundation/pocketjs-transaction-builder";
import { Relayer } from "@pokt-foundation/pocketjs-relayer";
import {
  MAINNET_RPC_URL,
  DISPATCHERS,
  RELAY_DATA,
} from "./config.js";

// Instantiate a provider for querying information on the chain!
//
// MAINNET_RPC_URL and an element of DISPATCHERS is a string representing an
// endpoint URL to the Pocket Network which may or may not contains basic
// authentication credentials e.g. "https://scott:tiger@pokt-node.example.com".
export const provider = new JsonRpcProvider({
  rpcUrl: MAINNET_RPC_URL,
  // If you'll Instantiate a relayer, you need to add dispatchers as well
  dispatchers: DISPATCHERS,
});

const balance = await provider.getBalance(
  "07a6fca4dea9f01e4c19f301df0d0afac128561b"
);

// Instantiate a signer for importing an account and signing messages!
export const signer = await KeyManager.fromPrivateKey(process.env.PRIVATE_KEY);

const address = signer.getAddress();
const publicKey = signer.getPublicKey();
const signedMessage = signer.sign("deadbeef");

// Instantiate a new TransactionBuilder for creating transaction messages and
// and sending them over the network!
export const transactionBuilder = new TransactionBuilder({
  provider,
  signer,
});

// Create a new `Send` Message which is used to send funds over the network.
const sendMsg = transactionBuilder.send(
  signer.getAddress(),
  "07a6fca4dea9f01e4c19f301df0d0afac128561b",
  // Amount in uPOKT (1 POKT = 1*10^6 uPOKT)
  "1000000"
);
// Send it over the network!
const txresponse = await transactionBuilder.submit({
  memo: "POKT Payment",
  txMsg: sendMsg,
});

// Create a new relayer to send relays over the network!
export const relayer = new Relayer({
  keyManager: signer,
  provider,
  dispatchers: DISPATCHERS,
});

const session = await relayer.getNewSession({
  chain: process.env.APP_CHAIN,
  applicationPubKey: process.env.APP_PUBLIC_KEY,
});

const appSigner = await KeyManager.fromPrivateKey(process.env.APP_PRIVATE_KEY);
const clientSigner = await KeyManager.createRandom();
const aat = await Relayer.GenerateAAT(appSigner, clientSigner.publicKey);

const relay = await relayer.relay({
  data: process.env.RELAY_DATA,
  blockchain: process.env.APP_CHAIN,
  pocketAAT: aat,
  session: session,
});
```

## Contributing

## Setting up

Download the repo from Github, and just run `pnpm i` at the root folder. This will install all of the individual packages in the necessary order. If you'd like to build all packages manually, you'll need follow the order in which they're referenced:
- Install `packages/utils`
- Install `packages/types`
- Install `packages/abstract-provider`
- Install `packages/provider`
- Install `packages/signer`
- Install `packages/relayer`
- Install `packages/transaction-builder`

The best way to develop locally is to link the local packages from your clone to the project you're working on; this will let you either run the dev server or build the packages to see the changes in real time.

We use Turborepo to manage build caches and our general build/test pipeline. This means that only the packages that have changed will get built again, saving you time. At the root `package.json` we've also defined a collection of scripts you can use to run individual packages on their dev server.

### Running tests

For running tests, either run `pnpm jest` on the corresponding repo or run `pnpm turbo run test` on the root folder to run all tests.

#### 👋 Get started contributing with a [good first issue](https://github.com/pokt-foundation/pocket-js-slim/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

Don't be shy to contribute even the smallest tweak. 🐲 There are still some dragons to be aware of, but we'll be here to help you get started!

## Issues

If you ever come across an issue with PocketJS, do a search in the issues tab of this repo and make sure it hasn't been reported before. Follow these steps to help us prevent unnecessary notifications to the many people following this repo.

- If the issue you found has been reported and is still open, and the details match your issue, give a "thumbs up" to the relevant posts in the issue thread to signal that you have the same issue. No further action is required on your part.
- If the issue you found has been reported and is still open, but the issue is missing some details, you can add a comment to the issue thread describing the additional details.
- If the issue you found has been reported but has been closed, you can comment on the closed issue thread and ask to have the issue reopened because you are still experiencing the issue. Alternatively, you can open a new issue, reference the closed issue by number or link, and state that you are still experiencing the issue. Provide any additional details in your post so we can better understand the issue and how to fix it.
