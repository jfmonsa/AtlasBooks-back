/**
 * @file utility functions to convert objects from camelCase to snake_case and vice versa
 * for db operations
 */

export const camelToSnake = str =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const snakeToCamel = str =>
  str.replace(/_[a-z]/g, letter => letter[1].toUpperCase());

/**
 * Deeply converts the keys of an object using a specified conversion function.
 *
 * @param {Object} obj - The object to convert the keys of.
 * @param {Function} convertFn - The conversion function to apply to each key.
 * @returns {Object} - The object with converted keys.
 */
export const deepConvertKeys = (obj, convertFn) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepConvertKeys(item, convertFn));
  }

  Object.keys(obj).forEach(key => {
    const convertedKey = convertFn(key);
    const value = obj[key];
    delete obj[key];
    obj[convertedKey] = deepConvertKeys(value, convertFn);
  });

  return obj;
};

export const camelToSnakeObjectDeep = obj => deepConvertKeys(obj, camelToSnake);

export const snakeToCamelObjectDeep = obj => deepConvertKeys(obj, snakeToCamel);
