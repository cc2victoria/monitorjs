import { WhiteScreenMonitorConfig } from '@monitorjs/types';

export const WHITE_SCREEN_MONITOR_PLUGIN_NAME = 'whitescreen';

export const DEFAULT_THRES_HOLD = 2000;
export const MAX_THRES_HOLD = 10000;

export const defaultWhiteScreenConfig = (): WhiteScreenMonitorConfig => ({
  threshold: 2000,
  rootSelector: '#app',
});
