export declare const REQUEST_CONFIG_NAME = 'request';

/**
 * 请求监听配置选型
 */
export interface RequestMonitorConfig {
  /**
   * The urls to report
   * if include and exclude both not null
   */
  include: Array<string | RegExp>;

  /**
   * the urls not to report
   *
   * Default: reporting url
   */
  exclude: Array<string | RegExp>;

  /**
   * Flag to disable patching all together for fetch requests.
   * Default: true
   */
  traceFetch: boolean;

  /**
   * Flag to disable patching all together for xhr requests.
   *
   * Default: true
   */
  traceXHR: boolean;
}

export interface RequestMonitorPluginConfig {
  [REQUEST_CONFIG_NAME]?: Partial<RequestMonitorConfig> | boolean;
}
