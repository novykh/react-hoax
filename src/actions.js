import * as actionTypes from './actionTypes';

export const initialize = (values, {merge} = {}) => (dispatch, getState) => {
  if (merge)
    return dispatch({
      type: actionTypes.initialize,
      values: {...getState(), ...values},
    });
  return dispatch({type: actionTypes.initialize, values});
};

export const update = (attr, value) => ({
  type: actionTypes.update,
  attr,
  value,
});

export const updateBatch = values => ({
  type: actionTypes.updateBatch,
  values,
});

export const updateOnChange = ({target}) => update(target.name, target.value);

export const reset = {type: actionTypes.reset};

export const resetPristine = {type: actionTypes.resetPristine};

export const resetPristineKey = attr => ({
  type: actionTypes.resetPristineKey,
  attr,
});

export const startFetch = {type: actionTypes.startFetch};

export const doneFetch = payload => ({
  type: actionTypes.doneFetch,
  values: payload,
});

export const failFetch = {type: actionTypes.failFetch};

export const startProcess = {type: actionTypes.startProcess};

export const doneProcess = {type: actionTypes.doneProcess};
