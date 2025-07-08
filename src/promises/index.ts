import { Result } from "src";

/**
 * A robust asynchronous helper designed to simplify error handling by wrapping
 * an already-instantiated Promise. It consistently returns a `Result<T>` object
 * (`{ result: T, error: null }` on success or `{ result: null, error: Error }` on failure),
 * allowing consumers to destructure and handle errors explicitly.
 *
 * This function is concise for direct use with promises that are already created and
 * potentially executing.
 *
 * @template T The expected type of the successful asynchronous result.
 * @param {Promise<T>} promise The promise instance to execute and handle.
 * @returns {Promise<Result<T>>} A Promise that resolves to a `Result<T>` object.
 *   - On success: `{ result: T, error: null }`
 *   - On failure: `{ result: null, error: Error }`
 */
export default async function tryPromise<T>(
  promise: Promise<T>,
): Promise<Result<T>> {
  try {
    const data = await promise;
    return { result: data, error: null }
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { result: null, error: err }
  }
}