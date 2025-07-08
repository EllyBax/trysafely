# trysafely

[![npm version](https://badge.fury.io/js/trysafely.svg)](https://www.npmjs.com/package/trysafely)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust asynchronous helper designed to simplify error handling by wrapping promises and functions to consistently return a predictable `{ result, error }` object. Say goodbye to repetitive `try...catch` blocks and embrace cleaner, more predictable async code.

## Features

*   **Eliminate `try...catch` boilerplate:** Replace cumbersome blocks with a single, elegant function call.
*   **Predictable `{ result: T, error: null } | { result: null, error: Error }` return:** Always receive a structured object, making error checks explicit and straightforward.
*   **Graceful Error Handling:** Easily manage both promise rejections and synchronous errors thrown during function execution.
*   **TypeScript-friendly:** Fully typed for excellent developer experience and compile-time safety.
*   **Lightweight:** Minimal overhead, focusing solely on simplifying async error patterns.
*   **Dual API:** Choose between wrapping a function-returning-a-promise (`trysafely`) or an already-instantiated promise (`tryPromise`).

## Usage

`trysafely` offers two primary ways to handle your asynchronous operations:

1.  **`trysafely(fn: () => Promise<T>)`**: For wrapping functions that return promises. This defers execution and catches synchronous errors.
2.  **`tryPromise(promise: Promise<T>)`**: For directly wrapping an already-created promise.

---

### Using `trySafely` (Function Wrapper)

Call `trySafely` with an arrow function that returns your Promise.

```typescript
import { trySafely } from 'trysafely';

async function fetchData(): Promise<string> {
  await new Promise(r => setTimeout(r, 50));
  if (Math.random() > 0.5) return "Data fetched!";
  throw new Error("Failed to fetch.");
}

async function runExample() {
  const { result, error } = await trySafely(() => fetchData());

  // Note: error is already typed as Error
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Success:", result);
  }
}
runExample();
```

---

### Using `tryPromise` (Promise Wrapper)

Import `tryPromise` from `trysafely/promises` and pass an existing Promise directly.

```typescript
import { tryPromise } from 'trysafely/promises';

async function validateInput(input: string): Promise<boolean> {
  await new Promise(r => setTimeout(r, 50));
  if (input.length > 5) return true;
  throw new Error("Input too short.");
}

async function runExample() {
  const { result, error } = await tryPromise(validateInput("hello world"));

  if (error) {
    console.error("Validation Error:", error.message);
  } else {
    console.log("Validation Success:", result);
  }
}
runExample();
```

---

### Renaming Variables on Destructuring

You can easily rename the `result` and `error` properties to custom variable names using object destructuring aliasing.

```typescript
import { trySafely } from 'trysafely';

async function getUserProfile(): Promise<{ name: string }> {
  await new Promise(r => setTimeout(r, 50));
  if (Math.random() > 0.5) return { name: "Alice" };
  throw new Error("Profile not found.");
}

async function runExample() {
  // Rename 'result' to 'user' and 'error' to 'userError'
  const { result: user, error: userError } = await trySafely(() => getUserProfile());

  if (userError) {
    console.error("User Profile Error:", userError.message);
  } else {
    console.log("User Profile:", user.name);
  }
}
runExample();
```

---

### With `Promise.all`

`trysafely` functions seamlessly with `Promise.all`, allowing you to await multiple operations concurrently and handle individual successes/failures.

```typescript
import { trySafely } from 'trysafely';
import { tryPromise } from 'trysafely/promises';

async function fetchProducts(): Promise<string[]> {
  await new Promise(r => setTimeout(r, 70));
  if (Math.random() > 0.3) return ["Laptop", "Monitor"];
  throw new Error("Product API error.");
}

async function fetchOrders(): Promise<number[]> {
  await new Promise(r => setTimeout(r, 80));
  return [101, 102];
}

async function loadDashboardData() {
  const [productsResp, ordersResp] = await Promise.all([
    trySafely(() => fetchProducts()), // Using trySafely for function wrapper
    tryPromise(fetchOrders())          // Using tryPromise for direct promise
  ]);

  if (productsResp.error) {
    console.error("Products failed:", productsResp.error.message);
  } else {
    console.log("Products loaded:", productsResp.result);
  }

  if (ordersResp.error) {
    console.error("Orders failed:", ordersResp.error.message); // This path unlikely for 'fetchOrders'
  } else {
    console.log("Orders loaded:", ordersResp.result);
  }
}
loadDashboardData();
```

---

## Why `trysafely`?

Traditional `try...catch` blocks can become verbose, especially when dealing with many async operations or `Promise.all`. `trysafely` provides a functional alternative, aligning with common patterns found in languages like Go (e.g., `value, err := func()`) where errors are returned as explicit values rather than thrown exceptions. This leads to:

*   **Readability:** Easier to follow the happy path and immediately see where errors are handled.
*   **Predictability:** Your functions will always resolve, never reject, making subsequent `await` calls safer.
*   **Maintainability:** Less nested code, simpler error propagation, and clearer responsibility.

## Installation

```bash
npm install trysafely
# or
yarn add trysafely
# or
pnpm add trysafely
```

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or want to contribute code, please feel free to open an issue or pull request on the [GitHub repository](https://github.com/EllyBax/trysafely.git).

## What's Next?

*   [ ] Add synchronous function support (e.g., `trysyncly` for non-async functions that might throw).
*   [ ] Enhance documentation with more advanced use cases and examples.
*   [ ] Explore error type refinement (e.g., custom error types or more precise error handling).

## License

`trysafely` is [MIT licensed](LICENSE).