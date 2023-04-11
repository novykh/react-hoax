const omit = (obj, attrs) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (!Array.isArray(attrs) || !attrs.length) return obj;

  if (attrs.length === 1) {
    const [key, ...rest] = Array.isArray(attrs[0])
      ? attrs[0]
      : attrs[0].split('.');

    if (!rest.length) {
      if (Array.isArray(obj)) {
        return [...obj.slice(0, key), ...obj.slice(key + 1)];
      } else {
        delete obj[key];
        return {...obj};
      }
    }

    return Array.isArray(obj)
      ? [...obj.slice(0, key), omit(obj[key], rest), ...obj.slice(key + 1)]
      : {
          ...obj,
          [key]: omit(obj[key], rest),
        };
  }

  attrs.reduce((h, attr) => omit(obj, [attr]));
};

export default omit;
