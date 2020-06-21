import { useReducer, useRef } from "react";
import { identity } from "../helpers";

import { IfcAction } from "../interfaces";
import type {
  Attr,
  LikeState,
  LikeStateArray,
  GetState,
  InputEvent,
  Dispatch,
  Action,
  Actions,
} from "../types";

const connect = (
  action: Action,
  dispatch: Dispatch,
  getState: GetState,
  args: any[],
  extraArgument: any
) => {
  if (typeof action !== "function") return dispatch(action);

  const next = action(...args);
  if (typeof next === "function")
    return next(dispatch, getState, extraArgument);
  return dispatch(next);
};

/**
 * @description A hook for creating a reducer and have access to its state and all actions to update it
 * @example
 * const Foo = () => {
 *    const [state, dispatches] = useReducer(reducer, {
 *      initialState: {foo: 'bar'},
 *      actions: {baz}
 *    });
 *
 *    return (
 *      <button onClick={dispatches.baz}>{state.foo}</button>
 *    );
 * }
 */

interface IfcReducerOptions {
  initialState: LikeState;
  init: (x: LikeState) => LikeState;
  actions: Actions | undefined;
  extraArgument: any;
}

interface IfcDispatchRef {
  [key: string]: Dispatch;
}

type Reducer = (state: LikeState, action: IfcAction) => LikeState;

export default (
  reducer: Reducer,
  {
    initialState,
    init = identity,
    actions = {},
    extraArgument,
  }: IfcReducerOptions
) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const stateRef = useRef<LikeState>();
  stateRef.current = state;

  const dispatchRef = useRef<IfcDispatchRef>();
  if (dispatchRef.current) return [state, dispatchRef.current];

  const getState = () => stateRef.current;
  dispatchRef.current = Object.keys(actions).reduce(
    (h, action) => ({
      ...h,
      [action]: (...args: any[]) =>
        connect(actions[action], dispatch, getState, args, extraArgument),
    }),
    { dispatch }
  );

  return [state, dispatchRef.current];
};
