import { EventTypesEnum } from './enums';

export declare type PerformanceTimingReport = {
  ev_type: 'performanceTiming';
  payload: PerformanceTimingPayload;
};

export declare type PerofrmanceReport = {
  ev_type: 'performance';
  payload:
    | PerformancePayload
    | {
        metrics: PerformancePayload[];
      };
};

/**
 * 资源请求性能上报字段
 */
export interface PerformanceTimingPayload {
  /** level 1 https://www.w3.org/TR/navigation-timing/ */
  timing?: PerformanceTiming;
  /** level 2 https://www.w3.org/TR/navigation-timing-2/ */
  navigation_timing?: PerformanceNavigationTiming;
}

/**
 * 首页性能上报字段
 */
export interface PerformancePayload {
  /** 指标名称 */
  name: string;
  /** 当前值 */
  value: number | string;
  /** 性能指标类型， perf => 传统性能, spa => SPA 性能, mf => 微前端性能 */
  type: string;
  /** 指标的相关信息 */
  vitalsScore?: number | string;
}
