import {
  getFormatLastetEntriesByName,
  isFunction,
  isInstanceOf,
  isPlainObject,
  reportSelfError,
  supportsFetch,
  uuid4,
} from '@monitorjs/shared';
import { HttpPayload, HttpReport, HttpReq, HttpRes } from '@monitorjstypes';
import {
  getAllFetchHeaders,
  getFetchBody,
  getFetchUrl,
  getHeaderUa,
  hook,
  isExceptionRes,
  isOwnRequest,
  isSuccessStatus,
} from './util';

/**
 * tracing xml http request
 * @param cb report functions
 * @param checkIgnore
 * @returns
 */
export const startTracingFetch = (
  cb: (ReportEvent: HttpReport) => void,
  checkIgnore: (url: string) => boolean,
  rate: number
): void => {
  if (!supportsFetch() || !isFunction(cb) || !isFunction(checkIgnore)) {
    return;
  }

  hook(window, 'fetch', function (originalFetch) {
    return function wrapped(...args: any[]) {
      const url = getFetchUrl(args);

      // 内部请求和可忽略请求不进行上报
      if (!checkIgnore(url) || isOwnRequest(url)) {
        return originalFetch.apply(window, args);
      }

      const request = 'Request' in window && isInstanceOf(args[0], Request) ? args[0] : args[1];
      const method = request.method || 'GET';
      let headers = request.headers;
      const isSupportBody = !(method === 'GET' || method === 'HEAD');
      let _ua!: string;

      try {
        _ua = getHeaderUa(isSupportBody ? getFetchBody(args) : new URL(url).searchParams);
      } catch (error) {}

      // if there isn't ua, the set requestId in ua
      if (!_ua) {
        _ua = uuid4();

        try {
          if (headers) {
            if (isInstanceOf(headers, Headers)) {
              (headers as Headers).set('X-Request-Id', _ua);
            } else if (isPlainObject(headers)) {
              headers['X-Request-Id'] = _ua;
            } else if (Array.isArray(headers)) {
              headers.push(['X-Request-Id', _ua]);
            }
          } else {
            headers = {
              'X-Request-Id': _ua,
            };
          }

          request.headers = headers;
        } catch (error) {}
      }

      const req: HttpReq = {
        method: method,
        url: url,
        timestamp: Date.now(),
      };

      return originalFetch.apply(window, args).then(
        async (response: Response) => {
          const { status, url: responseUrl, headers } = response;
          let resBody = {},
            rate = 0.1;

          try {
            resBody = await response.json();
          } catch (e) {
            reportSelfError(e, 'originalFetch');
          }

          const res: HttpRes = {
            status: status,
            timestamp: Date.now(),
            headers: getAllFetchHeaders(headers),
            body: resBody,
          };

          // 异常情况上报header
          if (!isSuccessStatus(status) || isExceptionRes(resBody)) {
            rate = 1;
          }

          const payload: HttpPayload = {
            api: 'fetch',
            request: req,
            response: res,
            duration: res.timestamp - req.timestamp,
            traceId: _ua,
          };

          setTimeout(() => {
            res.timing = getFormatLastetEntriesByName(responseUrl || url);
            cb({
              ev_type: 'http',
              payload,
            });
          }, 100);

          return response;
        },
        (error: Error) => {
          const res: HttpRes = {
            status: 0,
            timestamp: Date.now(),
            body: error && error.message ? `${error.name + ':' + error.message}` : 'Fetch Error',
          };

          setTimeout(() => {
            res.timing = getFormatLastetEntriesByName(url);

            cb({
              ev_type: 'http',
              payload: {
                api: 'fetch',
                request: req,
                response: res,
                duration: res.timestamp - req.timestamp,
              },
            });
          }, 100);

          throw error;
        }
      );
    };
  });
};
