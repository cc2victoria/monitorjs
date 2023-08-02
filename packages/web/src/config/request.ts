import { RequestMonitorConfig } from '@monitorjs/types';

export const REQUEST_MONITOR_PLUGIN_NAME = 'requestMonitorPlugin';

/**
 * default request config
 */
export const defaultRequestConfig = (): RequestMonitorConfig => ({
  traceFetch: true,
  traceXHR: true,
  include: [],
  exclude: [],
});
