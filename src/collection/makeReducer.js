import * as actionTypes from "../actionTypes";
import * as resourceActionTypes from "./resource/actionTypes";
import { updateBatch } from "../reducerUtils";
import createReducer from "../createReducer"

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

export default ({
  getInitialState,
  customReducer = {},
  resourceReducer = {},
  initResource,
  customResourceActionTypes = {}
}) => {
  const init = (state = {}) => ({
    ...getInitialState(),
    ...state
  });

  const updateOnlyResourceState = (state, id, payload) => {
    const prevResource = state.byId[id] || initResource();
    return resourceReducer(prevResource, { id, ...payload });
  };

  const update = (state, attr, value) => {
    const id = attr.toString();
    const ids = state.byId.hasOwnProperty(id) ? state.ids : [...state.ids, id];
    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: updateOnlyResourceState(state, id, {
          type: resourceActionTypes.updateBatchResource,
          values: value
        })
      },
      ids
    };
  };

  const doneFetch = (state, resources) => {
    const ids = [];
    const byId = resources.reduce((h, resource) => {
      ids.push(resource.id);

      return {
        ...h,
        [resource.id]: updateOnlyResourceState(state, resource.id, {
          type: resourceActionTypes.initializeResource,
          values: resource
        })
      };
    }, {});

    return {
      ...state,
      byId: {
        ...state.byId,
        ...byId
      },
      ids: [...new Set([...state.ids, ...ids])],
      loading: false,
      loaded: true
    };
  };

  const removeResource = (state, resourceId) => {
    const byId = { ...state.byId };
    delete byId[resourceId];
    const ids = state.ids.filter(id => id !== resourceId);

    return {
      ...state,
      byId,
      ids
    };
  };

  const updateResource = (state, { id, ...rest }) => {
    const resource = updateOnlyResourceState(state, id, rest);
    const ids = state.byId.hasOwnProperty(id) ? state.ids : [...state.ids, id];

    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: resource
      },
      ids
    };
  };

  const reducerHandlers = {
    [actionTypes.initialize]: (state, action) => init(action.values),
    [actionTypes.update]: (state, action) =>
      update(state, action.attr, action.value),
    [actionTypes.updateBatch]: (state, action) =>
      updateBatch(update, state, action.values),
    [actionTypes.reset]: (state, action) => init(),
    [actionTypes.startProcess]: (state, action) => ({
      ...state,
      processing: true
    }),
    [actionTypes.doneProcess]: (state, action) => ({
      ...state,
      processing: false
    }),
    [actionTypes.startFetch]: (state, action) => ({ ...state, loading: true }),
    [actionTypes.doneFetch]: (state, action) => doneFetch(state, action.values),
    [actionTypes.failFetch]: (state, action) => ({ ...state, loading: false }),
    [actionTypes.removeResource]: (state, action) =>
      removeResource(state, action.id),
    ...Object.keys({
      ...resourceActionTypes,
      ...customResourceActionTypes
    }).reduce(
      (h, actionType) => ({
        ...h,
        [actionType]: updateResource
      }),
      {}
    ),
    ...customReducer
  };

  const reducer = createReducer(reducerHandlers);

  return { reducer, init };
};
