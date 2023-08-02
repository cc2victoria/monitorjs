/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { PolymorphicEvent, Primitive } from '@monitorjs/types';

// eslint-disable-next-line @typescript-eslint/unbound-method
const objectToString = Object.prototype.toString;

export function hasOwnProperty(wat: unknown, ty: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(wat, ty);
}

/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function isError(wat: unknown): wat is Error {
  switch (objectToString.call(wat)) {
    case '[object Error]':
    case '[object Exception]':
    case '[object DOMError]':
    case '[object DOMException]':
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}

export function isBuiltin(wat: unknown, ty: string): boolean {
  return objectToString.call(wat) === `[object ${ty}]`;
}

/**
 * Checks whether given value's type is Function
 * {@link isFunction}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function isFunction(wat: unknown): boolean {
  return isBuiltin(wat, 'Function');
}

/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isErrorEvent(wat: unknown): boolean {
  return isBuiltin(wat, 'ErrorEvent');
}

/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isDOMError(wat: unknown): boolean {
  return isBuiltin(wat, 'DOMError');
}

/**
 * Checks whether given value's type is DOMException
 * {@link __isURLSearchParams}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isURLSearchParams(wat: unknown): boolean {
  return isBuiltin(wat, 'URLSearchParams');
}

/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isDOMException(wat: unknown): boolean {
  return isBuiltin(wat, 'DOMException');
}

/**
 * Checks whether given value's type is PromiseRejectionEvent
 * {@link isPromiseRejectionEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isPromiseRejectionEvent(wat: unknown): boolean {
  return isBuiltin(wat, 'PromiseRejectionEvent');
}

/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function isString(wat: unknown): wat is string {
  return isBuiltin(wat, 'String');
}

/**
 * Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isPrimitive(wat: unknown): wat is Primitive {
  return wat === null || (typeof wat !== 'object' && typeof wat !== 'function');
}

/**
 * Checks whether given value's type is an object literal
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function isPlainObject(wat: unknown): wat is Record<string, unknown> {
  return isBuiltin(wat, 'Object');
}

export function isObject(wat: unknown): wat is Record<string, unknown> {
  return typeof wat === 'object' && wat !== null;
}

/**
 * Checks whether given value's type is an Boolean literal
 * {@link isBoolean}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isBoolean(wat: unknown): boolean {
  return wat === true || wat === false || isBuiltin(wat, 'Boolean ');
}

/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isEvent(wat: unknown): wat is PolymorphicEvent {
  return typeof Event !== 'undefined' && isInstanceOf(wat, Event);
}

/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isElement(wat: unknown): boolean {
  return typeof Element !== 'undefined' && isInstanceOf(wat, Element);
}

/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function __isRegExp(wat: unknown): wat is RegExp {
  return isBuiltin(wat, 'RegExp');
}

export function __isNavigator(wat: unknown): boolean {
  return isBuiltin(wat, 'Navigator');
}

/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */
export function __isThenable(wat: any): wat is PromiseLike<any> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return Boolean(wat && wat.then && typeof wat.then === 'function');
}

/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function isSyntheticEvent(wat: unknown): boolean {
  return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
}

/**
 * Checks whether given value is NaN
 * {@link isNaN}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
export function checkIsNaN(wat: unknown): boolean {
  return typeof wat === 'number' && wat !== wat;
}

/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */
export function isInstanceOf(wat: any, base: any): boolean {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return objectToString.call(value).slice(8, -1);
};
