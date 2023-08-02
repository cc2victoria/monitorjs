/**
 * event type of report
 */
export declare enum EventTypesEnum {
  custom = 'custom',
  http = 'http',
  jsError = 'js_error',
  pageView = 'pageview',
  /** 性能指标 */
  performance = 'performance',
  /** 长任务加载时间 */
  performanceLongTask = 'performance_longtask',
  /** 首屏加载时间 */
  performanceTiming = 'performance_timing',
  /** 资源加载时间 */
  resource = 'resouce',
  /** 资源加载异常 */
  resourceError = 'resouce_error',
  /** 白屏 */
  blankScreen = 'blank_screen',
}