import React from 'react';
import useReducer from '../useReducer';
import defaultInitialState from './initialState';
import defaultResourceInitialState from './resource/initialState';
import * as actions from '../actions';
import * as resourceActions from './resource/actions';
import makeContext from '../makeContext';
import makeGetInitialState from '../makeGetInitialState';
import makeReducer from './makeReducer';
import makeUseCollection from '../makeUseCollection';
import makeUseMember from '../makeUseMember';
import makeUseSelector from './makeUseSelector';
import makeResourceReducer from './resource/makeReducer';

/** @module collectionHoax.makeCollectionProvider */

/**
 * @typedef {Object} CollectionHoax
 * @property {function} Provider - The collection context provider
 * @property {function} useMember - A react hook for
 * @property {function} useCollection - A react hook for
 * @property {collectionHoax.Selectors}
 */

/**
 * makeCollectionProvider factory.
 * @param {string} name - The name of the resource, will be used on the `displayName`.
 * @param {object} [options={}] - The collection options.
 * @param {object} options.getInitialState - The returned value of `getInitialState` of the collection, will be merged with the default collection hoax initialState.
 * @param {function} options.reducer - `reducer(state, action)` An extra reducer for the collection, should return nothing on actionType mismatch, after passing through the custom reducer, it will go through the default collection hoax reducer.
 * @param {object} options.actions - Extra actions, check the default hoax actions for collection and nested resources.
 * @param {object} options.resourceOptions - each nested resource's options
 * @param {object} options.resourceOptions.getInitialState - The returned value of `getInitialState` of the nested resource, will be merged with the default resource hoax initialState.
 * @param {function} options.resourceOptions.reducer - `reducer(state, action)` An extra reducer for the nested resource, should return nothing on actionType mismatch, after passing through the custom reducer, it will go through the default resource reducer.
 * @param {string} [idKey='id'] - The identifier for resource scoping, the key to be used for `ids` and `byId`.
 * @return {CollectionHoax} CollectionHoax - what is needed for a collection resource
 */

const makeCollectionProvider = (
  name,
  {
    getInitialState,
    reducer: customReducer,
    actions: customActions,
    resourceOptions = {},
    idKey = 'id',
  } = {},
) => {
  const initState = makeGetInitialState({
    getInitialState,
    defaultInitialState,
  });

  const getInitialResourceState = makeGetInitialState({
    getInitialState: resourceOptions.getInitialState,
    defaultInitialState: defaultResourceInitialState,
  });

  const {reducer: resourceReducer, init: initResource} = makeResourceReducer(
    getInitialResourceState,
    resourceOptions.reducer,
    idKey,
  );
  const {reducer, init} = makeReducer({
    getInitialState: initState,
    customReducer,
    resourceReducer,
    customResourceActionTypes: resourceOptions.actionTypes,
    initResource,
    idKey,
  });

  const [StateCtx, DispatchCtx] = makeContext();
  const useCollection = makeUseCollection(StateCtx, DispatchCtx);
  const useMember = makeUseMember(StateCtx, DispatchCtx);
  const {useSelector, useAction, useResourceSelector} = makeUseSelector(
    StateCtx,
    DispatchCtx,
    initState,
    getInitialResourceState,
  );

  const CollectionProvider = ({children, initialState, extraArgument}) => {
    const [state, dispatches] = useReducer(reducer, {
      initialState,
      init,
      actions: {...actions, ...resourceActions, ...customActions},
      extraArgument,
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
    getInitialState: initState,
    getInitialResourceState,
  };
};

export default makeCollectionProvider;
