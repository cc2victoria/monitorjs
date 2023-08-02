export declare type WhiteScreenReport = {
  ev_type: 'whiteScreen';
  payload: WhiteScreenPayload;
};

export interface WhiteScreenPayload {
  name?: string;
  duration?: number;
}
