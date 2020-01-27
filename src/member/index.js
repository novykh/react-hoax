import React from "react";
import useReducer from "../useReducer";
import * as actions from "../actions";
import makeContext from "../makeContext";
import makeGetInitialState from "../makeGetInitialState";
import makeReducer from "./makeReducer";
import makeUseMember from "../makeUseMember";
import makeUseCollection from "../makeUseCollection";
import makeFields from "../makeFields";
import makeUseSelector from "./makeUseSelector";
import defaultInitialState from "./initialState";

/** @module memberHoax.makeMemberProvider */

/**
 * @typedef {Object} MemberHoax
 * @property {function} Provider - The member context provider
 * @property {function} useMember - A react hook for
 * @property {function} useCollection - A react hook for
 * @property {function} useSelector - A react hook for
 * @property {function} useAction - A react hook for
 * @property {object} Field
 */

/**
 * makeMemberProvider factory.
 * @param {string} name - The name of the resource, will be used on the `displayName`.
 * @param {object} [options={}] - The resource options.
 * @param {object} options.initialState - The initialState of the resource, will be merged with the default member hoax initialState.
 * @param {function} options.reducer - `reducer(state, action)` An extra reducer for the resource, should return nothing on actionType mismatch, after passing through the custom reducer, it will go through the default member hoax reducer.
 * @param {object} options.actions - Extra actions, check the default hoax actions for member.
 * @return {MemberHoax} MemberHoax - what is needed for a member resource
 */

const makeMemberProvider = (
  name,
  { getInitialState, reducer: customReducer, actions: customActions } = {}
) => {
  const initState = makeGetInitialState({
    getInitialState,
    defaultInitialState
  });
  const { reducer, init } = makeReducer(initState, customReducer);

  const [StateCtx, DispatchCtx] = makeContext();
  const useMember = makeUseMember(StateCtx, DispatchCtx);
  const useCollection = makeUseCollection(StateCtx, DispatchCtx);
  const Field = makeFields(useMember);
  const { useSelector, useAction } = makeUseSelector(StateCtx, DispatchCtx);

  const MemberProvider = ({ children, initialState, extraArgument }) => {
    const [state, dispatches] = useReducer(reducer, {
      initialState,
      init,
      actions: { ...actions, ...customActions },
      extraArgument
    });

    return (
      <DispatchCtx.Provider value={dispatches}>
        <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
      </DispatchCtx.Provider>
    );
  };

  MemberProvider.displayName = name;

  return {
    Provider: MemberProvider,
    useMember,
    useCollection,
    useSelector,
    useAction,
    Field
  };
};

export default makeMemberProvider;
