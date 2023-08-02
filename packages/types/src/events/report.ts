import { customReport } from './custom';
import { JsErrorReport } from './error';
import { HttpReport } from './http';
import { pageViewReport } from './pageview';
import { PerformanceTimingReport, PerofrmanceReport } from './performance';
import { ResourceReport, ResourceErrorReport } from './resource';
import { Common } from './common';
import { WhiteScreenReport } from './whiteScreen';

export declare type ReportEvent = {
  /** 采样率： 0-1 */
  rate?: number;
} & (
  | customReport
  | JsErrorReport
  | HttpReport
  | pageViewReport
  | PerformanceTimingReport
  | PerofrmanceReport
  | ResourceReport
  | ResourceErrorReport
  | WhiteScreenReport
);

export declare type SendEvent = {
  common: Partial<Common>;
} & ReportEvent;
