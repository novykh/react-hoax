import isNil from "lodash/isNil";
import makePristine from "../../makePristine";
import { updateBatch } from "../../reducerUtils";
import * as actionTypes from "./actionTypes";
import createReducer from "../../createReducer";

export default (getInitialState, customReducer) => {
  const {
    getInitialPristineState,
    updatePristine,
    removePristine
  } = makePristine("pristine");

  const init = (id, state = {}) => ({
    id,
    ...getInitialState(),
    ...state,
    ...getInitialPristineState()
  });

  const getValidValue = (attr, value) =>
    isNil(value) ? getInitialState()[attr] : value;

  const update = (state, attr, value) => {
    value = getValidValue(attr, value);
    state = updatePristine(state, attr, value);
    return {
      ...state,
      [attr]: value
    };
  };

  const reducerHandlers = {
    [actionTypes.initializeResource]: (state, action) =>
      init(id, action.values),
    [actionTypes.updateResource]: (state, action) =>
      update(state, action.attr, action.value),
    [actionTypes.updateBatchResource]: (state, action) =>
      updateBatch(update, state, action.values),
    [actionTypes.resetResource]: (state, action) => init(action.id),
    [actionTypes.resetPristineResource]: (state, action) =>
      removePristine(state),
    [actionTypes.resetPristineKeyResource]: (state, action) =>
      removePristine(state, action.attr),
    [actionTypes.startProcessResource]: (state, action) => ({
      ...state,
      processing: true
    }),
    [actionTypes.doneProcessResource]: (state, action) => ({
      ...state,
      processing: false
    }),
    [actionTypes.startFetchResource]: (state, action) => ({
      ...state,
      loading: true
    }),
    [actionTypes.doneFetchResource]: (state, action) =>
      init(id, {
        ...action.values,
        loading: false,
        loaded: true
      }),
    [actionTypes.failFetchResource]: (state, action) => ({
      ...state,
      loading: false
    }),
    ...customReducer
  };

  const reducer = createReducer(initialState, reducerHandlers);

  return { reducer, init };
};
