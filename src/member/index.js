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

const makeMemberProvider = (
  name,
  { initialState, customReducer, customActions } = {}
) => {
  const getInitialState = makeGetInitialState({
    initialState,
    defaultInitialState
  });
  const { reducer, init } = makeReducer(getInitialState, customReducer);

  const [StateCtx, DispatchCtx] = makeContext();
  const useMember = makeUseMember(StateCtx, DispatchCtx);
  const useCollection = makeUseCollection(StateCtx, DispatchCtx);
  const Field = makeFields(useMember);
  const { useSelector, useAction } = makeUseSelector(StateCtx, DispatchCtx);

  const MemberProvider = ({ children, extraArgument }) => {
    const [state, dispatches] = useReducer(reducer, {
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
