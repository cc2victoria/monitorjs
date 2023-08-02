import { ApiInitiatorTypes, AssetsInitiatorTypes, PerformanceMonitorConfig } from '@monitorjs/types';

export const PERFORMANCE_MONITOR_PLUGIN_NAME = 'performanceMonitorPlugin';

export const DEFAULT_API_INITIATOR_TYPE: ApiInitiatorTypes[] = ['beacon', 'fetch', 'xmlhttprequest'];

export const DEFAULT_ASSETS_INITIATOR_TYPE: AssetsInitiatorTypes[] = ['link', 'script', 'css', 'img'];

export const defaultPerformanceConfig = (): PerformanceMonitorConfig => ({
  metrics: ['FP', 'FCP', 'LCP', 'CLS', 'FID', 'INP', 'TBT'],
  reportApiSpeed: false,
  reportAssetSpeed: false,
});
