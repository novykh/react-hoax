import { useEffect, useRef } from "react";
import usePrevious from "../usePrevious";
import isEqual from "lodash/isEqual";
import identity from "lodash/identity";

/**
 * @description Hooks for observing any kind of store and dispatch actions according to state changes
 * @example
 * const Foo = () => {
 *    const [state, setState] = useState({id: '1', title: ''});
 *    useObservers(state, [makeObserver(s => dispatchSomeAction(s))]);
 *
 *    // or specify the part of state to check
 *    useObservers(state, [makeObserver(s => dispatchSomeAction(s), s => s.title)]);
 *
 *    return <button onClick={() => setState(s => {...s, title: 'new title'})}>Abort fetching</button>;
 * }
 */

export const makeObserver = (dispatch, getStateToCheck = identity) => (
  state,
  prevState
) => {
  if (!prevState) return;
  const previous = getStateToCheck(prevState);
  const current = getStateToCheck(state);

  if (!isEqual(previous, current)) dispatch(state);
};

export default (state, observers) => {
  const hasObservers = Array.isArray(observers);
  const previousState = usePrevious(state);
  const observersRef = useRef();

  useEffect(() => {
    observersRef.current = hasObservers ? observers : [];
    observersRef.current.forEach(func => func(state, previousState));
    return () => (observersRef.current = []);
  }, [state]);
};
