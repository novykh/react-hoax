const batchUpdateWithArray = (update, state, values, options) =>
  values.reduce(
    (h, {attr, value}) => ({
      ...h,
      ...update(h, attr, value, options),
    }),
    state,
  );

const batchUpdateWithObject = (update, state, values, options) =>
  Object.keys(values).reduce(
    (h, attr) => ({
      ...h,
      ...update(h, attr, values[attr], options),
    }),
    state,
  );

export const updateBatch = (update, state, values, options) => {
  if (Array.isArray(values)) return batchUpdateWithArray(update, state, values);
  return batchUpdateWithObject(update, state, values, options);
};
