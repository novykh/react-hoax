export default ({ getInitialState, defaultInitialState }) => {
  if (getInitialState && typeof getInitialState !== "function") {
    console.error(
      "Hoax needs a function to return the initial state object - empty object will be used instead"
    );
    return () => defaultInitialState;
  }

  return () => ({ ...defaultInitialState, ...getInitialState() });
};
