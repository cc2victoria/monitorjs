import { isString } from './is';

/**
 * safeStringify
 * @param a
 * @returns
 */
export const safeStringify = (a: object | string | Event | any) => {
  try {
    return isString(a) ? a : JSON.stringify(a);
  } catch (err) {
    return `[FAILED_TO_STRINGIFY]:${String(err)}`;
  }
};

/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJoin(input: any[], delimiter?: string): string {
  if (!Array.isArray(input)) {
    return '';
  }

  const output = [];
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < input.length; i++) {
    const value = input[i];
    try {
      output.push(String(value));
    } catch (e) {
      output.push('[value cannot be serialized]');
    }
  }

  return output.join(delimiter);
}
