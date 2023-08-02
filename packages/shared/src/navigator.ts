export const getNavigator = (): Navigator | undefined => {
  if ('navigator' in window && window.navigator) {
    return window.navigator;
  }
};

export const getNavigatorConnection = () => {
  const navigator = getNavigator();

  if (navigator) {
    // @ts-ignore
    return navigator.connection || navigator.mozConnection || navigator.webkitConnetcion;
  }
};

export const getLocation = () => {
  if ('location' in window) {
    return window.location;
  }
};

export const getLocationUrl = () => {
  const location = getLocation();

  if (location) {
    return location.href;
  }
};
