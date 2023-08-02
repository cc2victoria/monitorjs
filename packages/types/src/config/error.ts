export declare const JS_ERROR_CONFIG_NAME = 'jsError';
export interface JsErrorMonitorConfig {
  /**
   * 忽略上报的错误
   */
  ignoreErrors: (string | RegExp)[];
  /**
   * 是否添加全局 onError 监听器
   * Default true
   */
  onerror: Boolean;

  /**
   * 是否添加全局 onunhandlerejection 监听器
   * Default true
   */
  onunhandlerejection: boolean;

  /**
   * 是否去重
   * Default true
   */
  dedupe?: boolean;

  /**
   * 将 Native Object 和事件 API（setTimeout、setInterval、requestAnimationFrame、addEventListener/removeEventListener）
   * 包装在 try/catch 块中来处理异步异常
   * Default false
   */
  captureGlobalAsync?: boolean;
}

export interface JSErrorMonitorPluginConfig {
  [JS_ERROR_CONFIG_NAME]?: Partial<JsErrorMonitorConfig> | boolean;
}
