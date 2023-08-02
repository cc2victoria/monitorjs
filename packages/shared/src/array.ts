/**
 * is value in array
 * @param array
 * @param value
 * @returns is value in array
 */
export const arrayIncludes = (array: any[], value: any): boolean => {
  if (!Array.isArray(array)) {
    return false;
  }
  if (array.length === 0) {
    return false;
  }
  var k = 0;
  while (k < array.length) {
    if (array[k] === value) {
      return true;
    }
    k++;
  }
  return false;
};
