import type { Attr, LikeState, LikeStateArray } from "./types";

type Update = (h: LikeState, attr: Attr, value: any) => LikeState;

const batchUpdateWithArray = (
  update: Update,
  state: LikeState,
  values: LikeStateArray
) =>
  values.reduce(
    (h, { attr, value }) => ({
      ...h,
      ...update(h, attr, value),
    }),
    state
  );

const batchUpdateWithObject = (
  update: Update,
  state: LikeState,
  values: LikeState
) =>
  Object.keys(values).reduce(
    (h, attr) => ({
      ...h,
      ...update(h, attr, values[attr]),
    }),
    state
  );

export const updateBatch = (
  update: Update,
  state: LikeState,
  values: LikeState | LikeStateArray
) => {
  if (Array.isArray(values)) return batchUpdateWithArray(update, state, values);
  return batchUpdateWithObject(update, state, values);
};
