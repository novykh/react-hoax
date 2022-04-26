import {
  useCallback,
  useContext as useReactContext,
  useState,
  useRef,
} from 'react';
import identity from 'lodash/identity';
import isObjectEqual from 'lodash/isEqual';
import {useIsomorphicLayoutEffect} from '../makeContext';

const isEqual = (prev, next) => {
  if (typeof prev === 'function' && typeof next === 'function') {
    return prev.toString() === next.toString();
  }

  if (Object.is(prev, next)) return true;

  return isObjectEqual(prev, next);
};

export default (context, selector = identity) => {
  const contextValue = useReactContext(context).current;

  if (typeof process === 'object' && process.env.NODE_ENV !== 'production') {
    if (!contextValue) {
      throw new Error('useContextSelector requires special context');
    }
  }
  const {
    value: {current: value},
    version: {current: version},
    listeners: listeners,
  } = contextValue;

  const selected = selector(value);

  const [state, setState] = useState(() => [version, selector(value)]);

  const dispatchRef = useRef(() => {});
  dispatchRef.current = useCallback(
    next =>
      setState(prev => {
        if (!next) {
          return [value, selected];
        }
        if (next[0] === version) {
          if (isEqual(prev[1], selected)) {
            return prev; // no update
          }
          return [value, selected];
        }
        try {
          if (next.length === 2) {
            if (isEqual(prev[0], next[1])) {
              return prev; // no update
            }
            const nextSelected = selector(next[1]);
            if (isEqual(prev[1], nextSelected)) {
              return prev; // no update
            }
            return [next[1], nextSelected];
          }
        } catch (e) {
          // ignored
        }
        return [...prev]; // update
      }),
    [selected],
  );

  if (!isEqual(state[1], selected)) {
    // should update
    dispatchRef.current();
  }

  useIsomorphicLayoutEffect(() => {
    listeners.add(dispatchRef.current);
    return () => listeners.delete(dispatchRef.current);
  }, [listeners]);

  return state[1];
};
