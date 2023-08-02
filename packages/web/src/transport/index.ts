import { __isNavigator } from '@monitorjs/shared';
import { xhrTransport } from './xhr';

/**
 * 立即发送请求
 * @param url String 请求URL
 * @param body String 请求体
 * @returns
 */
export const transport = (url: string, body: string, useBeacon: boolean = false) => {
  const hasSendBeacon = __isNavigator(window && window.navigator) && typeof window.navigator.sendBeacon === 'function';

  if (hasSendBeacon && useBeacon) {
    // Prevent illegal invocations - https://xgwang.me/posts/you-may-not-know-beacon/#it-may-throw-error%2C-be-sure-to-catch
    const sendBeacon = window.navigator.sendBeacon.bind(window.navigator);
    return sendBeacon(url, body);
  }

  return xhrTransport('POST', {
    url,
    data: body,
  });
};
