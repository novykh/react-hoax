import React from 'react';
import {createContext} from 'use-context-selector';
import {renderHook, act} from 'testUtils';
import makeUseMember from './index';

const DispatchContext = createContext();
const Context = createContext();

const makeProvider = (dispatcher, state) => ({children}) => (
  <DispatchContext.Provider value={dispatcher}>
    <Context.Provider value={state}>{children}</Context.Provider>
  </DispatchContext.Provider>
);

const render = ({dispatcher, state, ...options}) =>
  renderHook(
    () =>
      makeUseMember(
        Context,
        DispatchContext,
      )({
        fieldKey: 'myKey',
        ...options,
      }),
    {
      wrapper: makeProvider(dispatcher, state),
    },
  );

const toProps = current => {
  const [value, setValue, error, setError] = current;
  return {value, setValue, error, setError};
};

describe('root level member', () => {
  it('returns the member', () => {
    const {result} = render({
      dispatcher: {update: jest.fn()},
      state: {myKey: 'myValue', errors: {}},
    });
    expect(toProps(result.current).value).toEqual('myValue');
  });

  it('sets a value on the member', () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: '', errors: {}},
    });

    act(() => {
      toProps(result.current).setValue('myValue');
    });

    expect(update).toHaveBeenCalledWith('myKey', 'myValue');
  });

  it("returns the member's errors", () => {
    const {result} = render({
      dispatcher: {update: jest.fn()},
      state: {myKey: '', errors: {myKey: 'myError'}},
    });
    expect(toProps(result.current).value).toEqual('');
    expect(toProps(result.current).error).toEqual('myError');
  });

  it('throws error if update function is missing', () => {
    const {result} = render({
      dispatcher: {},
      state: {myKey: 'myValue', errors: {}},
    });
    expect(result.error.toString()).toMatch(/expects/);
  });

  it('sets an error', () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: 'myValue', errors: {}},
    });

    act(() => {
      toProps(result.current).setError('myError');
    });

    expect(update).toHaveBeenCalledWith('errors.myKey', 'myError');
  });
});

describe('nested byId member', () => {
  it('returns the member', () => {
    const {result} = render({
      dispatcher: {updateResource: jest.fn()},
      state: {byId: {nestedResourceId: {myKey: 'myValue', errors: {}}}},
      resourceId: 'nestedResourceId',
    });
    expect(toProps(result.current).value).toEqual('myValue');
  });

  it('sets a value on the member', () => {
    const updateResource = jest.fn();
    const {result} = render({
      dispatcher: {updateResource},
      state: {byId: {nestedResourceId: {myKey: '', errors: {}}}},
      resourceId: 'nestedResourceId',
      select: id => state => state.byId[id],
    });

    act(() => {
      toProps(result.current).setValue('myValue');
    });

    expect(updateResource).toHaveBeenCalledWith(
      'nestedResourceId',
      'myKey',
      'myValue',
    );
  });

  it("returns the member's errors", () => {
    const {result} = render({
      dispatcher: {updateResource: jest.fn()},
      state: {
        byId: {nestedResourceId: {myKey: '', errors: {myKey: 'myError'}}},
      },
      resourceId: 'nestedResourceId',
      select: id => state => state.byId[id],
    });
    expect(toProps(result.current).value).toEqual('');
    expect(toProps(result.current).error).toEqual('myError');
  });

  it('throws error if update function is missing', () => {
    const {result} = render({
      dispatcher: {},
      state: {byId: {nestedResourceId: {myKey: 'myValue', errors: {}}}},
      resourceId: 'nestedResourceId',
      select: id => state => state.byId[id],
    });
    expect(result.error.toString()).toMatch(/expects/);
  });

  it('sets an error', () => {
    const updateResource = jest.fn();
    const {result} = render({
      dispatcher: {updateResource},
      state: {byId: {nestedResourceId: {myKey: 'myValue', errors: {}}}},
      resourceId: 'nestedResourceId',
      select: id => state => state.byId[id],
    });

    act(() => {
      toProps(result.current).setError('myError');
    });

    expect(updateResource).toHaveBeenCalledWith(
      'nestedResourceId',
      'errors.myKey',
      'myError',
    );
  });
});
