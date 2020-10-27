import {renderHook, act} from 'testUtils';
import useReducer from './index';

const dummyAction = {type: 'dummyAction'};
const dummyActionWithPayload = num => ({type: 'dummyActionWithPayload', num});
const dummyActionWithPayloadThunk = num => (dispatch, getState) =>
  dispatch({
    type: 'dummyActionWithPayload',
    num: getState().dummyCounter === num ? 999 : -999,
  });

const initialState = 0;

const init = num => ({
  dummyCounter: num,
});

const dummyReducer = (state, {type, ...payload}) => {
  switch (type) {
    case 'dummyAction':
      return {dummyCounter: state.dummyCounter + 1};

    case 'dummyActionWithPayload':
      return {dummyCounter: payload.num};

    default:
      throw new Error('No action');
  }
};

describe('state', () => {
  it('returns initial', () => {
    const {result} = renderHook(() =>
      useReducer(dummyReducer, {
        initialState,
      }),
    );
    const [state] = result.current;
    expect(state).toEqual(initialState);
  });

  it('returns initial for init', () => {
    const {result} = renderHook(() =>
      useReducer(dummyReducer, {
        initialState,
        init,
      }),
    );
    const [state] = result.current;
    expect(state).toEqual(init(initialState));
  });
});

describe('dispatches', () => {
  it('returns connected actions and dispatch', () => {
    const {result} = renderHook(() =>
      useReducer(dummyReducer, {
        initialState,
        init,
        actions: {
          dummyAction,
          dummyActionWithPayload,
          dummyActionWithPayloadThunk,
        },
      }),
    );
    const [, dispatches] = result.current;

    expect(dispatches).toHaveProperty('dispatch');
    expect(typeof dispatches.dispatch === 'function').toBeTruthy();
    expect(dispatches).toHaveProperty('dummyAction');
    expect(typeof dispatches.dummyAction === 'function').toBeTruthy();
    expect(dispatches).toHaveProperty('dummyActionWithPayload');
    expect(
      typeof dispatches.dummyActionWithPayload === 'function',
    ).toBeTruthy();
    expect(dispatches).toHaveProperty('dummyActionWithPayloadThunk');
    expect(
      typeof dispatches.dummyActionWithPayloadThunk === 'function',
    ).toBeTruthy();
  });

  it('listens to dispatch', () => {
    const {result} = renderHook(() =>
      useReducer(dummyReducer, {
        initialState,
        init,
        actions: {
          dummyAction,
          dummyActionWithPayload,
          dummyActionWithPayloadThunk,
        },
      }),
    );
    const [state, dispatches] = result.current;
    expect(state.dummyCounter).toBe(0);
    act(() => {
      dispatches.dispatch(dummyAction);
    });
    const [newState] = result.current;
    expect(newState.dummyCounter).toBe(1);
  });

  it('listen to dispatch by connected action object', () => {
    const {result} = renderHook(() =>
      useReducer(dummyReducer, {
        initialState,
        init,
        actions: {
          dummyAction,
          dummyActionWithPayload,
          dummyActionWithPayloadThunk,
        },
      }),
    );
    const [state, dispatches] = result.current;
    expect(state.dummyCounter).toBe(0);
    act(() => {
      dispatches.dummyAction();
    });
    const [newState] = result.current;
    expect(newState.dummyCounter).toBe(1);
  });

  it('listen to dispatch by connected action function', () => {
    const {result} = renderHook(() =>
      useReducer(dummyReducer, {
        initialState,
        init,
        actions: {
          dummyAction,
          dummyActionWithPayload,
          dummyActionWithPayloadThunk,
        },
      }),
    );
    const [state, dispatches] = result.current;
    expect(state.dummyCounter).toBe(0);
    act(() => {
      dispatches.dummyActionWithPayload(3);
    });
    const [newState] = result.current;
    expect(newState.dummyCounter).toBe(3);
  });

  it('listen to dispatch by connected action thunk', () => {
    const {result} = renderHook(() =>
      useReducer(dummyReducer, {
        initialState,
        init,
        actions: {
          dummyAction,
          dummyActionWithPayload,
          dummyActionWithPayloadThunk,
        },
      }),
    );
    const [, dispatches] = result.current;
    act(() => {
      dispatches.dummyAction();
    });
    act(() => {
      dispatches.dummyActionWithPayloadThunk(0);
    });
    const [newState] = result.current;
    expect(newState.dummyCounter).toBe(-999);

    act(() => {
      dispatches.dummyActionWithPayload(3);
    });
    act(() => {
      dispatches.dummyActionWithPayloadThunk(3);
    });
    const [newestState] = result.current;
    expect(newestState.dummyCounter).toBe(999);
  });

  it('passes extra argument on action thunk', () => {
    const dispatchSpy = jest.fn();
    const dummyActionWithPayloadExtraArgumentThunk = num => (
      dispatch,
      getState,
      extraArgument,
    ) => {
      const args = {
        type: 'dummyActionWithPayload',
        dummyCounter: getState().dummyCounter,
        num,
        extraArgument,
      };
      dispatchSpy(args);
      dispatch(args);
    };

    const {result} = renderHook(() =>
      useReducer(dummyReducer, {
        initialState,
        init,
        actions: {dummyActionWithPayloadExtraArgumentThunk},
        extraArgument: 'mockExtraArgument',
      }),
    );

    const [, dispatches] = result.current;
    act(() => {
      dispatches.dummyActionWithPayloadExtraArgumentThunk(10);
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'dummyActionWithPayload',
      dummyCounter: 0,
      num: 10,
      extraArgument: 'mockExtraArgument',
    });
  });
});
