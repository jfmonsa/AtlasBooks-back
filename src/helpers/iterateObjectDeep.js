export const iterateObjectDeep = (obj, callback) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => iterateObjectDeep(item, callback));
  }
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const { convertedKey, convertedValue } = callback(value, key);
    delete obj[key];
    obj[convertedKey] = iterateObjectDeep(convertedValue, callback);
  });

  return obj;
};
