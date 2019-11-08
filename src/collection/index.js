import React from "react";
import useReducer from "../useReducer";
import defaultInitialState from "./initialState";
import defaultResourceInitialState from "./resource/initialState";
import * as actions from "../actions";
import * as resourceActions from "./resource/actions";
import makeContext from "../makeContext";
import makeGetInitialState from "../makeGetInitialState";
import makeReducer from "./makeReducer";
import makeUseCollection from "../makeUseCollection";
import makeUseMember from "../makeUseMember";
import makeFields from "../makeFields";
import makeUseSelector from "./makeUseSelector";
import makeResourceReducer from "./resource/makeReducer";

/** @module collectionHoax.makeCollectionProvider */

/**
 * @typedef {Object} CollectionHoax
 * @property {function} Provider - The collection context provider
 * @property {function} useMember - A react hook for
 * @property {function} useCollection - A react hook for
 * @property {collectionHoax.Selectors}
 * @property {object} Field
 */

/**
 * makeCollectionProvider factory.
 * @param {string} name - The name of the resource, will be used on the `displayName`.
 * @param {object} [options={}] - The collection options.
 * @param {object} options.initialState - The initialState of the collection, will be merged with the default collection hoax initialState.
 * @param {function} options.customReducer - `reducer(state, action)` An extra reducer for the collection, should return nothing on actionType mismatch, after passing through the custom reducer, it will go through the default collection hoax reducer.
 * @param {object} options.customActions - Extra actions, check the default hoax actions for collection and nested resources.
 * @param {object} options.resourceOptions - each nested resource's options
 * @param {object} options.resourceOptions.initialState - The initialState of the nested resource, will be merged with the default resource hoax initialState.
 * @param {function} options.resourceOptions.reducer - `reducer(state, action)` An extra reducer for the nested resource, should return nothing on actionType mismatch, after passing through the custom reducer, it will go through the default resource reducer.
 * @return {CollectionHoax} CollectionHoax - what is needed for a collection resource
 */

const makeCollectionProvider = (
  name,
  { initialState, customReducer, customActions, resourceOptions = {} } = {}
) => {
  const getInitialState = makeGetInitialState({
    initialState,
    defaultInitialState
  });

  const getInitialResourceState = makeGetInitialState({
    initialState: resourceOptions.initialState,
    defaultInitialState: defaultResourceInitialState
  });

  const { reducer: resourceReducer, init: initResource } = makeResourceReducer(
    getInitialResourceState,
    resourceOptions.reducer
  );
  const { reducer, init } = makeReducer({
    getInitialState,
    customReducer,
    resourceReducer,
    initResource
  });

  const [StateCtx, DispatchCtx] = makeContext();
  const useCollection = makeUseCollection(StateCtx, DispatchCtx);
  const useMember = makeUseMember(StateCtx, DispatchCtx);
  const Field = makeFields(useMember);
  const { useSelector, useAction, useResourceSelector } = makeUseSelector(
    StateCtx,
    DispatchCtx
  );

  const CollectionProvider = ({ children, extraArgument }) => {
    const [state, dispatches] = useReducer(reducer, {
      actions: { ...actions, ...resourceActions, ...customActions },
      init: getInitialState,
      extraArgument
    });

    return (
      <DispatchCtx.Provider value={dispatches}>
        <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
      </DispatchCtx.Provider>
    );
  };

  CollectionProvider.displayName = name;

  return {
    Provider: CollectionProvider,
    useCollection,
    useMember,
    useSelector,
    useAction,
    useResourceSelector,
    Field
  };
};

export default makeCollectionProvider;
