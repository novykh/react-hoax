/**
 * const {getInitialPristineState, updatePristine, removePristine} = makePristine('SOME_KEY');
 *   const init = (initialCount) => ({
 *   count: initialCount,
 *   ...getInitialPristineState()
 * });
 *   const reducer = (state: LikeState, action: IfcAction) => {
 *   switch (action.type) {
 *     case 'increment':
 *       const newValue = state.count + 1;
 *       state = updatePristine(state, 'count', newValue)
 *       return {...state, count: newValue};
 *       case 'decrement':
 *       const newValue = state.count - 1;
 *       state = updatePristine(state, 'count', newValue)
 *       return {...state, count: newValue};
 *       case 'reset':
 *       return init(action.payload);
 *       case 'resetPristine':
 *       return removePristine(state, 'count')
 *       default:
 *       throw new Error();
 *   }
 * }
 */

import { isEqual } from "../helpers";

import type { Attr, LikeState } from "../types";

const defaultPristineKey: string = "pristine";

export default (pristineKey: Attr = defaultPristineKey) => {
  const getInitialState = () => ({ [pristineKey]: {} });

  const hasKey = (state: LikeState, key: Attr) =>
    !!state[pristineKey] && state[pristineKey].hasOwnProperty(key);

  const add = (state: LikeState, key: Attr) => ({
    ...state,
    [pristineKey]: {
      ...state[pristineKey],
      [key]: state[key],
    },
  });

  const remove = (state: LikeState, key?: Attr) => {
    if (!key) return { ...state, ...getInitialState() };
    if (!hasKey(state, key)) return state;

    delete state[pristineKey][key];
    return {
      ...state,
      [pristineKey]: {
        ...state[pristineKey],
      },
    };
  };

  return {
    updatePristine: (state: LikeState, key: Attr, newValue: any) => {
      const hasPristineState = hasKey(state, key);
      if (!hasPristineState && !isEqual(newValue, state[key]))
        return add(state, key);

      if (hasPristineState && isEqual(newValue, state[pristineKey][key]))
        return remove(state, key);

      return state;
    },
    removePristine: remove,
    getInitialPristineState: getInitialState,
  };
};
