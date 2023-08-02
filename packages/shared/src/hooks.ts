import { BaseHooks, HookCallback, HookHandlers, HookOptions } from '@monitorjs/types';
import { arrayIncludes } from './array';
import { isFunction, isString } from './is';

const SupportTypes = ['sync', 'async', 'syncWaterfall', 'asyncWaterfall'];

export class Hooks implements BaseHooks {
  private handlers: HookHandlers[];
  private type: HookOptions;

  constructor(type: HookOptions = 'sync') {
    this.handlers = [];
    this.type = arrayIncludes(SupportTypes, type) ? type : 'sync';
  }

  /**
   * 注册回调方法
   * @param name 名称
   * @param callback 回调方法
   * @returns
   */
  public tap = (name: string, fn: Function) => {
    if (!name || !isString(name) || !fn || !isFunction(fn)) {
      return console.warn(`[Hooks] register tap error!`);
    }

    this.handlers.push({
      name: name.trim(),
      fn: fn,
    });
  };

  /**
   * 触发所有回调方法
   */
  public call = (options?: any, callback?: HookCallback) => {
    if (callback && !isFunction(callback)) {
      return;
    }
    const args = options ? (Array.isArray(options) ? options : [options]) : [];

    switch (this.type) {
      case 'syncWaterfall':
        runWaterfallHandlers(this.handlers)(args, callback);
        break;

      case 'asyncWaterfall':
        runWaterfallHandlers(this.handlers, true)(args, callback);
        break;

      case 'async':
        runHandlers(this.handlers, false)(args, callback);
        break;

      default:
        runHandlers(this.handlers)(args, callback);
        break;
    }
  };

  /**
   * 销毁
   */
  public destory = () => {
    this.handlers.length = 0;
  };
}

/**
 * 执行回调函数
 * @param fns
 * @param isAsync
 * @returns
 */
const runHandlers = (handlers: HookHandlers[], isAsync: boolean = false) => {
  return async (args: any[], callback?: HookCallback) => {
    for (let i = 0, len = handlers.length; i < len; i++) {
      let { name, fn } = handlers[i];
      try {
        isAsync ? await fn.apply(null, args) : fn.apply(null, args);
      } catch (error) {
        callback && callback(error);
        console.warn(`[Hooks] run callback ${name} Error!`);
      }

      callback && callback(null);
    }
  };
};

/**
 * 执行回调函数
 * @param fns callback array
 * @param isAsync
 * @returns
 */
const runWaterfallHandlers = (handlers: HookHandlers[], isAsync: boolean = false) => {
  return async (args: any[], callback?: HookCallback) => {
    let params = args.slice(0);

    for (let i = 0, len = handlers.length; i < len; i++) {
      let { name, fn } = handlers[i];

      if (params) {
        try {
          params = isAsync ? await fn.apply(null, params) : fn.apply(null, params);
        } catch (error) {
          callback && callback(error);
          console.warn(`[Hooks] run waterfall callback ${name} Error!`);
        }

        if (!Array.isArray(params)) {
          params = [params];
        }
      } else {
        break;
      }
    }

    callback && callback(null, ...params);
  };
};
