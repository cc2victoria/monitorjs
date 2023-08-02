import {
  getUrlParams,
  hasOwnProperty,
  isInstanceOf,
  isPlainObject,
  isString,
  reportSelfError,
} from '@monitorjs/shared';
import { WrappedFunction } from '@monitorjstypes';

/**
 * 劫持对象方法
 * @param source hookobject
 * @param name hookname
 * @param replacementFactory replaceFunction
 * @returns replacementFactory
 */
export function hook(source: { [key: string]: any }, name: string, replacementFactory: (...args: any[]) => any): void {
  if (!(name in source)) {
    return;
  }

  const original = source[name];
  const wrapped = replacementFactory(original);

  if (typeof wrapped === 'function') {
    try {
      const proto = original.prototype || {};

      wrapped.prototype = original.prototype = proto;
      addNonEnumerableProperty(wrapped, '__monitor_original__', original);
    } catch (err) {}
  }

  source[name] = wrapped;
}
/**
 * 重置对象方法为原始方法
 * @param source 重置对象
 * @param name 重置名称
 * @returns
 */
export function restoreHook(source: { [key: string]: any }, name: string): void {
  if (!(name in source)) {
    return;
  }

  const wrapped = source[name];
  const original = getOriginalFunction(wrapped);

  if (original) {
    source[name] = original;
  }
}

/**
 * Defines a non-enumerable property on the given object.
 *
 * @param obj The object on which to set the property
 * @param name The name of the property to be set
 * @param value The value to which to set the property
 */
export function addNonEnumerableProperty(obj: { [key: string]: unknown }, name: string, value: unknown): void {
  Object.defineProperty(obj, name, {
    // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
    value: value,
    writable: true,
    configurable: true,
  });
}

/**
 * This extracts the original function if available.
 *
 * @param func the function to unwrap
 * @returns the unwrapped version of the function if available.
 */
export function getOriginalFunction(func: WrappedFunction): WrappedFunction | undefined {
  return func.__monitor_original__;
}

/**
 * 获取请求参数中的ua
 * @param body
 * @returns string | null | undefined
 */
export const getHeaderUa = (body?: Document | XMLHttpRequestBodyInit | null) => {
  let _ua;

  const type = Object.prototype.toString.call(body);

  switch (type) {
    case '[object String]':
      let _data = body as string;
      if (_data.startsWith('{') && _data.endsWith('}')) {
        try {
          _data = JSON.parse(_data);
          // @ts-ignore
          _ua = _data.ua;
        } catch (e) {
          reportSelfError(e);
        }
      } else {
        _ua = getUrlParams(_data, 'ua');
      }
      break;
    case '[object URLSearchParams]':
      // @ts-ignore
      _ua = (body as URLSearchParams).get('ua') || body.ua;
      break;

    case '[object FormData]':
      // @ts-ignore
      _ua = (body as FormData).get('ua') || body.ua;
      break;
  }

  return _ua;
};

/**
 * 获取请求参数中的method
 * @param fetchArgs
 * @returns GET | POST | HEAD | DELETE ...
 */
export const getFetchMethod = (fetchArgs: any[] = []): string => {
  if ('Request' in window && isInstanceOf(fetchArgs[0], Request) && fetchArgs[0].method) {
    return String(fetchArgs[0].method).toUpperCase();
  }
  if (fetchArgs[1] && fetchArgs[1].method) {
    return String(fetchArgs[1].method).toUpperCase();
  }
  return 'GET';
};

/** Extract `url` from fetch call arguments */
export const getFetchUrl = (fetchArgs: any[] = []): string => {
  if (typeof fetchArgs[0] === 'string') {
    return fetchArgs[0];
  }
  if ('Request' in window && isInstanceOf(fetchArgs[0], Request)) {
    return fetchArgs[0].url;
  }
  return String(fetchArgs[0]);
};

export const getFetchHeader = (fetchArgs: any[] = []): Headers | undefined => {
  if ('Request' in window && isInstanceOf(fetchArgs[0], Request) && fetchArgs[0].header) {
    return fetchArgs[0].header;
  }
  if (fetchArgs[1] && fetchArgs[1].header) {
    return fetchArgs[1].header;
  }
  return 'Headers' in window ? new Headers() : undefined;
};

/**
 * 获取请求体
 * @param fetchArgs
 * @returns
 */
export const getFetchBody = (fetchArgs: any[] = []): XMLHttpRequestBodyInit | null => {
  if ('Request' in window && isInstanceOf(fetchArgs[0], Request) && fetchArgs[0].body) {
    return String(fetchArgs[0].body).toUpperCase();
  }
  if (fetchArgs[1] && fetchArgs[1].body) {
    return fetchArgs[1].body;
  }
  return null;
};

export const getSearchURL = (url: string): string | URLSearchParams | undefined => {
  if ('URL' in window) {
    return new URL(url).searchParams;
  }

  return url.split('?').pop();
};

export const isSuccessStatus = (status: number): boolean => !(status < 200 || status > 299);

/**
 * 获取请求头对象
 * @param h Headers
 * @returns
 */
export const getAllFetchHeaders = (h: Headers) => {
  let res: { [key: string]: string } = {};

  h &&
    h.forEach((value, key) => {
      if (!isSensitiveHeader(key, value)) {
        res[key] = value;
      }
    });

  return res;
};

/**
 * 获取请求头对象
 * @param headers Headers
 * @returns
 */
export const getAllXHRHeaders = (headers: String) => {
  if (isString(headers) && headers) {
    let res: { [key: string]: string } = {};

    return headers.split('\r\n').reduce(function (result, line) {
      if (isString(line)) {
        let _a = line.split(': ');

        if (_a && _a[0] && _a[1]) {
          let name_1 = _a[0];
          let value = _a[1];
          !isSensitiveHeader(name_1, value) && (result[name_1.toLowerCase()] = value);
        }
      }
      return result;
    }, res);
  }
  return {};
};

const headerKeyRe = new RegExp('(cookie|auth|jwt|token|key|ticket|secret|credential|session|password)', 'i');
const headerValueRe = new RegExp('(bearer|session)', 'i');
const isSensitiveHeader = (key: string, value: string): boolean => {
  if (!key || !value) return false;
  return headerKeyRe.test(key) || headerValueRe.test(value);
};

export const checkIsExceptionRes = (response: any) => {
  if (response) {
    if (typeof response === 'string' && response.startsWith('{') && response.endsWith('}')) {
      try {
        const obj = JSON.parse(response);

        return typeof obj === 'object' ? isExceptionRes(obj) : false;
      } catch (error) {
        reportSelfError(error);
      }
    } else if (typeof response === 'object') {
      return isExceptionRes(response);
    }

    return false;
  } else {
    return true;
  }
};

export const isExceptionRes = (obj: unknown): obj is Record<string, unknown> => {
  if (isPlainObject(obj)) {
    if (hasOwnProperty(obj, 'isError')) {
      return obj.isError === true;
    } else if (hasOwnProperty(obj, 'code')) {
      return obj.code !== 0;
    } else if (hasOwnProperty(obj, 'ret')) {
      return obj.ret !== 0;
    }
    return false;
  }

  return false;
};

/**
 * check if is monitor sdk's requests
 * TODO: 处理内部发送sdk请求
 * @param url string
 */
export const isOwnRequest = (url: string) => {
  return isString(url) && (url.match(/upload/) || url.match(/tc.html/))
};
