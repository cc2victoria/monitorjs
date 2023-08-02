import { reportSelfError } from './error';
import { isURLSearchParamsSupported } from './support';

export const getUrlParams = (url: string, name: string) => {
  let val = null;
  if (!url || !name) {
    return val;
  }

  try {
    if (isURLSearchParamsSupported()) {
      const params = new URLSearchParams(url);
      val = params.get(name);

      return val;
    }

    const r = new RegExp(`(\\?|&)` + name + `=(.*?)(#|&|$)`, `i`);
    const m = url.match(r);
    val = m && m[2] ? decodeURIComponent(m[2]) : null;
  } catch (error) {
    reportSelfError(error);
  }

  return val;
};
