export default handlers => {
  return (state, action) => {
    if (handlers.hasOwnProperty(action.type))
      return handlers[action.type](state, action);

    return state;
  };
};
