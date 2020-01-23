export default ({ getInitialState, defaultInitialState }) => {
  if (!getInitialState || typeof getInitialState !== "function") {
    console.error(
      "Hoax needs an object as initial state - empty object will be used instead"
    );
    return () => defaultInitialState;
  }

  return () => ({ ...defaultInitialState, ...getInitialState() });
};
