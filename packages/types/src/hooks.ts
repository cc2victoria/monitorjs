export type HookCallback = (error: Error | null | any, result?: any) => void;
export type HookOptions = 'sync' | 'async' | 'syncWaterfall' | 'asyncWaterfall';
export type HookHandlers = {
  name: string;
  fn: Function;
};

export declare interface BaseHooks {
  tap: (name: string, fn: Function) => void;
  call: (options?: any, callback?: HookCallback) => void;
  destory: () => void;
}
