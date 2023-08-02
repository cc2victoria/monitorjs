import { isString } from './is';
import { safeStringify } from './string';

/**
 * 设置本地缓存
 * @param key
 * @param value
 */
export const setStorageItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, safeStringify(value));
  } catch (error) {}
};

/**
 * 获取本地缓存值
 * @param key
 * @returns
 */
export const getStorageItem = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    return value && isString(value) ? JSON.parse(value) : value;
  } catch (error) {
    return undefined;
  }
};

/**
 * 设置本地缓存
 * @param key
 * @param value
 */
export const setSessionStorageItem = (key: string, value: any) => {
  try {
    sessionStorage.setItem(key, safeStringify(value));
  } catch (error) {}
};

/**
 * 获取本地缓存值
 * @param key
 * @returns
 */
export const getSessionStorageItem = (key: string) => {
  try {
    const value = sessionStorage.getItem(key);
    return value && isString(value) ? JSON.parse(value) : value;
  } catch (error) {
    return undefined;
  }
};
