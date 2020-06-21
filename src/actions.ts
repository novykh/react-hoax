import * as actionTypes from "./actionTypes";

import type {
  Attr,
  LikeState,
  LikeStateArray,
  GetState,
  Dispatch,
  InputEvent,
} from "./types";

export const initialize = (
  values: LikeState,
  { merge }: { merge?: boolean } = {}
) => (dispatch: Dispatch, getState: GetState) => {
  if (merge)
    return dispatch({
      type: actionTypes.initialize,
      values: { ...getState(), ...values },
    });
  return dispatch({ type: actionTypes.initialize, values });
};

export const update = (attr: Attr, value: any) => ({
  type: actionTypes.update,
  attr,
  value,
});

export const updateBatch = (values: LikeState | LikeStateArray) => ({
  type: actionTypes.updateBatch,
  values,
});

export const updateOnChange = ({ target }: InputEvent) =>
  update(target.name, target.value);

export const reset = { type: actionTypes.reset };

export const resetPristine = { type: actionTypes.resetPristine };

export const resetPristineKey = (attr: Attr) => ({
  type: actionTypes.resetPristineKey,
  attr,
});

export const startFetch = { type: actionTypes.startFetch };

export const doneFetch = (payload: LikeState | LikeStateArray) => ({
  type: actionTypes.doneFetch,
  values: payload,
});

export const failFetch = { type: actionTypes.failFetch };

export const startProcess = { type: actionTypes.startProcess };

export const doneProcess = { type: actionTypes.doneProcess };
