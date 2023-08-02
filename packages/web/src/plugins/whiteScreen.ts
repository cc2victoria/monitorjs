import { assign, isPlainObject, reportSelfError } from '@monitorjs/shared';
import { BrowerClient, BrowserPlugin, WhiteScreenMonitorConfig } from '@monitorjs/types';
import {
  defaultWhiteScreenConfig,
  DEFAULT_THRES_HOLD,
  MAX_THRES_HOLD,
  WHITE_SCREEN_MONITOR_PLUGIN_NAME,
} from '../config';

/**
 * 监控白屏
 */
export class WhiteScreenMonitorPlugin implements BrowserPlugin {
  public readonly name: string = WHITE_SCREEN_MONITOR_PLUGIN_NAME;
  options: WhiteScreenMonitorConfig;
  private timer!: any;
  constructor(options?: Partial<WhiteScreenMonitorConfig>) {
    const defaultConfig = defaultWhiteScreenConfig();

    if (options && options.threshold) {
      let threshold = Number(options.threshold);
      threshold = isNaN(threshold) || threshold < 0 ? DEFAULT_THRES_HOLD : threshold;

      options.threshold = Math.min(threshold, MAX_THRES_HOLD);
    }

    this.options = isPlainObject(options) ? assign(defaultConfig, options) : defaultConfig;
  }
  public setupOnce = (client: BrowerClient) => {
    try {
      console.log('[Monitor] Start tracing Blank White Screen!', this.options);

      const { rootSelector, threshold } = this.options;

      const checkWhiteScreen = () => {
        const element = rootSelector ? document.querySelector(rootSelector) : document.body;

        if (!/\w/.test(element!.innerHTML)) {
          client.report({
            ev_type: 'whiteScreen',
            payload: {
              name: rootSelector ? rootSelector : 'body',
              duration: threshold,
            },
          });
        }
      };

      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(checkWhiteScreen, threshold);
    } catch (error) {
      reportSelfError(error, 'WhiteScreenMonitorPlugin');
    }
  };
  public destory = (): void => {
    this.timer && clearTimeout(this.timer);

    console.log('[Monitor] Stop tracing Blank White Screen!');
  };
}
