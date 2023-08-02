export interface UserConfig {
  /**
   * 应用ID： Application ID
   */
  aid: string;
  /**
   * 用户ID：需要用户自行获取并传入，
   * 如果没有传入的话会自动生成
   */
  userId?: string;
  /**
   * 代码部署版本：默认为1.0.0
   */
  release?: string;
  /**
   * 代码部署环境：默认为prod
   */
  env?: 'test' | 'dev' | 'pre' | 'prod' | 'local'; // 上报环境
  /**
   * 上报接口
   */
  dsn?: string;

  /**
   * 采样率，默认值为0.1, 取值范围 0 - 1
   * 所有异常数据上报 100%；正常数据按照采样率（Math.random() > sampleRate）上报，例如：成功请求接口，资源测速
   */
  sample_rate?: number;
}

export declare type WebConfig = UserConfig & {
  /**
   * 终端ID
   */
  deviceId?: string;
  /**
   * PageId：pid
   */
  pid?: string;
  /**
   * 用户行为ID
   */
  actionId?: string;
  /**
   * sessionId：默认从cookie中获取，如果没有则生成
   */
  sid?: string;
};
