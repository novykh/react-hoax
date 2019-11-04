import { useState } from "react";
import { renderHook, act } from "testUtils";
import useObservers, { makeObserver } from "./index";

it("listens for changes", () => {
  const spy = jest.fn();
  const { result, rerender } = renderHook(() => {
    const [state, setState] = useState({ id: "1", title: "" });
    useObservers(state, [makeObserver(s => spy(s))]);
    return setState;
  });
  const setState = result.current;
  act(() => {
    setState(state => ({ ...state, title: "someTitle" }));
  });
  rerender();

  expect(spy.mock.calls.length).toBe(1);
  expect(spy.mock.calls[0][0]).toEqual({ id: "1", title: "someTitle" });

  act(() => {
    setState(state => ({ ...state, title: "someTitle2" }));
  });
  rerender();

  expect(spy.mock.calls.length).toBe(2);
  expect(spy.mock.calls[1][0]).toEqual({ id: "1", title: "someTitle2" });

  act(() => {
    setState(state => ({ ...state, title: "someTitle2" }));
  });
  rerender();

  expect(spy.mock.calls.length).toBe(2);
});

it("doesn't dispatch for same state checking", () => {
  const spy = jest.fn();
  const { result } = renderHook(() => {
    const [state, setState] = useState({ id: "1", title: "" });
    useObservers(state, [makeObserver(s => spy(s), s => s.id)]);
    return setState;
  });
  const setState = result.current;
  act(() => {
    setState(state => ({ ...state, title: "someTitle" }));
  });

  expect(spy).not.toBeCalled();
});
