import { ClientConfig, ClientOptions } from './config';
import { BaseHooks } from './hooks';

type HOOKTYPE = {
  init: BaseHooks;
  config: BaseHooks;
  beforeReport: BaseHooks;
  beforeBuild: BaseHooks;
  beforeSend: BaseHooks;
  destory: BaseHooks;
};

export interface BaseClientInterface<ReportEvent, SendEvent> {
  hooks: HOOKTYPE;

  hasInit: boolean;

  config: () => void;

  /*
   * 获取配置信息
   */
  getOptions<K extends keyof ClientOptions>(key: K): ClientOptions[K];
  getOptions(): ClientOptions;

  /*
   * @description 更新配置
   */
  setOptions: (opt: Partial<ClientOptions>) => void;
  /**
   * init config and plugins
   */
  init: (o: ClientConfig<ReportEvent, SendEvent>) => void;

  /**
   * called when user finishes configuration and ready to send
   */
  start: () => void;
  /**
   * to report any valid event
   * @param {ReportEvent} e
   */
  report: (options: ReportEvent) => void;
  /**
   * build the reported event into server-specific format
   * @param {ReportEvent} e
   */
  build: (e: ReportEvent) => void;
  /**
   * report event in server-specific format
   * @param {SendEvent} e
   */
  send: (e: SendEvent) => void;
  /**
   * gracefully destory and remove all the listeners!
   * @returns
   */
  destory: () => void;
}
