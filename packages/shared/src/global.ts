/**
 * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
 * you must either a) use `console.log` rather than the logger, or b) put your function elsewhere.
 */

const fallbackGlobalObject = {};

/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
export function getGlobalObject<T>(): T {
  return (
    typeof window !== 'undefined' // eslint-disable-line no-restricted-globals
      ? window // eslint-disable-line no-restricted-globals
      : typeof self !== 'undefined'
      ? self
      : fallbackGlobalObject
  ) as T;
}
