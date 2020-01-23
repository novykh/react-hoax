import * as actionTypes from "../actionTypes";
import * as resourceActionTypes from "./resource/actionTypes";
import { updateBatch } from "../reducerUtils";

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
  customReducer,
  resourceReducer,
  initResource
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
          type: actionTypes.updateBatchResource,
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
          type: actionTypes.initializeResource,
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
    const byId = delete state.byId[resourceId];
    const ids = state.ids.filter(id => id !== resourceId);

    return {
      ...state,
      byId: {
        ...byId
      },
      ids
    };
  };

  const updateResource = (state, { id, ...rest }) => {
    const resource = updateOnlyResourceState(state, id, rest);

    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: resource
      }
    };
  };

  const reducer = (state, { type, ...payload }) => {
    if (typeof customReducer === "function")
      state = customReducer(state, { type, ...payload });

    switch (type) {
      case actionTypes.update:
        return update(state, payload.attr, payload.value);

      case actionTypes.updateBatch:
        return updateBatch(update, state, payload.values);

      case actionTypes.reset:
        return init();

      case actionTypes.startFetch:
        return { ...state, loading: true };

      case actionTypes.doneFetch:
        return doneFetch(state, payload.values);

      case actionTypes.failFetch:
        return { ...state, loading: false };

      case resourceActionTypes.removeResource:
        return removeResource(state, payload.id);

      case resourceActionTypes.initializeResource:
      case resourceActionTypes.updateResource:
      case resourceActionTypes.updateBatchResource:
      case resourceActionTypes.resetResource:
      case resourceActionTypes.resetPristineResource:
      case resourceActionTypes.resetPristineKeyResource:
      case resourceActionTypes.startProcessResource:
      case resourceActionTypes.doneProcessResource:
        return updateResource(state, { type, ...payload });

      default:
        return state;
    }
  };

  return { reducer, init };
};
