import { JsErrorMonitorConfig } from '@monitorjs/types';

export const JS_ERROR_EV_TYPES = 'js_error';
export const JS_ERROR_MONITOR_PLUGIN_NAME = 'jsErrorMonitorPlugin';
/**
 * 默认JS配置
 */
export const defaultJSErrorConfig = (): JsErrorMonitorConfig => ({
  ignoreErrors: [],
  onerror: true,
  onunhandlerejection: true,
  dedupe: true,
  captureGlobalAsync: false,
});
