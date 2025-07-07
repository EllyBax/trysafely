# trysafely

[![npm version](https://badge.fury.io/js/trysafely.svg)](https://www.npmjs.com/package/trysafely)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust asynchronous helper designed to simplify error handling by wrapping promises and functions to consistently return a `[result, error]` tuple. Say goodbye to repetitive `try...catch` blocks and embrace cleaner, more predictable async code.

## Features

*   **Eliminate `try...catch` boilerplate:** Replace cumbersome blocks with a single, elegant function call.
*   **Predictable `[result, error]` return:** Always receive a tuple, making error checks explicit and straightforward.
*   **Graceful Error Handling:** Easily manage both promise rejections and synchronous errors thrown during function execution.
*   **TypeScript-friendly:** Fully typed for excellent developer experience and compile-time safety.
*   **Lightweight:** Minimal overhead, focusing solely on simplifying async error patterns.
*   **Dual API:** Choose between wrapping a function-returning-a-promise (`trysafely`) or an already-instantiated promise (`tryPromise`).

## Installation

```bash
npm install trysafely
# or
yarn add trysafely
# or
pnpm add trysafely
```

## Usage

`trysafely` offers two primary ways to handle your asynchronous operations:

1.  **`trysafely(fn: () => Promise<T>)`**: For wrapping functions that return promises. This defers execution until `trysafely` is called and also catches synchronous errors that might occur when `fn` is invoked.
2.  **`tryPromise(promise: Promise<T>)`**: For directly wrapping an already-created promise. This is more concise when the promise is immediately available and already executing.

---

### Basic Usage with `trysafely` (Wrapping a Function)

Wrap your asynchronous function in `trysafely` to get a `[data, error]` tuple. This form is ideal when you want to defer the execution of your async operation.

```typescript
import { trySafely } from 'trysafely';

// Assume this function fetches user data and might throw or reject
async function fetchUserDetails(userId: string): Promise<{ id: string; name: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  if (userId === "user123") {
    return { id: "user123", name: "Alice" };
  } else if (userId === "errorUser") {
    throw new Error("Network error during fetch!");
  } else {
    // This will be caught too! (synchronous throw)
    throw "Invalid User ID format.";
  }
}

async function getUser() {
  console.log("--- Getting 'user123' with trysafely(() => ...) ---");
  const [user, err] = await trySafely(() => fetchUserDetails("user123"));

  if (err) {
    console.error("Failed to get user:", err.message);
  } else {
    console.log("User data:", user); // Output: { id: 'user123', name: 'Alice' }
  }

  console.log("\n--- Getting 'errorUser' with trysafely(() => ...) (simulated failure) ---");
  const [errorUser, errorErr] = await trySafely(() => fetchUserDetails("errorUser"));

  if (errorErr) {
    console.error("Failed to get error user:", errorErr.message); // Output: Network error during fetch!
  } else {
    console.log("Error user data:", errorUser);
  }

  console.log("\n--- Getting 'unknownUser' with trysafely(() => ...) (synchronous throw) ---");
  const [unknownUser, unknownErr] = await trySafely(() => fetchUserDetails("unknownUser"));

  if (unknownErr) {
    console.error("Failed to get unknown user:", unknownErr.message); // Output: Invalid User ID format.
  } else {
    console.log("Unknown user data:", unknownUser);
  }
}

getUser();
```

---

### Usage with `tryPromise` (Wrapping a Promise)

For situations where you already have a `Promise` instance, import `tryPromise` and pass the promise directly. This is often more concise.

```typescript
import { trySafely } from 'trysafely'; // Still need trySafely for the other import
import { tryPromise } from 'trysafely/promises'; // Import the specific tryPromise helper

// Assume these functions return promises directly
async function fetchConfig(): Promise<{ theme: string; debug: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return { theme: "dark", debug: false };
}

async function validateToken(token: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 75));
  if (token === "valid-token") {
    return true;
  }
  throw new Error("Invalid token provided.");
}

async function retrieveData() {
  console.log("\n--- Retrieving Data with tryPromise(promise) ---");

  // Call the function directly to get the promise, then pass it to tryPromise
  const [config, configErr] = await tryPromise(fetchConfig());

  if (configErr) {
    console.error("Failed to fetch config:", configErr.message);
  } else {
    console.log("Config loaded:", config); // Output: { theme: 'dark', debug: false }
  }

  const [tokenValid, tokenErr] = await tryPromise(validateToken("bad-token"));
  if (tokenErr) {
    console.error("Token validation failed:", tokenErr.message); // Output: Invalid token provided.
  } else {
    console.log("Token is valid:", tokenValid);
  }
}

retrieveData();
```

---

### With `Promise.all`

Both `trysafely` and `tryPromise` truly shine when managing multiple concurrent asynchronous operations, allowing you to gracefully handle partial failures without `Promise.all` short-circuiting. Use the one that best fits the immediate availability of your promises.

```typescript
import { trySafely } from 'trysafely';
import { tryPromise } from 'trysafely/promises'; // Import tryPromise if you're using it

async function fetchSalesData(): Promise<number[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  // Simulate occasional failure
  if (Math.random() > 0.8) throw new Error("Sales API timeout");
  return [100, 250, 300];
}

async function fetchInventoryData(): Promise<string[]> {
  // assume a query fetching the list of items in the inventory
  return await db.select().from(inventory)
}

async function fetchAnalyticsSummary(): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 100));
  // Simulate consistent failure for demo
  throw new Error("Analytics service unavailable");
}

async function loadDashboard() {
  console.log("\n--- Loading Dashboard Data ---");
  const [salesResult, inventoryResult, analyticsResult] = await Promise.all([
    // Use trysafely for functions
    trySafely(() => fetchSalesData()),
    // Or tryPromise if you prefer to call it directly and pass the promise
    tryPromise(fetchInventoryData()), // since fetchInventoryData returns Promise directly
    trySafely(() => fetchAnalyticsSummary()),
  ]);

  const [sales, salesErr] = salesResult;
  const [inventory, inventoryErr] = inventoryResult;
  const [analytics, analyticsErr] = analyticsResult;

  if (salesErr) {
    console.error("❌ Failed to load Sales Data:", salesErr.message);
  } else {
    console.log("✅ Sales Data Loaded:", sales);
  }

  if (inventoryErr) {
    console.error("❌ Failed to load Inventory Data:", inventoryErr.message);
  } else {
    console.log("✅ Inventory Data Loaded:", inventory);
  }

  if (analyticsErr) {
    console.error("❌ Failed to load Analytics Summary:", analyticsErr.message);
  } else {
    console.log("✅ Analytics Summary Loaded:", analytics);
  }

  console.log("\nDashboard Load Complete.");
}

loadDashboard();
```

---

## Why `trysafely`?

Traditional `try...catch` blocks can become verbose, especially when dealing with many async operations or `Promise.all`. `trysafely` provides a functional alternative, aligning with common patterns found in languages like Go (e.g., `value, err := func()`) where errors are returned as explicit values rather than thrown exceptions. This leads to:

*   **Readability:** Easier to follow the happy path and immediately see where errors are handled.
*   **Predictability:** Your function will always resolve, never reject, making subsequent `await` calls safer.
*   **Maintainability:** Less nested code, simpler error propagation, and clearer responsibility.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or want to contribute code, please feel free to open an issue or pull request on the [GitHub repository](https://github.com/EllyBax/trysafely.git).

## What's Next?

*   [ ] Add synchronous function support (e.g., `trysyncly` for non-async functions that might throw).
*   [ ] Enhance documentation with more advanced use cases and examples.
*   [ ] Explore error type refinement (e.g., custom error types or more precise error handling).

## License

`trysafely` is [MIT licensed](LICENSE).