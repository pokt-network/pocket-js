# Abstract Provider

The abstract provider is the base class that all providers available in PocketJS inherit. They dictate the necessary functions along with their types to make a minimally-viable provider.

## Installation

```
pnpm i @pokt-foundation/pocketjs-abstract-provider
```

## Usage
Simply import it into your project and start coding!

```js
import { AbstractProvider } from '@pokt-foundation/pocketjs-abstract-provider'

class MyProvider implements AbstractProvider {
    // ... now override the methods!
}
```
