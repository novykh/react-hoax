import React from 'react';
import {createContext} from 'use-context-selector';
import {renderHook, act} from 'testUtils';
import makeUseCollection from './index';

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
      makeUseCollection(
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

describe('push', () => {
  it('pushes an item', () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b'], errors: {}},
    });

    act(() => {
      result.current.push('hello');
    });

    expect(update).toHaveBeenCalledWith('myKey', ['a', 'b', 'hello']);
  });

  it("doesn't push duplicates", () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b'], errors: {}},
      uniq: true,
    });

    act(() => {
      result.current.push('b');
    });

    expect(update).toHaveBeenCalledWith('myKey', ['a', 'b']);
  });
});

describe('add', () => {
  it('adds an item', () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b', 'c'], errors: {}},
    });

    act(() => {
      result.current.add(0, 'hello');
    });
    expect(update).toHaveBeenCalledWith('myKey', ['hello', 'a', 'b', 'c']);

    act(() => {
      result.current.add(3, 'hello');
    });
    expect(update).toHaveBeenCalledWith('myKey', ['a', 'b', 'c', 'hello']);

    act(() => {
      result.current.add(1, 'hello');
    });
    expect(update).toHaveBeenCalledWith('myKey', ['a', 'hello', 'b', 'c']);

    act(() => {
      result.current.add(100000, 'hello');
    });
    expect(update).toHaveBeenCalledWith('myKey', ['a', 'b', 'c', 'hello']);
  });

  it("doesn't add on invalid index", () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b'], errors: {}},
    });

    act(() => {
      result.current.add(-1, 'hello');
    });

    expect(update).not.toBeCalled();
  });
});

describe('edit', () => {
  it('updates an item', () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b', 'c'], errors: {}},
    });

    act(() => {
      result.current.edit(0, 'hello');
    });
    expect(update).toHaveBeenCalledWith('myKey', ['hello', 'b', 'c']);

    act(() => {
      result.current.edit(2, 'hello');
    });
    expect(update).toHaveBeenCalledWith('myKey', ['a', 'b', 'hello']);

    act(() => {
      result.current.edit(1, 'hello');
    });
    expect(update).toHaveBeenCalledWith('myKey', ['a', 'hello', 'c']);
  });

  it("doesn't update on negative index", () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b', 'c'], errors: {}},
    });

    act(() => {
      result.current.edit(-1, 'hello');
      result.current.edit(3, 'hello');
      result.current.edit(100000, 'hello');
    });

    expect(update).not.toBeCalled();
  });
});

describe('remove', () => {
  it('removes an item', () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b', 'c'], errors: {}},
    });

    act(() => {
      result.current.remove(0);
    });
    expect(update).toHaveBeenCalledWith('myKey', ['b', 'c']);

    act(() => {
      result.current.remove(2);
    });
    expect(update).toHaveBeenCalledWith('myKey', ['a', 'b']);

    act(() => {
      result.current.remove(1);
    });
    expect(update).toHaveBeenCalledWith('myKey', ['a', 'c']);
  });

  it("doesn't remove invalid index", () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b'], errors: {}},
    });

    act(() => {
      result.current.remove(-1);
      result.current.remove(2);
      result.current.remove(100000);
    });

    expect(update).not.toBeCalled();
  });
});

describe('reorder', () => {
  it('changes places for two items', () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b', 'c'], errors: {}},
    });

    act(() => {
      result.current.reorder(0, 1);
    });
    expect(update).toHaveBeenCalledWith('myKey', ['b', 'a', 'c']);

    act(() => {
      result.current.reorder(2, 0);
    });
    expect(update).toHaveBeenCalledWith('myKey', ['c', 'a', 'b']);

    act(() => {
      result.current.reorder(1, 2);
    });
    expect(update).toHaveBeenCalledWith('myKey', ['a', 'c', 'b']);
  });

  it('remains on same position on invalid indices', () => {
    const update = jest.fn();
    const {result} = render({
      dispatcher: {update},
      state: {myKey: ['a', 'b', 'c'], errors: {}},
    });

    act(() => {
      result.current.reorder(-1, 0);
      result.current.reorder(3, 0);
      result.current.reorder(100000, 0);

      result.current.reorder(0, -1);
      result.current.reorder(0, 3);
      result.current.reorder(0, 100000);
    });

    expect(update).not.toBeCalled();
  });
});
