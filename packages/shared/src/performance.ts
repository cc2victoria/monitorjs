import { ResourceTimingMetrics } from '@monitorjs/types';
import { WP, isPerformanceSupported } from './support';

export const getLastetEntriesByName = (name: string): PerformanceEntry | undefined => {
  return WP.getEntriesByName(name).pop();
};

/**
 * 通过名称获取最近一次资源监听的数据, 如果需要监听所有的dns等等，跨域的情况下需要开启：Timing-Allow-Origin
 * @param name xmlhttprequest ect
 * @returns
 * https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API
 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming
 */
export const getFormatLastetEntriesByName = (name: string): ResourceTimingMetrics => {
  if (!isPerformanceSupported()) {
    return {};
  }

  const n = getLastetEntriesByName(name) as PerformanceResourceTiming;

  if (!n) {
    return {};
  }

  return {
    redirectTime: n.redirectEnd - n.redirectStart,
    dnsLookupTime: n.domainLookupEnd - n.domainLookupStart,
    tcpTime: n.connectEnd - n.connectStart,
    headerSize: n.transferSize - n.encodedBodySize || 0, // unit Byte
    timeToFirstByte: n.responseStart - n.requestStart,
    downloadTime: n.responseEnd - n.responseStart,
    totalTime: n.responseEnd - n.requestStart,
    duration: n.duration,
  };
};
