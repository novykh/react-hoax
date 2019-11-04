export default ({ initialState, defaultInitialState }) => {
  if (!initialState || typeof initialState !== "object") {
    console.error(
      "Hoax needs an object as initial state - empty object will be used instead"
    );
    return () => defaultInitialState;
  }

  initialState = { ...defaultInitialState, ...initialState };
  return () => initialState;
};
