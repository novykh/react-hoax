export default reducer => (state, type, payload) => (expectedState = {}) =>
  expect(reducer(state, {type, ...payload})).toEqual(expectedState);
