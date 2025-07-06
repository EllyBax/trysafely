/**
 * A helper function to wrap an async operation and return a tuple of [result, error].
 * This avoids the need for explicit try...catch blocks in the caller.
 *
 * @template T The expected type of the successful result.
 * @param {() => Promise<T>} fn The asynchronous function to execute.
 * @returns {Promise<[T | null, Error | null]>} A Promise that resolves to a tuple.
 *   The first element is the successful result (or null if an error occurred).
 *   The second element is the error (or null if the operation was successful).
 */
export declare function tryCatch<T>(fn: () => Promise<T>): Promise<[T | null, Error | null]>;
//# sourceMappingURL=index.d.ts.map