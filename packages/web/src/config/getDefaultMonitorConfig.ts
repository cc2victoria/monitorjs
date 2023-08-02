import { getStorageItem, setStorageItem, uuid4 } from '@monitorjs/shared';
import { BrowserMonitorConfig } from '@monitorjs/types';
import { STORAGE_PREFIX, DEFAULT_REPORT_DSN } from './common';
import { defaultJSErrorConfig } from './error';
import { defaultRequestConfig } from './request';
import { defaultResourceErrorConfig } from './resourceError';
import { defaultWhiteScreenConfig } from './whiteScreen';
import { defaultPerformanceConfig } from './performance';
/**
 * 获取默认上报地址
 * @returns report url
 */
export const getDefaultDNS = () => `${window.location.protocol}//${DEFAULT_REPORT_DSN}`;

/**
 * 获取请求前缀
 * @param {String} appId
 * @returns
 */
export const getStorageKey = (appId?: string) => STORAGE_PREFIX + appId;

/**
 * get appinfo in local
 * @param appId application id
 * @returns
 */
export const getStoreInfo = (appId?: string) => {
  const historyItem = appId ? getStorageItem(getStorageKey(appId)) : '';

  return (
    historyItem || {
      userId: uuid4(),
      deviceId: uuid4(),
      sample_rate: 0.1,
    }
  );
};

export const saveStoreInfo = (config: Partial<BrowserMonitorConfig>) => {
  const { aid: appId, userId, deviceId, sample_rate } = config;
  const key = getStorageKey(appId);

  setStorageItem(key, {
    dsn: '',
    userId,
    deviceId,
    sample_rate,
  });
};

export const getDefaultMonitorConfig = (aid?: string): BrowserMonitorConfig => {
  const { userId, deviceId, sample_rate } = getStoreInfo(aid) || {};

  return {
    aid: aid || '',
    pid: '',
    userId,
    deviceId,
    // 当前事件命中的有效采样率。错误相关类都是100%的上报率，成功，会按照这个采样率。
    sample_rate,
    sid: '', // sid 请求sid从header或者cookie或者storage等获取，如果没有则生成sid uuid4()
    dsn: getDefaultDNS(),
    release: '1.0.0',
    env: 'prod',
    jsError: defaultJSErrorConfig(),
    request: defaultRequestConfig(),
    resourceError: defaultResourceErrorConfig(),
    whiteScreen: defaultWhiteScreenConfig(),
    performance: defaultPerformanceConfig(),
  };
};
