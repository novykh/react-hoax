import { isNil } from "../helpers";
import makePristine from "../makePristine";
import { updateBatch } from "../reducerUtils";
import * as actionTypes from "../actionTypes";
import createReducer from "../createReducer";

import { IfcAction } from "../interfaces";
import type {
  Attr,
  LikeState,
  LikeStateArray,
  GetState,
  Dispatch,
  InputEvent,
  ReducerHandlers,
  Reducer,
  Actions,
} from "../types";

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

export default (getInitialState: GetState, customReducer: ReducerHandlers) => {
  const {
    getInitialPristineState,
    updatePristine,
    removePristine,
  } = makePristine("pristine");

  const init = (state: LikeState = {}) => ({
    ...getInitialState(),
    ...state,
    ...getInitialPristineState(),
  });

  const getValidValue = (attr: Attr, value: any) =>
    isNil(value) ? getInitialState()[attr] : value;

  const update = (state: LikeState, attr: Attr, value: any) => {
    value = getValidValue(attr, value);
    state = updatePristine(state, attr, value);
    return {
      ...state,
      [attr]: value,
    };
  };

  const reducerHandlers = {
    [actionTypes.initialize]: (state: LikeState, action: IfcAction) =>
      init(action.values),
    [actionTypes.update]: (state: LikeState, action: IfcAction) =>
      update(state, action.attr, action.value),
    [actionTypes.updateBatch]: (state: LikeState, action: IfcAction) =>
      updateBatch(update, state, action.values),
    [actionTypes.reset]: (state: LikeState, action: IfcAction) => init(),
    [actionTypes.resetPristine]: (state: LikeState, action: IfcAction) =>
      removePristine(state),
    [actionTypes.resetPristineKey]: (state: LikeState, action: IfcAction) =>
      removePristine(state, action.attr),
    [actionTypes.startProcess]: (state: LikeState, action: IfcAction) => ({
      ...state,
      processing: true,
    }),
    [actionTypes.doneProcess]: (state: LikeState, action: IfcAction) => ({
      ...state,
      processing: false,
    }),
    [actionTypes.startFetch]: (state: LikeState, action: IfcAction) => ({
      ...state,
      loading: true,
    }),
    [actionTypes.doneFetch]: (state: LikeState, action: IfcAction) =>
      init({
        ...action.values,
        loading: false,
        loaded: true,
      }),
    [actionTypes.failFetch]: (state: LikeState, action: IfcAction) => ({
      ...state,
      loading: false,
    }),
    ...customReducer,
  };

  const reducer = createReducer(reducerHandlers);

  return { reducer, init };
};
