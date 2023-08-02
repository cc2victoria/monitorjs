/**
 * 公共上报字段：用户信息、环境信息
 */
 export interface Common {
   /** 应用标识: 创建项目时生成 */
   aid: string;
   /** 页面标识 */
   pid: string;
   /** 页面访问标识，用于区别同一个 pid 的多次访问 */
   view_id: string;
   /** uid用户标识，由接入方设定 */
   userId: string;
   /** 设备标识，保存在本地存储 */
   deviceId: string;
   /** 实例会话标识 */
   sid: string;
   /** 代码部署版本 */
   release: string;
   /** 代码部署环境 */
   env: string;
   /** 环境 */
   url: string;
   /** 网络类型：动态变化，需要监听 */
   network: string;
   /** 上报 SDK 版本 */
   sdk_version: string;
   /** 上报 SDK 名称, 以区分第三方 SDK */
   sdk_name: string;
   /** 客户端时间偏移量, 协助服务端进行时间校准 */
   //  sdk_offset: number; 直接计算到timestamp中了
   /** 当前事件命中的有效采样率, 所有错误都是100%的上报率，成功，例如成功请求会按照采样率进行上报 */
   sample_rate?: number;
   /** 客户端时间戳，发生时间 */
   timestamp: number;
 }


// TODO: 这些是自定义字段

//     /** 渠道ID */
//     channelID: number

//     /** 子渠道id */
//     subChannelID: number

//     /** 客户端版本 */
//     client_version: number

// 业务日志上报字段
// resourceKey 打桩key
// accessPoint 切入点（用作各行为的区分字段）
// memberId 会员ID


