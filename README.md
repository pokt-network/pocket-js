# PocketJS

![Build](https://github.com/pokt-foundation/pocket-js-slim/actions/workflows/node.js.yml/badge.svg)

A complete, fast and slim SDK to interact with the Pocket Network.

## Installation

You can install the packages using your favorite package manager like yarn, npm,
or pnpm.  See the usages below to know which package needs to be installed in
your project.

```shell
yarn add @pokt-foundation/pocketjs-provider
yarn add @pokt-foundation/pocketjs-signer
yarn add @pokt-foundation/pocketjs-transaction-builder
yarn add @pokt-foundation/pocketjs-relayer
yarn add @pokt-foundation/pocketjs-utils
```

## Usage

### Send a read-only query

This example queries the latest height and a wallet's balance in the network
specified by `PoktEndpoint`.

`PoktEndpoint` is a string representing an endpoint URL to any Pocket-based
network, POKT Mainnet, Testnet or your own devnet.  It may or may not contain
basic authentication credentials like "https://scott:tiger@example.pokt.network".

You can get an endpoint to POKT Mainnet from one of Pocket's Gateways.  See
https://docs.pokt.network/developers/use-a-gateway for details. For example,
Grove's endpoint is like `https://mainnet.rpc.grove.city/v1/<AccessKey>`.

```js
import "dotenv/config";
import { JsonRpcProvider } from "@pokt-foundation/pocketjs-provider";

const PoktEndpoint = process.env.POKT_ENDPOINT;

async function main() {
  const provider = new JsonRpcProvider({
    rpcUrl: PoktEndpoint,
  });

  // Get the latest height
  const height = await provider.getBlockNumber();
  console.log(height);

  // Get the balance of a wallet in μPOKT
  const balance = await provider.getBalance(
    "85efd04b9bad9da612ee2f80db9b62bb413e32fb",
  );
  console.log(balance);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Output:

```
125085
20009130876n
```

### Send POKT

This example sends 1 POKT from a wallet associated with `SIGNER_PRIVATE_KEY`
to the address `fc1c79e7efecf89f071ebb2ba7c6f5a98dcdfc3c` in POKT Testnet and
prints the transaction hash.

To send tokens, a send message must be signed by a sender account's private key.
There are two ways to import a private key into `TransactionBuilder`.

1. `KeyManager.fromPrivateKey` takes a private key in a raw format.
   You can get it from "pocket accounts export-raw" command.  This example
   demonstrates this usecase.

2. `KeyManager.fromPPK` takes the content of an armored keypair file and its
   passphrade.  A keypair file can be exported by "pocket accounts export"
   command.  You can see this usecase in the next example.

```js
import "dotenv/config";
import { JsonRpcProvider } from "@pokt-foundation/pocketjs-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { TransactionBuilder } from "@pokt-foundation/pocketjs-transaction-builder";

async function main() {
  const provider = new JsonRpcProvider({rpcUrl: process.env.POKT_ENDPOINT});

  const txSignerKey = process.env.SIGNER_PRIVATE_KEY;
  const txSigner = await KeyManager.fromPrivateKey(txSignerKey);
  const transactionBuilder = new TransactionBuilder({
    provider,
    signer: txSigner,

    // To submit a transaction to a non-Mainnet network, you need to specify
    // the network ID in `chainID`.
    chainID: "testnet",
  });

  // Create a message to send POKT
  const txMsg = transactionBuilder.send({
    fromAddress: txSigner.getAddress(),
    toAddress: "fc1c79e7efecf89f071ebb2ba7c6f5a98dcdfc3c",
    // Amount in μPOKT ("1000000" means 1 POKT)
    amount: "1000000",
  });
  // Submit the message as a transaction
  const txResponse = await transactionBuilder.submit({
    txMsg,
    memo: "Send 1 POKT via PocketJS",
  });
  console.log(txResponse.txHash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Output:

```
2958AC49C3C00DD9F3E6FF2C7983D56E93B4164FF197F6D9DD6954A0BF4FD066
```

### Stake a node

`transactionBuilder.nodeStake` creates a message to stake a new node or
edit a staked node.

This examples stakes a node with the output address and delegators in POKT
Testnet.

A signer's private is imported from an armored keypair file
"pocket-account-e95c3df1649d9525ae65949eb4c8466ee7ee8bef.json".

```js
import "dotenv/config";
import { JsonRpcProvider } from "@pokt-foundation/pocketjs-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { TransactionBuilder } from "@pokt-foundation/pocketjs-transaction-builder";
import ArmoredJson from './pocket-account-e95c3df1649d9525ae65949eb4c8466ee7ee8bef.json' assert { type: 'json' };

async function main() {
  const provider = new JsonRpcProvider({rpcUrl: process.env.POKT_ENDPOINT});

  const txSigner = await KeyManager.fromPPK({
    ppk: JSON.stringify(ArmoredJson),
    password: "password",
  });
  const transactionBuilder = new TransactionBuilder({
    provider,
    signer: txSigner,
    chainID: "testnet",
  });

  // Create a message to stake a node with delegators
  const txMsg = transactionBuilder.nodeStake({
    amount: "16000000000",
    chains: ["0001", "0002"],
    serviceURL: new URL("https://node1.testnet.pokt.network:443"),
    outputAddress: "fc1c79e7efecf89f071ebb2ba7c6f5a98dcdfc3c",
    rewardDelegators: {
      "8147ed5182da6e7dea33f36d78db6327f9df6ba0": 10,
      "54751ae3431c015a6e24d711c9d1ed4e5a276479": 50,
    }
  });
  const txResponse = await transactionBuilder.submit({
    txMsg,
    memo: "NodeStake via PocketJS",
  });
  console.log(txResponse.txHash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Output:

```
E85F8D495722B9832B9FA36E2F41012737A8FFF2DD2428A8F9C22847907032C7
```

There are some variations of a node-stake message.

1. Stake from the output address

   Instantiate `TransactionBuilder` with the private key of the output address
   and specify the node's public key in `nodePubKey`.

    ```js
    const transactionBuilder = new TransactionBuilder({
      provider,
      signer: txOutputSigner, // this must be the key of the output address
      chainID: "testnet",
    });
    const txMsg = transactionBuilder.nodeStake({
      nodePubKey: "f53b9120f4f18c09f883e82b5c1554eddb78cd56eb753eb2ae0dfdbc492cfaaf",
      amount: "16000000000",
      chains: ["0001", "0002"],
      serviceURL: new URL("https://node1.testnet.pokt.network:443"),
      outputAddress: "fc1c79e7efecf89f071ebb2ba7c6f5a98dcdfc3c",
      rewardDelegators: {
        "8147ed5182da6e7dea33f36d78db6327f9df6ba0": 10,
        "54751ae3431c015a6e24d711c9d1ed4e5a276479": 50,
      }
    });
    ```

2. Stake without delegators or remove delegators from a staked node

    Simply skip `rewardDelegators` to create a message.  If you submit this
    transaction to an existing node with delegators, this removes the existing
    delegators from the node.

    ```js
    const txMsg = transactionBuilder.nodeStake({
      amount: "16000000000",
      chains: ["0001", "0002"],
      serviceURL: new URL("https://node1.testnet.pokt.network:443"),
      outputAddress: "fc1c79e7efecf89f071ebb2ba7c6f5a98dcdfc3c",
    });
    ```

### Stake an app

This examples stakes an app with 1000 POKT in POKT Testnet.

```js
import "dotenv/config";
import { JsonRpcProvider } from "@pokt-foundation/pocketjs-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { TransactionBuilder } from "@pokt-foundation/pocketjs-transaction-builder";

async function main() {
  const provider = new JsonRpcProvider({rpcUrl: process.env.POKT_ENDPOINT});

  const txSignerKey = process.env.SIGNER_PRIVATE_KEY;
  const txSigner = await KeyManager.fromPrivateKey(txSignerKey);
  const transactionBuilder = new TransactionBuilder({
    provider,
    signer: txSigner,

    // To submit a transaction to a non-Mainnet network, you need to specify
    // the network ID in `chainID`.
    chainID: "testnet",
  });

  // Create a message to stake an app
  const txMsg = transactionBuilder.appStake({
    appPubKey: "f53b9120f4f18c09f883e82b5c1554eddb78cd56eb753eb2ae0dfdbc492cfaaf",
    chains: ["0001", "0002"],
    // Amount in μPOKT ("1000000000" means 1000 POKT)
    amount: "1000000000",
  });
  const txResponse = await transactionBuilder.submit({
    txMsg,
    memo: "AppStake via PocketJS",
  });
  console.log(txResponse.txHash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Output:

```
137BF72DAB2EA4DE9D27B25FFBCDC13C072687F6938F9530116FE96C91DC8F51
```

### Transfer an app

You can directly transfer the slot of a staked app to a new empty address
without unstaking the app.

This examples transfers the slot of a staked app from the address associated
with `process.env.SIGNER_PRIVATE_KEY` to `fc1c79e7efecf89f071ebb2ba7c6f5a98dcdfc3c`
that is the address of the public key
`0c872497365fad64c3909c934983853865b79e50fe7b8b8003a47baf99d5a64d`.

```js
import "dotenv/config";
import { JsonRpcProvider } from "@pokt-foundation/pocketjs-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { TransactionBuilder } from "@pokt-foundation/pocketjs-transaction-builder";

async function main() {
  const provider = new JsonRpcProvider({rpcUrl: process.env.POKT_ENDPOINT});

  const txSignerKey = process.env.SIGNER_PRIVATE_KEY;
  const txSigner = await KeyManager.fromPrivateKey(txSignerKey);
  const transactionBuilder = new TransactionBuilder({
    provider,
    signer: txSigner,

    // To submit a transaction to a non-Mainnet network, you need to specify
    // the network ID in `chainID`.
    chainID: "testnet",
  });

  // Create a message to transfer the app slot
  const txMsg = transactionBuilder.appTransfer({
    appPubKey: "0c872497365fad64c3909c934983853865b79e50fe7b8b8003a47baf99d5a64d",
  });
  const txResponse = await transactionBuilder.submit({
    txMsg,
    memo: "AppTransfer via PocketJS",
  });
  console.log(txResponse.txHash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Output:

```
AAF82443ADF0D5B0F43DE8E3537BF140B8F4122949F342D4831A57790AE0215D
```

### Send a jsonrpc to a relay chain

This example submits the call of `eth_chainId` to the chain `005A` in the
network specified by `process.env.POKT_ENDPOINT`.

```js
import "dotenv/config";
import { JsonRpcProvider } from "@pokt-foundation/pocketjs-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { Relayer } from "@pokt-foundation/pocketjs-relayer";

const AppPrivateKey = process.env.APP_PRIVATE_KEY;

async function main() {
  // Client signer adds a signature to every relay request.  This example
  // generates a new key every time for demonstration purpose.
  const clientSigner = await KeyManager.createRandom();

  // AAT (= Application Authentication Token) must be attached to every relay
  // request.  Otherwise it's rejected by the network.  To generate an AAT,
  // you need to have the private key of a staked application.
  // This example generates an AAT every request for demonstration purpose.
  // Usually a relayer pre-creates an AAT with Client public key, which is
  // also pre-created, and uses the AAT and the Client private key in the
  // relayer.
  const appSigner = await KeyManager.fromPrivateKey(AppPrivateKey);
  const aat = await Relayer.GenerateAAT(
    appSigner,
    clientSigner.publicKey,
  );

  // To use `Relayer`, you need to specify `dispatchers`.
  const provider = new JsonRpcProvider({
    dispatchers: [process.env.POKT_ENDPOINT],
  });
  const relayer = new Relayer({
    keyManager: clientSigner,
    provider,
  });

  const chain = '005A';
  const payload = {"id":1,"jsonrpc":"2.0","method":"eth_chainId"};

  const sessionResp = await provider.dispatch({
    sessionHeader: {
      sessionBlockHeight: 0,
      chain,
      applicationPubKey: appSigner.publicKey,
    },
  });

  const relayResp = await relayer.relay({
    blockchain: chain,
    data: JSON.stringify(payload),
    pocketAAT: aat,
    session: sessionResp.session,
    options: {
      retryAttempts: 5,
      rejectSelfSignedCertificates: false,
      timeout: 8000,
    },
  });

  console.log(relayResp.response);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Output:

```
{"jsonrpc":"2.0","id":1,"result":"0xc0d31"}
```

## Contributing

### Setting up

Clone the repo from Github, and just run `pnpm i` at the root folder. This will install all of the individual packages in the necessary order. If you'd like to build all packages manually, you'll need follow the order in which they're referenced:
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

### Issues

If you ever come across an issue with PocketJS, do a search in the issues tab of this repo and make sure it hasn't been reported before. Follow these steps to help us prevent unnecessary notifications to the many people following this repo.

- If the issue you found has been reported and is still open, and the details match your issue, give a "thumbs up" to the relevant posts in the issue thread to signal that you have the same issue. No further action is required on your part.
- If the issue you found has been reported and is still open, but the issue is missing some details, you can add a comment to the issue thread describing the additional details.
- If the issue you found has been reported but has been closed, you can comment on the closed issue thread and ask to have the issue reopened because you are still experiencing the issue. Alternatively, you can open a new issue, reference the closed issue by number or link, and state that you are still experiencing the issue. Provide any additional details in your post so we can better understand the issue and how to fix it.
