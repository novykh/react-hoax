import * as actionTypes from './actionTypes';

export const initializeResource = (id, values, {merge} = {}) => (
  dispatch,
  getState,
) => {
  if (merge) {
    const prevState = getState().byId[id] || {};

    return dispatch({
      type: actionTypes.initializeResource,
      id,
      values: {...prevState, ...values},
    });
  }
  return dispatch({type: actionTypes.initializeResource, id, values});
};

export const updateResource = (id, attr, value, options = {}) => ({
  type: actionTypes.updateResource,
  id,
  attr,
  value,
  ...options,
});

export const updateBatchResource = (id, values, options = {}) => ({
  type: actionTypes.updateBatchResource,
  id,
  values,
  ...options,
});

export const updateOnChangeResource = (id, {target}, options) =>
  updateResource(id, target.name, target.value, options);

export const removeResource = id => ({
  type: actionTypes.removeResource,
  id,
});

export const resetResource = id => ({
  type: actionTypes.resetResource,
  id,
});

export const resetPristineResource = id => ({
  type: actionTypes.resetPristineResource,
  id,
});

export const resetPristineKeyResource = (id, attr) => ({
  type: actionTypes.resetPristineKeyResource,
  id,
  attr,
});

export const startFetchResource = id => ({
  type: actionTypes.startFetchResource,
  id,
});

export const doneFetchResource = (id, payload) => ({
  type: actionTypes.doneFetchResource,
  id,
  values: payload,
});

export const failFetchResource = id => ({
  type: actionTypes.failFetchResource,
  id,
});

export const startProcessResource = id => ({
  type: actionTypes.startProcessResource,
  id,
});

export const doneProcessResource = id => ({
  type: actionTypes.doneProcessResource,
  id,
});
