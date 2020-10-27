const batchUpdateWithArray = (update, state, values) =>
  values.reduce(
    (h, {attr, value}) => ({
      ...h,
      ...update(h, attr, value),
    }),
    state,
  );

const batchUpdateWithObject = (update, state, values) =>
  Object.keys(values).reduce(
    (h, attr) => ({
      ...h,
      ...update(h, attr, values[attr]),
    }),
    state,
  );

export const updateBatch = (update, state, values) => {
  if (Array.isArray(values)) return batchUpdateWithArray(update, state, values);
  return batchUpdateWithObject(update, state, values);
};
