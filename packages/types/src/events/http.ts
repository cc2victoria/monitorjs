import { ResourceTimingMetrics } from '../config';

export declare type HttpReport = {
  ev_type: 'http';
  payload: HttpPayload;
};

/**
 * 接口上报字段
 */
export interface HttpPayload {
  /** xhr | fetch */
  api: string;
  request?: HttpReq;
  response?: HttpRes;
  /** elapsed time from send to response calculate by SDK */
  duration: number;
  extra?: {
    [key: string]: string;
  };
  /** requestId */
  traceId?: string;
}

export interface HttpReq {
  /** request method: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods  */
  method: string;
  /** request url */
  url: string;
  /** request header */
  headers?: {
    [key: string]: string;
  };
  /** request method */
  body?: string;
  /** request start timestamp */
  timestamp: number;
}

export interface HttpRes {
  /** 状态码 */
  status: number; // 0 is blocked
  /**
   * response header
   *  跨域的情况下，前端获取不到所有响应头
   *  https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
   */
  headers?: {
    [key: string]: string;
  };
  /** response body */
  body?:
    | string
    | {
        [key: string]: any;
      };
  /** request performance timing */
  timing?: ResourceTimingMetrics;
  /** response end timestamp */
  timestamp: number;
}
