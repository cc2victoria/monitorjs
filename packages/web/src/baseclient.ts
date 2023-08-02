import {
  Client,
  BrowserMonitorConfig,
  ReportEvent,
  SendEvent,
  BatchSender,
  ClientOptions,
  BaseHooks,
} from '@monitorjs/types';
import { isPlainObject, assign, pick, Hooks } from '@monitorjs/shared';
import { Sender } from './sender';
import { getDefaultDNS, saveStoreInfo } from './config/';
import { transport } from './transport';

export class BaseClient implements Client<ReportEvent, SendEvent, BrowserMonitorConfig> {
  hooks: {
    init: BaseHooks;
    config: BaseHooks;
    beforeReport: BaseHooks;
    beforeBuild: BaseHooks;
    beforeSend: BaseHooks;
    destory: BaseHooks;
  };

  options!: ClientOptions;
  /**
   * 上报至服务端
   */
  private sender!: BatchSender<SendEvent>;
  /**
   * 是否初始化
   */
  hasInit: boolean;
  /**
   * 是否开启上报，开启上报了才会发送错误至服务端
   */
  hasConfiged: boolean;
  /**
   * 预发布队列
   */
  preQueue: ReportEvent[];
  constructor() {
    this.hooks = {
      init: new Hooks(),
      config: new Hooks('asyncWaterfall'),
      beforeReport: new Hooks('syncWaterfall'),
      beforeBuild: new Hooks('syncWaterfall'),
      beforeSend: new Hooks('syncWaterfall'),
      destory: new Hooks(),
    };

    this.hasInit = false;
    this.hasConfiged = false;
    this.preQueue = [];
  }

  /**
   * get ClientOptions or some key value of ClientOptions
   * @param key key of clientOptions
   * @returns
   */
  getOptions = <K extends keyof ClientOptions>(key?: K): ClientOptions | ClientOptions[K] => {
    const options = this.options;

    return key ? options[key] : options;
  };
  /**
   * 初始化: 建议用户尽早开始初始化，开启浏览器监听服务
   * @param options 用户配置 appid 等
   */
  init = (opt: BrowserMonitorConfig) => {
    this.setOptions(opt);
    this.hooks.init.call();

    this.sender = new Sender({
      transport: this.transport,
      endpoint: opt.dsn || getDefaultDNS(),
    });

    this.hasInit = true;
    this.start();
  };

  /**
   * load remote config
   */
  config = () => {
    this.hooks.config.call(this.options || {}, (err: Error | null, clientOptions: ClientOptions) => {
      if (err) {
        return console.log(`[Client-send]: ${err && err.message}`);
      }

      this.setOptions(clientOptions);

      this.hasConfiged = true;
      console.log('[Monitor] load config success!');
      this.start();
    });
  };

  /**
   * set current options
   */
  setOptions = (opt: Partial<ClientOptions> & Partial<BrowserMonitorConfig>) => {
    const keys = ['aid', 'pid', 'sid', 'userId', 'deviceId', 'sample_rate', 'release', 'env', 'sdk_offset', 'dsn'];

    if (!isPlainObject(opt)) {
      return;
    }

    const options = this.options || {};
    const mergedConfig = assign({}, options || {}, pick(opt, keys));

    if (opt.userId && opt.userId !== options.userId) {
      saveStoreInfo(mergedConfig);
    }

    this.options = mergedConfig;
  };

  /**
   * 配置加载完成， 开启上报至服务端
   */
  start = () => {
    if (this.hasInit && this.hasConfiged) {
      console.log('[Monitor] SDK is ready. Start report now!');
      this.preQueue.forEach((item) => this.build(item));
      this.preQueue = [];
    }
  };

  /**
   * send the data to url
   */
  transport = (options: any): void => {
    console.log(options.url, JSON.parse(options.data));
    // transport(options.url, options.data);
  };

  /**
   * 向服务端发送上报信息
   */
  report = (event: ReportEvent): void => {
    if (!event) {
      return;
    }

    this.hooks.beforeReport.call(event, (err: Error | null, reportEvent: ReportEvent) => {
      if (err) {
        return console.warn(`[Monitor-Error]: in Client.report ${err && err.message}`);
      }

      if (reportEvent) {
        this.build(reportEvent);
      }
    });
  };

  /**
   * 组装公共字段和收集到的错误字段
   * @param event
   */
  build = (event: ReportEvent) => {
    if (!event) {
      return;
    }

    // 未初始化完成 & 配置未加载完成
    if (!this.hasConfiged || !this.hasInit) {
      this.preQueue.push(event);
      return;
    }

    this.hooks.beforeBuild.call(event, (err: Error | null, sendEvent: SendEvent) => {
      if (err) {
        return console.warn(`[Monitor-Error]: Client-send ${err && err.message}`);
      }

      if (sendEvent) {
        this.send(sendEvent);
      }
    });
  };

  /**
   * 上报至服务端
   * @param event SendEvent
   */
  send = (event: SendEvent) => {
    // 允许用户修改最后发送的内容
    this.hooks.beforeSend.call(event, (err: Error | null, sendEvent: SendEvent) => {
      if (err) {
        return console.log(`[Monitor-Error]: in Client-send ${err && err.message}`);
      }

      if (sendEvent) {
        this.sender.send(sendEvent);
      }
    });
  };

  /**
   * remove all the listeners from window
   */
  destory = () => {
    this.sender.flush();

    this.hooks.destory.call();
  };
}
