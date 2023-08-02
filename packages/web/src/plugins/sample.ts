import { checkIsNaN } from '@monitorjs/shared';
import { BrowerClient, BrowserPlugin, ReportEvent } from '@monitorjs/types';
import { SAMPLE_MONITOR_PLUGIN_NAME } from '../config';

/**
 * 根据采样率进行上报
 * 目前的实现情况：
 * 1. 异常请求、js错误，资源加载异常，白屏等都是100%上报
 * 2. 正常请求按照0.1的采样率进行上报
 */
export class SamplePlugin implements BrowserPlugin {
  public readonly name: string = SAMPLE_MONITOR_PLUGIN_NAME;

  public setupOnce = (client: BrowerClient): void => {
    console.log('[Monitor] Start Dealing Sample!');

    client.hooks.beforeReport.tap('samplePlugin', (ev: ReportEvent) => {
      if (ev && ev.rate && ev.rate < 1) {
        const rate = checkIsNaN(ev.rate) ? ev.rate : 1;

        if (Math.random() > rate) {
          return null;
        }
      }

      return ev;
    });
  };
}
