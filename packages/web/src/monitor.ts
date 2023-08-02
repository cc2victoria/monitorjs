import { getSdkOffset, arrayIncludes, assign, isFunction, isPlainObject } from '@monitorjs/shared';
import {
  BrowserMonitorConfig,
  BrowserPlugin,
  ClientOptions,
  LogLevel,
  ReportEvent,
  SendEvent,
} from '@monitorjs/types';
import { BaseClient } from './baseclient';
import { getDefaultMonitorConfig, saveStoreInfo } from './config';
import {
  ErrorMonitorPlugin,
  CommonMonitorPlugin,
  ResourceErrorMonitorPlugin,
  WhiteScreenMonitorPlugin,
  PerformanceMonitorPlugin,
  SamplePlugin,
} from './plugins';
import { RequestMonitorPlugin } from './plugins';
import { normalizeUnknownError } from './plugins/js-error/normalize';

export class BrowserMonitor {
  client: BaseClient;
  captureError!: (error: any, level?: LogLevel) => void;
  constructor() {
    this.client = new BaseClient();
    // 获取远程配置, SDK_Offset 等
    this._initConfig();
  }

  /**
   * 初始化并开始监听
   * @param config
   */
  public init(config: BrowserMonitorConfig) {
    if (config && !isPlainObject(config)) {
      throw new Error('[Monitor Error]: config must be an object');
    }

    if (!config.aid) {
      throw new Error('[Monitor Error]: aid can not be null');
    }

    // 处理参数
    const defaultConfig = getDefaultMonitorConfig(config.aid);
    const mergedConfig = assign(assign({}, defaultConfig), config);

    if (config && config.userId && config.userId !== defaultConfig.userId) {
      saveStoreInfo(mergedConfig);
    }

    this._initUserBefores(mergedConfig);
    this._initUserPlugins(mergedConfig);

    // 初始化 client
    this.client.init(mergedConfig);
  }

  /**
   * 更新用户配置
   */
  public updateConfig(opt: Partial<ClientOptions>) {
    if (!isPlainObject(opt)) {
      return;
    }

    this.client.setOptions(opt);
  }

  /**
   * 初始化插件
   * @param plugins 插件
   */
  private _initUserPlugins(config: Partial<BrowserMonitorConfig>) {
    const { jsError, request, plugins = [], resourceError, whiteScreen, performance } = config;
    const nameList: string[] = [];
    const client = this.client;
    const interPlugins: BrowserPlugin[] = [];

    // 处理所有内置插件
    const errorMonitorPlugin = new ErrorMonitorPlugin(isPlainObject(jsError) ? jsError : undefined);
    this.captureError = (error: any, level: LogLevel = 'info') =>
      errorMonitorPlugin.getReportFn(client.report)(assign({ level }, normalizeUnknownError(error)));
    jsError && interPlugins.push(errorMonitorPlugin);
    performance &&
      interPlugins.push(new PerformanceMonitorPlugin(isPlainObject(performance) ? performance : undefined));
    request && interPlugins.push(new RequestMonitorPlugin(isPlainObject(request) ? request : undefined));
    resourceError &&
      interPlugins.push(new ResourceErrorMonitorPlugin(isPlainObject(resourceError) ? resourceError : undefined));
    whiteScreen &&
      interPlugins.push(new WhiteScreenMonitorPlugin(isPlainObject(whiteScreen) ? whiteScreen : undefined));

    interPlugins.push(new SamplePlugin(), new CommonMonitorPlugin());

    const allPlugins = interPlugins.concat(plugins);

    // 初始化所有参数
    allPlugins.forEach((plugin) => {
      if (arrayIncludes(nameList, plugin.name)) {
        return;
      } else {
        nameList.push(plugin.name);

        // register init
        client.hooks.init.tap(plugin.name, () => {
          plugin.setupOnce(client);
        });

        // register destory
        if (plugin.destory) {
          client.hooks.destory.tap(plugin.name, plugin.destory);
        }
      }
    });
  }

  /**
   * 注册before方法
   */
  private _initUserBefores(config: Partial<BrowserMonitorConfig>) {
    const { beforeReport, beforeSend } = config;

    // 处理 beforeReport 参数
    if (beforeReport && isFunction(beforeReport)) {
      this.client.hooks.beforeReport.tap('beforeClientReport', (event: ReportEvent) => {
        return beforeReport(assign({}, event));
      });
    }

    // 处理 beforeSend 参数
    if (beforeSend && isFunction(beforeSend)) {
      this.client.hooks.beforeSend.tap('beforeClientReport', (event: SendEvent) => {
        return beforeSend(assign({}, event));
      });
    }
  }

  /**
   * 初始化配置
   * 获取远程配置（如果存在的话）
   */
  private _initConfig() {
    const client = this.client;

    getSdkOffset().then((sdkOffset) => {
      client.hooks.config.tap('InitMonitorConfig', (defaultOptions: ClientOptions) => {
        return assign({}, defaultOptions, { sdk_offset: sdkOffset });
      });

      client.config();
    });
  }

  public destory = () => {
    this.client.destory();
  };
}

export default BrowserMonitor;
