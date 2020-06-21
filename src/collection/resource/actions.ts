import * as actionTypes from "./actionTypes";

import { IfcAction } from "../../interfaces";
import type {
  Attr,
  LikeState,
  LikeStateArray,
  GetState,
  Dispatch,
  InputEvent,
} from "../../types";

export const initializeResource = (
  id: Attr,
  values: LikeState,
  { merge }: { merge?: boolean } = {}
) => (dispatch: Dispatch, getState: GetState) => {
  if (merge) {
    const prevState = getState().byId[id] || {};

    return dispatch({
      type: actionTypes.initializeResource,
      id,
      values: { ...prevState, ...values },
    });
  }
  return dispatch({ type: actionTypes.initializeResource, id, values });
};

export const updateResource = (id: Attr, attr: Attr, value: any) => ({
  type: actionTypes.updateResource,
  id,
  attr,
  value,
});

export const updateBatchResource = (
  id: Attr,
  values: LikeState | LikeStateArray
) => ({
  type: actionTypes.updateBatchResource,
  id,
  values,
});

export const updateOnChangeResource = (id: Attr, { target }: InputEvent) =>
  updateResource(id, target.name, target.value);

export const removeResource = (id: Attr) => ({
  type: actionTypes.removeResource,
  id,
});

export const resetResource = (id: Attr) => ({
  type: actionTypes.resetResource,
  id,
});

export const resetPristineResource = (id: Attr) => ({
  type: actionTypes.resetPristineResource,
  id,
});

export const resetPristineKeyResource = (id: Attr, attr: Attr) => ({
  type: actionTypes.resetPristineKeyResource,
  id,
  attr,
});

export const startFetchResource = (id: Attr) => ({
  type: actionTypes.startFetchResource,
  id,
});

export const doneFetchResource = (
  id: Attr,
  payload: LikeState | LikeStateArray
) => ({
  type: actionTypes.doneFetchResource,
  id,
  values: payload,
});

export const failFetchResource = (id: Attr) => ({
  type: actionTypes.failFetchResource,
  id,
});

export const startProcessResource = (id: Attr) => ({
  type: actionTypes.startProcessResource,
  id,
});

export const doneProcessResource = (id: Attr) => ({
  type: actionTypes.doneProcessResource,
  id,
});
