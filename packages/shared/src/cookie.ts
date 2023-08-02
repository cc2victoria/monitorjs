export const filterXSS = function (e: string) {
  if (!e) return e;

  for (; e != decodeURIComponent(e); ) {
    e = decodeURIComponent(e);
  }
  const r = [`<`, `>`, `'`, `"`, `%3c`, `%3e`, `%27`, `%22`, `%253c`, `%253e`, `%2527`, `%2522`],
    n = [
      `&#x3c;`,
      `&#x3e;`,
      `&#x27;`,
      `&#x22;`,
      `%26%23x3c%3B`,
      `%26%23x3e%3B`,
      `%26%23x27%3B`,
      `%26%23x22%3B`,
      `%2526%2523x3c%253B`,
      `%2526%2523x3e%253B`,
      `%2526%2523x27%253B`,
      `%2526%2523x22%253B`,
    ];
  for (let i = 0; i < r.length; i++) {
    e = e.replace(new RegExp(r[i], `gi`), n[i]);
  }
  return e;
};

export const getCookieByName = (name: string) => {
  const cookieV = document.cookie.match(RegExp(`(^|;\\s*)` + name + `=([^;]*)(;|$)`));

  return filterXSS(cookieV ? decodeURIComponent(cookieV[2]) : ``);
};
