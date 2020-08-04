import isNil from "lodash/isNil";
import makePristine from "../makePristine";
import { updateBatch } from "../reducerUtils";
import * as actionTypes from "../actionTypes";
import createReducer from "../createReducer";

/**
 * @typedef {Object} memberHoax.ReducerWithInit
 * @property {function} reducer - the reducer to be used along with provider
 * @property {function} init - the function to initialize the reducer's state
 */

/**
 *  @function memberHoax.makeReducer
 *  @access private
 *  @param {function} getInitialState - a function that returns the initialState
 *  @param {function} customReducer - a custom reducer
 *  @return {memberHoax.ReducerWithInit}
 */

export default (getInitialState, customReducer) => {
  const {
    getInitialPristineState,
    updatePristine,
    removePristine,
    getPristineState
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

  const reducerHandlers = {
    [actionTypes.initialize]: (state, action) => init(action.values),
    [actionTypes.update]: (state, action) => update(state, action.attr, action.value),
    [actionTypes.updateBatch]: (state, action) => updateBatch(update, state, action.values),
    [actionTypes.reset]: (state, action) => init(getPristineState()),
    [actionTypes.resetPristine]: (state, action) => removePristine(state),
    [actionTypes.resetPristineKey]: (state, action) => removePristine(state, action.attr),
    [actionTypes.startProcess]: (state, action) => ({ ...state, processing: true }),
    [actionTypes.doneProcess]: (state, action) => ({ ...state, processing: false }),
    [actionTypes.startFetch]: (state, action) => ({ ...state, loading: true }),
    [actionTypes.doneFetch]: (state, action) => init({
      ...action.values,
      loading: false,
      loaded: true
    }),
    [actionTypes.failFetch]: (state, action) => ({ ...state, loading: false }),
    ...customReducer
  };

  const reducer = createReducer(reducerHandlers);

  return { reducer, init };
};
