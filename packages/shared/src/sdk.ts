import { MonitorXMLHttpRequest } from '@monitorjs/types';
import { checkIsNaN } from './is';

/**
 * 获取服务端时间偏移量
 * https://api.zhenai.com/tc.html
 * 服务端返回数据客户端这段时间的误差忽略不计
 * @returns sdkOffset
 */
export const getSdkOffset = () => {
  const url = `${window.location.protocol}//api.zhenai.com/tc.html`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest() as MonitorXMLHttpRequest;
    xhr._is_monitor_own_request = true;

    xhr.onreadystatechange = function () {
      if (this.readyState === this.HEADERS_RECEIVED) {
        const msec = Number(this.getResponseHeader('msec'));
        const serverTimeStamp = checkIsNaN(msec) ? Date.now() : msec * 1000;

        resolve(serverTimeStamp - Date.now());
      }
    };

    try {
      // 仅options方法支持跨域
      xhr.open('OPTIONS', url);
      xhr.send();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 前端根据offset计算好和服务端时间差值
 * TODO: 处理所有请求的 timestamp，前端计算，不需要服务端进行计算，这个时间在上报之前进行计算
 */
export const getServerTimeStamp = (timestamp: number | undefined, offset: number) => {
  const current = !timestamp || checkIsNaN(timestamp) ? Date.now() : timestamp;
  return current + offset;
};
