const get = (obj, attr, defaultValue) => {
  if (obj === null || typeof obj !== 'object') return defaultValue;
  if (!attr) return obj;

  const [key, ...rest] = Array.isArray(attr) ? attr : attr.split('.');

  obj = obj[key];

  if (!rest.length) return typeof obj === 'undefined' ? defaultValue : obj;

  return get(obj, rest, defaultValue);
};

export default get;
