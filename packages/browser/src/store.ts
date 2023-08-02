import { getStorageItem, setStorageItem, uuid4 } from '@monitorjs/shared';
import { BrowserMonitorConfig } from '@monitorjs/types';
import { STORAGE_PREFIX, DEFAULT_REPORT_DSN } from './constant';
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
