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
