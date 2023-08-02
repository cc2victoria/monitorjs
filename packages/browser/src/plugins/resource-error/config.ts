import { ResourceErrorMonitorConfig } from '@monitorjs/types'

export const RESOURCE_ERROR_MONITOR_PLUGIN_NAME = 'resourceErrorMonirotPlugin'

/**
 * default request config
 */
export const defaultResourceErrorConfig = (): ResourceErrorMonitorConfig => ({
  include: [],
  exclude: [],
  dedupe: true,
})
