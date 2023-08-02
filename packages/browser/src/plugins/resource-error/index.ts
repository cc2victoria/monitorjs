import {
  assign,
  getLastetEntriesByName,
  getRegExpCheckFn,
  isPerformanceSupported,
  isPlainObject,
} from '@monitorjs/shared'
import {
  BrowerClientInterface,
  BrowserPluginInterface,
  ResourceErrorMonitorConfig,
  ResourceErrorPayload,
} from '@monitorjstypes'
import { defaultResourceErrorConfig, RESOURCE_ERROR_MONITOR_PLUGIN_NAME } from './config'
import { getDataFromEvent } from './format'

/**
 * 监听资源加载异常
 * Monitor resource error
 */
export class ResourceErrorMonitorPlugin implements BrowserPluginInterface {
  public readonly name: string = RESOURCE_ERROR_MONITOR_PLUGIN_NAME
  private restoreFn: () => void = () => {}
  private options: ResourceErrorMonitorConfig
  private lastErrorUrl!: string

  constructor(options?: Partial<ResourceErrorMonitorConfig>) {
    const defaultConfig = defaultResourceErrorConfig()
    this.options = options && isPlainObject(options) ? assign(defaultConfig, options) : defaultConfig
  }
  public setupOnce = (client: BrowerClientInterface): void => {
    try {
      console.log('[Monitor] start tracing resource error!', this.options)

      const { include, exclude, dedupe } = this.options
      const isPassReg = getRegExpCheckFn(include, exclude)

      const report = (data: ResourceErrorPayload): void => {
        const { url, type } = data || {}

        if (url && url === window.location.href) {
          return
        }

        if (!isPassReg(url)) {
          return
        }

        if (dedupe && this.lastErrorUrl === url) {
          return
        }

        this.setLastErrorUrl(url)

        const payload: ResourceErrorPayload = {
          url: url,
          type: type.toLocaleLowerCase(),
        }

        if (isPerformanceSupported()) {
          payload.timing = getLastetEntriesByName(url)
        }

        client.report({
          ev_type: 'resourceError',
          payload: payload,
        })
      }

      const errorHandle = (event: Event) => {
        const e: Event = event || window.event

        if (!e) {
          return
        }

        report(getDataFromEvent(e))
      }

      window.addEventListener('error', errorHandle, true)

      this.restoreFn = () => window.removeEventListener('error', errorHandle, true)
    } catch (error) {}
  }

  private setLastErrorUrl = (url: string) => {
    this.lastErrorUrl = url
  }

  public destory = (): void => {
    this.restoreFn()
    this.restoreFn = () => {}

    console.log('[Monitor] Stop tracing resource error!')
  }
}
