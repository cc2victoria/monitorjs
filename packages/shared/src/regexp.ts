import { INGORE_TYPES } from '@monitorjs/types';
import { isString } from './is';

export const getRegExpCheckFn = (include: INGORE_TYPES, exclude: INGORE_TYPES) => {
  const includeRegs = getRegExp(include);
  const excludeRegs = getRegExp(exclude);
  return (url: string): boolean => {
    // ignore
    if ((includeRegs && !includeRegs.test(url)) || (excludeRegs && excludeRegs.test(url))) {
      return false;
    }

    return true;
  };
};

/**
 * Joins RegExp in an array
 * @param ignore Either a regex or a string that must be contained in value
 * @returns Joined RegExp
 */
export const getRegExp = (ignore: INGORE_TYPES) => {
  if (!Array.isArray(ignore)) {
    return null;
  }
  return ignore.length ? joinRegExp(ignore) : null;
};

/**
 * Joins RegExp in an array
 * @param pattern Either a regex or a string that must be contained in value
 * @returns Joined RegExp
 */
export const joinRegExp = (patterns: (RegExp | string)[]) => {
  var sources = [];
  var len = patterns.length;
  for (var i = 0; i < len; i++) {
    var pattern = patterns[i];
    if (isString(pattern)) {
      sources.push(pattern.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'));
    } else if (pattern && pattern.source) {
      sources.push(pattern.source);
    }
  }
  return new RegExp(sources.join('|'), 'i');
};
