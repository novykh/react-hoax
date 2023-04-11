const has = (obj, attr) => {
  if (!obj || typeof obj !== 'object') return false;
  if (!attr) return false;

  const [key, ...rest] = Array.isArray(attr) ? attr : attr.split('.');

  if (!rest.length) return key in obj;

  return has(obj[key], rest);
};

export default has;
