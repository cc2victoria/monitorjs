import { JsError } from '@monitorjs/types';
import {
  assign,
  isError,
  isPlainObject,
  isString,
  pick,
  safeStringify,
  __isEvent,
  __isErrorEvent,
  __isPromiseRejectionEvent,
} from '@monitorjsshared';

export const ERROR_FIELDS = ['name', 'message', 'stack', 'filename', 'lineno', 'colno'];

/**
 * 格式化错误信息
 */
export const normalize = (err: Error | any): JsError => {
  try {
    let error;

    if (!isError(err)) {
      if (isPlainObject(err) || __isEvent(err) || isString(err)) {
        error = {
          message: safeStringify(err),
        };
      }
    } else {
      error = pick(err, ERROR_FIELDS);
    }

    return assign({ message: 'UnknowErrorMessage', level: 'error' }, error);
  } catch (error) {
    return { name: 'SDKError', message: `**non-normalize** (${error})`, level: 'error' };
  }
};

export const normalizeError = (ev: ErrorEvent): JsError => {
  try {
    if (ev && __isErrorEvent(ev)) {
      return assign(normalize(ev.error), pick(ev, ERROR_FIELDS));
    } else {
      return normalize(ev);
    }
  } catch (error) {
    return { name: 'SDKError', message: `**non-normalizeError** (${error})`, level: 'error' };
  }
};

export const normalizeException = (event: PromiseRejectionEvent | CustomEvent | any): JsError => {
  let _a;
  // dig the object of the rejection out of known event types
  try {
    let error;
    // see https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
    if ('reason' in event) {
      error = event.reason;
    }
    // see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
    else if ('detail' in event && 'reason' in event.detail) {
      error = event.detail.reason;
    }

    if (error) {
      let rejectionError: JsError = normalize(error);
      _a = rejectionError && rejectionError.name;

      return assign(assign({}, rejectionError), {
        name: _a !== null && _a !== undefined ? _a : 'UnhandledRejection',
      });
    } else {
      return { name: 'Unknow Error', message: `**non-normalizeException** (${error})`, level: 'error' };
    }
  } catch (err) {
    return { name: 'Internel SDK ERROR', message: `**non-normalizeException** (${err})`, level: 'error' };
  }
};

export const normalizeUnknownError = (exception: ErrorEvent | PromiseRejectionEvent | CustomEvent | any): JsError => {
  if (__isErrorEvent(exception)) {
    return normalizeError(exception);
  } else if (__isPromiseRejectionEvent(exception)) {
    return normalizeException(exception);
  } else {
    return normalize(exception);
  }
};
