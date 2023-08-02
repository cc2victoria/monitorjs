import { assign, getLocationUrl, getNavigatorConnection, uuid4, getServerTimeStamp, pick } from '@monitorjs/shared'
import { BrowerClientInterface, BrowserPluginInterface, ReportEvent, SendEvent } from '@monitorjstypes'
import { SDK_NAME, SDK_VERSION, COMMON_MONITOR_PLUGIN_NAME } from './config'

/**
 * 获取公共字段
 * network_type：网络类型
 * url：当前页面URL
 * sdk_name：sdk名称
 * sdk_version：sdk版本
 * timestamp：上报时间
 * sid: sessionId
 */
export class CommonMonitorPlugin implements BrowserPluginInterface {
  public readonly name: string = COMMON_MONITOR_PLUGIN_NAME
  private sid!: string | undefined

  public setupOnce = (client: BrowerClientInterface): void => {
    const getConnectionType = (con: any): string => con && (connection.effectiveType || connection.type)
    const connection = getNavigatorConnection()
    let networkType = getConnectionType(connection)

    // 获取sid
    const getSid = () => {
      let sid = this.sid || client.getOptions('sid')
      if (sid) {
        return sid
      } else {
        if (!sid) {
          sid = uuid4()

          client.setOptions({ sid })
        }

        this.sid = sid
      }

      return sid
    }

    // 监听网络类型变化
    if (connection) {
      if ('onchange' in connection) {
        connection.onchange = (e: Event) => {
          networkType = getConnectionType(e.target)
        }
      }
    }

    // 在错误发生时记录的字段
    // TODO: pid的处理
    client.hooks.beforeReport.tap('commonPlugin', (ev: ReportEvent) => {
      const event: SendEvent = assign({ common: {} }, ev)
      if (ev) {
        assign(event.common, {
          network: networkType || 'unknow',
          url: getLocationUrl(),
          timestamp: Date.now(),
        })
      }
      return event
    })

    // 处理组装字段
    client.hooks.beforeBuild.tap('commonPlugin', (ev: SendEvent) => {
      if (!ev) {
        return null
      }

      const { ev_type, payload, common, rate } = ev
      const keys = ['aid', 'pid', 'userId', 'deviceId', 'sample_rate', 'sid', 'release', 'env']
      const sdk_offset = client.getOptions('sdk_offset') || 0
      const ct = getServerTimeStamp(common.timestamp, sdk_offset)
      const options = assign(pick(client.getOptions(), keys), {
        timestamp: ct,
        sample_rate: rate,
        sdk_name: SDK_NAME,
        sdk_version: SDK_VERSION,
        sid: getSid(),
      })

      // handle timestamp with time offset
      if (ev_type === 'http') {
        if (payload.request) {
          payload.request.timestamp += sdk_offset
        }

        if (payload.response) {
          payload.response.timestamp += sdk_offset
        }
      }

      return { ev_type, payload, common: assign({}, common, options) }
    })
  }

  public destory = (): void => {
    this.sid = undefined
  }
}
