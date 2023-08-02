export interface WrappedFunction extends Function {
  [key: string]: any;
  __monitor_original__?: WrappedFunction;
}
