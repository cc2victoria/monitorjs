import { BrowerClient, BrowserPlugin, JsError, JsErrorMonitorConfig, JsErrorReport } from '@monitorjs/types';
import { normalizeError, normalizeException } from './normalize';
import { dedupeFn } from './dedupe';
import { assign, getRegExp, isPlainObject, reportSelfError } from '@monitorjsshared';
import { defaultJSErrorConfig, JS_ERROR_MONITOR_PLUGIN_NAME } from '../../config';

export class ErrorMonitorPlugin implements BrowserPlugin {
  public readonly name: string = JS_ERROR_MONITOR_PLUGIN_NAME;
  private restoreFns: (() => void)[] = [];
  private options: JsErrorMonitorConfig;

  constructor(options?: Partial<JsErrorMonitorConfig>) {
    const defaultConfig = defaultJSErrorConfig();
    this.options = options && isPlainObject(options) ? assign(defaultConfig, options) : defaultConfig;
  }
  public setupOnce = (client: BrowerClient): void => {
    try {
      console.log('[Monitor] Start tracing js error!', this.options);

      const { onerror, onunhandlerejection } = this.options;
      const report = this.getReportFn(client.report);

      // 监听错误
      if (onerror) {
        const errorHandle = (ev: ErrorEvent) => report(normalizeError(ev));

        window.addEventListener('error', errorHandle);
        this.restoreFns.push(() => window.removeEventListener('error', errorHandle));
      }

      // 监听未处理异常
      if (onunhandlerejection) {
        const exceptionHaneld = (ev: PromiseRejectionEvent) => report(normalizeException(ev));

        window.addEventListener('unhandledrejection', exceptionHaneld);
        this.restoreFns.push(() => window.removeEventListener('unhandledrejection', exceptionHaneld));
      }
    } catch (error) {
      reportSelfError(error, 'ErrorMonitorPlugin');
    }
  };

  public getReportFn = (cb: (ReportEvent: JsErrorReport) => void) => {
    const { ignoreErrors, dedupe } = this.options;

    return (error: JsError) => {
      const dedupeJsError = dedupeFn();
      const err = dedupe ? dedupeJsError(error) : error;
      const ignoreRegExp = getRegExp(ignoreErrors);

      // 上报错误
      err &&
        cb &&
        !(ignoreRegExp && ignoreRegExp.test(err.message)) &&
        cb({
          ev_type: 'jsError',
          payload: {
            error: err,
          },
        });
    };
  };

  public destory = (): void => {
    this.restoreFns.forEach((fn) => fn());
    this.restoreFns = [];

    console.log('[Monitor] Stop tracing js error!');
  };
}
