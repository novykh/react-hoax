const set = (obj, attr, value, customizer) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (!attr) return obj;

  const [key, ...rest] = Array.isArray(attr) ? attr : attr.split('.');

  if (!rest.length) {
    obj[key] = customizer ? customizer(obj[key], value, obj) : value;
    Array.isArray(obj) ? [...obj] : {...obj};
    return;
  }

  return Array.isArray(obj)
    ? [
        ...obj.slice(0, key),
        set(obj[key], rest, value, customizer),
        ...obj.slice(key + 1),
      ]
    : {
        ...obj,
        [key]: set(obj[key], rest, value, customizer),
      };
};

export default set;
