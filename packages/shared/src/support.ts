export const WP = window.performance;

/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 */
export function supportsFetch(): boolean {
  if (!('fetch' in window)) {
    return false;
  }

  try {
    new Headers();
    new Request('');
    new Response();
    return true;
  } catch (e) {
    return false;
  }
}

export const isPerformanceSupported = (): boolean => WP && !!WP.getEntriesByType && !!WP.now && !!WP.mark;

export const isURLSearchParamsSupported = (): boolean => 'URLSearchParams' in window;
