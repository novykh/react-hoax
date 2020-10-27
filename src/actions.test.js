import {testFunctionAction, testObjectAction} from 'testHelpers';
import * as actions from './actions';
import * as actionTypes from './actionTypes';

it('initializes', () => {
  const dispatch = jest.fn().mockImplementation(args => args);
  const getState = jest.fn();
  const dispatched = actions.initialize({foo: 'bar'})(dispatch, getState);
  expect(dispatch).toBeCalledWith({
    type: actionTypes.initialize,
    values: {foo: 'bar'},
  });
  expect(getState).not.toBeCalled();
  expect(dispatched).toEqual({
    type: actionTypes.initialize,
    values: {foo: 'bar'},
  });
});

it('initializes with merge', () => {
  const dispatch = jest.fn().mockImplementation(args => args);
  const getState = jest.fn().mockReturnValue({test: 'test'});
  const dispatched = actions.initialize({foo: 'bar'}, {merge: true})(
    dispatch,
    getState,
  );
  expect(dispatch).toBeCalledWith({
    type: actionTypes.initialize,
    values: {foo: 'bar', test: 'test'},
  });
  expect(getState).toBeCalledTimes(1);
  expect(dispatched).toEqual({
    type: actionTypes.initialize,
    values: {foo: 'bar', test: 'test'},
  });
});

it('updates', () =>
  testFunctionAction(
    actions.update,
    'foo',
    'bar',
  )({
    expectedType: actionTypes.update,
    expectedValues: {attr: 'foo', value: 'bar'},
  }));

it('batch updates', () =>
  testFunctionAction(
    actions.updateBatch,
    [],
  )({
    expectedType: actionTypes.updateBatch,
    expectedValues: {values: []},
  }));

it('updates on change - event', () =>
  testFunctionAction(actions.updateOnChange, {
    target: {name: 'foo', value: 'bar'},
  })({
    expectedType: actionTypes.update,
    expectedValues: {attr: 'foo', value: 'bar'},
  }));

it('resets', () =>
  testObjectAction(actions.reset)({
    expectedType: actionTypes.reset,
    expectedValues: undefined,
  }));

it('resets pristine', () =>
  testObjectAction(actions.resetPristine)({
    expectedType: actionTypes.resetPristine,
    expectedValues: undefined,
  }));

it('resetPristineKey', () =>
  testFunctionAction(
    actions.resetPristineKey,
    'someKey',
  )({
    expectedType: actionTypes.resetPristineKey,
    expectedValues: {attr: 'someKey'},
  }));

it('fetches', () =>
  testObjectAction(actions.startFetch)({
    expectedType: actionTypes.startFetch,
    expectedValues: undefined,
  }));

it('success fetches', () =>
  testFunctionAction(actions.doneFetch, {foo: 'foo', bar: 'bar'})({
    expectedType: actionTypes.doneFetch,
    expectedValues: {values: {foo: 'foo', bar: 'bar'}},
  }));

it('fail fetches', () =>
  testObjectAction(actions.failFetch)({
    expectedType: actionTypes.failFetch,
    expectedValues: undefined,
  }));

it('starts process', () =>
  testObjectAction(actions.startProcess)({
    expectedType: actionTypes.startProcess,
    expectedValues: undefined,
  }));

it('finishes process', () =>
  testObjectAction(actions.doneProcess)({
    expectedType: actionTypes.doneProcess,
    expectedValues: undefined,
  }));
