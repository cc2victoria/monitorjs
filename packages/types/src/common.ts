export type Falsy = false | null | undefined;

export type INGORE_TYPES = (RegExp | string)[];

export interface MonitorXMLHttpRequest extends XMLHttpRequest {
  /**
   * requestId
   */
  _ua: string;

  /**
   * should be ignore
   * true is ignore
   */
  _isIgnore: boolean;

  /**
   * monitor own request, intercept report to server
   */
  _is_monitor_own_request: boolean;
}
