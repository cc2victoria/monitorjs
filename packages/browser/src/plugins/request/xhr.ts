import { getFormatLastetEntriesByName, isFunction, reportSelfError, uuid4 } from '@monitorjs/shared';
import { HttpPayload, HttpReq, HttpRes, ReportEvent, MonitorXMLHttpRequest } from '@monitorjstypes';
import { checkIsExceptionRes, getAllXHRHeaders, getHeaderUa, hook, isOwnRequest, isSuccessStatus } from './util';

/**
 * tracing xmlHttpRequest
 * @param cb report functions
 * @param checkIgnore
 * @returns
 */
export const startTracingXHR = (
  cb: (event: ReportEvent) => void,
  checkIgnore: (url: string) => boolean,
  rate: number
): (() => void)[] => {
  const restores: (() => void)[] = [];
  if (!('XMLHttpRequest' in window) || !isFunction(cb) || !isFunction(checkIgnore)) {
    return restores;
  }

  hook(XMLHttpRequest.prototype, 'open', function (originalOpen) {
    return function wrapped(this: MonitorXMLHttpRequest, ...args: any[]) {
      let xhr = this;
      const url = args[0];

      xhr._isIgnore = !checkIgnore(url);

      if (isOwnRequest(url)) {
        xhr._is_monitor_own_request = true;
      }

      const req: HttpReq = {
        method: args[0],
        url: args[1],
        timestamp: Date.now(),
      };

      function handleReadyStateChange(): any {
        // don't capture monitor sdk requests
        if (xhr._is_monitor_own_request) {
          return;
        }

        // check is include or exclude
        if (xhr._isIgnore) {
          return;
        }

        if (xhr.readyState === XMLHttpRequest.DONE) {
          try {
            const status = xhr.status;
            const response = xhr.response;

            const res: HttpRes = {
              status: status,
              timestamp: Date.now(),
              timing: getFormatLastetEntriesByName(xhr.responseURL || req.url),
              body: response || '',
              headers: getAllXHRHeaders(xhr.getAllResponseHeaders()),
            };

            // exception mode
            if (!isSuccessStatus(status) || checkIsExceptionRes(response)) {
              rate = 1;
            }

            const payload: HttpPayload = {
              api: 'xhr',
              request: req,
              response: res,
              duration: res.timestamp - req.timestamp,
              traceId: xhr._ua,
            };

            cb({
              ev_type: 'http',
              payload,
              rate,
            });
          } catch (e) {
            reportSelfError(e);
          }
        }
      }

      if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
        xhr.onreadystatechange = handleReadyStateChange;

        hook(xhr, 'onreadystatechange', function (original) {
          return function wrapped(...readyStateArgs: any[]) {
            handleReadyStateChange();

            return original.apply(xhr, readyStateArgs);
          };
        });
      } else {
        xhr.addEventListener('readystatechange', handleReadyStateChange);
      }

      originalOpen.apply(xhr, args);
    };
  });

  hook(XMLHttpRequest.prototype, 'send', function (originSend) {
    return function wrapped(this: MonitorXMLHttpRequest, ...args: any[]) {
      try {
        let ua = getHeaderUa(args[0]);

        if (!ua) {
          ua = uuid4();

          this.setRequestHeader('X-Request-Id', ua);
        }

        this._ua = ua;
      } catch (e) {
        reportSelfError(e);
      }

      originSend.apply(this, args);
    };
  });

  return restores;
};
