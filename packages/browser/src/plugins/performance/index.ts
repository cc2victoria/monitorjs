import { assign, arrayIncludes, isPerformanceSupported, isPlainObject } from '@monitorjs/shared'
import {
  ApiInitiatorTypes,
  AssetsInitiatorTypes,
  BrowerClientInterface,
  BrowserPluginInterface,
  PerformanceMonitorConfig,
} from '@monitorjstypes'
import {
  defaultPerformanceConfig,
  PERFORMANCE_MONITOR_PLUGIN_NAME,
  DEFAULT_API_INITIATOR_TYPE,
  DEFAULT_ASSETS_INITIATOR_TYPE,
} from './config'
import Perfume from 'perfume.js'

/**
 * 性能监控插件
 */
export class PerformanceMonitorPlugin implements BrowserPluginInterface {
  public readonly name: string = PERFORMANCE_MONITOR_PLUGIN_NAME
  private options: PerformanceMonitorConfig
  private perfume!: Perfume

  constructor(options?: Partial<PerformanceMonitorConfig>) {
    const defaultConfig = defaultPerformanceConfig()
    this.options = isPlainObject(options) ? assign(defaultConfig, options) : defaultConfig
  }
  public setupOnce = (client: BrowerClientInterface): void => {
    try {
      console.log('[Monitor] Start tracing Performance!', this.options)
      const { metrics, reportApiSpeed, reportAssetSpeed } = this.options
      const isResourceTiming = !!reportApiSpeed || !!reportAssetSpeed
      let allowInitiatorTypes: (ApiInitiatorTypes | AssetsInitiatorTypes)[] = []

      reportApiSpeed &&
        (allowInitiatorTypes = allowInitiatorTypes.concat(
          Array.isArray(reportApiSpeed) ? reportApiSpeed : DEFAULT_API_INITIATOR_TYPE,
        ))
      reportAssetSpeed &&
        (allowInitiatorTypes = allowInitiatorTypes.concat(
          Array.isArray(reportAssetSpeed) ? reportAssetSpeed : DEFAULT_ASSETS_INITIATOR_TYPE,
        ))

      this.perfume = new Perfume({
        resourceTiming: isResourceTiming,
        elementTiming: false,
        maxMeasureTime: 30000,
        analyticsTracker: (options) => {
          const { data, metricName, rating } = options

          switch (metricName) {
            case 'navigationTiming':
              // @ts-ignore
              if (data && data.timeToFirstByte) {
                client.report({
                  ev_type: 'performanceTiming',
                  payload: {
                    // @ts-ignore
                    navigation_timing: data,
                  },
                })
              }
              break
            case 'resourceTiming':
              // @ts-ignore
              const initiatorType = data.initiatorType

              if (initiatorType && isResourceTiming && arrayIncludes(allowInitiatorTypes, initiatorType)) {
                client.report({
                  ev_type: 'resouce',
                  // @ts-ignore
                  payload: data,
                })
              }
              break
            default:
              if (arrayIncludes(metrics, metricName)) {
                // 监听性能指标
                client.report({
                  ev_type: 'performance',
                  payload: {
                    name: metricName,
                    type: 'perf',
                    // @ts-ignore
                    value: data,
                    vitalsScore: rating || '',
                  },
                })
              }
              break
          }
        },
      })
    } catch (error) {}
  }

  public destory = (): void => {
    this.options.metrics?.forEach((metricName) => this.perfume.clear(metricName))

    if (isPerformanceSupported()) {
      performance.clearResourceTimings()
    }

    console.log('[Monitor] Stop tracing Performance!')
  }
}
