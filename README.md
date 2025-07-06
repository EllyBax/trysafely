# safely

[![npm version](https://badge.fury.io/js/safely.svg)](https://www.npmjs.com/package/safely)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust asynchronous helper designed to simplify error handling by wrapping promises and functions to consistently return a `[result, error]` tuple. Say goodbye to repetitive `try...catch` blocks and embrace cleaner, more predictable async code.

## ✨ Features

*   **Eliminate `try...catch` boilerplate:** Replace cumbersome blocks with a single, elegant function call.
*   **Predictable `[result, error]` return:** Always receive a tuple, making error checks explicit and straightforward.
*   **Graceful Error Handling:** Easily manage both promise rejections and synchronous errors thrown during function execution.
*   **TypeScript-friendly:** Fully typed for excellent developer experience and compile-time safety.
*   **Lightweight:** Minimal overhead, focusing solely on simplifying async error patterns.

## 🚀 Installation

```bash
npm install safely
# or
yarn add safely
# or
pnpm add safely
```

## 📖 Usage

### Basic Usage

Wrap your asynchronous function in `safely` to get a `[data, error]` tuple.

```typescript
import { tryCatch } from 'safely';

// Assume this function fetches user data and might throw or reject
async function fetchUserDetails(userId: string): Promise<{ id: string; name: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  if (userId === "user123") {
    return { id: "user123", name: "Alice" };
  } else if (userId === "errorUser") {
    throw new Error("Network error during fetch!");
  } else {
    // This will be caught too!
    throw "Invalid User ID format.";
  }
}

async function getUser() {
  console.log("--- Getting 'user123' ---");
  const [user, err] = await tryCatch(() => fetchUserDetails("user123"));

  if (err) {
    console.error("Failed to get user:", err.message);
  } else {
    console.log("User data:", user); // Output: { id: 'user123', name: 'Alice' }
  }

  console.log("\n--- Getting 'errorUser' (simulated failure) ---");
  const [errorUser, errorErr] = await tryCatch(() => fetchUserDetails("errorUser"));

  if (errorErr) {
    console.error("Failed to get error user:", errorErr.message); // Output: Network error during fetch!
  } else {
    console.log("Error user data:", errorUser);
  }

  console.log("\n--- Getting 'unknownUser' (synchronous throw) ---");
  const [unknownUser, unknownErr] = await tryCatch(() => fetchUserDetails("unknownUser"));

  if (unknownErr) {
    console.error("Failed to get unknown user:", unknownErr.message); // Output: Invalid User ID format.
  } else {
    console.log("Unknown user data:", unknownUser);
  }
}

getUser();
```

### With `Promise.all`

`safely` truly shines when managing multiple concurrent asynchronous operations, allowing you to gracefully handle partial failures without `Promise.all` short-circuiting.

```typescript
import { tryCatch } from 'safely';

async function fetchSalesData(): Promise<number[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  // Simulate occasional failure
  if (Math.random() > 0.8) throw new Error("Sales API timeout");
  return [100, 250, 300];
}

async function fetchInventoryData(): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return ["Laptop", "Mouse", "Keyboard"];
}

async function fetchAnalyticsSummary(): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 100));
  // Simulate consistent failure for demo
  throw new Error("Analytics service unavailable");
}

async function loadDashboard() {
  console.log("\n--- Loading Dashboard Data ---");
  const [salesResult, inventoryResult, analyticsResult] = await Promise.all([
    tryCatch(() => fetchSalesData()),
    tryCatch(() => fetchInventoryData()),
    tryCatch(() => fetchAnalyticsSummary()),
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

## 💡 Why `safely`?

Traditional `try...catch` blocks can become verbose, especially when dealing with many async operations or `Promise.all`. `safely` provides a functional alternative, aligning with common patterns found in languages like Go (e.g., `value, err := func()`) where errors are returned as explicit values rather than thrown exceptions. This leads to:

*   **Readability:** Easier to follow the happy path and immediately see where errors are handled.
*   **Predictability:** Your function will always resolve, never reject, making subsequent `await` calls safer.
*   **Maintainability:** Less nested code, simpler error propagation, and clearer responsibility.

## 🤝 Contributing

Contributions are welcome! If you have suggestions, bug reports, or want to contribute code, please feel free to open an issue or pull request on the [GitHub repository](https://github.com/EllyBax/safely.git).

## What's Next?
- [ ] Add synchronous function support
- [ ] Add more documentation

## 📄 License

`safely` is [MIT licensed](LICENSE).