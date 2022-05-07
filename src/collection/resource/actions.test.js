import {testFunctionAction} from 'testHelpers';
import * as actions from './actions';
import * as actionTypes from './actionTypes';

it('removes resource', () =>
  testFunctionAction(
    actions.removeResource,
    '1',
  )({
    expectedType: actionTypes.removeResource,
    expectedValues: {id: '1'},
  }));

it('initializes resource', () => {
  const dispatch = jest.fn().mockImplementation(args => args);
  const getState = jest.fn();
  const dispatched = actions.initializeResource('1', {foo: 'bar'})(
    dispatch,
    getState,
  );
  expect(dispatch).toBeCalledWith({
    type: actionTypes.initializeResource,
    id: '1',
    values: {foo: 'bar'},
  });
  expect(getState).not.toBeCalled();
  expect(dispatched).toEqual({
    type: actionTypes.initializeResource,
    id: '1',
    values: {foo: 'bar'},
  });
});

it('initializes resource with merge', () => {
  const dispatch = jest.fn().mockImplementation(args => args);
  const getState = jest
    .fn()
    .mockImplementation(() => ({byId: {'1': {old: 'old'}}}));
  const dispatched = actions.initializeResource(
    '1',
    {foo: 'bar'},
    {merge: true},
  )(dispatch, getState);
  expect(dispatch).toBeCalledWith({
    type: actionTypes.initializeResource,
    id: '1',
    values: {foo: 'bar', old: 'old'},
  });
  expect(getState).toBeCalled();
  expect(dispatched).toEqual({
    type: actionTypes.initializeResource,
    id: '1',
    values: {foo: 'bar', old: 'old'},
  });
});

it('initializes non previous existent resource with merge', () => {
  const dispatch = jest.fn().mockImplementation(args => args);
  const getState = jest
    .fn()
    .mockImplementation(() => ({byId: {'2': {old: 'old'}}}));
  const dispatched = actions.initializeResource(
    '1',
    {foo: 'bar'},
    {merge: true},
  )(dispatch, getState);
  expect(dispatch).toBeCalledWith({
    type: actionTypes.initializeResource,
    id: '1',
    values: {foo: 'bar'},
  });
  expect(getState).toBeCalled();
  expect(dispatched).toEqual({
    type: actionTypes.initializeResource,
    id: '1',
    values: {foo: 'bar'},
  });
});

it('updates resource', () =>
  testFunctionAction(
    actions.updateResource,
    '1',
    'foo',
    'bar',
  )({
    expectedType: actionTypes.updateResource,
    expectedValues: {id: '1', attr: 'foo', value: 'bar'},
  }));

it('batch updates resource', () =>
  testFunctionAction(
    actions.updateBatchResource,
    '1',
    [],
  )({
    expectedType: actionTypes.updateBatchResource,
    expectedValues: {id: '1', values: []},
  }));

it('updates on change - event resource', () =>
  testFunctionAction(actions.updateOnChangeResource, '1', {
    target: {name: 'foo', value: 'bar'},
  })({
    expectedType: actionTypes.updateResource,
    expectedValues: {id: '1', attr: 'foo', value: 'bar'},
  }));

it('resets resource', () =>
  testFunctionAction(
    actions.resetResource,
    '1',
  )({
    expectedType: actionTypes.resetResource,
    expectedValues: {id: '1'},
  }));

it('resets pristine resource', () =>
  testFunctionAction(
    actions.resetPristineResource,
    '1',
  )({
    expectedType: actionTypes.resetPristineResource,
    expectedValues: {id: '1'},
  }));

it('resetPristineKey resource', () =>
  testFunctionAction(
    actions.resetPristineKeyResource,
    '1',
    'someKey',
  )({
    expectedType: actionTypes.resetPristineKeyResource,
    expectedValues: {id: '1', attr: 'someKey'},
  }));

it('fetches resource', () =>
  testFunctionAction(
    actions.startFetchResource,
    '1',
  )({
    expectedType: actionTypes.startFetchResource,
    expectedValues: {id: '1'},
  }));

it('success fetches resource', () =>
  testFunctionAction(actions.doneFetchResource, '1', {
    foo: 'foo',
    bar: 'bar',
  })({
    expectedType: actionTypes.doneFetchResource,
    expectedValues: {id: '1', values: {foo: 'foo', bar: 'bar'}},
  }));

it('fail fetches resource', () =>
  testFunctionAction(
    actions.failFetchResource,
    '1',
  )({
    expectedType: actionTypes.failFetchResource,
    expectedValues: {id: '1'},
  }));

it('starts process resource', () =>
  testFunctionAction(
    actions.startProcessResource,
    '1',
  )({
    expectedType: actionTypes.startProcessResource,
    expectedValues: {id: '1'},
  }));

it('finishes process resource', () =>
  testFunctionAction(
    actions.doneProcessResource,
    '1',
  )({
    expectedType: actionTypes.doneProcessResource,
    expectedValues: {id: '1'},
  }));
