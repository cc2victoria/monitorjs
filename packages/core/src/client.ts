import { BatchSender, ClientConfig, BaseHooks, BaseClientInterface, Plugins, ClientOptions } from '@monitorjs/types';
import { isPlainObject, assign, pick, Hooks, arrayIncludes, isFunction } from '@monitorjs/shared';
import { Sender } from './sender';
export class Client<ReportEvent, SendEvent> implements BaseClientInterface<ReportEvent, SendEvent> {
  public hooks: {
    init: BaseHooks;
    config: BaseHooks;
    beforeReport: BaseHooks;
    beforeBuild: BaseHooks;
    beforeSend: BaseHooks;
    destory: BaseHooks;
  };

  // 配置参数 user,device等
  private options!: ClientOptions;

  // 事件发送器
  private sender!: BatchSender<SendEvent>;

  // 是否初始化
  public hasInit: boolean = false;

  //  是否开启上报，开启上报了才会发送错误至服务端
  private hasConfiged: boolean = false;

  // 预上报队列
  private preQueue: ReportEvent[] = [];

  // 插件名称
  private pluginNameList: string[] = [];

  constructor() {
    this.hooks = {
      init: new Hooks(),
      config: new Hooks('asyncWaterfall'),
      beforeReport: new Hooks('syncWaterfall'),
      beforeBuild: new Hooks('syncWaterfall'),
      beforeSend: new Hooks('syncWaterfall'),
      destory: new Hooks(),
    };
  }

  /**
   * get ClientOptions or some key value of ClientOptions
   * @param key key of ClientOptions
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
  init({ options, transport, beforeReport, beforeSend, plugins }: ClientConfig<ReportEvent, SendEvent>) {
    this.setOptions(options);
    this.sender = new Sender({
      transport: transport,
      endpoint: options.dsn,
    });

    // register befores
    if (beforeReport && isFunction(beforeReport)) {
      this.hooks.beforeReport.tap('beforeClientReport', (event: ReportEvent) => beforeReport(event));
    }
    if (beforeSend && isFunction(beforeSend)) {
      this.hooks.beforeSend.tap('beforeClientReport', (event: SendEvent) => beforeSend(event));
    }

    // load plugins
    plugins.forEach((plugin) => this._loadPlugins(plugin));

    this.hasInit = true;
    this.start();
  }

  /**
   * @description 加载插件
   * @param {Plugins<BaseClientInterface<ReportEvent, SendEvent>>} plugin
   * @returns
   */
  private _loadPlugins(plugin: Plugins<BaseClientInterface<ReportEvent, SendEvent>>) {
    const nameList = this.pluginNameList;

    const pluginName = `~${plugin.name}~`;
    if (arrayIncludes(nameList, pluginName)) {
      console.warn('[Client warning]: 插件重复加载，只加载一次！');
      return;
    } else {
      if (!plugin.setupOnce) {
        console.error('[Monitor-Error]: load plugin error. You must set setupOnce method!');
        return;
      }

      nameList.push(pluginName);

      // register init
      plugin.setupOnce(this);

      // register destory
      if (plugin.destory) {
        this.hooks.destory.tap(pluginName, plugin.destory);
      }
    }
  }

  /**
   * load remote config，用于同步后台时间，或者后台配置
   * 如果不需要同步，则直接调用就行，且必须调用
   */
  config = () => {
    this.hooks.config.call(this.options || {}, (err: Error | null, clientConfig: ClientOptions) => {
      if (err) {
        return console.log(`[Client-send]: ${err && err.message}`);
      }

      this.setOptions(clientConfig);

      this.hasConfiged = true;
      console.log('[Monitor] load config success!');
      this.start();
    });
  };

  /**
   * set current options
   */
  setOptions = (opt: Partial<ClientOptions>) => {
    const keys = ['aid', 'pid', 'sid', 'userId', 'deviceId', 'sample_rate', 'release', 'env', 'sdk_offset', 'dsn'];

    if (!isPlainObject(opt)) {
      return;
    }

    const options = this.options || {};
    const mergedConfig = assign({}, options || {}, pick(opt, keys));

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
    if (this.hasInit && !this.hasConfiged) {
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
