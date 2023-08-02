import { EventTypesEnum } from './enums';

export declare type pageViewReport = {
    ev_type: EventTypesEnum.pageView;
    payload: PageviewPayload;
};

export interface PageviewPayload {
    pid: string;
    /** 触发原因 init | path change | hash change | history state change | user-set */
    source: string;
}
