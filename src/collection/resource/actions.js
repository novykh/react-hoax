import * as actionTypes from "./actionTypes";

export const initializeResource = (id, values) => ({
  type: actionTypes.initializeResource,
  id,
  values
});

export const updateResource = (id, attr, value) => ({
  type: actionTypes.updateResource,
  id,
  attr,
  value
});

export const updateBatchResource = (id, values) => ({
  type: actionTypes.updateBatchResource,
  id,
  values
});

export const updateOnChangeResource = (id, { target }) =>
  updateResource(id, target.name, target.value);

export const removeResource = id => ({
  type: actionTypes.removeResource,
  id
});

export const resetResource = id => ({
  type: actionTypes.resetResource,
  id
});

export const resetPristineResource = id => ({
  type: actionTypes.resetPristineResource,
  id
});

export const resetPristineKeyResource = (id, attr) => ({
  type: actionTypes.resetPristineKeyResource,
  id,
  attr
});

export const startFetchResource = id => ({
  type: actionTypes.startFetchResource,
  id
});

export const doneFetchResource = (id, payload) => ({
  type: actionTypes.doneFetchResource,
  id,
  values: payload
});

export const failFetchResource = id => ({
  type: actionTypes.failFetchResource,
  id
});

export const startProcessResource = id => ({
  type: actionTypes.startProcessResource,
  id
});

export const doneProcessResource = id => ({
  type: actionTypes.doneProcessResource,
  id
});
