import { useReducer, useRef } from "react";
import useObservers from "../useObservers";
import identity from "lodash/identity";

const connect = (action, dispatch, getState, args, extraArgument) => {
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

export default (
  reducer,
  { initialState, init = identity, actions = {}, observers, extraArgument }
) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const stateRef = useRef();
  stateRef.current = state;

  useObservers(state, observers);

  const dispatchRef = useRef();
  if (dispatchRef.current) return [state, dispatchRef.current];

  const getState = () => stateRef.current;
  dispatchRef.current = Object.keys(actions).reduce(
    (h, action) => ({
      ...h,
      [action]: (...args) =>
        connect(
          actions[action],
          dispatch,
          getState,
          args,
          extraArgument
        )
    }),
    { dispatch }
  );

  return [state, dispatchRef.current];
};
