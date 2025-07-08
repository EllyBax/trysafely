interface SuccessResult<T> {
  result: T;
  error: null;
}

interface ErrorResult {
  result: null;
  error: Error;
}

export type Result<T> = SuccessResult<T> | ErrorResult;

/**
 * A robust asynchronous helper designed to simplify error handling by wrapping
 * a function that returns a Promise. It consistently returns a `Result<T>` object
 * (`{ result: T, error: null }` on success or `{ result: null, error: Error }` on failure),
 * allowing consumers to destructure and handle errors explicitly.
 *
 * This function defers the execution of the async operation until `trySafely` is invoked,
 * and also catches synchronous errors that might occur when `fn` is called.
 *
 * @template T The expected type of the successful asynchronous result.
 * @param {() => Promise<T>} fn The asynchronous function to execute. This function
 *   should return a Promise that resolves with type T or rejects with an error.
 * @returns {Promise<Result<T>>} A Promise that resolves to a `Result<T>` object.
 *   - On success: `{ result: T, error: null }`
 *   - On failure: `{ result: null, error: Error }`
 */
export async function trySafely<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    return { result: data, error: null };
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { result: null, error: err };
  }
}