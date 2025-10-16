# trysafely

[![npm version](https://badge.fury.io/js/trysafely.svg)](https://www.npmjs.com/package/trysafely)
 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A zero-dependency utility to wrap async and sync functions into predictable `{ data, err }` results — goodbye `try...catch`, hello clarity!

------

## Features

- ✅ **Eliminate try/catch boilerplate**
- 🔁 **Wrap sync or async functions**
- 🧠 **Fully typed & TypeScript friendly**
- 📦 **Lightweight, no dependencies**
- 🎯 **Predictable result shape**: `{ data: T | null, err: Error | null }`
- 🧪 **Easy testing & debugging**: No unhandled promise rejections

------

## Installation

```bash
npm install trysafely
# or
yarn add trysafely
# or
pnpm add trysafely
```

------

## API

### `trySafely(fn: () => T | Promise<T>)`

> Smart wrapper for **both sync and async** functions. Determines if the function is returning a Promise, and handles errors accordingly.

```ts
import trySafely from 'trysafely';

const { data, err } = await trySafely(asyncOrSyncFn());
```

------

### `tryAsync(fn: () => Promise<T>)`

> Specifically wraps an **async function**, catching any thrown or rejected errors.

```ts
import { tryAsync } from 'trysafely';

const { data, err } = await tryAsync(someAsyncFunction());
```

------

### `trySync(fn: () => T)`

> Specifically wraps a **synchronous function**, catching exceptions.

```ts
import { trySync } from 'trysafely';

const { data, err } = trySync(someSyncFunction());
```

------

## Examples

### Universal Function: `trySafely`

```ts
import trySafely from 'trysafely';

/** Example that may return synchronously or asynchronously */
async function getUser(): Promise<string> {
  await new Promise(r => setTimeout(r, 100));
  if (Math.random() > 0.5) return "Alice";
  throw new Error("User not found");
}

async function main() {
  const { data: user, err } = await trySafely(getUser());

  if (err) {
    console.error("Error fetching user:", err.message);
  } else {
    console.log("Fetched user:", user);
  }
}
```

------

### `tryAsync` Example

```ts
import { tryAsync } from 'trysafely';

/** Simulates an async failure */
async function loadData(): Promise<number> {
  throw new Error("Load failed");
}

async function run() {
  const { data, err } = await tryAsync(loadData());

  if (err) {
    console.error("Load Error:", err.message);
  } else {
    console.log("Loaded:", data);
  }
}
```

------

### `trySync` Example

```ts
import { trySync } from 'trysafely';

/** Synchronous function that may throw */
function riskyOperation(): number {
  if (Math.random() > 0.5) return 42;
  throw new Error("Boom");
}

const { data, err } = trySync(riskyOperation());

if (err) {
  console.error("Sync error:", err.message);
} else {
  console.log("Sync result:", data);
}
```

------

## Return Type

Every function returns:

```ts
type TryResult<T> = {
  data: T | null;
  err: Error | null;
};
```

This helps keep control flow **flat and readable**, especially in concurrent or nested logic.

------

## TypeScript Support

All functions are fully typed. Errors are always of type `Error`, and results are `T | null`. No more `any` surprises or missing catches.

------

## What's New in 4.0

- ✅ Unified `trySafely` now supports both sync and async functions
- ✅ Explicit `tryAsync` and `trySync` utilities included
- ❌ `tryPromise` deprecated — use `trySafely(() => promise)` instead
- 📦 Clean, small footprint

------

## What's Next?

-  Add optional fallback/default values in case of error
-  Better error classification (e.g., custom error types, tagging)
-  Performance benchmarks and tree-shaking guides
-  `trysafely.allSettled()` for batches

------

## Contributing

Contributions, bug reports, and feedback are welcome!
 Feel free to open an issue or PR on [GitHub](https://github.com/EllyBax/trysafely.git).

------

## License

MIT © [Elly Bax](https://github.com/EllyBax)
 See LICENSE for details.