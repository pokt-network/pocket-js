# Transaction Error Handling Improvements

## Overview

This document outlines improvements to transaction error handling in the pocket-js SDK, specifically addressing issues with the `getTransaction()` method when dealing with pending or missing transactions.

## Problem

Previously, the `getTransaction()` method would throw generic "RPC Error" messages that didn't distinguish between:
- Transaction not found (doesn't exist)
- Pending transaction (not yet confirmed)
- Unexpected response format (server issue)

This made it difficult for developers to implement proper error handling and transaction polling logic.

## Solution

### New Error Classes

Two new error classes have been added to `packages/abstract-provider/src/errors.ts`:

#### `TransactionNotFoundError`
Thrown when a transaction cannot be found on the blockchain.

```typescript
interface TransactionNotFoundError extends Error {
  name: 'TransactionNotFoundError'
  transactionHash: string
  message: string
}
```

#### `PendingTransactionError`
Reserved for future implementation when pending transaction detection is added.

### Updated `getTransaction()` Method

The `JsonRpcProvider.getTransaction()` method now:
- Returns the full transaction object on success
- Throws `TransactionNotFoundError` when transaction is not found
- Provides descriptive error messages including the transaction hash
- Preserves backward compatibility (errors still extend `Error`)

## Usage Examples

### Basic Transaction Retrieval

```typescript
const provider = new JsonRpcProvider({
  rpcUrl: 'https://mainnet.pokt.network/v1/client/query/tx'
});

try {
  const tx = await provider.getTransaction('0xabc123...');
  console.log('Transaction found:', tx);
} catch (error) {
  if (error.name === 'TransactionNotFoundError') {
    console.log('Transaction not found:', error.message);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

### Transaction Polling Pattern

```typescript
async function pollTransactionStatus(
  provider: JsonRpcProvider,
  txHash: string,
  maxAttempts: number = 60,
  delayMs: number = 1000
): Promise<Transaction> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const tx = await provider.getTransaction(txHash);
      console.log(`Transaction confirmed on attempt ${attempt}`);
      return tx;
    } catch (error) {
      if (error.name === 'TransactionNotFoundError') {
        if (attempt < maxAttempts) {
          console.log(`Transaction still pending (attempt ${attempt}/${maxAttempts})...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        } else {
          throw new Error(`Transaction ${txHash} not confirmed after ${maxAttempts} attempts`);
        }
      } else {
        throw error;
      }
    }
  }
}

// Usage
const tx = await pollTransactionStatus(provider, '0xabc123...');
console.log('Transaction status:', tx);
```

## Testing

The improvements include comprehensive test coverage:

- ✅ Successful transaction retrieval
- ✅ TransactionNotFoundError for missing transactions
- ✅ Descriptive error messages
- ✅ Type safety with error instanceof checks
- ✅ Full response logging for debugging

Run tests with:
```bash
pnpm test provider
```

## Backward Compatibility

These changes are fully backward compatible:
- Existing code that catches generic `Error` will continue to work
- New code can use specific error types: `error.name === 'TransactionNotFoundError'`
- No breaking changes to method signatures or return types

## Benefits

1. **Better Error Handling**: Developers can distinguish between different failure modes
2. **Easier Debugging**: Error messages include transaction hashes and full RPC responses
3. **Polling Support**: Clear patterns for implementing transaction status polling
4. **Type Safety**: Proper TypeScript support for error types
5. **Production Ready**: Comprehensive tests ensure reliability

## Future Enhancements

- Implement `PendingTransactionError` for proactive pending transaction detection
- Add transaction receipt tracking
- Implement exponential backoff for polling
- Add transaction timeout handling
