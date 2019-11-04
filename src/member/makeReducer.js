import isNil from "lodash/isNil";
import makePristine from "../makePristine";
import { updateBatch } from "../reducerUtils";
import * as actionTypes from "../actionTypes";

export default (getInitialState, customReducer) => {
  const {
    getInitialPristineState,
    updatePristine,
    removePristine
  } = makePristine("pristine");

  const init = (state = {}) => ({
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

  const reducer = (state, { type, ...payload }) => {
    if (customReducer === "function")
      customReducer(state, { type, ...payload });

    switch (type) {
      case actionTypes.initialize:
        return init(payload.values);

      case actionTypes.update:
        return update(state, payload.attr, payload.value);

      case actionTypes.updateBatch:
        return updateBatch(update, state, payload.values);

      case actionTypes.reset:
        return init();

      case actionTypes.resetPristine:
        return removePristine(state);

      case actionTypes.resetPristineKey:
        return removePristine(state, payload.attr);

      case actionTypes.startProcess:
        return { ...state, processing: true };

      case actionTypes.doneProcess:
        return { ...state, processing: false };

      default:
        return state;
    }
  };

  return { reducer, init };
};
