import { assign, isPlainObject, getRegExpCheckFn, reportSelfError } from '@monitorjs/shared'
import { BrowerClientInterface, BrowserPluginInterface, RequestMonitorConfig } from '@monitorjstypes'
import { defaultRequestConfig, REQUEST_MONITOR_PLUGIN_NAME } from './config'
import { startTracingFetch } from './fetch'
import { restoreHook } from './util'
import { startTracingXHR } from './xhr'

/**
 * Monitor All Request in App.
 */
export class RequestMonitorPlugin implements BrowserPluginInterface {
  public readonly name: string = REQUEST_MONITOR_PLUGIN_NAME
  private options: RequestMonitorConfig

  constructor(options?: Partial<RequestMonitorConfig>) {
    const defaultConfig = defaultRequestConfig()
    this.options = options && isPlainObject(options) ? assign(defaultConfig, options) : defaultConfig
  }
  public setupOnce = (client: BrowerClientInterface): void => {
    try {
      console.log('[Monitor] Start tracing request!', this.options)
      const { traceXHR, traceFetch, include, exclude } = this.options
      const rate = client.getOptions('sample_rate') || 0.1

      const isPassIgnoreCheck = getRegExpCheckFn(include, exclude)

      traceXHR && startTracingXHR(client.report, isPassIgnoreCheck, rate)
      traceFetch && startTracingFetch(client.report, isPassIgnoreCheck, rate)
    } catch (err) {
      reportSelfError(err, 'RequestMonitorPlugin')
    }
  }

  public destory = (): void => {
    const { traceXHR, traceFetch } = this.options

    traceFetch && restoreHook(window, 'fetch')
    if (traceXHR) {
      restoreHook(XMLHttpRequest.prototype, 'open')
      restoreHook(XMLHttpRequest.prototype, 'send')
    }

    console.log('[Monitor] Stop tracing request!', this.options)
  }
}
