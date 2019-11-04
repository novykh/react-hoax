export const testFunctionAction = (action, ...values) => ({expectedType, expectedValues}) =>
  expect(action(...values)).toEqual({type: expectedType, ...expectedValues});

export const testObjectAction = action => ({expectedType}) => expect(action).toEqual({type: expectedType});
