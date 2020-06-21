import { isNil } from "../../helpers";
import makePristine from "../../makePristine";
import { updateBatch } from "../../reducerUtils";
import * as actionTypes from "./actionTypes";
import createReducer from "../../createReducer";

import { IfcAction } from "../../interfaces";
import type {
  Attr,
  LikeState,
  LikeStateArray,
  GetState,
  Dispatch,
  InputEvent,
  ReducerHandlers,
} from "../../types";

export default (
  getInitialState: GetState,
  customReducer: ReducerHandlers,
  idKey: Attr
) => {
  const {
    getInitialPristineState,
    updatePristine,
    removePristine,
  } = makePristine("pristine");

  const init = (id?: Attr, state: LikeState = {}) => ({
    [idKey]: id,
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
    [actionTypes.initializeResource]: (state: LikeState, action: IfcAction) =>
      init(action.id, action.values),
    [actionTypes.updateResource]: (state: LikeState, action: IfcAction) =>
      update(state, action.attr, action.value),
    [actionTypes.updateBatchResource]: (state: LikeState, action: IfcAction) =>
      updateBatch(update, state, action.values),
    [actionTypes.resetResource]: (state: LikeState, action: IfcAction) =>
      init(action.id),
    [actionTypes.resetPristineResource]: (
      state: LikeState,
      action: IfcAction
    ) => removePristine(state),
    [actionTypes.resetPristineKeyResource]: (
      state: LikeState,
      action: IfcAction
    ) => removePristine(state, action.attr),
    [actionTypes.startProcessResource]: (
      state: LikeState,
      action: IfcAction
    ) => ({
      ...state,
      processing: true,
    }),
    [actionTypes.doneProcessResource]: (
      state: LikeState,
      action: IfcAction
    ) => ({
      ...state,
      processing: false,
    }),
    [actionTypes.startFetchResource]: (
      state: LikeState,
      action: IfcAction
    ) => ({
      ...state,
      loading: true,
    }),
    [actionTypes.doneFetchResource]: (state: LikeState, action: IfcAction) =>
      init(action.id, {
        ...action.values,
        loading: false,
        loaded: true,
      }),
    [actionTypes.failFetchResource]: (state: LikeState, action: IfcAction) => ({
      ...state,
      loading: false,
    }),
    ...customReducer,
  };

  const reducer = createReducer(reducerHandlers);

  return { reducer, init };
};
