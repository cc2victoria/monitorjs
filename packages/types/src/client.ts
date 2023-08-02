import { BrowserMonitorConfig, ClientOptions } from './config';
import { BaseHooks } from './hooks';

type HOOKTYPE = {
  init: BaseHooks;
  config: BaseHooks;
  beforeReport: BaseHooks;
  beforeBuild: BaseHooks;
  beforeSend: BaseHooks;
  destory: BaseHooks;
};

export type getOptions = {
  <K extends keyof ClientOptions>(key: K): ClientOptions[K];
  (): ClientOptions;
};

export interface Client<ReportEvent, SendEvent, O extends BrowserMonitorConfig> {
  hooks: HOOKTYPE;

  getOptions<K extends keyof ClientOptions>(key: K): ClientOptions[K];
  getOptions(): ClientOptions;

  /**
   * init config and plugins
   */
  init: (o: O) => void;
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
