import { noop } from '@monitorjs/shared';
import { XHROptions, MonitorXMLHttpRequest } from '@monitorjs/types';

/**
 * send XMLHttpRequest
 * @param method GET | POST
 * @param options
 */
export const xhrTransport = function (options: XHROptions) {
  const { method, url, data, withCredentials, success, fail } = options;
  let xhr = new XMLHttpRequest() as MonitorXMLHttpRequest;
  const successFn = success || noop;
  const failFn = fail || noop;

  // 设置该请求不进行监控
  xhr._is_monitor_own_request = true;
  xhr.withCredentials = withCredentials || false;
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    try {
      if (this.responseText) {
        var result = JSON.parse(this.responseText);
        successFn(result);
      } else {
        successFn({});
      }
    } catch (e) {
      failFn(e);
    }
  };
  xhr.onerror = function () {
    failFn(new Error('Network request failed'));
  };
  xhr.onabort = function () {
    /* istanbul ignore next */
    failFn(new Error('Network request aborted'));
  };
  xhr.send(data);
};
