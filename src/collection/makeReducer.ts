import * as actionTypes from "../actionTypes";
import * as resourceActionTypes from "./resource/actionTypes";
import { updateBatch } from "../reducerUtils";
import createReducer from "../createReducer";
import { isNil } from "../helpers";

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
 * @typedef {Object} collectionHoax.ReducerWithInit
 * @property {function} reducer - the reducer to be used along with provider
 * @property {function} init - the function to initialize the reducer's state
 */

/**
 *  @function collectionHoax.makeReducer
 *  @access private
 *  @param {function} getInitialState - a function that returns the initialState
 *  @param {function} customReducer - a custom reducer
 *  @return {collectionHoax.ReducerWithInit}
 */

interface IfcMakeCollectionReducer {
  getInitialState?: GetState;
  customReducer?: ReducerHandlers;
  resourceReducer: Reducer;
  initResource: (id?: Attr, state?: LikeState) => LikeState;
  idKey: Attr;
}

export default ({
  getInitialState,
  customReducer = {},
  resourceReducer,
  initResource,
  idKey,
}: IfcMakeCollectionReducer) => {
  const init = (state: LikeState = {}) => ({
    ...getInitialState(),
    ...state,
  });

  const updateOnlyResourceState = (
    state: LikeState,
    id: Attr,
    payload: IfcAction
  ) => {
    const prevResource = state.byId[id] || initResource();
    return resourceReducer(prevResource, { [idKey]: id, ...payload });
  };

  const getValidValue = (attr: Attr, value: any) =>
    isNil(value) ? getInitialState()[attr] : value;

  const update = (state: LikeState, attr: Attr, value: any) => {
    value = getValidValue(attr, value);

    return {
      ...state,
      [attr]: value,
    };
  };

  const doneFetch = (state: LikeState, resources: LikeState[]) => {
    const ids: Attr[] = [];
    const byId = resources.reduce((h: LikeState, resource: LikeState) => {
      ids.push(resource[idKey]);

      return {
        ...h,
        [resource[idKey]]: updateOnlyResourceState(state, resource[idKey], {
          type: resourceActionTypes.initializeResource,
          values: resource,
        }),
      };
    }, {});

    return {
      ...state,
      byId: {
        ...state.byId,
        ...byId,
      },
      ids: [...new Set([...state.ids, ...ids])],
      loading: false,
      loaded: true,
    };
  };

  const removeResource = (state: LikeState, resourceId: Attr) => {
    const byId = { ...state.byId };
    delete byId[resourceId];
    const ids = state.ids.filter((id: Attr) => id !== resourceId);

    return {
      ...state,
      byId,
      ids,
    };
  };

  const updateResource = (state: LikeState, { id, ...rest }: IfcAction) => {
    const resource = updateOnlyResourceState(state, id, rest);
    const ids = state.byId.hasOwnProperty(id) ? state.ids : [...state.ids, id];

    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: resource,
      },
      ids,
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
      doneFetch(state, action.values),
    [actionTypes.failFetch]: (state: LikeState, action: IfcAction) => ({
      ...state,
      loading: false,
    }),
    ...Object.keys(resourceActionTypes).reduce(
      (h, actionType) => ({
        ...h,
        [actionType]: updateResource,
      }),
      {}
    ),
    [resourceActionTypes.removeResource]: (
      state: LikeState,
      action: IfcAction
    ) => removeResource(state, action.id),
    ...customReducer,
  };

  const reducer = createReducer(reducerHandlers);

  return { reducer, init };
};
