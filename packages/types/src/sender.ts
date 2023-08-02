/**
 * 发送数据
 */
export interface EventSender<SendEvent> {
  send: (e: SendEvent) => void;
}

export declare interface SenderConfig {
  size?: number;
  wait?: number;
  batch?: [];
  endpoint?: string;
  transport: (options: any) => void;
}

/**
 * 分批发送
 */
export declare type BatchSender<E> = EventSender<E> & {
  getSize: () => number;
  getWait: () => number;
  setSize: (v: number) => void;
  setWait: (v: number) => void;
  getEndpoint: () => string;
  setEndpoint: (v: string) => void;
  flush: () => void;
  getBatchData: () => string;
  clear: () => void;
};

export interface XHROptions {
  method: string
  url: string
  data?: Document | XMLHttpRequestBodyInit | null
  withCredentials?: boolean
  success?: (data: any) => void
  fail?: (error: any) => void
}
