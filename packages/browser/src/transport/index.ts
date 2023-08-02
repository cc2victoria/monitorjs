import { XHROptions, MonitorXMLHttpRequest } from '@monitorjs/types'
import { noop } from '@monitorjs/shared'

/**
 * send XMLHttpRequest
 * @param method GET | POST
 * @param options
 */
export const xhrTransport = function ({
  method = 'GET',
  url,
  data,
  withCredentials = false,
  success = noop,
  fail = noop,
}: XHROptions) {
  let xhr = new XMLHttpRequest() as MonitorXMLHttpRequest

  // 设置该请求不进行监控
  xhr._is_monitor_own_request = true
  xhr.withCredentials = withCredentials || false
  xhr.open(method, url, true)
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  xhr.onload = function () {
    try {
      if (this.responseText) {
        var result = JSON.parse(this.responseText)
        success(result)
      } else {
        success({})
      }
    } catch (e) {
      fail(e)
    }
  }
  xhr.onerror = function () {
    fail(new Error('Network request failed'))
  }
  xhr.onabort = function () {
    /* istanbul ignore next */
    fail(new Error('Network request aborted'))
  }
  xhr.send(data)
}
