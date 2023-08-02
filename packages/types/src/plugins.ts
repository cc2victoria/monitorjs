import { BaseClientInterface } from './baseClient';
import { Client } from './client';
import { BrowserMonitorConfig } from './config';
import { ReportEvent, SendEvent } from './events';

export interface Plugins<C> {
  name: string;
  setupOnce: (c: C) => void; // 插件初始化方法
  destory?: () => void; // 插件销毁方法
}

export type BrowerClient = Client<ReportEvent, SendEvent, BrowserMonitorConfig>;
export type BrowserPlugin = Plugins<BrowerClient>;

export type BrowerClientInterface = BaseClientInterface<ReportEvent, SendEvent>;
export type BrowserPluginInterface = Plugins<BrowerClientInterface>;
