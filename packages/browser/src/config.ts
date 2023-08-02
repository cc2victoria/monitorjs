import { BrowserMonitorConfig } from '@monitorjs/types'
import { getDefaultDNS, getStoreInfo } from './store'

export const getDefaultMonitorConfig = (aid?: string): BrowserMonitorConfig => {
  const { userId, deviceId, sample_rate } = getStoreInfo(aid) || {}

  return {
    aid: aid || '',
    pid: '',
    userId,
    deviceId,
    // 当前事件命中的有效采样率。错误相关类都是100%的上报率，成功，会按照这个采样率。
    sample_rate,
    sid: '', // sid 请求sid从header或者cookie或者storage等获取，如果没有则生成sid uuid4()
    dsn: getDefaultDNS(),
    release: '1.0.0',
    env: 'prod',
    jsError: true,
    request: false,
    resourceError: true,
    whiteScreen: true,
    performance: false,
  }
}
