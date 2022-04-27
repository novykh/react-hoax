import {
  createContext as createReactContext,
  useRef,
  useEffect,
  useLayoutEffect,
  createElement,
} from 'react';
import {
  unstable_NormalPriority as NormalPriority,
  unstable_runWithPriority as runWithPriority,
} from 'scheduler';

const isSSR =
  typeof window === 'undefined' ||
  /ServerSideRendering/.test(window.navigator && window.navigator.userAgent);

export const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect;

// for preact that doesn't have runWithPriority
const runWithNormalPriority = runWithPriority
  ? thunk => runWithPriority(NormalPriority, thunk)
  : thunk => thunk();

export const providerSymbol = Symbol();

const createProvider = ProviderOrig => {
  const ContextProvider = ({value, children}) => {
    const valueRef = useRef(value);
    const versionRef = useRef(0);
    const contextValue = useRef();

    if (!contextValue.current) {
      const listeners = new Set();

      contextValue.current = {
        value: valueRef,
        version: versionRef,
        listeners,
      };
    }

    useIsomorphicLayoutEffect(() => {
      valueRef.current = value;
      versionRef.current += 1;

      runWithNormalPriority(() => {
        contextValue.current.listeners.forEach(listener => {
          listener([versionRef.current, value]);
        });
      });
    }, [value]);

    return createElement(ProviderOrig, {value: contextValue.current}, children);
  };
  return ContextProvider;
};

export const createContext = defaultValue => {
  const context = createReactContext({
    value: {current: defaultValue},
    version: {current: -1},
    listeners: new Set(),
  });

  context.Provider = createProvider(context.Provider);
  delete context.Consumer;

  return context;
};

export default () => [createContext({}), createContext({})];
