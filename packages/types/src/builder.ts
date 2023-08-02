import { Falsy } from './common';
import { ReportEvent } from './events';
import { Common } from './events/common';

declare type ReportToReportEvent<T extends ReportEvent> = T & {
  extral?: Partial<Common>;
  overrides?: Partial<Common>;
};
declare type BrowserReportEvent = ReportToReportEvent<ReportEvent>;
declare type BrowserSendEvent = ReportEvent & {
  common: Partial<Common>;
};

interface EventBuilder<ReportEvent, SendEvent> {
  build: (e: ReportEvent) => SendEvent | Falsy;
}

/**
 * 上报组装器：
 * - 环境信息
 *      - 浏览器环境上下文: 浏览器信息、页面地址、网络状态、当前时间
 *      - APP 环境上下文：APP 版本、网络状态、当前时间等
 * - 用户信息： uid
 * - 信息收集器收集到的信息
 */
export declare type BrowserBuilder = EventBuilder<BrowserReportEvent, BrowserSendEvent>;
