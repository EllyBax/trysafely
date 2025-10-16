/**

- Attempts to run an **async** function safely.
- @template T
- @param fn - A function returning a Promise.
- @returns An object `{ data, err }` where `data` is the resolved value or `null`, and `err` is the caught error or `null`.
   */
export async function tryAsync<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    return { data, err: null };
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { data: null, err };
  }
}

/**

- Attempts to run a **sync** function safely.
- @template T
- @param fn - A function returning a synchronous result.
- @returns An object `{ data, err }`
   */
export function trySync<T>(fn: () => T) {
  try {
    const data = fn();
    return { data, err: null };
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { data: null, err };
  }
}

/**

- Attempts to run a function safely, whether it returns a value or a promise.
- @template T - The type of the function's return value.
- @param fn - A function that returns either T or Promise.
- @returns A Promise resolving to `{ data, err }`.
   */
export default async function trySafely<T>(fn: () => T | Promise<T>) {
  if (typeof fn !== "function") {
    throw new Error("fn must be a function");
  }
  try {
    const res = (fn as () => T | Promise<T>)();

    // If the result is a Promise-like, await it
    const isThenable = res !== null && typeof (res as any).then === "function";

    if (isThenable) {
      const data = await res;
      return { data, err: null };
    }
    const data = res as T;
    return { data, err: null };
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { data: null, err };
  }
}
