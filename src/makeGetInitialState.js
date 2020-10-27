export default ({getInitialState, defaultInitialState}) => {
  if (!getInitialState || typeof getInitialState !== 'function') {
    return () => defaultInitialState;
  }

  return () => ({...defaultInitialState, ...getInitialState()});
};
