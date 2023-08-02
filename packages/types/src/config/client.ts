import { BaseClientInterface } from '../baseClient';
import { BrowserPluginInterface, Plugins } from '../plugins';
import { SenderConfig } from '../sender';
import { WebConfig } from './user';
/**
 * 用户选项
 */
export type ClientOptions = Partial<WebConfig> & {
  sample_rate?: number;
  /**
   * 服务端偏移时间
   */
  sdk_offset?: number;
};

/**
 * new - 用户选项
 */
export type ClientConfig<R, S> = {
  options: ClientOptions;
  transport: SenderConfig['transport'];
  plugins: Plugins<BaseClientInterface<R, S>>[];
  beforeSend?: (e: S) => S | null;
  beforeReport?: (e: R) => R | null;
};
