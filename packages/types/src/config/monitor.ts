import { JSErrorMonitorPluginConfig } from './error';
import { RequestMonitorPluginConfig } from './request';
import { BrowserPlugin, BrowserPluginInterface } from '../plugins';
import { WebConfig } from './user';
import { ReportEvent, SendEvent } from '../events';
import { ResourceErrorMonitorPluginConfig } from './resourceError';
import { WhiteScreenMonitorPluginConfig } from './whiteScreen';
import { PerformanceMonitorPluginConfig } from './performance';

export declare type MonitorConfigType<T> = WebConfig & {
  /**
   * 自定义插件
   */
  plugins?: BrowserPluginInterface[];
  /**
   * 发送至服务器之前对数据进行格式化
   * @param { SendEvent } e
   * @returns SendEvent | false
   */
  beforeSend?: (e: SendEvent) => SendEvent | null;
  /**
   * 进行上报之前修改插件数据
   * @param {ReportEvent} e
   * @returns
   */
  beforeReport?: (e: ReportEvent) => ReportEvent | null;
} & T;

/**
 * 内部插件配置
 */
export declare type InterPluginsConfig = JSErrorMonitorPluginConfig &
  RequestMonitorPluginConfig &
  ResourceErrorMonitorPluginConfig &
  WhiteScreenMonitorPluginConfig &
  PerformanceMonitorPluginConfig;

export declare type BrowserMonitorConfig = MonitorConfigType<InterPluginsConfig>;
