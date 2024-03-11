
/**
* Internal function to sort an object with keys resursively
* @param {any} obj - The hex string to convert.
* @returns {Uint8Array} - A byte array with the converted hex string.
*
* */
function sortKeysRecursively(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortKeysRecursively);
  }

  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, any> = {};

  sortedKeys.forEach(key => {
    sortedObj[key] = sortKeysRecursively(obj[key]);
  });

  return sortedObj;
}

/**
 * Stringify an object with its keys sorted alphabetically
 * @param {Buffer} obj - Object to stringify
 * @returns {string} - Stringified result
 */
export function stringifyObjectWithSort(obj: Record<string, any>): string {
  const sortedObj = sortKeysRecursively(obj);
  const jsonString = JSON.stringify(sortedObj);
  return jsonString;
}
