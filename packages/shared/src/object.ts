import { hasOwnProperty, isObject } from './is';
import { Assign, PickFields } from '@monitorjs/types';

export const __assign = <T extends {}>(target: T, ...source: any[]): any => {
  for (let i = 0, len = source.length; i < len; i++) {
    let su = source[i];

    for (let k in su) {
      if (hasOwnProperty(su, k)) {
        // @ts-ignore
        target[k] = su[k];
      }
    }
  }

  return target;
};

export const assign: Assign = <T extends {}>(t: T, ...s: any[]) => (Object.assign || __assign)(t, ...s);

export const pick: PickFields = (obj: any, keys: any[]) => {
  if (!obj || !isObject(obj)) {
    return {};
  }

  let res = {};

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];

    if (hasOwnProperty(obj, key)) {
      // @ts-ignore
      res[key] = obj[key];
    }
  }

  return res;
};
