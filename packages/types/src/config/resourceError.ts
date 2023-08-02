export declare const RESOURCE_ERROR_CONFIG_NAME = 'resourceError';

/**
 * 错误资源监听
 */
export interface ResourceErrorMonitorConfig {
  /**
   * List of strings / regex where the integration should create Spans out of. Additionally this will be used
   * to define which outgoing requests the `sentry-trace` header will be attached to.
   *
   * Default: []
   */
  exclude: Array<string | RegExp>;

  /**
   * Flag to disable patching all together for fetch requests.
   *
   * Default: []
   */
  include: Array<string | RegExp>;

  /**
   * Flag to disable patching all together for xhr requests.
   *
   * Default: true
   */
  dedupe: boolean;
}

export interface ResourceErrorMonitorPluginConfig {
  [RESOURCE_ERROR_CONFIG_NAME]?: Partial<ResourceErrorMonitorConfig> | boolean;
}
