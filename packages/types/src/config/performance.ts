export declare const PERFORMANCE_CONFIG_NAME = 'performance';

/**
 * performance metrics
 */
declare enum PerformanceMetricsEnum {
  /** 首次内容绘制 FirstPaint */
  FP = 'FirstPaint',

  /** 首次内容绘制 FirstContentfulPaint */
  FCP = 'FirstContentfulPaint',

  /** 最大内容绘制 LargestContentfulPaint */
  LCP = 'LargestContentfulPaint',

  /** 首次输入延迟 FirstInputDelay */
  FID = 'FirstInputDelay',

  /** 累计布局偏移 CumulativeLayoutShift */
  CLS = 'CumulativeLayoutShift',

  /** TotalBlockingTime */
  TBT = 'TotalBlockingTime',

  /** NavigationTotalBlockingTime */
  NTBT = 'NavigationTotalBlockingTime',

  /** 资源加载时间，ResourceTiming，如：images, css, scripts */
  // RT = 'ResourceTiming',

  // ET = 'ElementTiming',

  /** 第一个字节时间 */
  // TTFB = 'TimeToFirstByte',

  /** https://web.dev/inp/ */
  INP = 'InteractionToNextPaint',
}

type MetricsKeys = keyof typeof PerformanceMetricsEnum;

export type ApiInitiatorTypes = 'beacon' | 'fetch' | 'xmlhttprequest';

export type AssetsInitiatorTypes = 'audio' | 'body' | 'css' | 'font' | 'img' | 'link' | 'script' | 'video' | 'other';

export interface PerformanceMonitorConfig {
  /**
   * 指标开关
   * default: ['FP', 'FCP', 'LCP', 'CLS', 'FID', 'INP', 'TBT', 'NTBT']
   */
  metrics: MetricsKeys[];

  /**
   * 是否对所有上报接口进行测速
   * default true
   */
  reportApiSpeed: boolean | ApiInitiatorTypes[];

  /**
   * 是否对所有资源进行测速
   * default: false
   */
  reportAssetSpeed: boolean | AssetsInitiatorTypes[];

  /**
   * 慢资源阈值，超过该值则定义为慢资源，慢资源100%上报
   */
}

export interface PerformanceMonitorPluginConfig {
  [PERFORMANCE_CONFIG_NAME]?: Partial<PerformanceMonitorConfig> | boolean;
}

export type ResourceTimingMetrics = {
  redirectTime?: number;
  dnsLookupTime?: number;
  tcpTime?: number;
  headerSize?: number;
  timeToFirstByte?: number;
  downloadTime?: number;
  totalTime?: number;
  duration?: number;
};
