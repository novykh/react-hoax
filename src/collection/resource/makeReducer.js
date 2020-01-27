import isNil from "lodash/isNil";
import makePristine from "../../makePristine";
import { updateBatch } from "../../reducerUtils";
import * as actionTypes from "./actionTypes";

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

  const reducer = (state, { type, id, ...payload }) => {
    if (customReducer === "function")
      customReducer(state, { type, ...payload });

    switch (type) {
      case actionTypes.initializeResource:
        return init(id, payload.values);

      case actionTypes.updateResource:
        return update(state, payload.attr, payload.value);

      case actionTypes.updateBatchResource:
        return updateBatch(update, state, payload.values);

      case actionTypes.resetResource:
        return init(id);

      case actionTypes.resetPristineResource:
        return removePristine(state);

      case actionTypes.resetPristineKeyResource:
        return removePristine(state, payload.attr);

      case actionTypes.startProcessResource:
        return { ...state, processing: true };

      case actionTypes.doneProcessResource:
        return { ...state, processing: false };

      case actionTypes.startFetchResource:
        return { ...state, loading: true };

      case actionTypes.doneFetchResource:
        return init(id, {
          ...payload.values,
          loading: false,
          loaded: true
        });

      case actionTypes.failFetchResource:
        return { ...state, loading: false };

      default:
        return state;
    }
  };

  return { reducer, init };
};
