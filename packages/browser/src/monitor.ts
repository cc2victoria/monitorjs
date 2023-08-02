import {
  BaseClientInterface,
  BrowserMonitorConfig,
  BrowserPluginInterface,
  ClientOptions,
  InterPluginsConfig,
  LogLevel,
  MonitorInterface,
  ReportEvent,
  SendEvent,
} from '@monitorjs/types'
import { Client } from '@monitorjs/core'
import { assign, getSdkOffset, isPlainObject, pick, normalizeUnknownError } from '@monitorjs/shared'
import { WindowErrorMonitorPlugin } from './plugins/window-error'
import { ResourceErrorMonitorPlugin } from './plugins/resource-error'
import { PerformanceMonitorPlugin } from './plugins/performance'
import { WhiteScreenMonitorPlugin } from './plugins/white-screen'
import { RequestMonitorPlugin } from './plugins/request'
import { SampleRateMonitorPlugin } from './plugins/sample-rate'
import { CommonMonitorPlugin } from './plugins/common'
import { xhrTransport } from './transport'
import { getDefaultMonitorConfig } from './config'
import { saveStoreInfo } from './store'

export class BrowserMonitor implements MonitorInterface<ReportEvent, SendEvent, InterPluginsConfig> {
  _client: BaseClientInterface<ReportEvent, SendEvent>

  public captureError!: (error: any, level?: LogLevel) => void

  constructor() {
    this._client = new Client<ReportEvent, SendEvent>()
    this._initConfig()
  }
  /**
   * 初始化参数和插件并开始监听
   * @param config
   */
  init(config: BrowserMonitorConfig) {
    if (config && !isPlainObject(config)) {
      throw new Error('[Monitor Error]: config must be an object')
    }

    if (!config.aid) {
      throw new Error('[Monitor Error]: aid can not be null')
    }

    const keys = ['aid', 'pid', 'sid', 'userId', 'deviceId', 'sample_rate', 'release', 'env', 'sdk_offset', 'dsn']

    // 处理参数
    const defaultConfig = getDefaultMonitorConfig(config.aid)
    const mergedConfig = assign(assign({}, defaultConfig), config)

    const {
      jsError,
      request,
      plugins = [],
      resourceError,
      whiteScreen,
      performance,
      beforeReport,
      beforeSend,
    } = mergedConfig

    const others = pick(mergedConfig, keys)
    const interPlugins: BrowserPluginInterface[] = []

    if (config && config.userId && config.userId !== defaultConfig.userId) {
      saveStoreInfo(mergedConfig)
    }

    const errorMonitorPlugin = new WindowErrorMonitorPlugin(isPlainObject(jsError) ? jsError : undefined)

    this.captureError = (error: any, level: LogLevel = 'info') =>
      errorMonitorPlugin.getReportFn(this._client.report)(assign({ level }, normalizeUnknownError(error)))

    jsError && interPlugins.push(errorMonitorPlugin)
    performance && interPlugins.push(new PerformanceMonitorPlugin(isPlainObject(performance) ? performance : undefined))

    request && interPlugins.push(new RequestMonitorPlugin(isPlainObject(request) ? request : undefined))

    resourceError &&
      interPlugins.push(new ResourceErrorMonitorPlugin(isPlainObject(resourceError) ? resourceError : undefined))

    whiteScreen && interPlugins.push(new WhiteScreenMonitorPlugin(isPlainObject(whiteScreen) ? whiteScreen : undefined))

    interPlugins.push(new SampleRateMonitorPlugin(), new CommonMonitorPlugin())

    this._client.init({
      options: others,
      plugins: interPlugins.concat(plugins),
      transport: xhrTransport,
      beforeReport,
      beforeSend,
    })

    return this._client
  }

  public start(config: BrowserMonitorConfig) {
    if (this._client.hasInit) {
      return this._client
    }

    this._client = this.init(config)

    return this._client
  }

  /**
   * 更新用户配置
   */
  public updateConfig(opt: Partial<ClientOptions>) {
    if (!isPlainObject(opt)) {
      return
    }

    this._client.setOptions(opt)
  }

  /**
   * 初始化配置
   * 获取远程配置（如果存在的话）
   */
  private _initConfig() {
    const client = this._client

    getSdkOffset().then((sdkOffset) => {
      client.hooks.config.tap('InitMonitorConfig', (defaultOptions: ClientOptions) => {
        return assign({}, defaultOptions, { sdk_offset: sdkOffset })
      })

      client.config()
    })
  }

  public destory() {
    this._client.destory()
  }
}

export const Monitor = new BrowserMonitor()
