import { EventTypesEnum } from './enums';

export declare type customReport = {
    ev_type: EventTypesEnum.custom;
    payload: CustomPayload;
};

export interface CustomPayload {
  /** 自定义名称, type 为 event时必填 */
  name?: string;
  /** 自定义数值 */
  metrics?: { [key: string]: number };
  /** 事件本身的维度，不要跟外部 context 合并 */
  categories?: { [key: string]: string };
  /** 自定义日志内容，可以是日志或者对象的 JSON 表示, type为log 时必填 */
  content?: string;
  /** 自定义日志的级别 debug | info | warn | error */
  level?: string;
  /** 自定义类型 event ｜ log */
  type: string;
}
