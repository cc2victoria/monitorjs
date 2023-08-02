export declare const WHITE_SCREEN_CONFIG_NAME = 'whiteScreen';

export interface WhiteScreenMonitorConfig {
  /**
   * the threshold to identify blank white screen
   */
  threshold: number;

  /**
   * default body
   */
  rootSelector?: string;
}

export interface WhiteScreenMonitorPluginConfig {
  [WHITE_SCREEN_CONFIG_NAME]?: Partial<WhiteScreenMonitorConfig> | boolean;
}
