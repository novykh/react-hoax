import {
  useContext as useReactContext,
  useCallback,
  useState,
  useRef,
} from 'react';
import identity from '../helpers/identity';
import deepEqual from '../helpers/deepEqual';
import {useIsomorphicLayoutEffect} from '../makeContext';

const isEqual = (prev, next) => {
  if (typeof prev === 'function' && typeof next === 'function')
    return prev.toString() === next.toString();

  return deepEqual(prev, next);
};

export default (context, selector = identity) => {
  const contextValue = useReactContext(context);

  const {value, version, listeners: listeners} = contextValue;

  const [state, setState] = useState(() => [
    value.current,
    selector(value.current),
  ]);

  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const dispatch = useCallback(next => {
    setState(prev => {
      if (version.current === next[0]) {
        const selected = selectorRef.current(next[1]);
        if (isEqual(prev[1], selected)) return prev; // no update

        return [next[1], selected];
      }

      if (next.length === 2) {
        if (isEqual(prev[0], next[1])) return prev; // no update

        const nextSelected = selectorRef.current(next[1]);
        if (isEqual(prev[1], nextSelected)) return prev; // no update

        return [next[1], nextSelected];
      }

      return [...prev]; // update
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    listeners.add(dispatch);
    return () => listeners.delete(dispatch);
  }, [listeners]);

  const selected = selector(value.current);
  if (!isEqual(state[1], selected)) {
    // should update
    setState([value.current, selected]);
    return selected;
  }

  return state[1];
};
