import { BaseClientInterface } from './baseClient';
import { MonitorConfigType } from './config';

export interface MonitorInterface<R, S, T> {
  _client: BaseClientInterface<R, S>;

  init(options: MonitorConfigType<T>): BaseClientInterface<R, S>;

  start(options: MonitorConfigType<T>): BaseClientInterface<R, S>;
}
