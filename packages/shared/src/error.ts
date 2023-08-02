/**
 * TODO：完成上报方法
 * 上报SDK 自身发生的错误
 * @param err
 */
export const reportSelfError = (err: any, type = '') => {
  console.warn(`[SDK Error]: ${err}`, type);
};
