export declare type ResourceReport = {
  ev_type: 'resouce';
  payload: ResourcePayload;
};

export declare type ResourceErrorReport = {
  ev_type: 'resourceError';
  payload: ResourceErrorPayload;
};

/**
 * 错误资源上报字段
 */
export declare type ResourcePayload = PerformanceResourceTiming;

/**
 * 资源上报字段
 */
export interface ResourceErrorPayload {
  /** 触发标签的类型 script/link/css */
  type: string;
  url: string;
  timing?: PerformanceEntry;
}
