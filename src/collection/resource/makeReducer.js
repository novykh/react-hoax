import set from '../../helpers/set';
import get from '../../helpers/get';
import makePristine from '../../makePristine';
import {updateBatch} from '../../reducerUtils';
import * as actionTypes from './actionTypes';
import createReducer from '../../createReducer';

export default (getInitialState, customReducer, idKey) => {
  const {
    getInitialPristineState,
    updatePristine,
    removePristine,
    getPristineState,
  } = makePristine('pristine');

  const init = (id, state = {}) => ({
    [idKey]: id,
    ...getInitialState(),
    ...state,
    ...getInitialPristineState(),
  });

  const getValidValue = (attr, value) =>
    value === null ? get(getInitialState(), attr) : value;

  const update = (state, attr, value, {checkPristine = true} = {}) => {
    value = getValidValue(attr, value);
    if (checkPristine) state = updatePristine(state, attr, value);
    return set(state, attr, value);
  };

  const reducerHandlers = {
    [actionTypes.initializeResource]: (state, action) =>
      init(action.id, action.values),
    [actionTypes.updateResource]: (state, action) =>
      update(state, action.attr, action.value, action),
    [actionTypes.updateBatchResource]: (state, action) =>
      updateBatch(update, state, action.values, action),
    [actionTypes.resetResource]: (state, action) => {
      state = init(action.id, {...state, ...getPristineState(state)});
      return removePristine(state);
    },
    [actionTypes.resetPristineResource]: state => removePristine(state),
    [actionTypes.resetPristineKeyResource]: (state, action) =>
      removePristine(state, action.attr),
    [actionTypes.startProcessResource]: state => ({
      ...state,
      processing: true,
    }),
    [actionTypes.doneProcessResource]: state => ({
      ...state,
      processing: false,
    }),
    [actionTypes.startFetchResource]: state => ({
      ...state,
      loading: true,
    }),
    [actionTypes.doneFetchResource]: (state, action) =>
      init(action.id, {
        ...state,
        ...action.values,
        loading: false,
        loaded: true,
      }),
    [actionTypes.failFetchResource]: state => ({
      ...state,
      loading: false,
    }),
    ...customReducer,
  };

  const reducer = createReducer(reducerHandlers);

  return {reducer, init};
};
