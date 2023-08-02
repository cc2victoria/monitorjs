export declare type JsErrorReport = {
  ev_type: 'jsError';
  payload: JsErrorPayload;
};

export interface JsErrorPayload {
  error: JsError;
  breadcrumbs?: Breadcrumb[];
  extra?: {
    [key: string]: string;
  };
}

export interface Breadcrumb {
  /** dom | http */
  type: string;
  /** xpath, keyvalue | url */
  message: string;
  /** ui.click, ui.keypress | post,get */
  category: string;
  /** status: 400 for http */
  data?: {
    [key: string]: string;
  };
  timestamp: number;
}

/**
 * 错误上报字段
 */
export interface JsError {
  /** 错误名称 */
  name?: string;
  /** 错误信息 */
  message: string;
  /** 错误级别 */
  level?: string;
  /** 堆栈 */
  stack?: string;
  /** 错误文件名 */
  filename?: string;
  /** 行 */
  lineno?: string;
  /** 列 */
  colno?: string;
}
